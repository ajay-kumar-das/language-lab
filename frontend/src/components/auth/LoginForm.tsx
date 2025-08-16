import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Languages } from "lucide-react";
import { useAuthLanguage } from "./AuthLanguageProvider";
import { AuthLanguageSelector } from "./AuthLanguageSelector";

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
  isLoading: boolean;
  error: string | null;
  clearError?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSwitchToRegister,
  onForgotPassword,
  isLoading,
  error,
  clearError
}) => {
  const { t } = useAuthLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AuthLanguageSelector />
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-full max-w-md lg:max-w-6xl lg:grid lg:grid-cols-2 lg:gap-8">
          
          {/* Left Side - Branding - Hidden on mobile */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Languages className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">LinguaLeap</h1>
                <p className="text-cyan-400 text-lg">Language Learning Platform</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {t('login_title') || 'Welcome Back!'}
              </h2>
              <p className="text-gray-300 text-lg">
                Continue your language learning journey with AI-powered lessons and practice
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <span className="text-gray-300">Interactive lessons with AI feedback</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <span className="text-gray-300">Practice conversations with native speakers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <span className="text-gray-300">Track your progress and achievements</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-md mx-auto">
              {/* Mobile header */}
              <div className="lg:hidden text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                    <Languages className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">LinguaLeap</h1>
                    <p className="text-cyan-400 text-sm">Language Learning Platform</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-2xl w-full">
                <div className="text-center mb-6 lg:mb-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Sign In</h3>
                  <p className="text-gray-400 text-sm lg:text-base">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                  {/* Fixed height container to prevent layout shift */}
                  <div className="h-12">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('email_label') || 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-gray-500"
                        placeholder={t('email_placeholder') || 'Enter your email'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('password_label') || 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-gray-500"
                        placeholder={t('password_placeholder') || 'Enter your password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {onForgotPassword && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 gradient-primary hover:opacity-90 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (t('signing_in') || 'Signing In...') : (t('sign_in_button') || 'Sign In')}
                  </button>

                  <div className="relative my-4 lg:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-800 text-gray-400">{t('or_divider') || 'or'}</span>
                    </div>
                  </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  // For OAuth, we need to check for configuration differently
                  // since the endpoint will redirect on success (302) and error on failure (503)
                  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                  
                  const response = await fetch(`${apiUrl}/v1/auth/google`, {
                    method: 'GET',
                    redirect: 'manual' // Don't follow redirects, let us handle them
                  });
                  
                  // If we get a redirect (302), OAuth is configured and working
                  if (response.status === 302) {
                    window.location.href = `${apiUrl}/v1/auth/google`;
                    return;
                  }
                  
                  // If we get an error response, check if it's a configuration issue
                  if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.code === 'OAUTH_NOT_CONFIGURED') {
                      alert(t('google_oauth_not_available') || 'Google login is not currently available. Please use email and password to sign in.');
                      return;
                    }
                  }
                  
                  // Default case - redirect to Google OAuth
                  window.location.href = `${apiUrl}/v1/auth/google`;
                } catch (error) {
                  console.error('Error with Google OAuth:', error);
                  // On error, just try to redirect anyway
                  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                  window.location.href = `${apiUrl}/v1/auth/google`;
                }
              }}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t('continue_with_google') || 'Continue with Google'}
                  </button>

                  <div className="text-center pt-3">
                    <p className="text-gray-400">
                      {t('no_account') || "Don't have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Sign up button clicked");
                          onSwitchToRegister();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      >
                        {t('sign_up_link') || "Sign up"}
                      </button>
                    </p>
                  </div>

                  <div className="text-center pt-4 lg:pt-6 lg:border-t lg:border-gray-700">
                    <p className="text-xs text-gray-500 hidden lg:block">
                      {t('terms_text') || "By signing in, you agree to our Terms of Service and Privacy Policy"}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
