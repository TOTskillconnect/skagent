import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  color?: 'primary' | 'accent1' | 'accent2';
  size?: 'small' | 'medium' | 'large';
}

const colorClasses = {
  primary: 'bg-primary bg-opacity-20 text-primary',
  accent1: 'bg-accent-1 bg-opacity-20 text-accent-1',
  accent2: 'bg-accent-2 bg-opacity-20 text-accent-2'
};

const sizeClasses = {
  small: 'text-2xl',
  medium: 'text-3xl',
  large: 'text-4xl'
};

export default function ScoreCard({
  title,
  score,
  maxScore = 100,
  color = 'primary',
  size = 'medium'
}: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-text-secondary mb-2">{title}</div>
      <div className="flex items-center justify-between">
        <div className={`font-bold ${sizeClass} ${colorClass}`}>
          {score}/{maxScore}
        </div>
        <div className="w-16 h-16 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-200"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="28"
              cx="32"
              cy="32"
            />
            <circle
              className={`${colorClass} transition-all duration-500`}
              strokeWidth="4"
              strokeDasharray={175.93}
              strokeDashoffset={175.93 - (175.93 * percentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="28"
              cx="32"
              cy="32"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-medium ${colorClass}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 