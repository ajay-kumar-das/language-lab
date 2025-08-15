import { AIOrchestrator } from "./ai/AIOrchestrator";
import { CourseGenerationRequest, GeneratedCourse, AIRequestType } from "../types/ai.types";
import { promptTemplates } from "../config/ai.config";
import { PrismaClient, TaskType } from "@prisma/client";

export class CourseGenerationService {
  private aiOrchestrator: AIOrchestrator;
  private prisma: PrismaClient;

  constructor(aiOrchestrator: AIOrchestrator, prisma: PrismaClient) {
    this.aiOrchestrator = aiOrchestrator;
    this.prisma = prisma;
  }

  async generatePersonalizedCourse(request: CourseGenerationRequest): Promise<GeneratedCourse> {
    const prompt = this.buildCourseGenerationPrompt(request);
    
    const aiRequest = {
      ...request,
      prompt,
      systemPrompt: "You are an expert language learning curriculum designer with 20+ years of experience creating personalized learning paths.",
      temperature: 0.7,
      maxTokens: 4000
    };

    const aiResponse = await this.aiOrchestrator.processRequest(aiRequest);
    
    let courseData: GeneratedCourse;
    try {
      courseData = JSON.parse(aiResponse.content);
    } catch (error) {
      throw new Error("Failed to parse AI-generated course: " + error);
    }

    // Validate and sanitize the generated course
    const validatedCourse = await this.validateAndSanitizeCourse(courseData, request);
    
    return validatedCourse;
  }

  private buildCourseGenerationPrompt(request: CourseGenerationRequest): string {
    let template = promptTemplates.courseGeneration;
    
    // Replace placeholders with actual user data
    template = template.replace("{nativeLanguage}", request.userGoals.nativeLanguage);
    template = template.replace("{targetLanguage}", request.userGoals.targetLanguage);
    template = template.replace("{proficiencyLevel}", request.userGoals.proficiencyLevel);
    template = template.replace("{learningMotivation}", request.userGoals.learningMotivation);
    template = template.replace("{timeCommitment}", request.userGoals.timeCommitment.toString());
    template = template.replace("{learningStyle}", request.userGoals.learningStyle.join(", "));
    template = template.replace("{specificScenarios}", 
      request.userGoals.specificScenarios ? request.userGoals.specificScenarios.join(", ") : "None specified"
    );

    return template;
  }

  private async validateAndSanitizeCourse(course: GeneratedCourse, request: CourseGenerationRequest): Promise<GeneratedCourse> {
    // Validate required fields
    if (!course.courseName || !course.courseStructure || !course.learningObjectives) {
      throw new Error("Generated course is missing required fields");
    }

    // Ensure reasonable course structure
    if (!course.courseStructure.modules || course.courseStructure.modules.length === 0) {
      throw new Error("Course must have at least one module");
    }

    // Validate each module
    course.courseStructure.modules.forEach((module, idx) => {
      if (!module.name || !module.tasks || module.tasks.length === 0) {
        throw new Error("Module " + (idx + 1) + " is invalid or missing tasks");
      }

      // Ensure tasks have proper difficulty progression
      module.tasks.forEach((task, taskIdx) => {
        if (!task.taskName || !task.taskType || task.difficultyLevel < 1 || task.difficultyLevel > 10) {
          throw new Error("Task " + (taskIdx + 1) + " in module " + (idx + 1) + " is invalid");
        }
      });
    });

    // Add metadata
    course.totalLessons = course.courseStructure.modules.reduce(
      (total, module) => total + module.tasks.length,
      0
    );

    // Estimate duration based on time commitment
    const totalMinutes = course.courseStructure.modules.reduce(
      (total, module) => total + (module.estimatedDuration || 0),
      0
    );
    
    course.estimatedDurationWeeks = Math.ceil(totalMinutes / (request.userGoals.timeCommitment * 7));

    return course;
  }

  private mapStringToTaskType(taskTypeString: string): TaskType {
    const upperCaseType = taskTypeString.toUpperCase();
    
    // Map common variations to valid enum values
    const taskTypeMap: Record<string, TaskType> = {
      "VOCABULARY": TaskType.VOCABULARY,
      "GRAMMAR": TaskType.GRAMMAR,
      "CONVERSATION": TaskType.CONVERSATION,
      "PRONUNCIATION": TaskType.PRONUNCIATION,
      "LISTENING": TaskType.LISTENING,
      "READING": TaskType.READING,
      "WRITING": TaskType.WRITING,
      "CULTURAL": TaskType.CULTURAL,
      // Common variations
      "VOCAB": TaskType.VOCABULARY,
      "SPEAK": TaskType.CONVERSATION,
      "SPEAKING": TaskType.CONVERSATION,
      "LISTEN": TaskType.LISTENING,
      "READ": TaskType.READING,
      "WRITE": TaskType.WRITING,
      "CULTURE": TaskType.CULTURAL
    };

    return taskTypeMap[upperCaseType] || TaskType.VOCABULARY; // Default fallback
  }

  async saveCourseToDatabase(course: GeneratedCourse, userId: string, userGoals: any): Promise<string> {
    const courseData = await this.prisma.personalizedCourse.create({
      data: {
        userId,
        courseName: course.courseName,
        targetLanguage: userGoals.targetLanguage,
        nativeLanguage: userGoals.nativeLanguage,
        learningMotivation: userGoals.primaryMotivation,
        proficiencyLevel: userGoals.proficiencyLevel || "BEGINNER",
        courseTier: "BASIC", // Default tier
        totalLessons: course.totalLessons,
        estimatedDurationWeeks: course.estimatedDurationWeeks,
        aiGenerationMetadata: JSON.stringify({
          generatedAt: new Date(),
          promptVersion: "1.0",
          validationPassed: true
        }),
        courseStructure: JSON.stringify(course.courseStructure),
        learningObjectives: JSON.stringify(course.learningObjectives),
        culturalContext: course.culturalContext ? JSON.stringify(course.culturalContext) : undefined,
        aiProviderUsed: "multi-provider"
      }
    });

    // Create individual tasks
    const tasks = [];
    let taskOrder = 1;

    for (const module of course.courseStructure.modules) {
      for (const task of module.tasks) {
        tasks.push({
          courseId: courseData.id,
          taskOrder: taskOrder++,
          taskType: this.mapStringToTaskType(task.taskType),
          taskName: task.taskName,
          taskDescription: task.taskContent?.instructions || "",
          difficultyLevel: task.difficultyLevel,
          estimatedDurationMinutes: task.estimatedDurationMinutes,
          taskContent: JSON.stringify(task.taskContent),
          scoringCriteria: task.scoringCriteria ? JSON.stringify(task.scoringCriteria) : undefined,
          learningObjectives: task.learningObjectives ? JSON.stringify(task.learningObjectives) : undefined
        });
      }
    }

    await this.prisma.courseTask.createMany({
      data: tasks
    });

    return courseData.id;
  }
}
