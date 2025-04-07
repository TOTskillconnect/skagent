// Interface for assigned assessments
export interface AssignedAssessment {
  id: string;
  assessmentId: string;
  candidateId: string;
  candidateName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  assignedAt: string;
  completedAt?: string;
  dueDate: string;
}

// Mock assigned assessments data
export const mockAssignedAssessments: Record<string, AssignedAssessment> = {
  "aa000001": {
    id: "aa000001",
    assessmentId: "ass000001",
    candidateId: "cand000001",
    candidateName: "Alex Morgan",
    status: "completed",
    assignedAt: "2024-01-16T10:00:00.000Z",
    completedAt: "2024-01-17T15:30:00.000Z",
    dueDate: "2024-01-23T10:00:00.000Z"
  },
  "aa000002": {
    id: "aa000002",
    assessmentId: "ass000002",
    candidateId: "cand000002",
    candidateName: "Jordan Lee",
    status: "in_progress",
    assignedAt: "2024-01-16T10:00:00.000Z",
    dueDate: "2024-01-23T10:00:00.000Z"
  },
  "aa000003": {
    id: "aa000003",
    assessmentId: "ass000003",
    candidateId: "cand000001",
    candidateName: "Alex Morgan",
    status: "pending",
    assignedAt: "2024-01-21T10:00:00.000Z",
    dueDate: "2024-01-28T10:00:00.000Z"
  }
}; 