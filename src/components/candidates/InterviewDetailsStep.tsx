import React from 'react';
import { InterviewStyle, interviewStyleOptions } from './GuidedInterviewTypes';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface InterviewDetailsStepProps {
  selectedStyle: InterviewStyle;
  interviewMode: 'one_on_one' | 'panel';
  setInterviewMode: (mode: 'one_on_one' | 'panel') => void;
  availableDates: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  updateDateSlot: (index: number, field: 'date' | 'startTime' | 'endTime', value: string) => void;
  addDateSlot: (e: React.MouseEvent) => void;
  removeDateSlot: (index: number, e: React.MouseEvent) => void;
  teamMembers: TeamMember[];
  selectedTeamMembers: string[];
  toggleTeamMember: (id: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  errors: {[key: string]: string};
}

const InterviewDetailsStep: React.FC<InterviewDetailsStepProps> = ({
  selectedStyle,
  interviewMode,
  setInterviewMode,
  availableDates,
  updateDateSlot,
  addDateSlot,
  removeDateSlot,
  teamMembers,
  selectedTeamMembers,
  toggleTeamMember,
  notes,
  setNotes,
  errors
}) => {
  // Get the selected interview style details
  const interviewStyleDetails = interviewStyleOptions.find(
    style => style.value === selectedStyle
  );

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Schedule Details</h2>
      <p className="text-gray-600 mb-6">
        Set up the logistics for your {interviewStyleDetails?.label || 'interview'}.
      </p>
      
      {/* Interview Mode */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Mode
        </label>
        <div className="flex space-x-4">
          <div 
            className={`
              flex-1 p-4 border rounded-lg cursor-pointer transition-all
              ${interviewMode === 'one_on_one' 
                ? 'border-primary bg-primary bg-opacity-5' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
            onClick={() => setInterviewMode('one_on_one')}
          >
            <div className="flex items-center justify-center">
              <span className="text-lg mr-2">👤</span>
              <span className="font-medium">1-on-1 Interview</span>
            </div>
          </div>
          
          <div 
            className={`
              flex-1 p-4 border rounded-lg cursor-pointer transition-all
              ${interviewMode === 'panel' 
                ? 'border-primary bg-primary bg-opacity-5' 
                : 'border-gray-200 hover:border-gray-300'}
            `}
            onClick={() => setInterviewMode('panel')}
          >
            <div className="flex items-center justify-center">
              <span className="text-lg mr-2">👥</span>
              <span className="font-medium">Panel Interview</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Dates */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Available Date & Time Options
          </label>
          <span className="text-xs text-gray-500">Candidate will select one</span>
        </div>
        
        {availableDates.map((dateSlot, index) => (
          <div 
            key={index} 
            className="flex flex-wrap md:flex-nowrap gap-4 mb-4 items-start"
          >
            <div className="w-full md:w-1/3">
              <input
                type="date"
                className={`block w-full p-2.5 text-gray-700 bg-white border ${errors[`dates[${index}].date`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                value={dateSlot.date}
                onChange={(e) => updateDateSlot(index, 'date', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {errors[`dates[${index}].date`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`dates[${index}].date`]}</p>
              )}
            </div>
            
            <div className="w-full md:w-1/3">
              <input
                type="time"
                className={`block w-full p-2.5 text-gray-700 bg-white border ${errors[`dates[${index}].startTime`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                value={dateSlot.startTime}
                onChange={(e) => updateDateSlot(index, 'startTime', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {errors[`dates[${index}].startTime`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`dates[${index}].startTime`]}</p>
              )}
            </div>
            
            <div className="w-full md:w-1/3">
              <input
                type="time"
                className={`block w-full p-2.5 text-gray-700 bg-white border ${errors[`dates[${index}].endTime`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                value={dateSlot.endTime}
                onChange={(e) => updateDateSlot(index, 'endTime', e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {errors[`dates[${index}].endTime`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`dates[${index}].endTime`]}</p>
              )}
            </div>
            
            <button 
              type="button"
              className="mt-2 p-1 text-red-600 hover:text-red-800 rounded"
              onClick={(e) => removeDateSlot(index, e)}
              disabled={availableDates.length <= 1}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        
        <button 
          type="button"
          className="flex items-center text-sm text-primary hover:text-primary-dark"
          onClick={addDateSlot}
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Date Option
        </button>
      </div>
      
      {/* Team Members (only show if panel interview) */}
      {interviewMode === 'panel' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Members to Include
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className={`
                  p-3 border rounded-lg cursor-pointer transition-all
                  ${selectedTeamMembers.includes(member.id)
                    ? 'border-primary bg-primary bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => toggleTeamMember(member.id)}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Interview Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Notes (Optional)
        </label>
        <textarea
          className="block w-full p-2.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          rows={4}
          placeholder={`Add any specific details about this ${interviewStyleDetails?.label || 'interview'}, questions to ask, or topics to cover.`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default InterviewDetailsStep; 