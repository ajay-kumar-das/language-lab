import React, { useState } from "react";
import { Lock, Eye, EyeOff, Languages, Shield } from "lucide-react";
import { useAuthLanguage } from "./AuthLanguageProvider";
import { AuthLanguageSelector } from "./AuthLanguageSelector";

interface ResetPasswordFormProps {
  onResetPassword: (password: string, confirmPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onResetPassword,
  isLoading,
  error,
  success,
  token
}) => {
  // const { t } = useAuthLanguage(); // TODO: Add translations
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    await onResetPassword(password, confirmPassword);
  };

  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 6;

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
                Create New Password
              </h2>
              <p className="text-gray-300 text-lg">
                Choose a strong password to secure your account and continue your language learning journey.
              </p>
            </div>
            
            {/* Security highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-gray-300">At least 6 characters long</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-gray-300">Mix of letters, numbers & symbols</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-gray-300">Different from previous passwords</span>
              </div>
            </div>
          </div>

          {/* Reset Password Form */}
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
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Create New Password</h3>
                  <p className="text-gray-400 text-sm lg:text-base">
                    Enter your new password to secure your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                  {/* Fixed height container to prevent layout shift */}
                  <div className="h-12">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                        {success}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-gray-500 ${
                          password && !passwordValid ? 'border-red-500/50' : 'border-gray-600'
                        }`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password && !passwordValid && (
                      <p className="text-red-400 text-xs mt-1">Password must be at least 6 characters long</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 bg-gray-700/50 border rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 hover:border-gray-500 ${
                          confirmPassword && !passwordsMatch ? 'border-red-500/50' : 'border-gray-600'
                        }`}
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !passwordValid || !passwordsMatch || !password || !confirmPassword}
                    className="w-full py-3 px-6 gradient-primary hover:opacity-90 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                  </button>

                  <div className="text-center pt-4 lg:pt-6 lg:border-t lg:border-gray-700">
                    <p className="text-xs text-gray-500">
                      After resetting your password, you'll be able to sign in with your new credentials
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