import { AssessmentResult, ComprehensiveReport } from '@/types/results';

export const mockAssessmentResults: AssessmentResult[] = [
  {
    id: 'r001',
    assessmentId: 'a001',
    candidateId: 'c001',
    score: 92,
    completionTime: '1 hour 45 minutes',
    feedback: 'Excellent implementation of React components with TypeScript. Strong understanding of state management and component architecture.',
    strengths: [
      'Clean code structure',
      'TypeScript implementation',
      'Component reusability',
      'Error handling'
    ],
    areasForImprovement: [
      'Could add more comprehensive testing',
      'Documentation could be more detailed'
    ],
    status: 'completed',
    submittedAt: '2024-03-15T10:30:00Z',
    evaluatedAt: '2024-03-15T12:15:00Z'
  },
  {
    id: 'r002',
    assessmentId: 'a002',
    candidateId: 'c001',
    score: 85,
    completionTime: '35 minutes',
    feedback: 'Strong communication skills and leadership potential. Good approach to conflict resolution.',
    strengths: [
      'Clear communication',
      'Problem-solving approach',
      'Team collaboration'
    ],
    areasForImprovement: [
      'Could provide more specific examples',
      'Time management could be improved'
    ],
    status: 'completed',
    submittedAt: '2024-03-16T14:20:00Z',
    evaluatedAt: '2024-03-16T14:55:00Z'
  },
  {
    id: 'r003',
    assessmentId: 'a003',
    candidateId: 'c002',
    score: 88,
    completionTime: '2 hours',
    feedback: 'Solid understanding of backend architecture and database design. Good implementation of RESTful principles.',
    strengths: [
      'API design',
      'Database modeling',
      'Security considerations'
    ],
    areasForImprovement: [
      'Could optimize database queries',
      'Documentation needs improvement'
    ],
    status: 'completed',
    submittedAt: '2024-03-17T09:15:00Z',
    evaluatedAt: '2024-03-17T11:15:00Z'
  }
];

export const mockComprehensiveReports: ComprehensiveReport[] = [
  {
    id: 'cr001',
    candidateId: 'c001',
    campaignId: 'camp001',
    overallScore: 89,
    technicalScore: 92,
    cultureFitScore: 85,
    problemSolvingScore: 90,
    strengths: [
      'Strong technical skills in React and TypeScript',
      'Excellent problem-solving abilities',
      'Good communication skills',
      'Team collaboration'
    ],
    risks: [
      'May need more experience with complex state management',
      'Testing practices could be improved'
    ],
    assessmentResults: mockAssessmentResults.filter(r => r.candidateId === 'c001'),
    recommendation: 'Highly Recommended',
    notes: [
      'Candidate shows strong potential for the role',
      'Technical assessment was particularly impressive',
      'Good cultural fit with the team'
    ],
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-16T14:55:00Z'
  },
  {
    id: 'cr002',
    candidateId: 'c002',
    campaignId: 'camp001',
    overallScore: 86,
    technicalScore: 88,
    cultureFitScore: 82,
    problemSolvingScore: 85,
    strengths: [
      'Strong backend architecture knowledge',
      'Good database design skills',
      'Security awareness'
    ],
    risks: [
      'Less experience with frontend technologies',
      'May need support with modern development practices'
    ],
    assessmentResults: mockAssessmentResults.filter(r => r.candidateId === 'c002'),
    recommendation: 'Recommended',
    notes: [
      'Solid technical background',
      'Good potential for growth',
      'May need mentoring in some areas'
    ],
    createdAt: '2024-03-17T09:15:00Z',
    updatedAt: '2024-03-17T11:15:00Z'
  }
];

export const mockReports: ComprehensiveReport[] = [
  {
    id: 'rep001',
    candidateId: 'c001',
    campaignId: 'camp001',
    overallScore: 85,
    technicalScore: 88,
    cultureFitScore: 82,
    problemSolvingScore: 85,
    strengths: [
      'Strong technical background in React and TypeScript',
      'Excellent problem-solving abilities',
      'Good communication skills'
    ],
    risks: [
      'Limited experience with large-scale applications',
      'May need mentoring in advanced architectural patterns'
    ],
    assessmentResults: [],
    recommendation: 'Highly Recommended',
    notes: [
      'Performed exceptionally well in technical assessments',
      'Shows great potential for growth'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'rep002',
    candidateId: 'c002',
    campaignId: 'camp001',
    overallScore: 78,
    technicalScore: 75,
    cultureFitScore: 85,
    problemSolvingScore: 80,
    strengths: [
      'Strong team collaboration skills',
      'Good understanding of design patterns',
      'Quick learner'
    ],
    risks: [
      'May need additional training in TypeScript',
      'Limited experience with testing frameworks'
    ],
    assessmentResults: [],
    recommendation: 'Recommended',
    notes: [
      'Good cultural fit with the team',
      'Shows enthusiasm and willingness to learn'
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]; 