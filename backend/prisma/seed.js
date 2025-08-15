"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting comprehensive database seeding...');
    // Create test users with enhanced data
    const hashedPassword = await bcryptjs_1.default.hash('TestPassword123!', 12);
    const testUser1 = await prisma.user.upsert({
        where: { email: 'john.doe@lingualeap.com' },
        update: {},
        create: {
            email: 'john.doe@lingualeap.com',
            passwordHash: hashedPassword,
            name: 'John Doe',
            nativeLanguage: 'en',
            targetLanguage: 'fr',
            currentLevel: client_1.UserLevel.INTERMEDIATE,
            xpPoints: 1250,
            dailyStreak: 15,
            maxStreak: 30,
            totalLearningTime: 480,
            timezone: 'America/New_York',
            isActive: true,
            isVerified: true,
            subscriptionTier: 'premium',
            bio: 'Language enthusiast learning French for travel',
            profileImageUrl: 'https://example.com/avatars/john.jpg',
            lastActive: new Date(),
            lastLoginAt: new Date()
        },
    });
    const testUser2 = await prisma.user.upsert({
        where: { email: 'maria.garcia@lingualeap.com' },
        update: {},
        create: {
            email: 'maria.garcia@lingualeap.com',
            passwordHash: hashedPassword,
            name: 'Maria Garcia',
            nativeLanguage: 'es',
            targetLanguage: 'en',
            currentLevel: client_1.UserLevel.ADVANCED,
            xpPoints: 2850,
            dailyStreak: 45,
            maxStreak: 60,
            totalLearningTime: 720,
            timezone: 'Europe/Madrid',
            isActive: true,
            isVerified: true,
            subscriptionTier: 'premium',
            bio: 'Business professional improving English for career growth',
            lastActive: new Date(),
            lastLoginAt: new Date()
        },
    });
    console.log('✅ Created test users');
    // Create user progress records
    await prisma.userProgress.createMany({
        data: [
            {
                userId: testUser1.id,
                language: 'fr',
                wordsMastered: 245,
                phrasesMastered: 89,
                totalPracticeTime: 480,
                averagePronunciationScore: 8.2,
                averageAccuracyScore: 7.9,
                currentStreak: 15,
                levelAchieved: client_1.UserLevel.INTERMEDIATE,
                progressPercentage: 65.5,
                nextLevelXpRequired: 500,
                weeklyGoal: 5,
                monthlyGoal: 20,
                strongestSkill: 'pronunciation',
                weakestSkill: 'grammar'
            },
            {
                userId: testUser2.id,
                language: 'en',
                wordsMastered: 385,
                phrasesMastered: 142,
                totalPracticeTime: 720,
                averagePronunciationScore: 9.1,
                averageAccuracyScore: 8.8,
                currentStreak: 45,
                levelAchieved: client_1.UserLevel.ADVANCED,
                progressPercentage: 82.3,
                nextLevelXpRequired: 250,
                weeklyGoal: 7,
                monthlyGoal: 25,
                strongestSkill: 'conversation',
                weakestSkill: 'listening'
            }
        ],
        skipDuplicates: true
    });
    console.log('✅ Created user progress records');
    // Create comprehensive phrases for multiple languages
    const phrases = [
        {
            textNativeLanguage: 'Hello, how are you?',
            textTargetLanguage: 'Bonjour, comment allez-vous ?',
            phoneticTranscription: 'bonˈʒuʁ komɑ̃ talɛ vu',
            topic: 'greetings',
            difficultyLevel: 1,
            type: 'phrase',
            nativeLanguageCode: 'en',
            targetLanguageCode: 'fr',
            usageContext: 'Formal greeting in French',
            usageExample: 'Use when meeting someone for the first time or in formal situations',
            tags: ['greeting', 'formal', 'basic'],
            frequency: 0.95,
            isActive: true
        },
        {
            textNativeLanguage: 'I would like a coffee, please',
            textTargetLanguage: 'Je voudrais un café, s\'il vous plaît',
            phoneticTranscription: 'ʒə vudʁɛ œ̃ kafɛ sil vu plɛ',
            topic: 'food_drink',
            difficultyLevel: 2,
            type: 'phrase',
            nativeLanguageCode: 'en',
            targetLanguageCode: 'fr',
            usageContext: 'Ordering drinks in a café',
            usageExample: 'Use when ordering at restaurants or cafés',
            tags: ['food', 'ordering', 'polite'],
            frequency: 0.85,
            isActive: true
        },
        {
            textNativeLanguage: 'Hola, ¿cómo estás?',
            textTargetLanguage: 'Hello, how are you?',
            phoneticTranscription: 'həˈloʊ haʊ ɑr ju',
            topic: 'greetings',
            difficultyLevel: 1,
            type: 'phrase',
            nativeLanguageCode: 'es',
            targetLanguageCode: 'en',
            usageContext: 'Casual greeting in English',
            usageExample: 'Use with friends, family, or informal situations',
            tags: ['greeting', 'casual', 'basic'],
            frequency: 0.98,
            isActive: true
        }
    ];
    for (const phrase of phrases) {
        await prisma.phrase.upsert({
            where: {
                textTargetLanguage: phrase.textTargetLanguage
            },
            update: {},
            create: phrase
        });
    }
    console.log('✅ Created sample phrases');
    // Create user preferences
    const preferences = [
        { userId: testUser1.id, type: client_1.UserPreferenceType.AUDIO_SPEED, key: 'speed', value: '1.0' },
        { userId: testUser1.id, type: client_1.UserPreferenceType.VOICE_TYPE, key: 'voice', value: 'female' },
        { userId: testUser1.id, type: client_1.UserPreferenceType.DAILY_REMINDER, key: 'enabled', value: 'true' },
        { userId: testUser1.id, type: client_1.UserPreferenceType.DAILY_REMINDER, key: 'time', value: '09:00' },
        { userId: testUser1.id, type: client_1.UserPreferenceType.DIFFICULTY_AUTO_ADJUST, key: 'enabled', value: 'true' },
        { userId: testUser2.id, type: client_1.UserPreferenceType.AUDIO_SPEED, key: 'speed', value: '1.25' },
        { userId: testUser2.id, type: client_1.UserPreferenceType.VOICE_TYPE, key: 'voice', value: 'male' },
        { userId: testUser2.id, type: client_1.UserPreferenceType.PROGRESS_NOTIFICATIONS, key: 'enabled', value: 'true' },
        { userId: testUser2.id, type: client_1.UserPreferenceType.ANALYTICS_OPT_IN, key: 'enabled', value: 'true' }
    ];
    for (const pref of preferences) {
        await prisma.userPreference.upsert({
            where: {
                userId_type_key: {
                    userId: pref.userId,
                    type: pref.type,
                    key: pref.key
                }
            },
            update: { value: pref.value },
            create: pref
        });
    }
    console.log('✅ Created user preferences');
    // Create audit log entries for GDPR compliance
    await prisma.auditLog.createMany({
        data: [
            {
                userId: testUser1.id,
                action: client_1.AuditAction.LOGIN,
                resource: 'user_sessions',
                resourceId: testUser1.id,
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                metadata: JSON.stringify({ loginMethod: 'email', success: true })
            },
            {
                userId: testUser2.id,
                action: client_1.AuditAction.UPDATE,
                resource: 'users',
                resourceId: testUser2.id,
                oldValues: JSON.stringify({ name: 'Maria G.' }),
                newValues: JSON.stringify({ name: 'Maria Garcia' }),
                ipAddress: '10.0.0.45',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                metadata: JSON.stringify({ field: 'name', reason: 'profile_update' })
            }
        ]
    });
    console.log('✅ Created audit logs for GDPR compliance');
    // Create system health monitoring data
    await prisma.systemHealth.createMany({
        data: [
            {
                serviceName: 'whisper-api',
                status: 'healthy',
                responseTime: 250.5,
                cpuUsage: 45.2,
                memoryUsage: 78.9,
                activeConnections: 12,
                errorRate: 0.02
            },
            {
                serviceName: 'database',
                status: 'healthy',
                responseTime: 15.3,
                cpuUsage: 32.1,
                memoryUsage: 65.4,
                activeConnections: 8,
                errorRate: 0.0
            },
            {
                serviceName: 'auth-service',
                status: 'healthy',
                responseTime: 89.7,
                cpuUsage: 28.6,
                memoryUsage: 52.3,
                activeConnections: 15,
                errorRate: 0.01
            }
        ]
    });
    console.log('✅ Created system health records');
    n; // Create user speech preferences
    await prisma.userSpeechPreference.createMany({
        data: [
            {
                userId: testUser1.id,
                preferredProvider: "WHISPER_API",
                allowBrowserSpeech: true,
                privacyMode: false,
                enableOfflineMode: false,
                audioQuality: "standard",
                autoFallback: true,
                maxProcessingTime: 30000,
                enableCaching: true,
                preferredLanguage: "fr",
                customSettings: {
                    pronunciationFeedback: "detailed",
                    voiceSpeed: 1.0,
                    backgroundNoise: "filter"
                }
            },
            {
                userId: testUser2.id,
                preferredProvider: "WEB_SPEECH",
                allowBrowserSpeech: true,
                privacyMode: true,
                enableOfflineMode: true,
                audioQuality: "high",
                autoFallback: false,
                maxProcessingTime: 20000,
                enableCaching: false,
                preferredLanguage: "en",
                customSettings: {
                    pronunciationFeedback: "basic",
                    voiceSpeed: 1.25,
                    backgroundNoise: "allow"
                }
            }
        ],
        skipDuplicates: true
    });
    console.log("✅ Created user speech preferences");
    console.log('🎉 Comprehensive database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
// Create user speech preferences
await prisma.userSpeechPreference.createMany({
    data: [
        {
            userId: testUser1.id,
            preferredProvider: "WHISPER_API",
            allowBrowserSpeech: true,
            privacyMode: false,
            enableOfflineMode: false,
            audioQuality: "standard",
            autoFallback: true,
            maxProcessingTime: 30000,
            enableCaching: true,
            preferredLanguage: "fr",
            customSettings: JSON.stringify({
                pronunciationFeedback: "detailed",
                voiceSpeed: 1.0,
                backgroundNoise: "filter"
            })
        },
        {
            userId: testUser2.id,
            preferredProvider: "WEB_SPEECH",
            allowBrowserSpeech: true,
            privacyMode: true,
            enableOfflineMode: true,
            audioQuality: "high",
            autoFallback: false,
            maxProcessingTime: 20000,
            enableCaching: false,
            preferredLanguage: "en",
            customSettings: JSON.stringify({
                pronunciationFeedback: "basic",
                voiceSpeed: 1.25,
                backgroundNoise: "allow"
            })
        }
    ],
    skipDuplicates: true
});
console.log("✅ Created user speech preferences");
