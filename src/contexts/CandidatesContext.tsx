import React, { createContext, useContext, useState } from 'react';
import { mockCandidates } from '@/data/mockCandidates';
import type { Candidate } from '@/types/candidates';

interface CandidatesContextType {
  candidates: Record<string, Candidate>;
  addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  getCandidateById: (id: string) => Candidate | undefined;
}

// Create context
const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

// Provider component
export function CandidatesProvider({ children }: { children: React.ReactNode }) {
  // Convert array to record with ID as key
  const initialCandidates: Record<string, Candidate> = {};
  Object.values(mockCandidates).forEach((candidate: Candidate) => {
    initialCandidates[candidate.id] = candidate;
  });

  const [candidates, setCandidates] = useState<Record<string, Candidate>>(initialCandidates);

  const addCandidate = (candidateData: Omit<Candidate, 'id'>) => {
    const id = `c${Object.keys(candidates).length + 1}`.padStart(3, '0');
    const newCandidate: Candidate = {
      ...candidateData,
      id,
      skills: candidateData.skills || []
    };
    setCandidates(prev => ({ ...prev, [id]: newCandidate }));
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
        }
      };
    });
  };

  const deleteCandidate = (id: string) => {
    setCandidates(prev => {
      const newCandidates = { ...prev };
      delete newCandidates[id];
      return newCandidates;
    });
  };

  const getCandidateById = (id: string) => {
    return candidates[id];
  };

  return (
    <CandidatesContext.Provider
      value={{
        candidates,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        getCandidateById
      }}
    >
      {children}
    </CandidatesContext.Provider>
  );
}

// Custom hook
export function useCandidates() {
  const context = useContext(CandidatesContext);
  if (context === undefined) {
    throw new Error('useCandidates must be used within a CandidatesProvider');
  }
  return context;
} 