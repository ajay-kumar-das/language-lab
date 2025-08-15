import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();

// GET /api/v1/courses/:courseId/tasks - Get course tasks
router.get("/:courseId/tasks", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const prisma = new PrismaClient();
    
    // Verify user owns the course
    const course = await prisma.personalizedCourse.findFirst({
      where: { id: courseId, userId }
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const tasks = await prisma.courseTask.findMany({
      where: { courseId },
      orderBy: { taskOrder: "asc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const totalTasks = await prisma.courseTask.count({
      where: { courseId }
    });

    res.json({
      success: true,
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalTasks,
        pages: Math.ceil(totalTasks / Number(limit))
      }
    });

  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

// POST /api/v1/courses/:courseId/tasks/:taskId/complete - Complete a task
router.post("/:courseId/tasks/:taskId/complete", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { courseId, taskId } = req.params;
    const { score, timeSpent, answers } = req.body;

    const prisma = new PrismaClient();

    // Verify user owns the course and task
    const task = await prisma.courseTask.findFirst({
      where: {
        id: taskId,
        courseId,
        course: { userId }
      },
      include: { course: true }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update task completion
    const updatedTask = await prisma.courseTask.update({
      where: { id: taskId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        userScore: score,
        attempts: task.attempts + 1
      }
    });

    // Update course progress
    const totalTasks = await prisma.courseTask.count({
      where: { courseId }
    });

    const completedTasks = await prisma.courseTask.count({
      where: { courseId, isCompleted: true }
    });

    const progressPercentage = (completedTasks / totalTasks) * 100;

    await prisma.personalizedCourse.update({
      where: { id: courseId },
      data: { progressPercentage }
    });

    res.json({
      success: true,
      task: updatedTask,
      courseProgress: progressPercentage,
      message: "Task completed successfully"
    });

  } catch (error) {
    console.error("Complete task error:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
});

export default router;
