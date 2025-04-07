import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockAssessmentResults, mockComprehensiveReports } from '@/data/mockResults';
import type { ResultsFilters, AssessmentResult, ComprehensiveReport } from '@/types/results';

export interface ResultsContextType {
  results: AssessmentResult[];
  filteredResults: AssessmentResult[];
  reports: ComprehensiveReport[];
  filters: ResultsFilters;
  setFilters: (filters: ResultsFilters) => void;
  getResultById: (id: string) => AssessmentResult | undefined;
  getReportById: (id: string) => ComprehensiveReport | undefined;
}

// Create context
const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

// Provider component
export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results] = useState<AssessmentResult[]>(mockAssessmentResults);
  const [reports] = useState<ComprehensiveReport[]>(mockComprehensiveReports);
  const [filters, setFilters] = useState<ResultsFilters>({});

  // Apply filters to results
  const filteredResults = results.filter(result => {
    // Candidate ID filter
    if (filters.candidateId && result.candidateId !== filters.candidateId) {
      return false;
    }

    // Assessment type/ID filter - assuming assessmentType is a prefix of assessmentId
    if (filters.assessmentType && !result.assessmentId.startsWith(filters.assessmentType)) {
      return false;
    }

    // Status filter
    if (filters.status && result.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const submittedDate = new Date(result.submittedAt);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (submittedDate < startDate || submittedDate > endDate) {
        return false;
      }
    }

    return true;
  });

  // Get result by ID
  const getResultById = (id: string): AssessmentResult | undefined => {
    return results.find(result => result.id === id);
  };

  // Get report by ID
  const getReportById = (id: string): ComprehensiveReport | undefined => {
    return reports.find(report => report.id === id);
  };

  return (
    <ResultsContext.Provider
      value={{
        results,
        filteredResults,
        reports,
        filters,
        setFilters,
        getResultById,
        getReportById
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

// Custom hook
export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
} 