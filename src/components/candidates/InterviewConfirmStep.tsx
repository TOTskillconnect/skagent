import React from 'react';
import { InterviewStyle, interviewStyleOptions } from './GuidedInterviewTypes';
import { Candidate } from '@/types/candidates';

interface InterviewConfirmStepProps {
  candidate: Candidate;
  selectedStyle: InterviewStyle;
  interviewMode: 'one_on_one' | 'panel';
  availableDates: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  selectedTeamMembers: string[];
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  notes: string;
  isSubmitting: boolean;
}

const InterviewConfirmStep: React.FC<InterviewConfirmStepProps> = ({
  candidate,
  selectedStyle,
  interviewMode,
  availableDates,
  selectedTeamMembers,
  teamMembers,
  notes,
  isSubmitting
}) => {
  // Get the selected interview style details
  const interviewStyleDetails = interviewStyleOptions.find(
    style => style.value === selectedStyle
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  // Get selected team members
  const selectedTeamMembersList = teamMembers.filter(
    member => selectedTeamMembers.includes(member.id)
  );

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirm & Send</h2>
      <p className="text-gray-600 mb-6">
        Review the interview details before sending the invitation to {candidate.name}.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 text-2xl mr-3">
            {interviewStyleDetails?.icon || '📝'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {interviewStyleDetails?.label || 'Interview'}
            </h3>
            <p className="text-gray-700">{interviewStyleDetails?.description}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Candidate</h4>
            <p className="text-gray-900">{candidate.name}</p>
            {candidate.title && <p className="text-sm text-gray-500">{candidate.title}</p>}
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Interview Type</h4>
            <div className="flex items-center">
              <span className="mr-2">
                {interviewMode === 'one_on_one' ? '👤' : '👥'}
              </span>
              <span>
                {interviewMode === 'one_on_one' ? '1-on-1 Interview' : 'Panel Interview'}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Available Times</h4>
            <div className="space-y-2">
              {availableDates.map((slot, index) => (
                <div key={index} className="text-gray-900">
                  {formatDate(slot.date)}, {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </div>
              ))}
            </div>
          </div>
          
          {interviewMode === 'panel' && selectedTeamMembersList.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Team Members</h4>
              <div className="flex flex-wrap">
                {selectedTeamMembersList.map((member) => (
                  <div key={member.id} className="mr-4 mb-2 flex items-center">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-1 text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {notes && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
              <div className="text-gray-700 text-sm whitespace-pre-line">{notes}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-700">What happens next?</h3>
            <div className="mt-2 text-sm text-blue-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>The candidate will receive an email invitation</li>
                <li>They'll select one of your available time slots</li>
                <li>You'll be notified once they confirm a time</li>
                <li>The interview will be added to your calendar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-green-700 text-sm">Ready to send to {candidate.name}</span>
      </div>
    </div>
  );
};

export default InterviewConfirmStep; 