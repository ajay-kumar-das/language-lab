# LinguaLeap Hardware/System Block Diagram

```
                    LINGUALEAP LANGUAGE LEARNING PLATFORM
                           Hardware/System Block Diagram
═══════════════════════════════════════════════════════════════════════════════

                                 USER INTERFACE LAYER
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT-SIDE ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   WEB CLIENT    │    │  MOBILE CLIENT  │    │   PWA CLIENT    │        │
│  │   (React 19.1)  │    │  (React Native) │    │ (Service Worker)│        │
│  │                 │    │                 │    │                 │        │
│  │ • React Router  │    │ • Navigation    │    │ • Offline Cache │        │
│  │ • TypeScript    │    │ • Native APIs   │    │ • Push Notifications│    │
│  │ • Tailwind CSS  │    │ • Platform UI   │    │ • Background Sync│        │
│  │ • Headless UI   │    │ • Gesture Recog │    │ • App Shell     │        │
│  │ • Vite Bundler  │    │ • Camera/Mic    │    │ • Asset Caching │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│           │                       │                       │                │
│           └───────────────────────┼───────────────────────┘                │
│                                   │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    4-LAYER CLIENT-SIDE CACHING SYSTEM               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  L1: MEMORY CACHE (React State + Query Cache)                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ • TanStack Query (50MB RAM)    • Zustand State Manager       │   │   │
│  │  │ • Hot Vocabulary (500 items)   • UI State Cache             │   │   │
│  │  │ • Session Data                 • Recent API Responses        │   │   │
│  │  │ • Access Time: <10ms           • TTL: Session-based          │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                   ↓                                 │   │
│  │  L2: BROWSER STORAGE (localStorage + sessionStorage)               │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ • localStorage: User Preferences (5MB)                       │   │   │
│  │  │   - Theme settings, Language prefs, Auth tokens (AES-256)    │   │   │
│  │  │ • sessionStorage: Temporary Data (10MB)                      │   │   │
│  │  │   - Form state, Navigation breadcrumbs, Error recovery      │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                   ↓                                 │   │
│  │  L3: INDEXEDDB (Structured Offline Storage)                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ • Dexie.js Wrapper (500MB quota)                             │   │   │
│  │  │ • Vocabulary Database (50MB)    • Progress Sync Queue (10MB) │   │   │
│  │  │ • Course Content Cache (30MB)   • ML Model Storage (100MB)   │   │   │
│  │  │ • Audio/Media Cache (200MB)     • User Analytics (10MB)      │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                   ↓                                 │   │
│  │  L4: SERVICE WORKER CACHE (Network Response Cache)                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ • Application Shell (Critical resources)                     │   │   │
│  │  │ • API Response Cache (100MB)    • Media Asset Cache          │   │   │
│  │  │ • Offline Fallback Content     • Progressive Web App Assets  │   │   │
│  │  │ • Background Sync Queue        • Push Notification Store    │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTPS/WebSocket
                                       ↓
                                 NETWORK BOUNDARY
═══════════════════════════════════════════════════════════════════════════════

                               CONTENT DELIVERY LAYER (L1)
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GLOBAL CDN (CloudFlare/AWS)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   EDGE CACHE    │    │   STATIC ASSETS │    │   API GATEWAY   │        │
│  │ (200+ locations)│    │     (24-48h)    │    │   (5-15 min)    │        │
│  │                 │    │                 │    │                 │        │
│  │ • JS Bundles    │    │ • Images/Icons  │    │ • Vocabulary    │        │
│  │ • CSS Files     │    │ • Audio Files   │    │ • Course Data   │        │
│  │ • Fonts         │    │ • Video Content │    │ • User Content  │        │
│  │ • ML Models     │    │ • Translations  │    │ • Response Cache│        │
│  │ • Gzip/Brotli   │    │ • WebP Images   │    │ • Rate Limiting │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Load Balancing
                                       ↓
                              APPLICATION LAYER (L2)
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND SERVICES TIER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │  API GATEWAY    │    │  LOAD BALANCER  │    │  REVERSE PROXY  │        │
│  │   (Railway)     │    │    (Railway)    │    │    (Nginx)      │        │
│  │                 │    │                 │    │                 │        │
│  │ • Rate Limiting │    │ • Health Checks │    │ • SSL Termination│       │
│  │ • Authentication│    │ • Auto Scaling  │    │ • Request Routing│       │
│  │ • Request Routing│   │ • Failover      │    │ • Compression   │        │
│  │ • CORS Handling │    │ • Session Sticky│    │ • Security Headers│       │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│           │                       │                       │                │
│           └───────────────────────┼───────────────────────┘                │
│                                   │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      NODE.JS APPLICATION TIER                       │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │   │
│  │  │  WEB SERVER     │  │   API SERVER    │  │  WEBSOCKET      │     │   │
│  │  │  (Express.js)   │  │  (Express.js)   │  │    SERVER       │     │   │
│  │  │                 │  │                 │  │                 │     │   │
│  │  │ • Static Serving│  │ • REST API      │  │ • Real-time     │     │   │
│  │  │ • Middleware    │  │ • GraphQL       │  │ • Chat Support  │     │   │
│  │  │ • Auth Guards   │  │ • Validation    │  │ • Live Sessions │     │   │
│  │  │ • Error Handler │  │ • Serialization │  │ • Progress Sync │     │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │   │
│  │                                   │                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    BUSINESS LOGIC LAYER                     │   │   │
│  │  ├─────────────────────────────────────────────────────────────┤   │   │
│  │  │                                                             │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │   │
│  │  │  │   AUTH      │  │   LEARNING  │  │   PROGRESS  │         │   │   │
│  │  │  │  SERVICE    │  │   ENGINE    │  │   TRACKER   │         │   │   │
│  │  │  │             │  │             │  │             │         │   │   │
│  │  │  │ • JWT Mgmt  │  │ • Spaced    │  │ • XP System │         │   │   │
│  │  │  │ • OAuth2    │  │   Repetition│  │ • Streaks   │         │   │   │
│  │  │  │ • Sessions  │  │ • Adaptive  │  │ • Analytics │         │   │   │
│  │  │  │ • MFA       │  │   Difficulty│  │ • Reporting │         │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘         │   │   │
│  │  │                                                             │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │   │   │
│  │  │  │ VOCABULARY  │  │ PRONUNCIATION│  │   CONTENT   │         │   │   │
│  │  │  │  MANAGER    │  │   ANALYZER   │  │   MANAGER   │         │   │   │
│  │  │  │             │  │              │  │             │         │   │   │
│  │  │  │ • Word DB   │  │ • Speech API │  │ • Course    │         │   │   │
│  │  │  │ • Categories│  │ • Scoring    │  │   Structure │         │   │   │
│  │  │  │ • Difficulty│  │ • Feedback   │  │ • Lessons   │         │   │   │
│  │  │  │ • Metadata  │  │ • Audio Proc │  │ • Resources │         │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘         │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Connection Pooling
                                       ↓
                                 CACHE LAYER (L2)
┌─────────────────────────────────────────────────────────────────────────────┐
│                             REDIS CLUSTER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │  REDIS MASTER   │    │  REDIS REPLICA  │    │  REDIS REPLICA  │        │
│  │   (Primary)     │────│   (Read Only)   │────│   (Read Only)   │        │
│  │                 │    │                 │    │                 │        │
│  │ • Session Store │    │ • Query Cache   │    │ • User Data     │        │
│  │ • User Prefs    │    │ • API Responses │    │ • Learning Data │        │
│  │ • Active Data   │    │ • Content Cache │    │ • Analytics     │        │
│  │ • Write Ops     │    │ • Read Scaling  │    │ • Backup Store  │        │
│  │ • TTL: 1-24h    │    │ • TTL: 5min-2h  │    │ • TTL: Variable │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│                                   │                                        │
│                    ┌─────────────────────────────────┐                     │
│                    │         REDIS SENTINEL          │                     │
│                    │        (Monitoring)             │                     │
│                    │                                 │                     │
│                    │ • Health Monitoring             │                     │
│                    │ • Automatic Failover            │                     │
│                    │ • Configuration Management      │                     │
│                    │ • Performance Metrics           │                     │
│                    └─────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Prisma ORM
                                       ↓
                                DATABASE LAYER (L3)
┌─────────────────────────────────────────────────────────────────────────────┐
│                            POSTGRESQL DATABASE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │  PRIMARY DB     │    │   REPLICA DB    │    │   BACKUP DB     │        │
│  │  (Railway)      │────│   (Read Only)   │────│   (Archive)     │        │
│  │                 │    │                 │    │                 │        │
│  │ • User Data     │    │ • Read Queries  │    │ • Full Backups  │        │
│  │ • Learning Data │    │ • Analytics     │    │ • Point in Time │        │
│  │ • Progress Data │    │ • Reports       │    │ • Disaster Rec. │        │
│  │ • Content Data  │    │ • Query Caching │    │ • Data Archive  │        │
│  │ • Write Ops     │    │ • Load Balancing│    │ • Compliance    │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        DATABASE SCHEMA                              │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  users               phrases               speaking_attempts         │   │
│  │  ├─ id (CUID)        ├─ id (CUID)         ├─ id (CUID)             │   │
│  │  ├─ email             ├─ textNative        ├─ userId (FK)           │   │
│  │  ├─ password          ├─ textTarget        ├─ phraseId (FK)         │   │
│  │  ├─ name              ├─ phonetic          ├─ audioUrl              │   │
│  │  ├─ nativeLanguage    ├─ topic             ├─ transcription         │   │
│  │  ├─ targetLanguage    ├─ difficulty        ├─ scores (1-100)        │   │
│  │  ├─ currentLevel      ├─ type              ├─ aiFeedback            │   │
│  │  ├─ xpPoints          ├─ imageUrl          ├─ attemptDate           │   │
│  │  ├─ streaks           ├─ usageContext      └─────────────────────    │   │
│  │  ├─ lastActive        ├─ languageCodes                              │   │
│  │  └─ timestamps        └─ createdAt         conversation_logs        │   │
│  │                                            ├─ id (CUID)             │   │
│  │  learning_sessions    user_progress        ├─ userId (FK)           │   │
│  │  ├─ id (CUID)        ├─ id (CUID)         ├─ sessionId             │   │
│  │  ├─ userId (FK)      ├─ userId (FK)       ├─ turnNumber            │   │
│  │  ├─ sessionType      ├─ language          ├─ speaker               │   │
│  │  ├─ languagePract.   ├─ wordsMastered     ├─ messageText           │   │
│  │  ├─ topicCovered     ├─ phrasesMastered   ├─ audioUrl              │   │
│  │  ├─ wordsLearned     ├─ practiceTime      ├─ responseTime          │   │
│  │  ├─ timeSpent        ├─ avgPronuncScore   ├─ conversationTopic     │   │
│  │  ├─ xpEarned         ├─ currentStreak     ├─ difficultyLevel       │   │
│  │  ├─ accuracyPct      ├─ levelAchieved     └─ timestamp             │   │
│  │  └─ sessionDate      └─ lastUpdated                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ External API Calls
                                       ↓
                                EXTERNAL SERVICES
┌─────────────────────────────────────────────────────────────────────────────┐
│                             AI & ML SERVICES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   OPENAI API    │    │   WHISPER API   │    │  CUSTOM LLM     │        │
│  │   (GPT-4/3.5)   │    │ (Speech-to-Text)│    │   (InvokeLLM)   │        │
│  │                 │    │                 │    │                 │        │
│  │ • Conversation  │    │ • Audio Trans.  │    │ • Content Gen   │        │
│  │ • Content Gen   │    │ • Pronunciation │    │ • Conversation  │        │
│  │ • Translation   │    │ • Voice Analysis│    │ • Personalized  │        │
│  │ • Cultural Ctx  │    │ • Quality Score │    │ • Feedback      │        │
│  │ • Adaptive Resp │    │ • Language Det  │    │ • Local Process │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   AZURE SPEECH  │    │ GOOGLE TRANSLATE│    │   TTS SERVICES  │        │
│  │    SERVICES     │    │      API        │    │   (Multiple)    │        │
│  │                 │    │                 │    │                 │        │
│  │ • Advanced STT  │    │ • Multi-Language│    │ • Natural Voice │        │
│  │ • Pronunciation │    │ • Real-time     │    │ • Emotion Tone  │        │
│  │ • Accent Detect │    │ • Cultural Adapt│    │ • Speed Control │        │
│  │ • Confidence    │    │ • Context Aware │    │ • Multiple Voice│        │
│  │ • Emotion Recog │    │ • Quality Assess│    │ • SSML Support  │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MEDIA & STORAGE SERVICES                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   CLOUDINARY    │    │   AWS S3/       │    │   FILE STORAGE  │        │
│  │   (Media CDN)   │    │   GOOGLE CLOUD  │    │   (Local/NAS)   │        │
│  │                 │    │                 │    │                 │        │
│  │ • Image Storage │    │ • Audio Files   │    │ • User Uploads  │        │
│  │ • Auto-Optimize │    │ • Video Content │    │ • Temp Files    │        │
│  │ • Transformations│   │ • Backup Storage│    │ • Cache Storage │        │
│  │ • Global CDN    │    │ • Archive Data  │    │ • Log Files     │        │
│  │ • Adaptive Deliv│    │ • Disaster Rec. │    │ • Dev Assets    │        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HOSTING & INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │     VERCEL      │    │    RAILWAY      │    │   MONITORING    │        │
│  │   (Frontend)    │    │   (Backend)     │    │   & ANALYTICS   │        │
│  │                 │    │                 │    │                 │        │
│  │ • Static Deploy │    │ • Container     │    │ • Sentry (Error)│        │
│  │ • Edge Functions│    │ • Auto Deploy  │    │ • DataDog (APM) │        │
│  │ • Global CDN    │    │ • Database Host │    │ • LogRocket     │        │
│  │ • Auto Scaling  │    │ • Environment   │    │ • Google Analyt.│        │
│  │ • Preview Deploys│   │ • Load Balancer │    │ • Custom Metrics│        │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SECURITY & COMPLIANCE                          │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  • SSL/TLS Encryption (Let's Encrypt)    • DDoS Protection         │   │
│  │  • OAuth 2.0 / JWT Authentication        • Rate Limiting           │   │
│  │  • GDPR/CCPA Compliance                  • Security Headers        │   │
│  │  • Data Encryption at Rest               • WAF (Web App Firewall)  │   │
│  │  • Regular Security Audits               • Vulnerability Scanning  │   │
│  │  • Multi-Factor Authentication           • Backup & Recovery       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

                               DATA FLOW DIAGRAM
                                      
    USER ACTION → CLIENT CACHE → CDN → LOAD BALANCER → API GATEWAY 
                     ↑               ↓
                  L4 Cache      Response Cache
                     ↑               ↓
    IndexedDB ←── L3 Cache      Redis Cache (L2) ←─── Business Logic
                     ↑               ↓                      ↓
    localStorage ← L2 Cache      Query Cache (L3) ←── PostgreSQL DB
                     ↑               ↓                      ↓
    Memory Cache ← L1 Cache      External APIs ←──── AI/ML Services

═══════════════════════════════════════════════════════════════════════════════

                             TECHNOLOGY STACK SUMMARY

    Frontend:    React 19.1 + TypeScript + Vite + Tailwind CSS + Headless UI
    Backend:     Node.js + Express.js + TypeScript + Prisma ORM
    Database:    PostgreSQL (Primary) + Redis (Cache) + IndexedDB (Client)
    AI/ML:       OpenAI GPT-4 + Whisper API + InvokeLLM + Azure Speech
    Storage:     Cloudinary (Media) + AWS S3/Google Cloud + Local Storage
    Hosting:     Vercel (Frontend) + Railway (Backend) + CloudFlare (CDN)
    Monitoring:  Sentry + DataDog + LogRocket + Google Analytics
    Security:    OAuth 2.0 + JWT + SSL/TLS + GDPR/CCPA Compliance

═══════════════════════════════════════════════════════════════════════════════

                              PERFORMANCE METRICS

    Cache Hit Rates:  L1: 95% (<10ms)  |  L2: 90% (<5ms)  |  L3: 85% (<10ms)
    Response Times:   API: <200ms      |  Audio: <100ms   |  Speech: <500ms
    Scalability:      1M concurrent users | 99.9% uptime | Auto-scaling
    Storage Limits:   Client: 500MB    |  CDN: Global    |  DB: Unlimited

═══════════════════════════════════════════════════════════════════════════════
```

## Key Components Shown:

### 🏗️ **Client-Side Architecture**
- **4-Layer Caching System** with specific storage limits and technologies
- **PWA Support** with Service Workers for offline functionality
- **Multi-platform** support (Web, Mobile, PWA)

### 🔧 **Backend Infrastructure**  
- **Node.js Application Tier** with Express.js and business logic separation
- **Redis Cluster** for server-side caching and session management
- **PostgreSQL Database** with complete schema representation

### 🤖 **External Services**
- **AI/ML Services** (OpenAI, Whisper, Azure Speech)
- **Media Storage** (Cloudinary, AWS S3)
- **Hosting Platform** (Vercel, Railway, CDN)

### 📊 **Performance Specifications**
- **Cache Hit Rates**: L1: 95%, L2: 90%, L3: 85%
- **Response Times**: API <200ms, Audio <100ms, Speech <500ms
- **Storage Limits**: Client 500MB, CDN Global, DB Unlimited

This comprehensive HDD block diagram is now saved at:
**`architecture/LinguaLeap-HDD-Block-Diagram.md`**