# LinguaLeap - Feature Documentation

**Version**: 1.0  
**Last Updated**: January 25, 2024

---

## 1. Introduction

LinguaLeap is a comprehensive, AI-driven language learning application designed to provide an immersive and personalized learning experience. This document outlines the core features, functionality, and technical specifications of the platform. The primary goal of LinguaLeap is to help users build practical language skills through vocabulary acquisition, pronunciation practice, and simulated real-world conversations.

---

## 2. Core Features

### 2.1 User Authentication & Profile Management

-   **Objective**: To provide secure user access and allow users to personalize their learning experience.
-   **User Story**: "As a user, I want to sign up/log in easily, and I want to be able to set my native language and preferred AI voice to tailor the app to my needs."
-   **Functionality**:
    -   Users can log in via a secure Google OAuth provider.
    -   The system automatically creates a user profile upon the first login.
    -   Users can navigate to the "Profile" page to manage their settings.
    -   **Settings include**:
        -   **Native Language**: Determines the language used for translations and explanations.
        -   **App Language**: Changes the UI language of the application itself.
        -   **Preferred Voice**: Sets the AI tutor's voice to male or female for text-to-speech audio.
    -   Changes are saved and applied across all relevant modules.
-   **Technical Implementation**:
    -   Leverages base44's built-in authentication.
    -   User settings are stored in the `User` entity.
    -   The `Profile` page uses the `User.me()` and `User.updateMyUserData()` methods to fetch and save data.
-   **Acceptance Criteria**:
    -   A user can successfully log in.
    -   A user can change their native language, and this change is reflected in the `Learn` module.
    -   A user can change their preferred voice, and the correct voice is used in text-to-speech.

---

### 2.2 Dashboard

-   **Objective**: To provide users with a quick, motivating overview of their progress and a clear starting point for their daily learning.
-   **User Story**: "As a user, when I log in, I want to see my stats at a glance and have a suggested task to start my learning for the day."
-   **Functionality**:
    -   Displays key performance indicators (KPIs) in summary cards.
    -   **Stats displayed**: Daily Streak, Words Learned, and XP Points (Note: Currently static, planned for dynamic updates).
    -   Features a "Today's Goal" card that prompts the user to start a learning session.
    -   Provides direct navigation to the `Learn` page.
-   **Technical Implementation**:
    -   `Dashboard` page component.
    -   Uses `Card` components from Shadcn/UI for layout.
    -   `Link` from `react-router-dom` for navigation.
-   **Acceptance Criteria**:
    -   The dashboard loads successfully after login.
    -   All stat cards are displayed correctly.
    -   The "Start Learning" button navigates to the `Learn` page.

---

### 2.3 Learning Module (Vocabulary & Sentences)

-   **Objective**: To help users build a foundational vocabulary and understanding of sentence structure through interactive flashcards.
-   **User Story**: "As a user, I want to choose a language and a topic to learn new words or sentences, see their meaning, hear the pronunciation, and practice saying them myself."
-   **Functionality**:
    1.  **Topic Selection**: Users select a target language, a topic (e.g., "Greetings," "Food"), and a learning type ("Words" or "Sentences").
    2.  **AI Content Generation**: The `InvokeLLM` integration generates a list of 10 relevant vocabulary items, including the English text, target language translation, a context sentence, and a translation in the user's native language.
    3.  **Interactive Flashcard (`VocabularyCard`)**:
        -   Displays the word/sentence in the target language.
        -   **Text-to-Speech**: Users can click a button to hear the native pronunciation, using the user's preferred voice setting.
        -   **Reveal Translations**: Buttons to reveal the English translation and the native language meaning.
        -   **Pronunciation Practice**: An integrated component (`PronunciationPractice`) allows users to record themselves.
            -   Uses the browser's Web Speech API for speech-to-data.
            -   Provides a simplified local scoring mechanism based on speech recognition confidence.
            -   Gives immediate feedback on pronunciation. For course tasks, a minimum score is required to proceed.
    4.  **Progression**: Users move through the 10 flashcards. Upon completion, a new set can be generated.
    5.  **Course Task Integration**: If accessed via a course, the module loads a predefined set of words/sentences from the `CourseTask` entity.
-   **Technical Implementation**:
    -   `Learn` page manages the overall state.
    -   `LanguageSelector` component for user input.
    -   `InvokeLLM` integration for content generation.
    -   `VocabularyCard` and `PronunciationPractice` for the interactive experience.
    -   `Phrase` and `User` entities are utilized.
    -   Browser's `SpeechSynthesis` and `SpeechRecognition` APIs are key.
-   **Acceptance Criteria**:
    -   Users can successfully generate a vocabulary list.
    -   Audio pronunciation works correctly in the selected language and voice.
    -   Translations can be toggled.
    -   Pronunciation practice records user audio and provides feedback.
    -   Users can navigate through the entire set of flashcards.

---

### 2.4 Practice Module (AI Conversation)

-   **Objective**: To improve users' conversational fluency by simulating real-world dialogues with an AI tutor.
-   **User Story**: "As a user, I want to practice speaking about a specific topic with an AI that responds to me in real-time and gives me feedback on my speech."
-   **Functionality**:
    1.  **Scenario Selection**: User chooses a language and a conversation scenario (e.g., "Ordering Food at a Restaurant").
    2.  **Conversation View**: The UI transitions to a dedicated conversation interface.
        -   **AI Avatar**: An avatar for the AI tutor, "Lexi," is displayed.
        -   **Message Log**: A chat-like interface shows the history of the conversation.
        -   **Recorder**: A microphone button for the user to speak.
    3.  **AI-Initiated Dialogue**: The AI starts the conversation with a greeting in the target language.
    4.  **User Interaction**: The user clicks the microphone, speaks their response, and clicks again to stop.
    5.  **Speech Analysis & AI Response**:
        -   The user's speech is transcribed using the Web Speech API.
        -   The transcript is sent to the `InvokeLLM` integration along with the conversation history.
        -   The AI analyzes the user's input, provides a score and feedback (pronunciation, clarity), and generates a natural, contextual response to continue the conversation.
    6.  **Continuous Loop**: The conversation continues with the AI's response being displayed and spoken aloud.
-   **Technical Implementation**:
    -   `Practice` page manages the state.
    -   `ConversationView` component contains the main interface.
    -   `Avatar`, `MessageLog`, and `Recorder` are child components.
    -   `InvokeLLM` is used for both analysis and response generation.
    -   `ConversationLog` and `SpeakingAttempt` entities store practice history.
-   **Acceptance Criteria**:
    -   An AI-led conversation can be started successfully.
    -   User can record their voice, and it is accurately transcribed.
    -   The AI provides a relevant and grammatically correct response.
    -   Feedback on the user's speech is displayed in the message log.
    -   The conversation flows naturally.

---

### 2.5 Courses Module

-   **Objective**: To provide structured, long-term learning paths tailored to a user's specific goals.
-   **User Story**: "As a user, I want to generate a full course for a language based on my reason for learning (e.g., for travel, for business), and I want to progress through a series of tasks to complete the course."
-   **Functionality**:
    1.  **Course Creation**:
        -   Users select a language and a learning reason (e.g., "Travel & Tourism").
        -   An `InvokeLLM` prompt is sent to generate a complete course structure, including a title, description, and a list of 12-15 sequential tasks.
        -   The tasks are designed with a logical progression of difficulty and type (vocabulary, sentences, conversation, etc.).
    2.  **Course Listing**: All created courses are displayed as cards, showing title, language, and completion progress.
    3.  **Course Details View**:
        -   Clicking a course shows a detailed view with its description and a list of all its tasks.
        -   Tasks are marked as `Completed`, `Current` (next available), or `Locked`.
    4.  **Task Execution**:
        -   The user can only start the `Current` task.
        -   Clicking "Start Task" navigates them to the appropriate module (`Learn` or `Practice`) with the specific `taskId` as a URL parameter.
        -   Upon successful completion of the task, the `is_completed` flag is set to `true`, and the parent course's `completed_tasks` count is incremented.
        -   The next task in the sequence then becomes `Current`.
-   **Technical Implementation**:
    -   `Courses` page manages the main view.
    -   `CreateCourseCard`, `CourseCard`, and `CourseDetails` components handle the UI.
    -   Heavy reliance on `InvokeLLM` for course generation.
    -   `Course` and `CourseTask` entities store all the data.
    -   URL parameters (`?taskId=...`) are used to link courses to the `Learn` and `Practice` modules.
-   **Acceptance Criteria**:
    -   A user can successfully generate a new course.
    -   The generated course and its tasks are saved correctly to the database.
    -   The task list correctly displays completed, current, and locked states.
    -   Starting a task navigates to the correct page with the correct content.
    -   Completing a task updates the course progress and unlocks the next task.

---