import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  onComplete: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const updateProgress = () => {
      if (!mounted) return;
      
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      mounted = false;
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400 mt-4">Loading Posspole 360...</p>
    </div>
  );
}