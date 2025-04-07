import React, { useState, useEffect } from 'react';
import { Candidate } from '@/types/candidates';
import { Campaign } from '@/data/mockCampaigns';
import { getCandidatesMap } from '@/services/candidateService';

interface ScheduleInterviewModalProps {
  candidate?: Candidate;
  campaign?: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: any) => void;
}

const InterviewMode = {
  VIDEO: '1v1 video call',
  PANEL: 'Panel interview'
};

const FocusAreas = [
  'Technical depth',
  'Values fit',
  'Async readiness',
  'Problem-solving approach',
  'Leadership potential',
  'Communication skills',
  'Project management',
  'Team collaboration'
];

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  candidate,
  campaign,
  isOpen,
  onClose,
  onSchedule
}) => {
  // Get candidates data
  const candidatesMap = getCandidatesMap();
  const allCandidates = Object.values(candidatesMap);
  
  // Track current step
  const [step, setStep] = useState(1);
  
  // Selected candidates state
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  
  // Form data state
  const [interviewData, setInterviewData] = useState({
    mode: InterviewMode.VIDEO,
    dates: [
      { date: '', startTime: '', endTime: '' }
    ],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notes: '',
    suggestFollowUps: true,
    focusAreas: [] as string[],
    candidates: [] as string[]
  });

  // Initialize selected candidates based on props
  useEffect(() => {
    if (isOpen) {
      if (candidate) {
        setSelectedCandidates([candidate]);
      } else if (campaign) {
        // Get candidates for this campaign
        const campaignCandidates = allCandidates.filter((c: Candidate) => 
          c.campaignId === campaign.id || Math.random() < 0.3
        );
        setSelectedCandidates(campaignCandidates);
      } else {
        setSelectedCandidates([]);
      }
    }
  }, [isOpen, candidate, campaign, allCandidates]);

  // Update candidates IDs when selectedCandidates changes
  useEffect(() => {
    if (selectedCandidates.length > 0) {
      setInterviewData(prev => ({
        ...prev,
        candidates: selectedCandidates.map(c => c.id)
      }));
    }
  }, [selectedCandidates]);

  // Handle modal close with confirmation if data has been entered
  const handleClose = () => {
    if (step > 1 && !confirm('Are you sure you want to cancel this interview setup?')) {
      return;
    }
    onClose();
  };

  // Handle form data changes
  const updateInterviewData = (field: string, value: any) => {
    setInterviewData(prev => ({ ...prev, [field]: value }));
  };

  // Handle candidate selection
  const toggleCandidate = (candidate: Candidate) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.some(c => c.id === candidate.id);
      if (isSelected) {
        return prev.filter(c => c.id !== candidate.id);
      } else {
        return [...prev, candidate];
      }
    });
  };

  // Add a new date option
  const addDateOption = () => {
    setInterviewData(prev => ({
      ...prev,
      dates: [...prev.dates, { date: '', startTime: '', endTime: '' }]
    }));
  };

  // Remove a date option
  const removeDateOption = (index: number) => {
    if (interviewData.dates.length > 1) {
      setInterviewData(prev => ({
        ...prev,
        dates: prev.dates.filter((_, i) => i !== index)
      }));
    }
  };

  // Update a specific date option
  const updateDateOption = (index: number, field: string, value: string) => {
    setInterviewData(prev => ({
      ...prev,
      dates: prev.dates.map((date, i) => 
        i === index ? { ...date, [field]: value } : date
      )
    }));
  };

  // Toggle a focus area
  const toggleFocusArea = (area: string) => {
    setInterviewData(prev => {
      const newFocusAreas = prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: newFocusAreas };
    });
  };

  // Go to next step
  const nextStep = () => {
    // Validate current step
    if (step === 1 && selectedCandidates.length === 0) {
      alert('Please select at least one candidate');
      return;
    }
    
    if (step === 2 && !validateDates()) {
      alert('Please fill in all date and time fields');
      return;
    }
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Submit the form
      onSchedule({
        ...interviewData,
        candidates: selectedCandidates.map(c => c.id)
      });
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle button click events to prevent them from bubbling up
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  // Validate dates
  const validateDates = () => {
    return interviewData.dates.every(
      date => date.date && date.startTime && date.endTime
    );
  };

  // Filter candidates for display
  const getFilteredCandidates = (): Candidate[] => {
    // If a specific campaign is provided, filter by that campaign
    if (campaign) {
      return allCandidates.filter((c: Candidate) => c.campaignId === campaign.id || Math.random() < 0.3);
    }
    return allCandidates as Candidate[];
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Candidates</h3>
            <p className="text-sm text-gray-600">
              Choose one or more candidates to schedule for interviews.
            </p>
            
            {campaign && (
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-sm text-blue-700 font-medium">Campaign: {campaign.title}</p>
                <p className="text-xs text-blue-600">Candidates from this campaign are pre-selected</p>
              </div>
            )}
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search candidates..."
                className="w-full border-gray-300 rounded-md pl-10 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -mt-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="overflow-auto max-h-64 border rounded-md">
              {getFilteredCandidates().length === 0 ? (
                <div className="p-4 text-center text-gray-500">No candidates found</div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                          checked={selectedCandidates.length === getFilteredCandidates().length && getFilteredCandidates().length > 0}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (selectedCandidates.length === getFilteredCandidates().length) {
                              setSelectedCandidates([]);
                            } else {
                              setSelectedCandidates(getFilteredCandidates());
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Role</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Match</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredCandidates().map((c: Candidate) => {
                      const isSelected = selectedCandidates.some(sc => sc.id === c.id);
                      return (
                        <tr 
                          key={c.id} 
                          className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCandidate(c);
                          }}
                        >
                          <td className="px-3 py-2 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-primary border-gray-300 rounded"
                              checked={isSelected}
                              onChange={() => {}} // Handled by row click
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{c.title || 'Not specified'}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {c.matchScore ? `${c.matchScore}%` : 'N/A'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedCandidates.length}</span> candidates selected
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Choose Interview Mode</h3>
            <p className="text-sm text-gray-600">
              Select how you want to conduct the {selectedCandidates.length > 1 ? 'interviews' : 'interview'}.
            </p>
            
            <div className="space-y-2">
              {Object.values(InterviewMode).map((mode) => (
                <label key={mode} className="flex items-start p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="interviewMode"
                    value={mode}
                    checked={interviewData.mode === mode}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateInterviewData('mode', e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="block font-medium text-gray-900">{mode}</span>
                    <span className="block text-xs text-gray-500">
                      {mode === InterviewMode.VIDEO 
                        ? 'Meet face-to-face with the candidates via video conference.' 
                        : 'Conduct the interviews with a panel of interviewers.'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Available Dates & Times</h3>
            <p className="text-sm text-gray-600">
              Choose times that work for your team. The {selectedCandidates.length > 1 ? 'candidates' : 'candidate'} will select from these options.
            </p>
            
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Timezone:</span> {interviewData.timezone}
            </div>
            
            <div className="space-y-3">
              {interviewData.dates.map((dateOption, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-center p-3 border rounded-md bg-gray-50">
                  <div className="w-full sm:w-auto flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={dateOption.date}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDateOption(index, 'date', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="w-full sm:w-auto flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={dateOption.startTime}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDateOption(index, 'startTime', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  
                  <div className="w-full sm:w-auto flex-1">
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={dateOption.endTime}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateDateOption(index, 'endTime', e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => handleButtonClick(e, () => removeDateOption(index))}
                    className="mt-5 text-red-600 hover:text-red-800"
                    disabled={interviewData.dates.length <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={(e) => handleButtonClick(e, addDateOption)}
              className="text-primary hover:text-primary-dark text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Date Option
            </button>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Customize Interview Plan</h3>
            <p className="text-sm text-gray-600">
              Add notes and focus areas to help structure the {selectedCandidates.length > 1 ? 'interviews' : 'interview'}.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Notes or Questions
              </label>
              <textarea
                value={interviewData.notes}
                onChange={(e) => {
                  e.stopPropagation();
                  updateInterviewData('notes', e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Add any specific topics, questions, or areas to focus on..."
                className="w-full border-gray-300 rounded-md shadow-sm text-sm h-24"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="suggestFollowUps"
                checked={interviewData.suggestFollowUps}
                onChange={(e) => {
                  e.stopPropagation();
                  updateInterviewData('suggestFollowUps', e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="suggestFollowUps" className="ml-2 block text-sm text-gray-900">
                Let Scout suggest live follow-up questions based on candidate answers
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Areas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FocusAreas.map((area) => (
                  <div key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`area-${area}`}
                      checked={interviewData.focusAreas.includes(area)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleFocusArea(area);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`area-${area}`} className="ml-2 block text-sm text-gray-900">
                      {area}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Confirm & Schedule {selectedCandidates.length > 1 ? 'Interviews' : 'Interview'}</h3>
            <p className="text-sm text-gray-600">
              Review your interview setup and click Schedule when ready.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Interview Details</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex flex-col">
                  <span className="font-medium mb-1">{selectedCandidates.length > 1 ? 'Candidates' : 'Candidate'}:</span>
                  {selectedCandidates.length > 3 ? (
                    <div>
                      <ul className="list-disc pl-8">
                        {selectedCandidates.slice(0, 3).map(c => (
                          <li key={c.id}>{c.name}</li>
                        ))}
                      </ul>
                      <p className="pl-8 text-gray-500">+{selectedCandidates.length - 3} more candidates</p>
                    </div>
                  ) : (
                    <ul className="list-disc pl-8">
                      {selectedCandidates.map(c => (
                        <li key={c.id}>{c.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="flex">
                  <span className="font-medium w-32">Interview Mode:</span>
                  <span>{interviewData.mode}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="font-medium mb-1">Available Times:</span>
                  <ul className="list-disc pl-8 space-y-1">
                    {interviewData.dates.map((date, index) => (
                      <li key={index}>
                        {new Date(date.date).toLocaleDateString()} from {date.startTime} to {date.endTime} ({interviewData.timezone})
                      </li>
                    ))}
                  </ul>
                </div>
                
                {interviewData.notes && (
                  <div className="flex flex-col">
                    <span className="font-medium mb-1">Notes:</span>
                    <p className="pl-8 whitespace-pre-line">{interviewData.notes}</p>
                  </div>
                )}
                
                {interviewData.focusAreas.length > 0 && (
                  <div className="flex flex-col">
                    <span className="font-medium mb-1">Focus Areas:</span>
                    <div className="pl-8 flex flex-wrap gap-1">
                      {interviewData.focusAreas.map(area => (
                        <span key={area} className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2 text-center text-gray-500 text-xs">
                  <p>An email will be sent to each candidate to select from your available times.</p>
                  <p>Scout will join the meeting and auto-record notes.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 modal-overlay"
      onClick={(e) => {
        // Stop click events from reaching the parent card
        e.stopPropagation();
        
        // If clicking the overlay (not the content), close the modal
        if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
          handleClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {campaign 
              ? `Schedule Interviews: ${campaign.title} Campaign`
              : selectedCandidates.length > 1
              ? 'Schedule Group Interviews'
              : selectedCandidates.length === 1
              ? `Schedule Interview: ${selectedCandidates[0].name}`
              : 'Schedule Interviews'
            }
          </h2>
          <button 
            onClick={(e) => handleButtonClick(e, handleClose)}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Step indicator */}
        <div className="px-6 py-3 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === s 
                      ? 'border-primary bg-primary text-white' 
                      : step > s 
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className="text-xs mt-1 text-gray-500">
                  {s === 1 ? 'Candidates' : s === 2 ? 'Mode' : s === 3 ? 'Dates' : s === 4 ? 'Plan' : 'Confirm'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Form content */}
        <div className="px-6 py-4 overflow-y-auto flex-grow">
          {renderStepContent()}
        </div>
        
        {/* Footer buttons */}
        <div className="px-6 py-4 border-t flex justify-between">
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, prevStep)}
            className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, step === 5 ? () => onSchedule({
              ...interviewData,
              candidates: selectedCandidates.map(c => c.id)
            }) : nextStep)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-200 hover:text-black text-sm"
          >
            {step === 5 ? 'Schedule Interviews' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal; 