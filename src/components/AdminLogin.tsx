import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@posspole.com',
        password: 'admin123'
      });

      if (error) throw error;
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <img
              src="https://gmyipnwiqnnxtouvmxbf.supabase.co/storage/v1/object/public/logo//posspole%20logo%20.png"
              alt="Posspole Logo"
              className="mx-auto h-16 w-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Portal
            </h2>
            <p className="mt-2 text-gray-600">Sign in to access the dashboard</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold
                         bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transform transition-all duration-150 hover:scale-[1.02] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}