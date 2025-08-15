import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { AuthLanguageProvider } from "./AuthLanguageProvider";

interface AuthWrapperProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onRegister: (data: { 
    email: string; 
    password: string; 
    confirmPassword: string; 
    firstName: string; 
    lastName: string;
    nativeLanguage?: string;
    appLanguage?: string;
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError?: () => void;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  onLogin,
  onRegister,
  isLoading,
  error,
  clearError
}) => {
  console.log('AuthWrapper props:', { clearError: typeof clearError, error });
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLanguageProvider>
      {isLogin ? (
        <LoginForm
          onLogin={onLogin}
          onSwitchToRegister={() => {
            console.log("Switching to register", { clearError: typeof clearError });
            if (clearError && typeof clearError === 'function') {
              clearError();
            }
            setIsLogin(false);
          }}
          isLoading={isLoading}
          error={error}
          clearError={clearError}
        />
      ) : (
        <RegisterForm
          onRegister={onRegister}
          onSwitchToLogin={() => {
            if (clearError && typeof clearError === 'function') {
              clearError();
            }
            setIsLogin(true);
          }}
          isLoading={isLoading}
          error={error}
        />
      )}
    </AuthLanguageProvider>
  );
};
