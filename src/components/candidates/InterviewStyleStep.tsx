import React from 'react';
import { InterviewPriority, InterviewStyle, interviewStyleOptions } from './GuidedInterviewTypes';

interface InterviewStyleStepProps {
  selectedPriority: InterviewPriority;
  selectedStyle: InterviewStyle | null;
  onSelectStyle: (style: InterviewStyle) => void;
}

const InterviewStyleStep: React.FC<InterviewStyleStepProps> = ({ 
  selectedPriority, 
  selectedStyle, 
  onSelectStyle 
}) => {
  // Get the recommended style based on the selected priority
  const recommendedStyle = interviewStyleOptions.find(
    style => style.recommendedFor === selectedPriority
  );
  
  // Other style options
  const otherStyles = interviewStyleOptions.filter(
    style => style.recommendedFor !== selectedPriority && style.value !== InterviewStyle.CUSTOM
  );
  
  // Custom style option
  const customStyle = interviewStyleOptions.find(
    style => style.value === InterviewStyle.CUSTOM
  );

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Recommended Interview Style</h2>
      <p className="text-gray-600 mb-6">Based on your priorities, we recommend this interview approach.</p>
      
      {/* Recommended style card */}
      {recommendedStyle && (
        <div className="mb-8">
          <div className={`
            p-5 border-2 rounded-lg border-primary bg-primary bg-opacity-5 shadow-md mb-3
            ${selectedStyle === recommendedStyle.value ? 'ring-2 ring-primary' : ''}
          `}>
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 text-2xl mr-3">{recommendedStyle.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{recommendedStyle.label}</h3>
                <p className="text-gray-700">{recommendedStyle.description}</p>
              </div>
            </div>
            
            <ul className="ml-8 mb-4 space-y-2">
              {recommendedStyle.details.map((detail, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <svg className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>
            
            <button
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
              onClick={() => onSelectStyle(recommendedStyle.value)}
            >
              Use This Interview Format
            </button>
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-700 mb-3">Other Approaches</h3>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        {otherStyles.map((style) => (
          <div 
            key={style.value}
            className={`
              p-4 border rounded-lg cursor-pointer transition-all duration-200
              ${selectedStyle === style.value 
                ? 'border-primary shadow-md bg-primary bg-opacity-5' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => onSelectStyle(style.value)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 text-2xl mr-3">{style.icon}</div>
              <div>
                <h4 className="font-medium text-gray-900">{style.label}</h4>
                <p className="text-sm text-gray-600">{style.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Custom interview option */}
        {customStyle && (
          <div 
            className={`
              p-4 border-dashed border rounded-lg cursor-pointer transition-all duration-200
              ${selectedStyle === InterviewStyle.CUSTOM 
                ? 'border-primary shadow-md bg-primary bg-opacity-5' 
                : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
              }
            `}
            onClick={() => onSelectStyle(InterviewStyle.CUSTOM)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 text-2xl mr-3">{customStyle.icon}</div>
              <div>
                <h4 className="font-medium text-gray-900">Do It Your Own Way</h4>
                <p className="text-sm text-gray-600">Create a custom interview format tailored to your specific needs.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewStyleStep; 