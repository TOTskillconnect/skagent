import type { Candidate } from '@/types/candidates';

const mockCandidates: Candidate[] = [
  {
    id: 'cand001',
    name: 'John Doe',
    title: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'CSS'],
    match_score: '85',
    experience_tags: ['3+ years', 'Startup', 'SaaS'],
    context_fit_summary: 'Has experience with early-stage startups and building MVPs from scratch',
    verification_badges: ['Identity', 'Skills'],
    experience: [
      {
        role: 'Senior Frontend Developer',
        company: 'TechCorp',
        period: '2020 - 2023',
        description: 'Led frontend development for a SaaS product.'
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor',
        field: 'Computer Science',
        year: '2020'
      }
    ]
  },
  {
    id: 'cand002',
    name: 'Jane Smith',
    title: 'Product Manager',
    skills: ['Product Strategy', 'User Research', 'Agile'],
    match_score: '92',
    experience_tags: ['5+ years', 'B2B', 'Fintech'],
    context_fit_summary: 'Strong experience in product management for B2B financial products',
    verification_badges: ['Identity', 'Employment'],
    experience: [
      {
        role: 'Senior Product Manager',
        company: 'FinApp Inc.',
        period: '2018 - 2023',
        description: 'Managed the development of financial products.'
      }
    ],
    education: [
      {
        institution: 'Business School',
        degree: 'MBA',
        field: 'Business Administration',
        year: '2018'
      }
    ]
  }
];

export default mockCandidates; 