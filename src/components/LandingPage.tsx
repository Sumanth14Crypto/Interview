import React from 'react';
import { Building2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80")',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="flex items-center mt-8">
        <img
          src="https://gmyipnwiqnnxtouvmxbf.supabase.co/storage/v1/object/public/logo//posspole%20logo%20.png"
          alt="Posspole Logo"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          className="object-contain bg-white/10 backdrop-blur-sm rounded p-1"
        />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          Welcome to Posspole 360 Hiring System
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl">
          Experience the future of hiring with our advanced virtual interview platform.
          Start your journey towards your dream career today.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-semibold
                     hover:bg-blue-700 transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}