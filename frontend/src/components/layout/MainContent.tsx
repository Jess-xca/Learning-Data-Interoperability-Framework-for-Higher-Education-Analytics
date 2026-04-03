import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

export default function MainContent({ 
  children, 
  maxWidth = '6xl' 
}: MainContentProps) {
  const maxWidthClass = {
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    'full': 'max-w-full',
  }[maxWidth];

  return (
    <main className="ml-0 md:ml-72 pt-16 min-h-screen">
      <div className={`${maxWidthClass} mx-auto p-4 md:p-12 w-full`}>
        {children}
      </div>
    </main>
  );
}
