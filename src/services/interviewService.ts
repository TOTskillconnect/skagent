/**
 * Interview Service
 * 
 * Handles all API calls and data management related to interviews
 */

import { InterviewPriority, InterviewStyle } from '@/components/candidates/GuidedInterviewTypes';
import { Candidate } from '@/types/candidates';

// Types for interview data
export interface InterviewDate {
  date: string;
  startTime: string;
  endTime: string;
}

export interface InterviewData {
  candidateId?: string;
  candidates?: string[];
  mode: string;
  interviewStyle?: InterviewStyle;
  interviewPriority?: InterviewPriority;
  dates: InterviewDate[];
  timezone: string;
  notes: string;
  teamMembers?: string[];
  suggestFollowUps: boolean;
  focusAreas: string[];
  groupInterviewId?: string; // Reference to parent group interview if part of a batch
}

export interface Interview extends InterviewData {
  id: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'pending' | 'confirmed';
  createdAt: string;
  updatedAt: string;
}

// Local storage key for interviews
const INTERVIEWS_STORAGE_KEY = 'interviews';

// Some sample data for testing
const sampleInterviews: Interview[] = [
  {
    id: 'interview_1',
    candidateId: '1',
    mode: '1v1 video call',
    interviewStyle: InterviewStyle.LIVE_COLLABORATION,
    interviewPriority: InterviewPriority.TECHNICAL,
    status: 'scheduled',
    createdAt: '2023-09-15T10:00:00Z',
    updatedAt: '2023-09-15T10:00:00Z',
    dates: [
      { date: '2023-09-20', startTime: '10:00', endTime: '11:00' }
    ],
    timezone: 'America/New_York',
    notes: 'Initial screening interview',
    suggestFollowUps: true,
    focusAreas: ['Technical depth', 'Problem-solving approach']
  },
  {
    id: 'interview_2',
    candidateId: '2',
    mode: 'Panel interview',
    interviewStyle: InterviewStyle.ROLE_REVERSAL,
    interviewPriority: InterviewPriority.CULTURE,
    status: 'pending',
    createdAt: '2023-09-14T15:30:00Z',
    updatedAt: '2023-09-14T15:30:00Z',
    dates: [
      { date: '2023-09-22', startTime: '14:00', endTime: '15:00' }
    ],
    timezone: 'America/Los_Angeles',
    notes: 'Technical interview with the engineering team',
    suggestFollowUps: true,
    focusAreas: ['Technical depth', 'Team collaboration']
  }
];

// Mock data storage (in a real app, this would be in a backend/database)
let interviews: Interview[] = [];

// Initialize the interview data with sample data if none exists
const initializeInterviewData = (): void => {
  try {
    const storedInterviews = localStorage.getItem(INTERVIEWS_STORAGE_KEY);
    if (!storedInterviews) {
      // No interviews in localStorage, seed with sample data
      localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(sampleInterviews));
      interviews = [...sampleInterviews];
      console.log('Initialized sample interview data');
    } else {
      interviews = JSON.parse(storedInterviews);
    }
  } catch (error) {
    console.error('Error initializing interview data:', error);
    // If localStorage fails, still set the sample data in memory
    interviews = [...sampleInterviews];
  }
};

/**
 * Get all interviews
 */
export const getInterviews = (): Interview[] => {
  if (typeof window === 'undefined') return [];
  
  const interviews = localStorage.getItem(INTERVIEWS_STORAGE_KEY);
  return interviews ? JSON.parse(interviews) : [];
};

/**
 * Get interviews for a specific candidate
 */
export const getInterviewsForCandidate = (candidateId: string): Interview[] => {
  const interviews = getInterviews();
  return interviews.filter(interview => 
    interview.candidateId === candidateId || 
    (interview.candidates && interview.candidates.includes(candidateId))
  );
};

/**
 * Schedule a new interview
 */
export const scheduleInterview = (interviewData: InterviewData): Interview => {
  const interviews = getInterviews();
  
  // Create new interview object
  const newInterview: Interview = {
    ...interviewData,
    id: Date.now().toString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Save to local storage
  localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify([...interviews, newInterview]));
  
  // If this is a multi-candidate interview, we need to create individual 
  // interview records for each candidate for easier tracking
  if (interviewData.candidates && interviewData.candidates.length > 0) {
    // For each candidate, create an individual interview record linked to the group interview
    interviewData.candidates.forEach(candidateId => {
      const individualInterview: Interview = {
        ...interviewData,
        candidateId,
        groupInterviewId: newInterview.id,
        id: `${newInterview.id}-${candidateId}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to the list of interviews
      interviews.push(individualInterview);
    });
    
    // Update local storage with all the individual interviews
    localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(interviews));
  }
  
  return newInterview;
};

/**
 * Update an interview's status
 */
export const updateInterviewStatus = (
  interviewId: string, 
  status: 'scheduled' | 'completed' | 'canceled' | 'pending' | 'confirmed'
): Interview | null => {
  const interviews = getInterviews();
  const interviewIndex = interviews.findIndex(interview => interview.id === interviewId);
  
  if (interviewIndex === -1) return null;
  
  const updatedInterview = {
    ...interviews[interviewIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  interviews[interviewIndex] = updatedInterview;
  localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(interviews));
  
  return updatedInterview;
};

/**
 * Delete an interview
 */
export const deleteInterview = (interviewId: string): boolean => {
  const interviews = getInterviews();
  const filteredInterviews = interviews.filter(interview => interview.id !== interviewId);
  
  if (filteredInterviews.length === interviews.length) return false;
  
  localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(filteredInterviews));
  return true;
};

// Initialize the interviews when this module is first loaded
initializeInterviewData(); 