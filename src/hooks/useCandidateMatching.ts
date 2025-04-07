import { useState, useCallback, useEffect } from 'react';
import { Campaign, Candidate } from '../lib/candidateGenerator';
import { useMatchedCandidates } from '../contexts/MatchedCandidatesContext';

// Interface for tracking the status of matching operations
interface MatchingStatus {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Result interface for the hook
interface CandidateMatchingResult {
  // Current state
  candidates: Candidate[];
  status: MatchingStatus;
  comparisonCandidates: Candidate[];
  
  // Operations
  generateMatches: (count?: number) => Promise<void>;
  refreshMatches: () => Promise<void>;
  addToComparison: (candidate: Candidate) => void;
  removeFromComparison: (candidateId: string) => void;
  clearComparison: () => void;
  updateCandidateStatus: (candidate: Candidate, newStatus: Candidate['status']) => void;
}

/**
 * Custom hook for campaign-specific candidate matching
 * 
 * Provides a simplified interface for components to access and manage
 * matched candidates for a specific campaign
 */
export function useCandidateMatching(campaign: Campaign | null): CandidateMatchingResult {
  // Access the shared context
  const {
    generateMatches,
    getMatchesForCampaign,
    markCandidateStatus,
    isGeneratingForCampaign,
    comparisonCandidates,
    addToComparison,
    removeFromComparison,
    clearComparison
  } = useMatchedCandidates();
  
  // Local state for the list of candidates
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  // Local state for tracking the status of operations
  const [status, setStatus] = useState<MatchingStatus>({
    isLoading: false,
    error: null,
    lastUpdated: null
  });
  
  // Load candidates when the campaign changes
  useEffect(() => {
    if (!campaign) {
      setCandidates([]);
      return;
    }
    
    // Check if we are generating for this campaign
    if (isGeneratingForCampaign(campaign.id)) {
      setStatus(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
      return;
    }
    
    // Load existing matches
    const existingMatches = getMatchesForCampaign(campaign.id);
    setCandidates(existingMatches);
    
    setStatus(prev => ({
      isLoading: false,
      error: null,
      lastUpdated: existingMatches.length > 0 ? new Date() : prev.lastUpdated
    }));
  }, [campaign, getMatchesForCampaign, isGeneratingForCampaign]);
  
  /**
   * Generate candidate matches for the current campaign
   */
  const generateMatchesForCampaign = useCallback(async (count: number = 5) => {
    if (!campaign) {
      setStatus(prev => ({
        ...prev,
        error: 'No campaign selected'
      }));
      return;
    }
    
    setStatus(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    try {
      const newCandidates = await generateMatches(campaign, count);
      setCandidates(newCandidates);
      
      setStatus({
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      setStatus({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate matches',
        lastUpdated: null
      });
    }
  }, [campaign, generateMatches]);
  
  /**
   * Refresh existing matches for the current campaign
   */
  const refreshMatches = useCallback(async () => {
    if (!campaign) {
      return;
    }
    
    // Just reload the existing matches from storage
    const existingMatches = getMatchesForCampaign(campaign.id);
    setCandidates(existingMatches);
    
    setStatus(prev => ({
      isLoading: false,
      error: null,
      lastUpdated: new Date()
    }));
  }, [campaign, getMatchesForCampaign]);
  
  /**
   * Update a candidate's status
   */
  const updateCandidateStatus = useCallback((candidate: Candidate, newStatus: Candidate['status']) => {
    markCandidateStatus(candidate, newStatus);
    
    // Also update our local state
    setCandidates(prev => 
      prev.map(c => c.id === candidate.id ? { ...c, status: newStatus } : c)
    );
  }, [markCandidateStatus]);
  
  // Return the hook's API
  return {
    candidates,
    status,
    comparisonCandidates,
    generateMatches: generateMatchesForCampaign,
    refreshMatches,
    addToComparison,
    removeFromComparison,
    clearComparison,
    updateCandidateStatus
  };
} 