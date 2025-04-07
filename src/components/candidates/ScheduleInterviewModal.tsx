import { useState, useEffect, useCallback } from 'react';
import { Candidate } from '@/types/candidates';
import { scheduleInterview, InterviewData } from '@/services/interviewService';

// Interface for available date slots
interface DateSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// Props interface
interface ScheduleInterviewModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (success: boolean) => void;
}

// Interview mode options
export const InterviewMode = {
  VIDEO: 'video',
  PHONE: 'phone',
  IN_PERSON: 'in-person'
};

// Timezone options
const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];

// Skill areas that can be suggested for focus
const skillFocusAreas = [
  'Technical Skills', 'Communication', 'Problem Solving', 
  'Leadership', 'Teamwork', 'Project Management', 
  'Domain Knowledge', 'Cultural Fit', 'Work Ethic'
];

const ScheduleInterviewModal = ({ 
  candidate, 
  isOpen, 
  onClose, 
  onSchedule 
}: ScheduleInterviewModalProps) => {
  // Form state
  const [mode, setMode] = useState<string>(InterviewMode.VIDEO);
  const [dates, setDates] = useState<DateSlot[]>([{ 
    date: '', 
    startTime: '09:00', 
    endTime: '10:00' 
  }]);
  const [timezone, setTimezone] = useState('America/New_York');
  const [notes, setNotes] = useState('');
  const [suggestFollowUps, setSuggestFollowUps] = useState(true);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens with a new candidate
  useEffect(() => {
    if (isOpen) {
      // Clear any previous form data and errors
      setMode(InterviewMode.VIDEO);
      setDates([{ date: '', startTime: '09:00', endTime: '10:00' }]);
      setTimezone('America/New_York');
      setNotes('');
      setSuggestFollowUps(true);
      setFocusAreas([]);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, candidate.id]);

  // Add a new date slot
  const addDateSlot = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDates([...dates, { date: '', startTime: '09:00', endTime: '10:00' }]);
  }, [dates]);

  // Remove a date slot
  const removeDateSlot = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dates.length > 1) {
      const newDates = [...dates];
      newDates.splice(index, 1);
      setDates(newDates);
    }
  }, [dates]);

  // Update date slot details
  const updateDateSlot = useCallback((index: number, field: keyof DateSlot, value: string) => {
    const newDates = [...dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setDates(newDates);
    
    // Clear any error for this field
    if (errors[`dates[${index}].${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`dates[${index}].${field}`];
      setErrors(newErrors);
    }
  }, [dates, errors]);

  // Toggle focus area selection
  const toggleFocusArea = useCallback((area: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusAreas(prev => 
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate mode
    if (!mode) {
      newErrors.mode = "Interview mode is required";
    }
    
    // Validate dates
    dates.forEach((dateSlot, index) => {
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
    
    // Validate timezone
    if (!timezone) {
      newErrors.timezone = "Timezone is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [mode, dates, timezone]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const interviewData: InterviewData = {
        candidateId: candidate.id,
        mode,
        dates,
        timezone,
        notes,
        suggestFollowUps,
        focusAreas
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
  }, [candidate, mode, dates, timezone, notes, suggestFollowUps, focusAreas, validateForm, onSchedule, onClose]);

  // Handle modal close with confirmation if form has data
  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const hasData = dates.some(d => d.date) || notes || focusAreas.length > 0;
    
    if (!hasData || window.confirm("Are you sure you want to close without saving?")) {
      onClose();
    }
  }, [dates, notes, focusAreas, onClose]);

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
          <h2 className="text-xl font-semibold text-gray-800">Schedule Interview with {candidate.name}</h2>
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
        
        <form onSubmit={handleSubmit}>
          <div className="p-6" onClick={(e) => e.stopPropagation()}>
            {/* Interview Mode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Mode
              </label>
              <div className={`relative ${errors.mode ? 'border-red-500' : 'border-gray-300'}`}>
                <select
                  className="block w-full p-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  value={mode}
                  onChange={(e) => {
                    e.stopPropagation();
                    setMode(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value={InterviewMode.VIDEO}>Video Call</option>
                  <option value={InterviewMode.PHONE}>Phone Call</option>
                  <option value={InterviewMode.IN_PERSON}>In-Person</option>
                </select>
              </div>
              {errors.mode && (
                <p className="mt-1 text-sm text-red-600">{errors.mode}</p>
              )}
            </div>
            
            {/* Proposed Dates */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Proposed Date & Time Options
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Offer multiple options to increase scheduling flexibility
              </p>
              
              {dates.map((dateSlot, index) => (
                <div 
                  key={index} 
                  className="flex flex-wrap md:flex-nowrap gap-4 mb-4 items-start"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className={`block w-full p-2.5 text-gray-700 bg-white border ${errors[`dates[${index}].date`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                      value={dateSlot.date}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDateSlot(index, 'date', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {errors[`dates[${index}].date`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`dates[${index}].date`]}</p>
                    )}
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className={`block w-full p-2.5 text-gray-700 bg-white border ${errors[`dates[${index}].startTime`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                      value={dateSlot.startTime}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDateSlot(index, 'startTime', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {errors[`dates[${index}].startTime`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`dates[${index}].startTime`]}</p>
                    )}
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      className={`block w-full p-2.5 text-gray-700 bg-white border ${errors[`dates[${index}].endTime`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                      value={dateSlot.endTime}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDateSlot(index, 'endTime', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {errors[`dates[${index}].endTime`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`dates[${index}].endTime`]}</p>
                    )}
                  </div>
                  
                  <button 
                    type="button"
                    className="mt-6 p-1 text-red-600 hover:text-red-800 rounded-full"
                    onClick={(e) => removeDateSlot(index, e)}
                    disabled={dates.length <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button 
                type="button"
                className="flex items-center text-sm text-primary hover:text-primary-dark mt-1 mb-4"
                onClick={addDateSlot}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Date Option
              </button>
            </div>
            
            {/* Timezone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                className={`block w-full p-2.5 text-gray-700 bg-white border ${errors.timezone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                value={timezone}
                onChange={(e) => {
                  e.stopPropagation();
                  setTimezone(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {timezoneOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.timezone && (
                <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>
              )}
            </div>
            
            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Notes
              </label>
              <textarea
                className="block w-full p-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                rows={3}
                placeholder="Add any specific details, instructions, or topics to cover during the interview"
                value={notes}
                onChange={(e) => {
                  e.stopPropagation();
                  setNotes(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              ></textarea>
            </div>
            
            {/* Focus Areas */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Focus Areas
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Select specific skills or attributes to focus on during the interview
              </p>
              
              <div className="flex flex-wrap gap-2">
                {skillFocusAreas.map(area => (
                  <button
                    key={area}
                    type="button"
                    className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                      focusAreas.includes(area) 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={(e) => toggleFocusArea(area, e)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Additional Options */}
            <div className="flex items-start mb-4">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={suggestFollowUps}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSuggestFollowUps(e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <label className="ml-2 text-sm text-gray-700">
                Suggest follow-up questions based on candidate responses
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-md shadow-sm hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scheduling...
                </span>
              ) : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal; 