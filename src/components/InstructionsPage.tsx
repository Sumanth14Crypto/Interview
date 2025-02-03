import React from 'react';
import { ArrowRight } from 'lucide-react';

interface InstructionsPageProps {
  onContinue: () => void;
}

export function InstructionsPage({ onContinue }: InstructionsPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Interview Instructions
        </h2>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">📅 Interview Details</h3>
            <p className="text-gray-600">Your interview will begin immediately after these instructions.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">💻 Technical Setup</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ensure you have a stable internet connection</li>
              <li>Test your camera and microphone</li>
              <li>Use headphones for better audio quality</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">🏡 Environment & Appearance</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Find a quiet place with good lighting</li>
              <li>Maintain professional attire</li>
              <li>Ensure your background is clean and professional</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">⏳ Interview Structure</h3>
            <p className="text-gray-600">Introduction → Skill Evaluation → HR Discussion</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">📩 Need Assistance?</h3>
            <p className="text-gray-600">Contact HR Support: support@posspole360.com</p>
          </section>

          <button
            onClick={onContinue}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold
                     hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Continue to Questions
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}