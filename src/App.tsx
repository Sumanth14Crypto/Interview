import React, { useState, useEffect } from 'react';
import { PageLoader } from './components/PageLoader';
import { LandingPage } from './components/LandingPage';
import { CandidateForm } from './components/CandidateForm';
import { InstructionsPage } from './components/InstructionsPage';
import { QuestionsPage } from './components/QuestionsPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Layout } from './components/Layout';
import { Candidate, VideoSubmission, StoredCandidate } from './types';
import { supabase } from './lib/supabase';

type AppState = 'loading' | 'landing' | 'form' | 'instructions' | 'questions' | 'complete' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('loading');
  const [candidate, setCandidate] = useState<StoredCandidate | null>(null);
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);

  useEffect(() => {
    // Check if we're on the admin route
    if (window.location.pathname === '/admin') {
      setCurrentState('admin-login');
    }
  }, []);

  const handleLoaderComplete = () => {
    if (currentState === 'loading') {
      setCurrentState('landing');
    }
  };

  const handleStartInterview = () => {
    setCurrentState('form');
  };

  const handleAdminLogin = () => {
    setCurrentState('admin-dashboard');
  };

  const handleCandidateSubmit = async (candidateData: Candidate) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
          full_name: candidateData.fullName,
          college_name: candidateData.collegeName,
          date_of_birth: candidateData.dateOfBirth,
          department: candidateData.department
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating candidate:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No candidate data returned');
      }

      setCandidate(data);
      sessionStorage.setItem('candidate', JSON.stringify(data));
      setCurrentState('instructions');
    } catch (error) {
      console.error('Error saving candidate:', error);
      alert('Failed to save candidate information. Please try again.');
    }
  };

  const handleInstructionsContinue = () => {
    setCurrentState('questions');
  };

  const handleQuestionsComplete = async (videoSubmissions: VideoSubmission[]) => {
    if (!candidate) {
      console.error('No candidate data found');
      return;
    }

    try {
      const processedSubmissions = [];

      for (const submission of videoSubmissions) {
        // Create a unique filename for the video
        const timestamp = Date.now();
        const fileName = `${candidate.id}/question_${submission.questionId}_${timestamp}.webm`;

        // Upload the video to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, submission.videoBlob, {
            cacheControl: '3600',
            contentType: 'video/webm',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading video:', uploadError);
          throw uploadError;
        }

        // Get the public URL for the uploaded video
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);

        // Save video reference in the database
        const { error: dbError } = await supabase
          .from('videos')
          .insert([{
            candidate_id: candidate.id,
            question_id: submission.questionId,
            video_url: publicUrl
          }]);

        if (dbError) {
          console.error('Error saving video reference:', dbError);
          throw dbError;
        }

        processedSubmissions.push({ questionId: submission.questionId, videoUrl: publicUrl });
      }

      setSubmissions(videoSubmissions);
      setCurrentState('complete');
    } catch (error) {
      console.error('Error processing videos:', error);
      alert('Failed to save some video responses. Please try again.');
    }
  };

  // Render admin pages without the standard layout
  if (currentState === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (currentState === 'admin-dashboard') {
    return <AdminDashboard />;
  }

  return (
    <Layout>
      {currentState === 'loading' && (
        <PageLoader onComplete={handleLoaderComplete} />
      )}
      
      {currentState === 'landing' && (
        <LandingPage onStart={handleStartInterview} />
      )}
      
      {currentState === 'form' && (
        <CandidateForm onSubmit={handleCandidateSubmit} />
      )}

      {currentState === 'instructions' && (
        <InstructionsPage onContinue={handleInstructionsContinue} />
      )}

      {currentState === 'questions' && (
        <QuestionsPage onComplete={handleQuestionsComplete} />
      )}

      {currentState === 'complete' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Interview Complete!
            </h2>
            <p className="text-gray-600">
              Thank you for completing your interview. We will review your responses and get back to you soon.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;