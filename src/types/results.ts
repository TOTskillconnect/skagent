export type AssessmentStatus = 'completed' | 'in_progress' | 'pending';

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  candidateId: string;
  score: number;
  completionTime: string;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  status: AssessmentStatus;
  submittedAt: string;
  evaluatedAt?: string;
}

export type RecommendationType = 'Highly Recommended' | 'Recommended' | 'Consider' | 'Not Recommended';

export interface ComprehensiveReport {
  id: string;
  candidateId: string;
  campaignId: string;
  overallScore: number;
  technicalScore: number;
  cultureFitScore: number;
  problemSolvingScore: number;
  strengths: string[];
  risks: string[];
  assessmentResults: AssessmentResult[];
  recommendation: RecommendationType;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResultsFilters {
  campaignId?: string;
  candidateId?: string;
  assessmentType?: string;
  status?: AssessmentStatus;
  dateRange?: {
    start: string;
    end: string;
  };
} 