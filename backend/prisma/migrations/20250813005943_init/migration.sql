-- CreateEnum
CREATE TYPE "public"."UserLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'PROFICIENT');

-- CreateEnum
CREATE TYPE "public"."SessionType" AS ENUM ('VOCABULARY', 'CONVERSATION', 'PRONUNCIATION', 'GRAMMAR', 'LISTENING', 'READING');

-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'DATA_EXPORT', 'ACCOUNT_DELETION');

-- CreateEnum
CREATE TYPE "public"."ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."UserPreferenceType" AS ENUM ('AUDIO_SPEED', 'VOICE_TYPE', 'DIFFICULTY_AUTO_ADJUST', 'DAILY_REMINDER', 'PROGRESS_NOTIFICATIONS', 'ANALYTICS_OPT_IN', 'MARKETING_OPT_IN');

-- CreateEnum
CREATE TYPE "public"."CourseTier" AS ENUM ('BASIC', 'PREMIUM', 'PRO');

-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('VOCABULARY', 'GRAMMAR', 'CONVERSATION', 'PRONUNCIATION', 'LISTENING', 'READING', 'WRITING', 'CULTURAL');

-- CreateEnum
CREATE TYPE "public"."LearningMotivation" AS ENUM ('TRAVEL', 'BUSINESS', 'FAMILY', 'ACADEMIC', 'PERSONAL_GROWTH', 'CAREER_ADVANCEMENT', 'CULTURAL_INTEREST');

-- CreateEnum
CREATE TYPE "public"."LearningStyle" AS ENUM ('VISUAL', 'AUDITORY', 'KINESTHETIC', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."LearningPhase" AS ENUM ('NEW', 'LEARNING', 'REVIEW', 'MASTERED');

-- CreateEnum
CREATE TYPE "public"."DifficultyAdjustment" AS ENUM ('DECREASE_MAJOR', 'DECREASE_MINOR', 'MAINTAIN', 'INCREASE_MINOR', 'INCREASE_MAJOR');

-- CreateEnum
CREATE TYPE "public"."PerformancePattern" AS ENUM ('IMPROVING', 'STABLE', 'DECLINING', 'STRUGGLING', 'EXCELLING');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT,
    "native_language" TEXT NOT NULL DEFAULT 'en',
    "target_language" TEXT NOT NULL,
    "current_level" "public"."UserLevel" NOT NULL DEFAULT 'BEGINNER',
    "xp_points" INTEGER NOT NULL DEFAULT 0,
    "daily_streak" INTEGER NOT NULL DEFAULT 0,
    "max_streak" INTEGER NOT NULL DEFAULT 0,
    "total_learning_time" INTEGER NOT NULL DEFAULT 0,
    "preferred_voice" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "device_capabilities" JSONB NOT NULL DEFAULT '{}',
    "privacy_settings" JSONB NOT NULL DEFAULT '{"analytics": true, "personalization": true}',
    "subscription_tier" TEXT NOT NULL DEFAULT 'free',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "password_reset_token" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    "last_active" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "profile_image_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_info" JSONB,
    "location" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "public"."UserPreferenceType" NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" "public"."AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."phrases" (
    "id" TEXT NOT NULL,
    "text_native_language" TEXT NOT NULL,
    "text_target_language" TEXT NOT NULL,
    "phonetic_transcription" TEXT,
    "topic" TEXT NOT NULL,
    "difficulty_level" INTEGER NOT NULL DEFAULT 1,
    "type" TEXT NOT NULL DEFAULT 'word',
    "image_url" TEXT,
    "usage_context" TEXT,
    "usage_example" TEXT,
    "native_language_code" TEXT NOT NULL,
    "target_language_code" TEXT NOT NULL,
    "audio_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "frequency" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phrases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."speaking_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "phrase_id" TEXT NOT NULL,
    "user_audio_url" TEXT,
    "transcription" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "overall_score" INTEGER,
    "pronunciation_score" INTEGER,
    "clarity_score" INTEGER,
    "fluency_score" INTEGER,
    "accuracy_score" INTEGER,
    "ai_feedback" TEXT,
    "detailed_analysis" JSONB,
    "session_id" TEXT,
    "processing_status" "public"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processing_time" INTEGER,
    "audio_file_size" INTEGER,
    "audio_duration" DOUBLE PRECISION,
    "attempt_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "turn_number" INTEGER NOT NULL,
    "speaker" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,
    "audio_url" TEXT,
    "response_time" INTEGER,
    "conversation_topic" TEXT,
    "difficulty_level" INTEGER,
    "sentiment" TEXT,
    "emotion" TEXT,
    "ai_model_used" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_type" "public"."SessionType" NOT NULL,
    "language_practiced" TEXT NOT NULL,
    "topic_covered" TEXT,
    "words_learned" INTEGER NOT NULL DEFAULT 0,
    "time_spent" INTEGER NOT NULL DEFAULT 0,
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "accuracy_percentage" DOUBLE PRECISION,
    "completion_rate" DOUBLE PRECISION,
    "difficulty_level" INTEGER,
    "session_data" JSONB,
    "performance_metrics" JSONB,
    "session_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "learning_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "words_mastered" INTEGER NOT NULL DEFAULT 0,
    "phrases_mastered" INTEGER NOT NULL DEFAULT 0,
    "total_practice_time" INTEGER NOT NULL DEFAULT 0,
    "average_pronunciation_score" DOUBLE PRECISION,
    "average_accuracy_score" DOUBLE PRECISION,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "level_achieved" "public"."UserLevel" NOT NULL DEFAULT 'BEGINNER',
    "progress_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "next_level_xp_required" INTEGER NOT NULL DEFAULT 100,
    "weekly_goal" INTEGER NOT NULL DEFAULT 5,
    "monthly_goal" INTEGER NOT NULL DEFAULT 20,
    "strongest_skill" TEXT,
    "weakest_skill" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "achievement_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "xp_reward" INTEGER NOT NULL DEFAULT 0,
    "badge_level" TEXT,
    "category" TEXT,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vocabulary_mastery" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "phrase_id" TEXT NOT NULL,
    "mastery_level" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "times_encountered" INTEGER NOT NULL DEFAULT 0,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "last_encountered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "next_review" TIMESTAMP(3) NOT NULL,
    "review_interval" INTEGER NOT NULL DEFAULT 1,
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "stability" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "retrievability" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "is_learned" BOOLEAN NOT NULL DEFAULT false,
    "learning_phase" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_mastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_health" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "response_time" DOUBLE PRECISION,
    "cpu_usage" DOUBLE PRECISION,
    "memory_usage" DOUBLE PRECISION,
    "disk_usage" DOUBLE PRECISION,
    "active_connections" INTEGER,
    "error_rate" DOUBLE PRECISION,
    "last_checked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_speech_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "preferred_provider" TEXT NOT NULL DEFAULT 'WHISPER_API',
    "allow_browser_speech" BOOLEAN NOT NULL DEFAULT true,
    "privacy_mode" BOOLEAN NOT NULL DEFAULT false,
    "enable_offline_mode" BOOLEAN NOT NULL DEFAULT false,
    "audio_quality" TEXT NOT NULL DEFAULT 'standard',
    "auto_fallback" BOOLEAN NOT NULL DEFAULT true,
    "max_processing_time" INTEGER NOT NULL DEFAULT 30000,
    "enable_caching" BOOLEAN NOT NULL DEFAULT true,
    "preferred_language" TEXT,
    "custom_settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_speech_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personalized_courses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "target_language" TEXT NOT NULL,
    "native_language" TEXT NOT NULL,
    "learning_motivation" "public"."LearningMotivation" NOT NULL,
    "proficiency_level" "public"."UserLevel" NOT NULL,
    "course_tier" "public"."CourseTier" NOT NULL DEFAULT 'BASIC',
    "total_lessons" INTEGER NOT NULL,
    "estimated_duration_weeks" INTEGER,
    "ai_generation_metadata" JSONB NOT NULL,
    "course_structure" JSONB NOT NULL,
    "learning_objectives" JSONB NOT NULL,
    "cultural_context" JSONB,
    "price" DECIMAL(10,2),
    "completion_reward" DECIMAL(10,2),
    "progress_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "ai_provider_used" TEXT,
    "generation_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personalized_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_tasks" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "task_order" INTEGER NOT NULL,
    "task_type" "public"."TaskType" NOT NULL,
    "task_name" TEXT NOT NULL,
    "task_description" TEXT,
    "difficulty_level" INTEGER NOT NULL,
    "estimated_duration_minutes" INTEGER,
    "task_content" JSONB NOT NULL,
    "scoring_criteria" JSONB,
    "ai_feedback_prompts" JSONB,
    "prerequisites" JSONB,
    "learning_objectives" JSONB,
    "multimedia_assets" JSONB,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "user_score" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_goals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT,
    "primary_motivation" "public"."LearningMotivation" NOT NULL,
    "specific_scenarios" JSONB,
    "learning_style_preferences" JSONB NOT NULL,
    "time_commitment_daily" INTEGER,
    "time_commitment_weekly" INTEGER,
    "cultural_interests" JSONB,
    "business_context" JSONB,
    "travel_destinations" JSONB,
    "accessibility_needs" JSONB,
    "ai_assessment_results" JSONB,
    "proficiency_assessment" JSONB,
    "learning_goals_short_term" JSONB,
    "learning_goals_long_term" JSONB,
    "preferred_learning_times" JSONB,
    "device_capabilities" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_interactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "ai_provider" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "token_usage" JSONB,
    "processing_time" INTEGER,
    "cost" DECIMAL(10,4),
    "quality_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_sequences" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sequence_name" TEXT NOT NULL,
    "prerequisite_rules" JSONB NOT NULL,
    "difficulty_progression" JSONB NOT NULL,
    "spaced_repetition_config" JSONB NOT NULL,
    "adaptive_settings" JSONB NOT NULL,
    "learning_path" JSONB NOT NULL,
    "current_position" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_results" (
    "id" TEXT NOT NULL,
    "sequence_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "completion_time" INTEGER,
    "difficulty_attempted" INTEGER NOT NULL,
    "performance_metrics" JSONB NOT NULL,
    "learning_insights" JSONB,
    "adaptation_triggers" JSONB,
    "next_difficulty_level" INTEGER,
    "spaced_repetition_data" JSONB,
    "attention_metrics" JSONB,
    "engagement_score" DOUBLE PRECISION,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."adaptive_learning_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "detected_learning_style" JSONB NOT NULL,
    "performance_patterns" JSONB NOT NULL,
    "strength_areas" JSONB NOT NULL,
    "weakness_areas" JSONB NOT NULL,
    "optimal_difficulty_curve" JSONB NOT NULL,
    "attention_span_metrics" JSONB NOT NULL,
    "learning_velocity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "retention_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "engagement_trends" JSONB NOT NULL,
    "recommended_task_types" JSONB NOT NULL,
    "adaptive_settings" JSONB NOT NULL,
    "last_analysis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adaptive_learning_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spaced_repetition_schedules" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "content_id" TEXT,
    "sequence_id" TEXT,
    "learning_phase" "public"."LearningPhase" NOT NULL DEFAULT 'NEW',
    "current_interval" INTEGER NOT NULL DEFAULT 1,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed" TIMESTAMP(3),
    "next_review" TIMESTAMP(3) NOT NULL,
    "difficulty_level" INTEGER NOT NULL,
    "retention_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "stability_score" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "retrievability" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "memory_strength" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "forgetting_curve" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spaced_repetition_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_analytics" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT,
    "sequence_id" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "total_time_spent" INTEGER,
    "interaction_events" JSONB NOT NULL,
    "attention_metrics" JSONB NOT NULL,
    "engagement_levels" JSONB NOT NULL,
    "difficulty_ratings" JSONB NOT NULL,
    "frustraction_events" JSONB,
    "help_seeking_behavior" JSONB,
    "task_switching_events" JSONB,
    "device_interactions" JSONB,
    "performance_metrics" JSONB NOT NULL,
    "qualitative_data" JSONB,

    CONSTRAINT "task_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_sessions_v2" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "total_duration" INTEGER,
    "tasks_attempted" INTEGER NOT NULL DEFAULT 0,
    "tasks_completed" INTEGER NOT NULL DEFAULT 0,
    "average_score" DOUBLE PRECISION,
    "difficulty_progression" JSONB NOT NULL,
    "learning_velocity" DOUBLE PRECISION,
    "engagement_metrics" JSONB NOT NULL,
    "adaptation_events" JSONB,
    "break_events" JSONB,
    "device_info" JSONB,
    "network_conditions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "learning_sessions_v2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."real_time_events" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_data" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sequence_number" INTEGER NOT NULL,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "real_time_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_target_language_native_language_idx" ON "public"."users"("target_language", "native_language");

-- CreateIndex
CREATE INDEX "users_last_active_idx" ON "public"."users"("last_active");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_is_active_is_verified_idx" ON "public"."users"("is_active", "is_verified");

-- CreateIndex
CREATE INDEX "users_subscription_tier_is_active_idx" ON "public"."users"("subscription_tier", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_token_key" ON "public"."user_sessions"("session_token");

-- CreateIndex
CREATE INDEX "user_sessions_session_token_idx" ON "public"."user_sessions"("session_token");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_is_active_idx" ON "public"."user_sessions"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "user_sessions_expires_at_idx" ON "public"."user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "user_preferences_user_id_type_idx" ON "public"."user_preferences"("user_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_type_key_key" ON "public"."user_preferences"("user_id", "type", "key");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "public"."audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_resource_idx" ON "public"."audit_logs"("action", "resource");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "public"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resource_id_idx" ON "public"."audit_logs"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "phrases_target_language_code_native_language_code_difficult_idx" ON "public"."phrases"("target_language_code", "native_language_code", "difficulty_level");

-- CreateIndex
CREATE INDEX "phrases_topic_difficulty_level_is_active_idx" ON "public"."phrases"("topic", "difficulty_level", "is_active");

-- CreateIndex
CREATE INDEX "phrases_type_is_active_frequency_idx" ON "public"."phrases"("type", "is_active", "frequency");

-- CreateIndex
CREATE INDEX "idx_phrases_frequency_desc" ON "public"."phrases"("frequency");

-- CreateIndex
CREATE INDEX "idx_phrases_created_recent" ON "public"."phrases"("created_at");

-- CreateIndex
CREATE INDEX "speaking_attempts_user_id_attempt_date_overall_score_idx" ON "public"."speaking_attempts"("user_id", "attempt_date", "overall_score");

-- CreateIndex
CREATE INDEX "speaking_attempts_session_id_attempt_date_idx" ON "public"."speaking_attempts"("session_id", "attempt_date");

-- CreateIndex
CREATE INDEX "speaking_attempts_processing_status_attempt_date_idx" ON "public"."speaking_attempts"("processing_status", "attempt_date");

-- CreateIndex
CREATE INDEX "speaking_attempts_phrase_id_overall_score_attempt_date_idx" ON "public"."speaking_attempts"("phrase_id", "overall_score", "attempt_date");

-- CreateIndex
CREATE INDEX "speaking_attempts_user_id_processing_status_idx" ON "public"."speaking_attempts"("user_id", "processing_status");

-- CreateIndex
CREATE INDEX "conversation_logs_user_id_session_id_idx" ON "public"."conversation_logs"("user_id", "session_id");

-- CreateIndex
CREATE INDEX "conversation_logs_timestamp_idx" ON "public"."conversation_logs"("timestamp");

-- CreateIndex
CREATE INDEX "conversation_logs_conversation_topic_difficulty_level_idx" ON "public"."conversation_logs"("conversation_topic", "difficulty_level");

-- CreateIndex
CREATE INDEX "learning_sessions_user_id_session_date_idx" ON "public"."learning_sessions"("user_id", "session_date");

-- CreateIndex
CREATE INDEX "learning_sessions_session_type_language_practiced_idx" ON "public"."learning_sessions"("session_type", "language_practiced");

-- CreateIndex
CREATE INDEX "learning_sessions_session_date_accuracy_percentage_idx" ON "public"."learning_sessions"("session_date", "accuracy_percentage");

-- CreateIndex
CREATE INDEX "user_progress_language_level_achieved_idx" ON "public"."user_progress"("language", "level_achieved");

-- CreateIndex
CREATE INDEX "user_progress_progress_percentage_level_achieved_idx" ON "public"."user_progress"("progress_percentage", "level_achieved");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_language_key" ON "public"."user_progress"("user_id", "language");

-- CreateIndex
CREATE INDEX "achievements_user_id_achievement_type_idx" ON "public"."achievements"("user_id", "achievement_type");

-- CreateIndex
CREATE INDEX "achievements_unlocked_at_idx" ON "public"."achievements"("unlocked_at");

-- CreateIndex
CREATE INDEX "achievements_category_badge_level_idx" ON "public"."achievements"("category", "badge_level");

-- CreateIndex
CREATE INDEX "vocabulary_mastery_user_id_next_review_idx" ON "public"."vocabulary_mastery"("user_id", "next_review");

-- CreateIndex
CREATE INDEX "vocabulary_mastery_mastery_level_is_learned_idx" ON "public"."vocabulary_mastery"("mastery_level", "is_learned");

-- CreateIndex
CREATE INDEX "vocabulary_mastery_learning_phase_next_review_idx" ON "public"."vocabulary_mastery"("learning_phase", "next_review");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_mastery_user_id_phrase_id_key" ON "public"."vocabulary_mastery"("user_id", "phrase_id");

-- CreateIndex
CREATE INDEX "system_health_service_name_last_checked_idx" ON "public"."system_health"("service_name", "last_checked");

-- CreateIndex
CREATE INDEX "system_health_status_idx" ON "public"."system_health"("status");

-- CreateIndex
CREATE INDEX "user_speech_preferences_user_id_preferred_provider_idx" ON "public"."user_speech_preferences"("user_id", "preferred_provider");

-- CreateIndex
CREATE INDEX "user_speech_preferences_privacy_mode_enable_offline_mode_idx" ON "public"."user_speech_preferences"("privacy_mode", "enable_offline_mode");

-- CreateIndex
CREATE UNIQUE INDEX "user_speech_preferences_user_id_key" ON "public"."user_speech_preferences"("user_id");

-- CreateIndex
CREATE INDEX "personalized_courses_user_id_is_active_idx" ON "public"."personalized_courses"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "personalized_courses_target_language_proficiency_level_idx" ON "public"."personalized_courses"("target_language", "proficiency_level");

-- CreateIndex
CREATE INDEX "personalized_courses_course_tier_is_active_idx" ON "public"."personalized_courses"("course_tier", "is_active");

-- CreateIndex
CREATE INDEX "personalized_courses_created_at_idx" ON "public"."personalized_courses"("created_at");

-- CreateIndex
CREATE INDEX "course_tasks_course_id_task_order_idx" ON "public"."course_tasks"("course_id", "task_order");

-- CreateIndex
CREATE INDEX "course_tasks_task_type_difficulty_level_idx" ON "public"."course_tasks"("task_type", "difficulty_level");

-- CreateIndex
CREATE INDEX "course_tasks_is_completed_completed_at_idx" ON "public"."course_tasks"("is_completed", "completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_goals_user_id_key" ON "public"."user_goals"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_goals_course_id_key" ON "public"."user_goals"("course_id");

-- CreateIndex
CREATE INDEX "user_goals_primary_motivation_idx" ON "public"."user_goals"("primary_motivation");

-- CreateIndex
CREATE INDEX "user_goals_created_at_idx" ON "public"."user_goals"("created_at");

-- CreateIndex
CREATE INDEX "ai_interactions_user_id_created_at_idx" ON "public"."ai_interactions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_interactions_ai_provider_interaction_type_idx" ON "public"."ai_interactions"("ai_provider", "interaction_type");

-- CreateIndex
CREATE INDEX "ai_interactions_created_at_idx" ON "public"."ai_interactions"("created_at");

-- CreateIndex
CREATE INDEX "task_sequences_course_id_user_id_idx" ON "public"."task_sequences"("course_id", "user_id");

-- CreateIndex
CREATE INDEX "task_sequences_user_id_is_active_idx" ON "public"."task_sequences"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "task_results_sequence_id_completed_at_idx" ON "public"."task_results"("sequence_id", "completed_at");

-- CreateIndex
CREATE INDEX "task_results_user_id_completed_at_idx" ON "public"."task_results"("user_id", "completed_at");

-- CreateIndex
CREATE INDEX "task_results_task_id_score_idx" ON "public"."task_results"("task_id", "score");

-- CreateIndex
CREATE UNIQUE INDEX "adaptive_learning_profiles_user_id_key" ON "public"."adaptive_learning_profiles"("user_id");

-- CreateIndex
CREATE INDEX "adaptive_learning_profiles_user_id_last_analysis_idx" ON "public"."adaptive_learning_profiles"("user_id", "last_analysis");

-- CreateIndex
CREATE INDEX "spaced_repetition_schedules_user_id_next_review_idx" ON "public"."spaced_repetition_schedules"("user_id", "next_review");

-- CreateIndex
CREATE INDEX "spaced_repetition_schedules_learning_phase_next_review_idx" ON "public"."spaced_repetition_schedules"("learning_phase", "next_review");

-- CreateIndex
CREATE UNIQUE INDEX "spaced_repetition_schedules_user_id_task_id_content_id_key" ON "public"."spaced_repetition_schedules"("user_id", "task_id", "content_id");

-- CreateIndex
CREATE INDEX "task_analytics_task_id_start_time_idx" ON "public"."task_analytics"("task_id", "start_time");

-- CreateIndex
CREATE INDEX "task_analytics_user_id_start_time_idx" ON "public"."task_analytics"("user_id", "start_time");

-- CreateIndex
CREATE INDEX "task_analytics_session_id_idx" ON "public"."task_analytics"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_sessions_v2_session_token_key" ON "public"."learning_sessions_v2"("session_token");

-- CreateIndex
CREATE INDEX "learning_sessions_v2_user_id_start_time_idx" ON "public"."learning_sessions_v2"("user_id", "start_time");

-- CreateIndex
CREATE INDEX "learning_sessions_v2_session_token_idx" ON "public"."learning_sessions_v2"("session_token");

-- CreateIndex
CREATE INDEX "learning_sessions_v2_is_active_start_time_idx" ON "public"."learning_sessions_v2"("is_active", "start_time");

-- CreateIndex
CREATE INDEX "real_time_events_session_id_timestamp_idx" ON "public"."real_time_events"("session_id", "timestamp");

-- CreateIndex
CREATE INDEX "real_time_events_event_type_is_processed_idx" ON "public"."real_time_events"("event_type", "is_processed");

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."speaking_attempts" ADD CONSTRAINT "speaking_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."speaking_attempts" ADD CONSTRAINT "speaking_attempts_phrase_id_fkey" FOREIGN KEY ("phrase_id") REFERENCES "public"."phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_logs" ADD CONSTRAINT "conversation_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_sessions" ADD CONSTRAINT "learning_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_mastery" ADD CONSTRAINT "vocabulary_mastery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary_mastery" ADD CONSTRAINT "vocabulary_mastery_phrase_id_fkey" FOREIGN KEY ("phrase_id") REFERENCES "public"."phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_speech_preferences" ADD CONSTRAINT "user_speech_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personalized_courses" ADD CONSTRAINT "personalized_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_tasks" ADD CONSTRAINT "course_tasks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."personalized_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_goals" ADD CONSTRAINT "user_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_goals" ADD CONSTRAINT "user_goals_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."personalized_courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_interactions" ADD CONSTRAINT "ai_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_sequences" ADD CONSTRAINT "task_sequences_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."personalized_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_sequences" ADD CONSTRAINT "task_sequences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_results" ADD CONSTRAINT "task_results_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "public"."task_sequences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_results" ADD CONSTRAINT "task_results_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."course_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_results" ADD CONSTRAINT "task_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."adaptive_learning_profiles" ADD CONSTRAINT "adaptive_learning_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spaced_repetition_schedules" ADD CONSTRAINT "spaced_repetition_schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spaced_repetition_schedules" ADD CONSTRAINT "spaced_repetition_schedules_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."course_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spaced_repetition_schedules" ADD CONSTRAINT "spaced_repetition_schedules_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "public"."task_sequences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_analytics" ADD CONSTRAINT "task_analytics_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."course_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_analytics" ADD CONSTRAINT "task_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_analytics" ADD CONSTRAINT "task_analytics_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "public"."task_sequences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_sessions_v2" ADD CONSTRAINT "learning_sessions_v2_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."real_time_events" ADD CONSTRAINT "real_time_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."learning_sessions_v2"("id") ON DELETE CASCADE ON UPDATE CASCADE;
