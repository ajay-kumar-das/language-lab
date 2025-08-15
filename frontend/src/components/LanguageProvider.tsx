import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  nativeLanguage: string;
  setLanguages: (appLang: string, nativeLang: string) => void;
  initializeFromUser: (appLang: string, nativeLang: string) => void;
  t: (key: string, params?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation dictionary
const translations: { [key: string]: { [key: string]: string } } = {
  English: {
    'dashboard': 'Dashboard',
    'learn': 'Learn',
    'practice': 'Practice',
    'courses': 'Courses',
    'profile': 'Profile',
    'welcome_back': 'Welcome back',
    'ready_to_continue': 'Ready to continue your language learning journey?',
    'todays_goal': "Today's Goal",
    'learn_new_words': 'Learn 10 new words',
    'start_learning': 'Start Learning',
    'sign_out': 'Sign Out',
    'keep_learning': 'Keep learning every day! 🚀',
    'choose_language': 'Choose Your Language',
    'choose_topic': 'Choose Your Topic',
    'start_learning_vocabulary': 'Start Learning Vocabulary',
    'practice_conversations': 'Practice Conversations',
    'start_conversation_practice': 'Start Conversation Practice',
    'my_courses': 'My Courses',
    'create_course': 'Create Course',
    'personal_information': 'Personal Information',
    'language_preferences': 'Language Preferences',
    'learning_progress': 'Learning Progress',
    'words_learned': 'Words Learned',
    'days_streak': 'Days Streak',
    'edit_profile': 'Edit Profile',
    'save_changes': 'Save Changes',
    'saving': 'Saving...',
    'native_language': 'Native Language',
    'app_language': 'App Language',
    'language_setting_applied': 'Language Setting Applied',
    'app_language_changed': 'App language changed to {language}. Some features may display in English until full translation is available.',
    'explore_comprehensive_courses': 'Explore our comprehensive language learning courses',
    'continue_building_vocabulary': 'Continue building your vocabulary and reach your daily goal!',
    'loading_dashboard': 'Loading Dashboard...',
    'welcome_back_name': 'Welcome back, {name}!',
    'welcome_back': 'Welcome back',
    'continue_journey': 'Continue your language learning journey',
    'lessons_completed': 'Lessons Completed',
    'current_streak': 'Current Streak',
    'total_xp': 'Total XP',
    'learn_words_goal': 'Learn {count} new words',
    'recent_activity': 'Recent Activity',
    'no_recent_activity': 'No recent activity',
    'start_learning_to_see_progress': 'Start learning to see your progress here',
    'pick_up_where_left_off': 'Pick up where you left off',
    'improve_conversation_skills': 'Improve your conversation skills',
    'explore_learning_paths': 'Explore structured learning paths',
    'profile_settings': 'Profile Settings',
    'manage_account_preferences': 'Manage your account and preferences',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'email_address': 'Email Address',
    'select_native_language': 'Select your native language',
    'select_app_language': 'Select app language',
    'choose_language_master': 'Choose your language and master vocabulary or sentences',
    'please_select_language': 'Please select a language first!',
    'interactive': 'Interactive',
    'visual_learning': 'Visual Learning',
    'ai_powered': 'AI-Powered',
    'adaptive': 'Adaptive',
    'choose_learning_language': 'Choose Your Learning Language',
    'select_language_to_learn': 'Select a language to learn...',
    'vocabulary_learning': 'Vocabulary Learning',
    'sentence_practice': 'Sentence Practice',
    'select_language_to_begin': 'Select a Language to Begin',
    'choose_target_language': 'Choose your target language from the dropdown above to start learning',
    'continue_learning': 'Continue Learning',
    'master_conversations_ai': 'Master conversations and pronunciation with AI-powered practice',
    'voice_recognition': 'Voice Recognition',
    'ai_feedback': 'AI Feedback',
    'realtime_analysis': 'Real-time Analysis',
    'instant_feedback': 'Instant Feedback',
    'choose_practice_language': 'Choose Your Practice Language',
    'select_language_to_practice': 'Select a language to practice...',
    'conversation_practice': 'Conversation Practice',
    'pronunciation_practice': 'Pronunciation Practice',
    'choose_target_language_practice': 'Choose your target language from the dropdown above to start practicing',
    'continue_practice': 'Continue Practice',
    'start_practice': 'Start Practice'
  },
  Spanish: {
    'dashboard': 'Tablero',
    'learn': 'Aprender',
    'practice': 'Practicar',
    'courses': 'Cursos',
    'profile': 'Perfil',
    'welcome_back_name': 'Bienvenido de vuelta, {name}!',
    'welcome_back': 'Bienvenido de vuelta',
    'ready_to_continue': '¿Listo para continuar tu viaje de aprendizaje de idiomas?',
    'todays_goal': 'Objetivo de Hoy',
    'learn_new_words': 'Aprende 10 palabras nuevas',
    'start_learning': 'Comenzar a Aprender',
    'sign_out': 'Cerrar Sesión',
    'keep_learning': '¡Sigue aprendiendo todos los días! 🚀',
    'choose_language': 'Elige Tu Idioma',
    'choose_topic': 'Elige Tu Tema',
    'start_learning_vocabulary': 'Comenzar Aprendizaje de Vocabulario',
    'practice_conversations': 'Practicar Conversaciones',
    'start_conversation_practice': 'Comenzar Práctica de Conversación',
    'my_courses': 'Mis Cursos',
    'create_course': 'Crear Curso',
    'personal_information': 'Información Personal',
    'language_preferences': 'Preferencias de Idioma',
    'learning_progress': 'Progreso de Aprendizaje',
    'words_learned': 'Palabras Aprendidas',
    'days_streak': 'Días Consecutivos',
    'edit_profile': 'Editar Perfil',
    'save_changes': 'Guardar Cambios',
    'saving': 'Guardando...',
    'native_language': 'Idioma Nativo',
    'app_language': 'Idioma de la App',
    'language_setting_applied': 'Configuración de Idioma Aplicada',
    'app_language_changed': 'Idioma de la aplicación cambiado a {language}. Algunas funciones pueden mostrarse en inglés hasta que la traducción completa esté disponible.',
    'explore_comprehensive_courses': 'Explora nuestros cursos completos de aprendizaje de idiomas',
    'continue_building_vocabulary': '¡Continúa construyendo tu vocabulario y alcanza tu objetivo diario!',
    'loading_dashboard': 'Cargando Tablero...',
    'continue_journey': 'Continúa tu viaje de aprendizaje de idiomas',
    'lessons_completed': 'Lecciones Completadas',
    'current_streak': 'Racha Actual',
    'total_xp': 'XP Total',
    'learn_words_goal': 'Aprender {count} palabras nuevas',
    'recent_activity': 'Actividad Reciente',
    'no_recent_activity': 'Sin actividad reciente',
    'start_learning_to_see_progress': 'Comienza a aprender para ver tu progreso aquí',
    'pick_up_where_left_off': 'Continúa donde lo dejaste',
    'improve_conversation_skills': 'Mejora tus habilidades de conversación',
    'explore_learning_paths': 'Explora rutas de aprendizaje estructuradas',
    'profile_settings': 'Configuración del Perfil',
    'manage_account_preferences': 'Gestiona tu cuenta y preferencias',
    'first_name': 'Nombre',
    'last_name': 'Apellido',
    'email_address': 'Dirección de Email',
    'select_native_language': 'Selecciona tu idioma nativo',
    'select_app_language': 'Selecciona idioma de la app',
    'choose_language_master': 'Elige tu idioma y domina vocabulario o oraciones',
    'please_select_language': '¡Por favor selecciona un idioma primero!',
    'interactive': 'Interactivo',
    'visual_learning': 'Aprendizaje Visual',
    'ai_powered': 'Potenciado por IA',
    'adaptive': 'Adaptativo',
    'choose_learning_language': 'Elige Tu Idioma de Aprendizaje',
    'select_language_to_learn': 'Selecciona un idioma para aprender...',
    'vocabulary_learning': 'Aprendizaje de Vocabulario',
    'sentence_practice': 'Práctica de Oraciones',
    'select_language_to_begin': 'Selecciona un Idioma para Comenzar',
    'choose_target_language': 'Elige tu idioma objetivo del menú desplegable arriba para comenzar a aprender',
    'continue_learning': 'Continuar Aprendiendo',
    'master_conversations_ai': 'Domina conversaciones y pronunciación con práctica potenciada por IA',
    'voice_recognition': 'Reconocimiento de Voz',
    'ai_feedback': 'Retroalimentación IA',
    'realtime_analysis': 'Análisis en Tiempo Real',
    'instant_feedback': 'Retroalimentación Instantánea',
    'choose_practice_language': 'Elige Tu Idioma de Práctica',
    'select_language_to_practice': 'Selecciona un idioma para practicar...',
    'conversation_practice': 'Práctica de Conversación',
    'pronunciation_practice': 'Práctica de Pronunciación',
    'choose_target_language_practice': 'Elige tu idioma objetivo del menú desplegable arriba para comenzar a practicar',
    'continue_practice': 'Continuar Práctica',
    'start_practice': 'Comenzar Práctica'
  },
  French: {
    'dashboard': 'Tableau de Bord',
    'learn': 'Apprendre',
    'practice': 'Pratiquer',
    'courses': 'Cours',
    'profile': 'Profil',
    'welcome_back': 'Bon retour',
    'ready_to_continue': 'Prêt à continuer votre parcours d\'apprentissage des langues?',
    'todays_goal': 'Objectif d\'Aujourd\'hui',
    'learn_new_words': 'Apprendre 10 nouveaux mots',
    'start_learning': 'Commencer à Apprendre',
    'sign_out': 'Se Déconnecter',
    'keep_learning': 'Continuez à apprendre tous les jours! 🚀',
    'choose_language': 'Choisissez Votre Langue',
    'choose_topic': 'Choisissez Votre Sujet',
    'start_learning_vocabulary': 'Commencer l\'Apprentissage du Vocabulaire',
    'practice_conversations': 'Pratiquer les Conversations',
    'start_conversation_practice': 'Commencer la Pratique de Conversation',
    'my_courses': 'Mes Cours',
    'create_course': 'Créer un Cours',
    'personal_information': 'Informations Personnelles',
    'language_preferences': 'Préférences Linguistiques',
    'learning_progress': 'Progrès d\'Apprentissage',
    'words_learned': 'Mots Appris',
    'days_streak': 'Jours Consécutifs',
    'edit_profile': 'Modifier le Profil',
    'save_changes': 'Sauvegarder les Modifications',
    'saving': 'Sauvegarde...',
    'native_language': 'Langue Maternelle',
    'app_language': 'Langue de l\'App',
    'language_setting_applied': 'Paramètre de Langue Appliqué',
    'app_language_changed': 'Langue de l\'application changée en {language}. Certaines fonctionnalités peuvent s\'afficher en anglais jusqu\'à ce que la traduction complète soit disponible.',
    'explore_comprehensive_courses': 'Explorez nos cours complets d\'apprentissage des langues',
    'continue_building_vocabulary': 'Continuez à développer votre vocabulaire et atteignez votre objectif quotidien!'
  },
  German: {
    'dashboard': 'Dashboard',
    'learn': 'Lernen',
    'practice': 'Üben',
    'courses': 'Kurse',
    'profile': 'Profil',
    'welcome_back': 'Willkommen zurück',
    'ready_to_continue': 'Bereit, Ihre Sprachlernreise fortzusetzen?',
    'todays_goal': 'Heutiges Ziel',
    'learn_new_words': '10 neue Wörter lernen',
    'start_learning': 'Lernen Beginnen',
    'sign_out': 'Abmelden',
    'keep_learning': 'Lernen Sie jeden Tag weiter! 🚀',
    'choose_language': 'Wählen Sie Ihre Sprache',
    'choose_topic': 'Wählen Sie Ihr Thema',
    'start_learning_vocabulary': 'Vokabular Lernen Beginnen',
    'practice_conversations': 'Gespräche Üben',
    'start_conversation_practice': 'Gesprächspraxis Beginnen',
    'my_courses': 'Meine Kurse',
    'create_course': 'Kurs Erstellen',
    'personal_information': 'Persönliche Informationen',
    'language_preferences': 'Spracheinstellungen',
    'learning_progress': 'Lernfortschritt',
    'words_learned': 'Gelernte Wörter',
    'days_streak': 'Tage in Folge',
    'edit_profile': 'Profil Bearbeiten',
    'save_changes': 'Änderungen Speichern',
    'saving': 'Speichern...',
    'native_language': 'Muttersprache',
    'app_language': 'App-Sprache',
    'language_setting_applied': 'Spracheinstellung Angewendet',
    'app_language_changed': 'App-Sprache geändert zu {language}. Einige Funktionen können auf Englisch angezeigt werden, bis die vollständige Übersetzung verfügbar ist.',
    'explore_comprehensive_courses': 'Entdecken Sie unsere umfassenden Sprachlernkurse',
    'continue_building_vocabulary': 'Bauen Sie weiter Ihren Wortschatz auf und erreichen Sie Ihr tägliches Ziel!'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only load from localStorage as fallback if not initialized from user data
    if (!isInitialized) {
      const savedPrefs = localStorage.getItem('languagePreferences');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setCurrentLanguage(prefs.appLanguage || 'English');
        setNativeLanguage(prefs.nativeLanguage || 'English');
      }
    }
  }, [isInitialized]);

  const setLanguages = (appLang: string, nativeLang: string) => {
    setCurrentLanguage(appLang);
    setNativeLanguage(nativeLang);
    
    // Save to localStorage
    const prefs = { appLanguage: appLang, nativeLanguage: nativeLang };
    localStorage.setItem('languagePreferences', JSON.stringify(prefs));
  };

  const initializeFromUser = (appLang: string, nativeLang: string) => {
    setCurrentLanguage(appLang);
    setNativeLanguage(nativeLang);
    setIsInitialized(true);
    
    // Apply HTML lang attribute for accessibility
    const getLanguageCode = (language: string): string => {
      const languageCodes: { [key: string]: string } = {
        'English': 'en',
        'Spanish': 'es', 
        'French': 'fr',
        'German': 'de'
      };
      return languageCodes[language] || 'en';
    };
    
    document.documentElement.lang = getLanguageCode(appLang);
    
    // Store preferences in localStorage as fallback
    const prefs = { appLanguage: appLang, nativeLanguage: nativeLang };
    localStorage.setItem('languagePreferences', JSON.stringify(prefs));
  };

  const t = (key: string, params?: { [key: string]: string }): string => {
    const languageDict = translations[currentLanguage];
    let translation = '';
    
    if (languageDict && languageDict[key]) {
      translation = languageDict[key];
    } else {
      // Fallback to English if translation not found
      const englishDict = translations['English'];
      if (englishDict && englishDict[key]) {
        translation = englishDict[key];
      } else {
        // Return empty string if no translation found, let the fallback handle it
        return '';
      }
    }
    
    // Replace parameters in translation
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, nativeLanguage, setLanguages, initializeFromUser, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}