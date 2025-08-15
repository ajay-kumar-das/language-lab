import React, { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "../types/api.types";

interface LanguageContextType {
  appLanguage: string;
  learningLanguage: string;
  setAppLanguage: (code: string) => void;
  setLearningLanguage: (code: string) => void;
  getLanguageByCode: (code: string) => SupportedLanguage | undefined;
  getEnabledLanguages: () => SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appLanguage, setAppLanguageState] = useState("en");
  const [learningLanguage, setLearningLanguageState] = useState("es");

  useEffect(() => {
    const storedAppLang = localStorage.getItem("lingualeap-app-language");
    const storedLearningLang = localStorage.getItem("lingualeap-learning-language");
    
    if (storedAppLang) setAppLanguageState(storedAppLang);
    if (storedLearningLang) setLearningLanguageState(storedLearningLang);
  }, []);

  const setAppLanguage = (code: string) => {
    setAppLanguageState(code);
    localStorage.setItem("lingualeap-app-language", code);
    document.documentElement.lang = code;
  };

  const setLearningLanguage = (code: string) => {
    setLearningLanguageState(code);
    localStorage.setItem("lingualeap-learning-language", code);
  };

  const getLanguageByCode = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  };

  const getEnabledLanguages = () => {
    return SUPPORTED_LANGUAGES.filter(lang => lang.enabled);
  };

  return (
    <LanguageContext.Provider value={{
      appLanguage,
      learningLanguage,
      setAppLanguage,
      setLearningLanguage,
      getLanguageByCode,
      getEnabledLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
