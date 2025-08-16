import React, { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { EmailVerificationForm } from "./EmailVerificationForm";
import { AuthLanguageProvider } from "./AuthLanguageProvider";
import { authApiService } from "../../services/api/authService";

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

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'verify-email';

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  onLogin,
  onRegister,
  isLoading,
  error,
  clearError
}) => {
  console.log('AuthWrapper props:', { clearError: typeof clearError, error });
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Check URL parameters for tokens
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const pathname = window.location.pathname;
    
    if (token && pathname.includes('/reset-password')) {
      setResetToken(token);
      setCurrentView('reset-password');
    } else if (token && pathname.includes('/verify-email')) {
      setVerificationToken(token);
      setCurrentView('verify-email');
    }
  }, []);

  const clearLocalState = () => {
    setLocalError(null);
    setLocalSuccess(null);
    if (clearError) {
      clearError();
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLocalLoading(true);
    setLocalError(null);
    setLocalSuccess(null);
    
    try {
      await authApiService.forgotPassword(email);
      setUserEmail(email);
      setLocalSuccess('Password reset link sent to your email address');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send password reset email');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResetPassword = async (password: string, _confirmPassword: string) => {
    if (!resetToken) {
      setLocalError('Invalid reset token');
      return;
    }

    setLocalLoading(true);
    setLocalError(null);
    setLocalSuccess(null);
    
    try {
      await authApiService.resetPassword(resetToken, password);
      setLocalSuccess('Password reset successfully! You can now sign in with your new password.');
      setTimeout(() => {
        setCurrentView('login');
        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname);
      }, 2000);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to reset password');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    setLocalLoading(true);
    setLocalError(null);
    setLocalSuccess(null);
    
    try {
      await authApiService.verifyEmail(token);
      setLocalSuccess('Email verified successfully! You can now sign in to your account.');
      setTimeout(() => {
        setCurrentView('login');
        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname);
      }, 2000);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to verify email');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    setLocalLoading(true);
    setLocalError(null);
    setLocalSuccess(null);
    
    try {
      await authApiService.resendVerification(email);
      setLocalSuccess('Verification email sent successfully');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to resend verification email');
    } finally {
      setLocalLoading(false);
    }
  };

  const switchView = (view: AuthView) => {
    clearLocalState();
    setCurrentView(view);
  };

  return (
    <AuthLanguageProvider>
      {currentView === 'login' && (
        <LoginForm
          onLogin={onLogin}
          onSwitchToRegister={() => switchView('register')}
          onForgotPassword={() => switchView('forgot-password')}
          isLoading={isLoading}
          error={error}
          clearError={clearError}
        />
      )}
      
      {currentView === 'register' && (
        <RegisterForm
          onRegister={onRegister}
          onSwitchToLogin={() => switchView('login')}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {currentView === 'forgot-password' && (
        <ForgotPasswordForm
          onForgotPassword={handleForgotPassword}
          onBackToLogin={() => switchView('login')}
          isLoading={localLoading}
          error={localError}
          success={localSuccess}
        />
      )}
      
      {currentView === 'reset-password' && (
        <ResetPasswordForm
          onResetPassword={handleResetPassword}
          isLoading={localLoading}
          error={localError}
          success={localSuccess}
          token={resetToken || ''}
        />
      )}
      
      {currentView === 'verify-email' && (
        <EmailVerificationForm
          onVerifyEmail={handleVerifyEmail}
          onResendVerification={handleResendVerification}
          onBackToLogin={() => switchView('login')}
          isLoading={localLoading}
          error={localError}
          success={localSuccess}
          token={verificationToken || undefined}
          userEmail={userEmail}
        />
      )}
    </AuthLanguageProvider>
  );
};
