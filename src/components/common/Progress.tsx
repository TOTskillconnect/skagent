import React from 'react';

export interface ProgressProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  progressColor?: string;
  steps?: string[];
  currentStep?: number;
  onStepClick?: (step: number) => void;
  sticky?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max, 
  size = 'md',
  progressColor = '#FFB130',
  steps = [],
  currentStep = 0,
  onStepClick,
  sticky = false
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className={`w-full ${sticky ? 'sticky top-0 z-10 bg-white pt-4 pb-4 border-b border-[#E5E5E5]' : ''}`}>
      {/* Progress bar */}
      <div className="relative w-full mb-3">
        <div className={`w-full bg-[#E5E5E5] rounded-full overflow-hidden ${heightClass}`}>
          <div 
            className="transition-all duration-500 ease-in-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: progressColor,
              height: '100%'
            }}
          />
        </div>
        
        {/* Step indicators */}
        {steps.length > 0 && (
          <div className="absolute top-0 left-0 w-full flex items-center justify-between px-0">
            {steps.map((step, index) => {
              const isActive = index < currentStep;
              const isCurrent = index === currentStep - 1;
              
              // Calculate position
              const position = index === 0 ? '0%' : 
                               index === steps.length - 1 ? '100%' : 
                               `${(index / (steps.length - 1)) * 100}%`;
              
              return (
                <div 
                  key={index}
                  className="absolute -translate-x-1/2"
                  style={{ left: position }}
                >
                  <div 
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-[#FFB130] ring-4 ring-[#FFB130]/20' 
                        : isActive 
                          ? 'bg-[#FFB130]' 
                          : 'bg-[#E5E5E5]'
                    }`}
                    onClick={() => onStepClick && index < currentStep && onStepClick(index + 1)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Step labels */}
      {steps.length > 0 && (
        <div className="w-full flex items-center justify-between text-xs text-[#1E1E1E] mt-1 px-0">
          {steps.map((step, index) => {
            const isActive = index < currentStep;
            const isCurrent = index === currentStep - 1;
            
            // Calculate position for label
            const position = index === 0 ? '0%' : 
                            index === steps.length - 1 ? '100%' : 
                            `${(index / (steps.length - 1)) * 100}%`;
            
            // Alignment for first and last labels
            const alignment = index === 0 ? 'text-left' : 
                              index === steps.length - 1 ? 'text-right' : 
                              'text-center';
            
            // X offset adjustments
            const xAdjust = index === 0 ? '0' : 
                            index === steps.length - 1 ? '-100%' : 
                            '-50%';
            
            return (
              <div 
                key={index}
                className={`absolute ${alignment} font-medium transition-all duration-300 ${
                  isCurrent ? 'text-[#FFB130]' : isActive ? 'text-[#1E1E1E]' : 'text-[#858585]'
                }`}
                style={{ 
                  left: position,
                  transform: `translateX(${xAdjust})`
                }}
              >
                {step}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Mobile progress text */}
      <div className="flex justify-between items-center mt-6 text-sm md:hidden">
        <span className="text-[#1E1E1E]">Step {value} of {max}</span>
        <span className="font-medium text-[#FFB130]">{percentage}% Complete</span>
      </div>
    </div>
  );
};

export default Progress; 