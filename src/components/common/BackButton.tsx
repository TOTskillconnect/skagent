import React from 'react';
import { useRouter } from 'next/router';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className = '' }: BackButtonProps) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center text-text-secondary hover:text-primary transition-colors ${className}`}
      aria-label="Go back"
    >
      <svg 
        className="w-5 h-5 mr-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      <span>Back</span>
    </button>
  );
};

export default BackButton; 