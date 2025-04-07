import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockAssessments, mockAssessmentTemplates } from '@/data/mockAssessments';
import { mockAssignedAssessments, AssignedAssessment } from '@/data/mockAssignedAssessments';
import { Assessment, AssessmentTemplate, AssessmentType, AssessmentStatus, AssessmentSubtype, AssessmentDifficulty } from '@/types/assessments';

// Re-export types that are used in other files
export type { AssessmentType, AssessmentSubtype };

// Generate a simple short ID for demo purposes
const generateId = () => `ass${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

// Types
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface AssessmentsContextType {
  assessments: Record<string, Assessment>;
  templates: Record<string, AssessmentTemplate>;
  assignedAssessments: Record<string, AssignedAssessment>;
  addAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  addTemplate: (template: Omit<AssessmentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<AssessmentTemplate>) => void;
  deleteTemplate: (id: string) => void;
  assignAssessment: (assessmentId: string, candidateId: string, candidateName: string, dueDate: string) => void;
  updateAssignedAssessment: (id: string, updates: Partial<AssignedAssessment>) => void;
  deleteAssignedAssessment: (id: string) => void;
  getAssessmentById: (id: string) => Assessment | undefined;
}

// Create context
const AssessmentsContext = createContext<AssessmentsContextType | undefined>(undefined);

// Provider component
export function AssessmentsProvider({ children }: { children: ReactNode }) {
  const [assessments, setAssessments] = useState<Record<string, Assessment>>(mockAssessments);
  const [templates, setTemplates] = useState<Record<string, AssessmentTemplate>>(mockAssessmentTemplates);
  const [assignedAssessments, setAssignedAssessments] = useState<Record<string, AssignedAssessment>>(mockAssignedAssessments);

  const addAssessment = (assessmentData: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = generateId();
    const now = new Date().toISOString();
    const newAssessment: Assessment = {
      ...assessmentData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setAssessments(prev => ({ ...prev, [id]: newAssessment }));
  };

  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const deleteAssessment = (id: string) => {
    setAssessments(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const addTemplate = (templateData: Omit<AssessmentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `tpl${Object.keys(templates).length + 1}`.padStart(6, '0');
    const now = new Date().toISOString();
    const newTemplate: AssessmentTemplate = {
      ...templateData,
      id,
      createdAt: now,
      updatedAt: now
    };
    setTemplates(prev => ({ ...prev, [id]: newTemplate }));
  };

  const updateTemplate = (id: string, updates: Partial<AssessmentTemplate>) => {
    setTemplates(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const assignAssessment = (assessmentId: string, candidateId: string, candidateName: string, dueDate: string) => {
    const id = `aa${Object.keys(assignedAssessments).length + 1}`.padStart(6, '0');
    const now = new Date().toISOString();
    const newAssignedAssessment: AssignedAssessment = {
      id,
      assessmentId,
      candidateId,
      candidateName,
      status: 'pending',
      assignedAt: now,
      dueDate
    };
    setAssignedAssessments(prev => ({ ...prev, [id]: newAssignedAssessment }));
  };

  const updateAssignedAssessment = (id: string, updates: Partial<AssignedAssessment>) => {
    setAssignedAssessments(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
          completedAt: updates.status === 'completed' ? new Date().toISOString() : prev[id].completedAt
        }
      };
    });
  };

  const deleteAssignedAssessment = (id: string) => {
    setAssignedAssessments(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const getAssessmentById = (id: string) => {
    return assessments[id];
  };

  return (
    <AssessmentsContext.Provider value={{
      assessments,
      templates,
      assignedAssessments,
      addAssessment,
      updateAssessment,
      deleteAssessment,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      assignAssessment,
      updateAssignedAssessment,
      deleteAssignedAssessment,
      getAssessmentById
    }}>
      {children}
    </AssessmentsContext.Provider>
  );
}

// Custom hook
export function useAssessments() {
  const context = useContext(AssessmentsContext);
  if (context === undefined) {
    throw new Error('useAssessments must be used within an AssessmentsProvider');
  }
  return context;
} 