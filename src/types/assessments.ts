export type AssessmentType = 'technical' | 'behavioral' | 'cultural' | 'skills';
export type AssessmentDifficulty = 'easy' | 'medium' | 'hard';
export type AssessmentStatus = 'active' | 'inactive' | 'archived' | 'pending' | 'in_progress' | 'completed' | 'expired';
export type AssessmentSubtype = 
  | 'frontend_dev' 
  | 'backend_dev' 
  | 'product_design'
  | 'marketing'
  | 'decision_simulation'
  | 'ethical_dilemma'
  | 'leadership'
  | 'client_interaction'
  | 'values_assessment'
  | 'work_style'
  | 'startup_fit'
  | 'startup_scenarios';

export interface Assessment {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  instructions: string;
  duration: number; // in minutes
  difficulty: AssessmentDifficulty;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentTemplate {
  id: string;
  type: AssessmentType;
  subtype?: AssessmentSubtype;
  title: string;
  description: string;
  instructions: string;
  duration: number; // in minutes
  difficulty: AssessmentDifficulty;
  createdAt: string;
  updatedAt: string;
} 