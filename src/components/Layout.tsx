import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&q=80")',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="min-h-screen">
        {children}
      </div>
      <footer className="fixed bottom-0 left-0 right-0 text-center p-4 text-white/80 bg-black/20 backdrop-blur-sm">
        <p>Copyright © Posspole 2025</p>
      </footer>
    </div>
  );
}