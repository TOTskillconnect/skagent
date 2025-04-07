import React from 'react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div 
            key={i} 
            className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium 
              ${i < currentStep 
                ? 'bg-primary text-white' 
                : i === currentStep 
                  ? 'bg-primary-light text-white' 
                  : 'bg-gray-200 text-gray-500'}`}
          >
            {i < currentStep ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>
      
      <div className="relative">
        <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
        <div 
          className="absolute top-0 h-1 bg-primary rounded transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Priority</div>
        <div className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Style</div>
        <div className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Details</div>
        <div className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Confirm</div>
      </div>
    </div>
  );
};

export default ProgressSteps; 