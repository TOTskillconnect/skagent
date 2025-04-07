import React, { useState, useCallback, useEffect } from 'react';
import { Candidate } from '@/types/candidates';
import { scheduleInterview } from '@/services/interviewService';
import { InterviewPriority, InterviewStyle } from './GuidedInterviewTypes';
import ProgressSteps from './ProgressSteps';
import InterviewPriorityStep from './InterviewPriorityStep';
import InterviewStyleStep from './InterviewStyleStep';
import InterviewDetailsStep from './InterviewDetailsStep';
import InterviewConfirmStep from './InterviewConfirmStep';

// Interface for date slots
interface DateSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// Props interface
interface GuidedInterviewModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (success: boolean) => void;
}

// Sample team members data
const SAMPLE_TEAM_MEMBERS = [
  { id: '1', name: 'Alex Johnson', role: 'Engineering Manager' },
  { id: '2', name: 'Sam Smith', role: 'Product Manager' },
  { id: '3', name: 'Taylor Kim', role: 'Design Lead' },
  { id: '4', name: 'Jordan Lee', role: 'Technical Lead' }
];

const GuidedInterviewModal: React.FC<GuidedInterviewModalProps> = ({ 
  candidate, 
  isOpen, 
  onClose, 
  onSchedule 
}) => {
  // Current step in the wizard
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Interview Priority
  const [selectedPriority, setSelectedPriority] = useState<InterviewPriority | null>(null);
  
  // Step 2: Interview Style
  const [selectedStyle, setSelectedStyle] = useState<InterviewStyle | null>(null);
  
  // Step 3: Interview Details
  const [interviewMode, setInterviewMode] = useState<'one_on_one' | 'panel'>('one_on_one');
  const [availableDates, setAvailableDates] = useState<DateSlot[]>([{ 
    date: '', 
    startTime: '09:00', 
    endTime: '10:00' 
  }]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  // Form validation and submission
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedPriority(null);
      setSelectedStyle(null);
      setInterviewMode('one_on_one');
      setAvailableDates([{ date: '', startTime: '09:00', endTime: '10:00' }]);
      setSelectedTeamMembers([]);
      setNotes('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);
  
  // Handle priority selection
  const handleSelectPriority = useCallback((priority: InterviewPriority) => {
    setSelectedPriority(priority);
  }, []);
  
  // Handle style selection
  const handleSelectStyle = useCallback((style: InterviewStyle) => {
    setSelectedStyle(style);
  }, []);
  
  // Add a new date slot
  const addDateSlot = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setAvailableDates(prev => [...prev, { date: '', startTime: '09:00', endTime: '10:00' }]);
  }, []);
  
  // Remove a date slot
  const removeDateSlot = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (availableDates.length > 1) {
      const newDates = [...availableDates];
      newDates.splice(index, 1);
      setAvailableDates(newDates);
    }
  }, [availableDates]);
  
  // Update date slot details
  const updateDateSlot = useCallback((index: number, field: keyof DateSlot, value: string) => {
    const newDates = [...availableDates];
    newDates[index] = { ...newDates[index], [field]: value };
    setAvailableDates(newDates);
    
    // Clear any error for this field
    if (errors[`dates[${index}].${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`dates[${index}].${field}`];
      setErrors(newErrors);
    }
  }, [availableDates, errors]);
  
  // Toggle team member selection
  const toggleTeamMember = useCallback((memberId: string) => {
    setSelectedTeamMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  }, []);
  
  // Form validation
  const validateCurrentStep = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!selectedPriority) {
        newErrors.priority = "Please select what's most important to you";
      }
    } 
    else if (currentStep === 2) {
      if (!selectedStyle) {
        newErrors.style = "Please select an interview style";
      }
    }
    else if (currentStep === 3) {
      // Validate dates
      availableDates.forEach((dateSlot, index) => {
        if (!dateSlot.date) {
          newErrors[`dates[${index}].date`] = "Date is required";
        }
        
        if (!dateSlot.startTime) {
          newErrors[`dates[${index}].startTime`] = "Start time is required";
        }
        
        if (!dateSlot.endTime) {
          newErrors[`dates[${index}].endTime`] = "End time is required";
        }
        
        if (dateSlot.startTime && dateSlot.endTime && dateSlot.startTime >= dateSlot.endTime) {
          newErrors[`dates[${index}].endTime`] = "End time must be after start time";
        }
      });
      
      // Validate team members for panel interviews
      if (interviewMode === 'panel' && selectedTeamMembers.length === 0) {
        newErrors.teamMembers = "Please select at least one team member for a panel interview";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, selectedPriority, selectedStyle, availableDates, interviewMode, selectedTeamMembers]);
  
  // Handle next step
  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, validateCurrentStep]);
  
  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!selectedStyle || !selectedPriority) {
        throw new Error("Missing required data");
      }
      
      const interviewData = {
        candidateId: candidate.id,
        mode: interviewMode === 'panel' ? 'panel' : 'one_on_one',
        interviewStyle: selectedStyle,
        interviewPriority: selectedPriority,
        dates: availableDates,
        timezone: 'America/New_York', // Default timezone
        notes,
        teamMembers: selectedTeamMembers,
        suggestFollowUps: true, // Default to true
        focusAreas: []
      };
      
      await scheduleInterview(interviewData);
      onSchedule(true);
      onClose();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      onSchedule(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [candidate, selectedStyle, selectedPriority, interviewMode, availableDates, notes, selectedTeamMembers, validateCurrentStep, onSchedule, onClose]);
  
  // Handle modal close with confirmation if form has data
  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const hasData = 
      selectedPriority !== null || 
      selectedStyle !== null || 
      availableDates.some(d => d.date) || 
      notes || 
      selectedTeamMembers.length > 0;
    
    if (!hasData || window.confirm("Are you sure you want to close without saving?")) {
      onClose();
    }
  }, [selectedPriority, selectedStyle, availableDates, notes, selectedTeamMembers, onClose]);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Schedule Interview – Tailored to What Matters Most</h1>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
            aria-label="close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <ProgressSteps currentStep={currentStep} totalSteps={4} />
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Interview Priority */}
            {currentStep === 1 && (
              <InterviewPriorityStep
                selectedPriority={selectedPriority}
                onSelectPriority={handleSelectPriority}
              />
            )}
            
            {/* Step 2: Interview Style */}
            {currentStep === 2 && selectedPriority && (
              <InterviewStyleStep
                selectedPriority={selectedPriority}
                selectedStyle={selectedStyle}
                onSelectStyle={handleSelectStyle}
              />
            )}
            
            {/* Step 3: Interview Details */}
            {currentStep === 3 && selectedStyle && (
              <InterviewDetailsStep
                selectedStyle={selectedStyle}
                interviewMode={interviewMode}
                setInterviewMode={setInterviewMode}
                availableDates={availableDates}
                updateDateSlot={updateDateSlot}
                addDateSlot={addDateSlot}
                removeDateSlot={removeDateSlot}
                teamMembers={SAMPLE_TEAM_MEMBERS}
                selectedTeamMembers={selectedTeamMembers}
                toggleTeamMember={toggleTeamMember}
                notes={notes}
                setNotes={setNotes}
                errors={errors}
              />
            )}
            
            {/* Step 4: Confirm */}
            {currentStep === 4 && selectedStyle && selectedPriority && (
              <InterviewConfirmStep
                candidate={candidate}
                selectedStyle={selectedStyle}
                interviewMode={interviewMode}
                availableDates={availableDates}
                selectedTeamMembers={selectedTeamMembers}
                teamMembers={SAMPLE_TEAM_MEMBERS}
                notes={notes}
                isSubmitting={isSubmitting}
              />
            )}
            
            {/* Error message */}
            {Object.keys(errors).length > 0 && errors[Object.keys(errors)[0]] && (
              <div className="mt-4 text-red-600 text-sm">
                {errors[Object.keys(errors)[0]]}
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 text-gray-500 bg-white border border-gray-200 rounded-md"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-gray-200 hover:text-black"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-gray-200 hover:text-black"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Invitation'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuidedInterviewModal; 