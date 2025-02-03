import React, { useState } from 'react';
import { Candidate } from '../types';

interface CandidateFormProps {
  onSubmit: (candidate: Candidate) => void;
}

export function CandidateForm({ onSubmit }: CandidateFormProps) {
  const [formData, setFormData] = useState<Candidate>({
    fullName: '',
    collegeName: '',
    dateOfBirth: '',
    department: 'Computer Science',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Tell us more about you
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Name
            </label>
            <input
              type="text"
              required
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value as Candidate['department'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold
                       hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Instructions
          </button>
        </form>
      </div>
    </div>
  );
}