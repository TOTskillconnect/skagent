import { Candidate } from '@/types/candidates';

// Mock candidates data - in a real app, this would come from an API
const candidates: Record<string, Candidate> = {
  '1': {
    id: '1',
    name: 'Sophia Chen',
    title: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    standoutSkills: ['React'],
    matchScore: 92,
    location: 'San Francisco, CA',
    campaignId: '1',
  },
  '2': {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'Full Stack Engineer',
    skills: ['Node.js', 'React', 'MongoDB', 'Express'],
    standoutSkills: ['Node.js'],
    matchScore: 87,
    location: 'Austin, TX',
    campaignId: '1',
  },
  '3': {
    id: '3',
    name: 'Emma Thompson',
    title: 'UI/UX Designer',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
    standoutSkills: ['Figma'],
    matchScore: 95,
    location: 'New York, NY',
    campaignId: '2',
  },
  '4': {
    id: '4',
    name: 'David Kim',
    title: 'DevOps Engineer',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    standoutSkills: ['AWS'],
    matchScore: 84,
    location: 'Seattle, WA',
    campaignId: '3',
  },
  '5': {
    id: '5',
    name: 'Olivia Martinez',
    title: 'Product Manager',
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile'],
    standoutSkills: ['Roadmapping'],
    matchScore: 91,
    location: 'Chicago, IL',
    campaignId: '3',
  },
  '6': {
    id: '6',
    name: 'Ethan Williams',
    title: 'Backend Developer',
    skills: ['Java', 'Spring', 'SQL', 'Microservices'],
    standoutSkills: ['Java'],
    matchScore: 89,
    location: 'Boston, MA',
    campaignId: '4',
  },
  '7': {
    id: '7',
    name: 'Ava Johnson',
    title: 'Mobile Developer',
    skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
    standoutSkills: ['React Native'],
    matchScore: 86,
    location: 'Denver, CO',
    campaignId: '2',
  },
  '8': {
    id: '8',
    name: 'Noah Garcia',
    title: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    standoutSkills: ['Machine Learning'],
    matchScore: 93,
    location: 'Washington, DC',
    campaignId: '1',
  }
};

/**
 * Get a specific candidate by ID
 */
export const getCandidate = (id: string): Candidate | undefined => {
  return candidates[id];
};

/**
 * Get all candidates as a map
 */
export const getCandidatesMap = (): Record<string, Candidate> => {
  return candidates;
};

/**
 * Get all candidates as an array
 */
export const getCandidates = (): Candidate[] => {
  return Object.values(candidates);
};

/**
 * Get candidates by campaign ID
 */
export const getCandidatesByCampaign = (campaignId: string): Candidate[] => {
  return Object.values(candidates).filter(
    candidate => candidate.campaignId === campaignId
  );
};

/**
 * Add a new candidate
 */
export const addCandidate = (candidate: Candidate): void => {
  candidates[candidate.id] = candidate;
};

/**
 * Update an existing candidate
 */
export const updateCandidate = (id: string, updates: Partial<Candidate>): void => {
  if (candidates[id]) {
    candidates[id] = { ...candidates[id], ...updates };
  }
};

/**
 * Delete a candidate
 */
export const deleteCandidate = (id: string): void => {
  delete candidates[id];
}; 