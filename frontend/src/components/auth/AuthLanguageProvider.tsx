import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APP_INTERFACE_LANGUAGES, getLanguageByName } from '../../constants/languages';

interface AuthLanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const AuthLanguageContext = createContext<AuthLanguageContextType | undefined>(undefined);

// Auth screen translations
const authTranslations: { [key: string]: { [key: string]: string } } = {
  English: {
    'app_name': 'LinguaLeap',
    'login_title': 'Sign in to continue your language learning journey',
    'register_title': 'Join thousands learning languages with LinguaLeap',
    'email_label': 'Email Address',
    'email_placeholder': 'Enter your email',
    'password_label': 'Password',
    'password_placeholder': 'Enter your password',
    'confirm_password_label': 'Confirm Password',
    'confirm_password_placeholder': 'Confirm your password',
    'first_name_label': 'First Name',
    'first_name_placeholder': 'Enter your first name',
    'last_name_label': 'Last Name',
    'last_name_placeholder': 'Enter your last name',
    'username_label': 'Username',
    'username_placeholder': 'Choose a username',
    'sign_in_button': 'Sign In',
    'sign_up_button': 'Sign Up',
    'signing_in': 'Signing in...',
    'signing_up': 'Creating account...',
    'continue_with_google': 'Continue with Google',
    'or_divider': 'or',
    'no_account': "Don't have an account?",
    'have_account': "Already have an account?",
    'sign_up_link': 'Sign up',
    'sign_in_link': 'Sign in',
    'terms_text': 'By signing in, you agree to our Terms of Service and Privacy Policy.',
    'terms_text_register': 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
    'language_selector': 'Language',
    'google_oauth_not_available': 'Google login is not currently available. Please use email and password to sign in.',
    'native_language_label': 'Native Language',
    'app_language_label': 'App Language',
    'target_language_label': 'Language to Learn',
    'target_language_placeholder': 'Choose language to learn',
  },
  Spanish: {
    'app_name': 'LinguaLeap',
    'login_title': 'Inicia sesión para continuar tu viaje de aprendizaje de idiomas',
    'register_title': 'Únete a miles aprendiendo idiomas con LinguaLeap',
    'email_label': 'Correo Electrónico',
    'email_placeholder': 'Ingresa tu correo electrónico',
    'password_label': 'Contraseña',
    'password_placeholder': 'Ingresa tu contraseña',
    'confirm_password_label': 'Confirmar Contraseña',
    'confirm_password_placeholder': 'Confirma tu contraseña',
    'first_name_label': 'Nombre',
    'first_name_placeholder': 'Ingresa tu nombre',
    'last_name_label': 'Apellido',
    'last_name_placeholder': 'Ingresa tu apellido',
    'username_label': 'Usuario',
    'username_placeholder': 'Elige un nombre de usuario',
    'sign_in_button': 'Iniciar Sesión',
    'sign_up_button': 'Registrarse',
    'signing_in': 'Iniciando sesión...',
    'signing_up': 'Creando cuenta...',
    'continue_with_google': 'Continuar con Google',
    'or_divider': 'o',
    'no_account': '¿No tienes una cuenta?',
    'have_account': '¿Ya tienes una cuenta?',
    'sign_up_link': 'Regístrate',
    'sign_in_link': 'Inicia sesión',
    'terms_text': 'Al iniciar sesión, aceptas nuestros Términos de Servicio y Política de Privacidad.',
    'terms_text_register': 'Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad.',
    'language_selector': 'Idioma',
    'google_oauth_not_available': 'El inicio de sesión con Google no está disponible actualmente. Por favor, usa email y contraseña para iniciar sesión.',
    'native_language_label': 'Idioma Nativo',
    'app_language_label': 'Idioma de la App',
    'target_language_label': 'Idioma a Aprender',
    'target_language_placeholder': 'Elige el idioma a aprender',
  },
  French: {
    'app_name': 'LinguaLeap',
    'login_title': 'Connectez-vous pour continuer votre parcours d\'apprentissage des langues',
    'register_title': 'Rejoignez des milliers de personnes apprenant des langues avec LinguaLeap',
    'email_label': 'Adresse E-mail',
    'email_placeholder': 'Entrez votre e-mail',
    'password_label': 'Mot de Passe',
    'password_placeholder': 'Entrez votre mot de passe',
    'confirm_password_label': 'Confirmer le Mot de Passe',
    'confirm_password_placeholder': 'Confirmez votre mot de passe',
    'first_name_label': 'Prénom',
    'first_name_placeholder': 'Entrez votre prénom',
    'last_name_label': 'Nom',
    'last_name_placeholder': 'Entrez votre nom',
    'username_label': 'Nom d\'Utilisateur',
    'username_placeholder': 'Choisissez un nom d\'utilisateur',
    'sign_in_button': 'Se Connecter',
    'sign_up_button': 'S\'Inscrire',
    'signing_in': 'Connexion...',
    'signing_up': 'Création du compte...',
    'continue_with_google': 'Continuer avec Google',
    'or_divider': 'ou',
    'no_account': 'Pas de compte ?',
    'have_account': 'Déjà un compte ?',
    'sign_up_link': 'S\'inscrire',
    'sign_in_link': 'Se connecter',
    'terms_text': 'En vous connectant, vous acceptez nos Conditions de Service et Politique de Confidentialité.',
    'terms_text_register': 'En créant un compte, vous acceptez nos Conditions de Service et Politique de Confidentialité.',
    'language_selector': 'Langue',
    'google_oauth_not_available': 'La connexion Google n\'est actuellement pas disponible. Veuillez utiliser email et mot de passe pour vous connecter.',
    'native_language_label': 'Langue Maternelle',
    'app_language_label': 'Langue de l\'App',
    'target_language_label': 'Langue à Apprendre',
    'target_language_placeholder': 'Choisir la langue à apprendre',
  },
  German: {
    'app_name': 'LinguaLeap',
    'login_title': 'Melden Sie sich an, um Ihre Sprachlernreise fortzusetzen',
    'register_title': 'Schließen Sie sich Tausenden beim Sprachenlernen mit LinguaLeap an',
    'email_label': 'E-Mail-Adresse',
    'email_placeholder': 'E-Mail eingeben',
    'password_label': 'Passwort',
    'password_placeholder': 'Passwort eingeben',
    'confirm_password_label': 'Passwort Bestätigen',
    'confirm_password_placeholder': 'Passwort bestätigen',
    'first_name_label': 'Vorname',
    'first_name_placeholder': 'Vorname eingeben',
    'last_name_label': 'Nachname',
    'last_name_placeholder': 'Nachname eingeben',
    'username_label': 'Benutzername',
    'username_placeholder': 'Benutzername wählen',
    'sign_in_button': 'Anmelden',
    'sign_up_button': 'Registrieren',
    'signing_in': 'Anmeldung...',
    'signing_up': 'Konto wird erstellt...',
    'continue_with_google': 'Mit Google fortfahren',
    'or_divider': 'oder',
    'no_account': 'Noch kein Konto?',
    'have_account': 'Bereits ein Konto?',
    'sign_up_link': 'Registrieren',
    'sign_in_link': 'Anmelden',
    'terms_text': 'Mit der Anmeldung akzeptieren Sie unsere Nutzungsbedingungen und Datenschutzrichtlinie.',
    'terms_text_register': 'Mit der Kontoeröffnung akzeptieren Sie unsere Nutzungsbedingungen und Datenschutzrichtlinie.',
    'language_selector': 'Sprache',
    'google_oauth_not_available': 'Google-Anmeldung ist derzeit nicht verfügbar. Bitte verwenden Sie E-Mail und Passwort zur Anmeldung.',
    'native_language_label': 'Muttersprache',
    'app_language_label': 'App-Sprache',
    'target_language_label': 'Sprache zum Lernen',
    'target_language_placeholder': 'Sprache zum Lernen wählen',
  }
};

export function AuthLanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('English');

  useEffect(() => {
    // Check for previously saved language preferences
    const checkStoredPreferences = () => {
      // First check if user has main app language preferences saved
      const authData = localStorage.getItem('lingualeap-auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          // Check both possible structures: direct user object or nested under state
          const appLanguage = parsed.state?.user?.appLanguage || parsed.user?.appLanguage;
          if (appLanguage && authTranslations[appLanguage]) {
            setCurrentLanguage(appLanguage);
            return;
          }
        } catch (error) {
          console.log('Could not parse auth data for language preference');
        }
      }

      // Fallback to auth-specific language preference
      const authLangPreference = localStorage.getItem('lingualeap-auth-language');
      if (authLangPreference && authTranslations[authLangPreference]) {
        setCurrentLanguage(authLangPreference);
        return;
      }

      // Final fallback - browser language detection
      const browserLang = navigator.language || navigator.languages[0];
      const browserLangCode = browserLang.split('-')[0].toLowerCase();
      
      // Find matching language in our supported app interface languages
      const matchingLanguage = APP_INTERFACE_LANGUAGES.find(lang => 
        lang.code === browserLangCode && authTranslations[lang.name]
      );
      
      if (matchingLanguage) {
        setCurrentLanguage(matchingLanguage.name);
      }
    };

    checkStoredPreferences();
  }, []);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    // Save auth language preference
    localStorage.setItem('lingualeap-auth-language', language);
    
    // Apply HTML lang attribute
    const getLanguageCode = (lang: string): string => {
      const matchingLanguage = APP_INTERFACE_LANGUAGES.find(l => l.name === lang);
      return matchingLanguage?.code || 'en';
    };
    
    document.documentElement.lang = getLanguageCode(language);
  };

  const t = (key: string): string => {
    const languageDict = authTranslations[currentLanguage];
    if (languageDict && languageDict[key]) {
      return languageDict[key];
    }
    
    // Fallback to English
    const englishDict = authTranslations['English'];
    if (englishDict && englishDict[key]) {
      return englishDict[key];
    }
    
    // Final fallback to key itself
    return key;
  };

  return (
    <AuthLanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </AuthLanguageContext.Provider>
  );
}

export function useAuthLanguage() {
  const context = useContext(AuthLanguageContext);
  if (context === undefined) {
    throw new Error('useAuthLanguage must be used within an AuthLanguageProvider');
  }
  return context;
}