import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const success = searchParams.get('success');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setStatus('error');
        switch (errorParam) {
          case 'oauth_failed':
            setError('Google authentication failed. Please try again.');
            break;
          case 'oauth_not_configured':
            setError('Google login is not available. Please use email and password to sign in.');
            break;
          default:
            setError('Authentication failed. Please try again.');
        }
        // Redirect to login after showing error
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (success === 'true' && token) {
        try {
          // Store the token and update auth state
          localStorage.setItem('lingualeap-auth', JSON.stringify({
            state: {
              token,
              isAuthenticated: true,
              user: null // Will be populated by the auth system
            }
          }));

          setStatus('success');
          
          // Redirect to dashboard
          setTimeout(() => navigate('/dashboard'), 1500);
          
        } catch (error) {
          console.error('Error handling Google auth callback:', error);
          setStatus('error');
          setError('Failed to complete authentication. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        }
      } else {
        setStatus('error');
        setError('Invalid authentication response. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <div className="text-white text-2xl font-bold">LL</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-200 mb-2">LinguaLeap</h1>
          </div>

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-300">Completing your Google sign-in...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-300">Successfully signed in! Redirecting to your dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-400">{error}</p>
              <p className="text-gray-400 text-sm">Redirecting to login page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};