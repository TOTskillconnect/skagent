import React from 'react';
import { InterviewPriority, priorityOptions } from './GuidedInterviewTypes';

interface InterviewPriorityStepProps {
  selectedPriority: InterviewPriority | null;
  onSelectPriority: (priority: InterviewPriority) => void;
}

const InterviewPriorityStep: React.FC<InterviewPriorityStepProps> = ({ 
  selectedPriority, 
  onSelectPriority 
}) => {
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">What's most important to you in this hire?</h2>
      <p className="text-gray-600 mb-6">Choose the top trait or outcome you want to prioritize in this interview.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {priorityOptions.map((option) => (
          <div 
            key={option.value}
            className={`
              p-4 border rounded-lg cursor-pointer transition-all duration-200
              ${selectedPriority === option.value 
                ? 'border-primary shadow-md bg-primary bg-opacity-5' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => onSelectPriority(option.value)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 text-2xl mr-3">{option.icon}</div>
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-base font-medium text-gray-900">{option.label}</span>
                  {selectedPriority === option.value && (
                    <svg className="w-5 h-5 ml-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPriorityStep; 