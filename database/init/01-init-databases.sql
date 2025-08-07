-- LinguaLeap Development Database Initialization Script

-- Create additional databases for supporting services
CREATE DATABASE grafana;
CREATE DATABASE sonarqube;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE lingualeap_dev TO lingualeap;
GRANT ALL PRIVILEGES ON DATABASE grafana TO lingualeap;
GRANT ALL PRIVILEGES ON DATABASE sonarqube TO lingualeap;

-- Connect to main application database
\c lingualeap_dev;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create application schema
CREATE SCHEMA IF NOT EXISTS lingualeap;

-- Set default search path
ALTER DATABASE lingualeap_dev SET search_path TO lingualeap, public;

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE phrase_type AS ENUM ('word', 'phrase', 'sentence');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_type AS ENUM ('vocabulary', 'conversation', 'practice', 'assessment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS lingualeap.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_language VARCHAR(10) NOT NULL DEFAULT 'en',
    target_language VARCHAR(10) NOT NULL,
    current_level user_level DEFAULT 'beginner',
    xp_points INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    total_learning_time INTEGER DEFAULT 0, -- in minutes
    preferred_voice VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'UTC',
    device_capabilities JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{"analytics": true, "personalization": true}',
    subscription_tier VARCHAR(20) DEFAULT 'free',
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lingualeap.phrases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text_native TEXT NOT NULL,
    text_target TEXT NOT NULL,
    phonetic_transcription TEXT,
    topic VARCHAR(50) NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5) DEFAULT 1,
    type phrase_type DEFAULT 'word',
    image_url TEXT,
    audio_url TEXT,
    usage_context TEXT,
    cultural_notes TEXT,
    language_code VARCHAR(10) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    frequency_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lingualeap.speaking_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES lingualeap.users(id) ON DELETE CASCADE,
    phrase_id UUID REFERENCES lingualeap.phrases(id) ON DELETE CASCADE,
    session_id UUID,
    user_audio_url TEXT,
    transcription TEXT,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    pronunciation_score INTEGER CHECK (pronunciation_score >= 1 AND pronunciation_score <= 10),
    clarity_score INTEGER CHECK (clarity_score >= 1 AND clarity_score <= 10),
    fluency_score INTEGER CHECK (fluency_score >= 1 AND fluency_score <= 10),
    ai_feedback TEXT,
    improvement_suggestions TEXT[],
    processing_time_ms INTEGER,
    confidence_score REAL,
    attempt_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lingualeap.conversation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES lingualeap.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    turn_number INTEGER NOT NULL,
    speaker VARCHAR(10) CHECK (speaker IN ('user', 'avatar')) NOT NULL,
    message_text TEXT NOT NULL,
    audio_url TEXT,
    response_time_ms INTEGER,
    conversation_topic VARCHAR(100),
    conversation_scenario VARCHAR(100),
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    ai_analysis JSONB,
    sentiment_score REAL,
    engagement_score REAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lingualeap.learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES lingualeap.users(id) ON DELETE CASCADE,
    session_type session_type NOT NULL,
    language_practiced VARCHAR(10) NOT NULL,
    topic_covered VARCHAR(100),
    words_learned INTEGER DEFAULT 0,
    phrases_practiced INTEGER DEFAULT 0,
    time_spent INTEGER NOT NULL, -- in seconds
    xp_earned INTEGER DEFAULT 0,
    accuracy_percentage REAL,
    completion_percentage REAL,
    session_goals JSONB,
    session_results JSONB,
    device_type VARCHAR(20),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS lingualeap.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES lingualeap.users(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    words_mastered INTEGER DEFAULT 0,
    phrases_mastered INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0, -- in minutes
    average_pronunciation_score REAL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    level_achieved user_level DEFAULT 'beginner',
    weak_areas TEXT[] DEFAULT '{}',
    strong_areas TEXT[] DEFAULT '{}',
    last_practice_date DATE,
    next_review_date DATE,
    spaced_repetition_data JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, language)
);

CREATE TABLE IF NOT EXISTS lingualeap.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES lingualeap.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_icon VARCHAR(100),
    xp_reward INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress_data JSONB
);

CREATE TABLE IF NOT EXISTS lingualeap.vocabulary_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES lingualeap.users(id) ON DELETE CASCADE,
    phrase_id UUID REFERENCES lingualeap.phrases(id) ON DELETE CASCADE,
    mastery_level INTEGER CHECK (mastery_level >= 0 AND mastery_level <= 5) DEFAULT 0,
    times_practiced INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    last_practiced TIMESTAMP WITH TIME ZONE,
    next_review TIMESTAMP WITH TIME ZONE,
    easiness_factor REAL DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    repetition_number INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, phrase_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON lingualeap.users(email);
CREATE INDEX IF NOT EXISTS idx_users_target_language ON lingualeap.users(target_language);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON lingualeap.users(last_active);

CREATE INDEX IF NOT EXISTS idx_phrases_language_topic ON lingualeap.phrases(language_code, topic);
CREATE INDEX IF NOT EXISTS idx_phrases_difficulty ON lingualeap.phrases(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_phrases_type ON lingualeap.phrases(type);
CREATE INDEX IF NOT EXISTS idx_phrases_tags ON lingualeap.phrases USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_speaking_attempts_user ON lingualeap.speaking_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_phrase ON lingualeap.speaking_attempts(phrase_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_session ON lingualeap.speaking_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_date ON lingualeap.speaking_attempts(attempt_date);

CREATE INDEX IF NOT EXISTS idx_conversation_logs_user ON lingualeap.conversation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_session ON lingualeap.conversation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_timestamp ON lingualeap.conversation_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_user ON lingualeap.learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_type ON lingualeap.learning_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_date ON lingualeap.learning_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_lang ON lingualeap.user_progress(user_id, language);
CREATE INDEX IF NOT EXISTS idx_user_progress_review_date ON lingualeap.user_progress(next_review_date);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON lingualeap.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON lingualeap.achievements(achievement_type);

CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery_user ON lingualeap.vocabulary_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery_phrase ON lingualeap.vocabulary_mastery(phrase_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery_review ON lingualeap.vocabulary_mastery(next_review);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_phrases_text_search ON lingualeap.phrases USING GIN(to_tsvector('english', text_native || ' ' || text_target));

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION lingualeap.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON lingualeap.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON lingualeap.users 
    FOR EACH ROW 
    EXECUTE FUNCTION lingualeap.update_updated_at_column();

DROP TRIGGER IF EXISTS update_phrases_updated_at ON lingualeap.phrases;
CREATE TRIGGER update_phrases_updated_at 
    BEFORE UPDATE ON lingualeap.phrases 
    FOR EACH ROW 
    EXECUTE FUNCTION lingualeap.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vocabulary_mastery_updated_at ON lingualeap.vocabulary_mastery;
CREATE TRIGGER update_vocabulary_mastery_updated_at 
    BEFORE UPDATE ON lingualeap.vocabulary_mastery 
    FOR EACH ROW 
    EXECUTE FUNCTION lingualeap.update_updated_at_column();

-- Insert sample data for development
INSERT INTO lingualeap.users (email, password_hash, name, target_language, current_level) VALUES
('developer@lingualeap.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeANLyJ8.VhOBiZme', 'Dev User', 'es', 'intermediate'),
('tester@lingualeap.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeANLyJ8.VhOBiZme', 'Test User', 'fr', 'beginner')
ON CONFLICT (email) DO NOTHING;

-- Insert sample phrases
INSERT INTO lingualeap.phrases (text_native, text_target, topic, difficulty_level, type, language_code) VALUES
('Hello', 'Hola', 'greetings', 1, 'word', 'es'),
('Good morning', 'Buenos días', 'greetings', 2, 'phrase', 'es'),
('How are you?', '¿Cómo estás?', 'greetings', 2, 'sentence', 'es'),
('Thank you', 'Gracias', 'courtesy', 1, 'word', 'es'),
('Please', 'Por favor', 'courtesy', 1, 'phrase', 'es'),
('Excuse me', 'Perdón', 'courtesy', 2, 'phrase', 'es'),
('Water', 'Agua', 'food', 1, 'word', 'es'),
('Bread', 'Pan', 'food', 1, 'word', 'es'),
('I would like...', 'Me gustaría...', 'restaurant', 3, 'phrase', 'es'),
('Where is the bathroom?', '¿Dónde está el baño?', 'travel', 3, 'sentence', 'es')
ON CONFLICT DO NOTHING;

-- Create view for user statistics
CREATE OR REPLACE VIEW lingualeap.user_stats AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.xp_points,
    u.daily_streak,
    u.max_streak,
    u.total_learning_time,
    up.words_mastered,
    up.phrases_mastered,
    up.average_pronunciation_score,
    COUNT(ls.id) as total_sessions,
    COALESCE(SUM(ls.time_spent), 0) as total_time_practiced
FROM lingualeap.users u
LEFT JOIN lingualeap.user_progress up ON u.id = up.user_id AND up.language = u.target_language
LEFT JOIN lingualeap.learning_sessions ls ON u.id = ls.user_id
GROUP BY u.id, u.email, u.name, u.xp_points, u.daily_streak, u.max_streak, u.total_learning_time, 
         up.words_mastered, up.phrases_mastered, up.average_pronunciation_score;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA lingualeap TO lingualeap;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA lingualeap TO lingualeap;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA lingualeap TO lingualeap;
GRANT USAGE ON SCHEMA lingualeap TO lingualeap;

-- Create user for application
-- (Password: lingualeap_app_2024)
-- CREATE USER lingualeap_app WITH PASSWORD 'lingualeap_app_2024';
-- GRANT CONNECT ON DATABASE lingualeap_dev TO lingualeap_app;
-- GRANT USAGE ON SCHEMA lingualeap TO lingualeap_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA lingualeap TO lingualeap_app;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA lingualeap TO lingualeap_app;

COMMIT;