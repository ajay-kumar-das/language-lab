import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Globe, Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, APP_INTERFACE_LANGUAGES, getLanguageDisplayName } from "../../constants/languages";
import { useAuthLanguage } from "./AuthLanguageProvider";
import { AuthLanguageSelector } from "./AuthLanguageSelector";

interface RegisterFormProps {
  onRegister: (data: { 
    email: string; 
    password: string; 
    confirmPassword: string; 
    firstName: string; 
    lastName: string;
    nativeLanguage?: string;
    appLanguage?: string;
  }) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  isLoading,
  error
}) => {
  const { t, currentLanguage } = useAuthLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nativeLanguage: "English",
    appLanguage: currentLanguage,
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(formData);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto">
      {/* Header with Logo and Language Selector */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Languages className="h-6 w-6 text-white" />
          </div>
        </div>
        <AuthLanguageSelector />
      </div>

      {/* Page Title */}
      <div className="text-center mb-4 px-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('register_title') || 'Create Your Account'}</h2>
        <p className="text-gray-300">Create your account to start learning languages</p>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center flex-1 px-6 py-6">
        <div className="w-full max-w-5xl">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fixed height container to prevent layout shift */}
            <div className="h-12">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Single Row Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information Card */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
                <h3 className="text-base font-medium text-gray-200 flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-cyan-400" />
                  Personal Info
                </h3>
                <div className="space-y-4">

                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('first_name_label') || 'First Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                        placeholder={t('first_name_placeholder') || 'Enter your first name'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('last_name_label') || 'Last Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                        placeholder={t('last_name_placeholder') || 'Enter your last name'}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('email_label') || 'Email'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                        placeholder={t('email_placeholder') || 'Enter your email'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Preferences Card */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
                <h3 className="text-base font-medium text-gray-200 flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Languages
                </h3>
                <div className="space-y-4">

                  <div>
                    <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('native_language_label') || 'Native Language'}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        id="nativeLanguage"
                        name="nativeLanguage"
                        required
                        value={formData.nativeLanguage}
                        onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors appearance-none"
                      >
                        {SUPPORTED_LANGUAGES.map((language) => (
                          <option key={language.code} value={language.name} className="bg-gray-800">
                            {getLanguageDisplayName(language)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="appLanguage" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('app_language_label') || 'App Language'}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        id="appLanguage"
                        name="appLanguage"
                        required
                        value={formData.appLanguage}
                        onChange={(e) => setFormData({ ...formData, appLanguage: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors appearance-none"
                      >
                        {APP_INTERFACE_LANGUAGES.map((language) => (
                          <option key={language.code} value={language.name} className="bg-gray-800">
                            {getLanguageDisplayName(language)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Security Card */}
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
                <h3 className="text-base font-medium text-gray-200 flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-purple-400" />
                  Security
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('password_label') || 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                        placeholder={t('password_placeholder') || 'Enter your password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                      {t('confirm_password_label') || 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-cyan-600/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                        placeholder={t('confirm_password_placeholder') || 'Confirm your password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 gradient-primary hover:opacity-90 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('signing_up') || 'Creating Account...'}
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    {t('sign_up_button') || 'Create Account'}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center pt-4 mt-4">
              <p className="text-gray-400 text-sm">
                {t('have_account') || "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  {t('sign_in_link') || "Sign in"}
                </button>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};