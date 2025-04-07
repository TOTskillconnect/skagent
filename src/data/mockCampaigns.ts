export interface Campaign {
  id: string;
  title: string;
  status: string;
  dateCreated: string;
  candidateCount?: string | number;
  description?: string;
  requiredSkills?: string[];
  location?: string;
  actualCandidateCount?: number;
  type?: string;
  jobType?: string;
  businessStage?: string;
}

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Software Engineer',
    status: 'active',
    dateCreated: '2023-03-15',
    description: 'Full-stack engineer with React and Node.js experience',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    location: 'Remote',
    candidateCount: 12,
    actualCandidateCount: 5
  },
  {
    id: '2',
    title: 'Product Designer',
    status: 'active',
    dateCreated: '2023-03-10',
    description: 'UI/UX designer with experience in SaaS products',
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    location: 'San Francisco (Hybrid)',
    candidateCount: 8,
    actualCandidateCount: 3
  },
  {
    id: '3',
    title: 'Technical Project Manager',
    status: 'active',
    dateCreated: '2023-02-28',
    description: 'Project manager with technical background to lead development teams',
    requiredSkills: ['Agile', 'Jira', 'Software Development', 'Team Leadership'],
    location: 'New York',
    candidateCount: 5,
    actualCandidateCount: 2
  },
  {
    id: '4',
    title: 'Marketing Manager',
    status: 'paused',
    dateCreated: '2023-02-01',
    description: 'Growth-focused marketing manager for B2B SaaS product',
    requiredSkills: ['Content Marketing', 'SEO', 'SEM', 'Analytics'],
    location: 'Remote',
    candidateCount: 15,
    actualCandidateCount: 0
  }
]; 