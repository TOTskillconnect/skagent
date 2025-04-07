import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate } from '@/types/candidates';

// Demo candidates for archive 
const demoArchivedCandidates: Candidate[] = [
  {
    id: 'arc001',
    name: 'Hiroshi Chen',
    title: 'Software Engineer',
    match_score: '93',
    skills: ['Python', 'Java', 'Next.js', 'Node.js', 'Mailtrap'],
    verification_badges: ['Reference Provided', 'Background Checked', 'Assessment Passed'],
    industry: 'Fintech',
    experience_tags: ['Series A Ready'],
    context_fit_summary: 'Architected product development for Fintech mobile app in Series A Ready companies. Known for structured thinking.',
  },
  {
    id: 'arc002',
    name: 'Ava Rodriguez',
    title: 'UX/UI Designer',
    match_score: '89',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    verification_badges: ['Portfolio Verified', 'Assessment Passed'],
    industry: 'E-commerce',
    experience_tags: ['Remote Team', 'Startup Environment'],
    context_fit_summary: 'Led design for e-commerce platforms with focus on conversion optimization. Experienced in remote team collaboration and agile environments.',
  },
  {
    id: 'arc003',
    name: 'Marcus Johnson',
    title: 'DevOps Engineer',
    match_score: '95',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    verification_badges: ['Reference Provided', 'Security Clearance'],
    industry: 'FinTech',
    experience_tags: ['Seed Stage', '5+ years'],
    context_fit_summary: 'Built scalable infrastructure for fintech startups from seed to Series B. Expert in secure cloud architecture and deployment automation.',
  },
  {
    id: 'arc004',
    name: 'Sophia Park',
    title: 'Product Manager',
    match_score: '87',
    skills: ['Roadmapping', 'User Stories', 'Agile', 'Analytics', 'Market Research'],
    verification_badges: ['Work History Verified', 'Assessment Passed'],
    industry: 'Healthcare',
    experience_tags: ['Growth Stage', 'Remote Team'],
    context_fit_summary: 'Managed digital health products with 200% YoY growth. Specializes in translating complex requirements into user-centric solutions.',
  }
];

interface ArchivedCandidatesContextType {
  archivedCandidates: Candidate[];
  addToArchive: (candidate: Candidate) => void;
  removeFromArchive: (candidateId: string) => void;
  isArchived: (candidateId: string) => boolean;
}

const ArchivedCandidatesContext = createContext<ArchivedCandidatesContextType | undefined>(undefined);

export const ArchivedCandidatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [archivedCandidates, setArchivedCandidates] = useState<Candidate[]>([]);
  
  // Load archived candidates from localStorage on initial mount
  useEffect(() => {
    const loadArchivedCandidates = () => {
      try {
        const storedCandidates = localStorage.getItem('sk_archived_candidates');
        
        if (storedCandidates) {
          const parsedData = JSON.parse(storedCandidates);
          setArchivedCandidates([...demoArchivedCandidates, ...parsedData]);
        } else {
          // If no stored candidates, just use demo candidates
          setArchivedCandidates(demoArchivedCandidates);
        }
      } catch (error) {
        console.error('Error loading archived candidates:', error);
        // Fallback to demo candidates on error
        setArchivedCandidates(demoArchivedCandidates);
      }
    };
    
    loadArchivedCandidates();
  }, []);
  
  // Save to localStorage whenever archives change
  useEffect(() => {
    // Don't save if we only have the demo candidates
    if (archivedCandidates.length > demoArchivedCandidates.length) {
      // Only save non-demo candidates
      const userArchivedCandidates = archivedCandidates.filter(
        candidate => !demoArchivedCandidates.some(demo => demo.id === candidate.id)
      );
      localStorage.setItem('sk_archived_candidates', JSON.stringify(userArchivedCandidates));
    }
  }, [archivedCandidates]);
  
  /**
   * Add a candidate to the archive
   */
  const addToArchive = (candidate: Candidate) => {
    // Don't add duplicates
    if (isArchived(candidate.id)) {
      return;
    }
    
    setArchivedCandidates(prev => [...prev, candidate]);
  };
  
  /**
   * Remove a candidate from the archive
   */
  const removeFromArchive = (candidateId: string) => {
    setArchivedCandidates(prev => prev.filter(c => c.id !== candidateId));
  };
  
  /**
   * Check if a candidate is in the archive
   */
  const isArchived = (candidateId: string): boolean => {
    return archivedCandidates.some(c => c.id === candidateId);
  };
  
  return (
    <ArchivedCandidatesContext.Provider
      value={{
        archivedCandidates,
        addToArchive,
        removeFromArchive,
        isArchived
      }}
    >
      {children}
    </ArchivedCandidatesContext.Provider>
  );
};

export const useArchivedCandidates = (): ArchivedCandidatesContextType => {
  const context = useContext(ArchivedCandidatesContext);
  if (context === undefined) {
    throw new Error('useArchivedCandidates must be used within an ArchivedCandidatesProvider');
  }
  return context;
}; 