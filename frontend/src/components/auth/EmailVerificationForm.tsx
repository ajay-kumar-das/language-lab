import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, XCircle, RefreshCw, Languages } from "lucide-react";
import { useAuthLanguage } from "./AuthLanguageProvider";
import { AuthLanguageSelector } from "./AuthLanguageSelector";

interface EmailVerificationFormProps {
  onVerifyEmail: (token: string) => Promise<void>;
  onResendVerification: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  token?: string;
  userEmail?: string;
}

export const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  onVerifyEmail,
  onResendVerification,
  onBackToLogin,
  isLoading,
  error,
  success,
  token,
  userEmail
}) => {
  // const { t } = useAuthLanguage(); // TODO: Add translations
  const [email, setEmail] = useState(userEmail || "");
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    if (token) {
      // Automatically verify if token is provided in URL
      onVerifyEmail(token);
    }
  }, [token, onVerifyEmail]);

  useEffect(() => {
    if (success) {
      setVerificationStatus('success');
    } else if (error) {
      setVerificationStatus('error');
    }
  }, [success, error]);

  const handleResendVerification = async () => {
    if (email) {
      await onResendVerification(email);
    }
  };

  const renderContent = () => {
    if (token) {
      // Token verification mode
      return (
        <>
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex justify-center mb-4">
              {verificationStatus === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-400" />
              )}
              {verificationStatus === 'error' && (
                <XCircle className="w-16 h-16 text-red-400" />
              )}
              {verificationStatus === 'pending' && (
                <div className="animate-spin">
                  <RefreshCw className="w-16 h-16 text-cyan-400" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
              {verificationStatus === 'success' && 'Email Verified!'}
              {verificationStatus === 'error' && 'Verification Failed'}
              {verificationStatus === 'pending' && 'Verifying Email...'}
            </h3>
            
            <p className="text-gray-400 text-sm lg:text-base">
              {verificationStatus === 'success' && 'Your email has been successfully verified. You can now sign in to your account.'}
              {verificationStatus === 'error' && 'The verification link is invalid or has expired. Please request a new verification email.'}
              {verificationStatus === 'pending' && 'Please wait while we verify your email address...'}
            </p>
          </div>

          {verificationStatus === 'success' && (
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-3 px-6 gradient-primary hover:opacity-90 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
            >
              Continue to Sign In
            </button>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
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
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isLoading || !email}
                className="w-full py-3 px-6 gradient-primary hover:opacity-90 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Sending...' : 'Send New Verification Email'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </>
      );
    } else {
      // Manual verification mode
      return (
        <>
          <div className="text-center mb-6 lg:mb-8">
            <div className="flex justify-center mb-4">
              <Mail className="w-16 h-16 text-cyan-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Check Your Email</h3>
            <p className="text-gray-400 text-sm lg:text-base">
              We've sent a verification link to your email address. Click the link to verify your account.
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
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
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isLoading || !email}
              className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Back to Sign In
              </button>
            </div>

            <div className="text-center pt-4 lg:pt-6 lg:border-t lg:border-gray-700">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or click resend
              </p>
            </div>
          </div>
        </>
      );
    }
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
                Verify Your Email
              </h2>
              <p className="text-gray-300 text-lg">
                Email verification helps keep your account secure and ensures you receive important updates about your learning progress.
              </p>
            </div>
            
            {/* Security highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <span className="text-gray-300">Secure account verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <span className="text-gray-300">Receive important notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                </div>
                <span className="text-gray-300">Quick and easy process</span>
              </div>
            </div>
          </div>

          {/* Email Verification Form */}
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
                {/* Fixed height container to prevent layout shift */}
                <div className="h-12 mb-4">
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

                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};