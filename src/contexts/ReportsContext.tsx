import React, { createContext, useContext, useState } from 'react';
import { mockReports } from '@/data/mockResults';
import { ComprehensiveReport } from '@/types/results';

// Types
interface ReportsContextType {
  reports: ComprehensiveReport[];
  getReportByCandidate: (candidateId: string) => ComprehensiveReport | undefined;
  addReport: (report: Omit<ComprehensiveReport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReport: (id: string, updates: Partial<ComprehensiveReport>) => void;
  deleteReport: (id: string) => void;
  addNoteToReport: (id: string, note: string) => void;
}

// Create context
const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Provider component
export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<ComprehensiveReport[]>(Object.values(mockReports));

  const getReportByCandidate = (candidateId: string) => {
    return reports.find(report => report.candidateId === candidateId);
  };

  const addReport = (reportData: Omit<ComprehensiveReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `rep${Object.keys(reports).length + 1}`.padStart(6, '0');
    const now = new Date().toISOString();
    const newReport: ComprehensiveReport = {
      ...reportData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: string, updates: Partial<ComprehensiveReport>) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id 
          ? { ...report, ...updates, updatedAt: new Date().toISOString() }
          : report
      )
    );
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const addNoteToReport = (id: string, note: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id 
          ? { 
              ...report, 
              notes: [...(report.notes || []), note],
              updatedAt: new Date().toISOString()
            }
          : report
      )
    );
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      getReportByCandidate,
      addReport,
      updateReport,
      deleteReport,
      addNoteToReport
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

// Custom hook
export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
} 