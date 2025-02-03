import React, { useState, useRef } from 'react';
import { Camera, StopCircle, Play, CheckCircle } from 'lucide-react';
import { Question, VideoSubmission } from '../types';

interface QuestionsPageProps {
  onComplete: (submissions: VideoSubmission[]) => void;
}

const QUESTIONS: Question[] = [
  { id: 1, text: "Tell me about yourself." },
  { id: 2, text: "Tell us about your educational background and work experience." },
  { id: 3, text: "What are your projects and what is your contribution?" },
  { id: 4, text: "What are your future goals and aspirations?" },
  { id: 5, text: "Why do you think you're a good fit for this position?" },
  { id: 6, text: "What are your strengths and weaknesses?" }
];

const MAX_RECORDING_TIME = 240; // 4 minutes in seconds

export function QuestionsPage({ onComplete }: QuestionsPageProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number>();
  const chunksRef = useRef<Blob[]>([]);

  const answeredQuestions = submissions.map(s => s.questionId);
  const remainingQuestions = QUESTIONS.filter(q => !answeredQuestions.includes(q.id));

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const submitRecording = () => {
    if (selectedQuestion && recordedBlob) {
      setSubmissions(prev => [...prev, {
        questionId: selectedQuestion.id,
        videoBlob: recordedBlob
      }]);
      setSelectedQuestion(null);
      setRecordedBlob(null);
      setRecordingTime(0);
      
      if (remainingQuestions.length <= 1) {
        onComplete(submissions);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Interview Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Questions List */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Select a Question to Answer
            </h3>
            <div className="space-y-3">
              {QUESTIONS.map((question) => {
                const isAnswered = answeredQuestions.includes(question.id);
                const isSelected = selectedQuestion?.id === question.id;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => !isAnswered && setSelectedQuestion(question)}
                    disabled={isAnswered || isRecording}
                    className={`w-full p-4 rounded-lg text-left relative ${
                      isAnswered
                        ? 'bg-green-50 text-green-800'
                        : isSelected
                        ? 'bg-blue-50 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="pr-8">{question.text}</span>
                    {isAnswered && (
                      <CheckCircle className="w-5 h-5 text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recording Interface */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recording Interface
            </h3>
            
            {selectedQuestion ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {formatTime(recordingTime)}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  {!isRecording && !recordedBlob && (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Camera className="w-5 h-5" />
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <StopCircle className="w-5 h-5" />
                      Stop Recording
                    </button>
                  )}

                  {recordedBlob && (
                    <button
                      onClick={submitRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Play className="w-5 h-5" />
                      Submit Answer
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Maximum recording time: 4 minutes
                </p>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Select a question to start recording
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}