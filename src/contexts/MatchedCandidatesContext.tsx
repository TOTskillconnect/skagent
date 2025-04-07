import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, Campaign, generateCandidatesForCampaign } from '../lib/candidateGenerator';
import { getCandidatesForCampaign, storeCandidatesForCampaign } from '../lib/storageManager';

interface MatchedCandidatesContextType {
  // Matched candidates state
  matchedCandidates: Record<string, Candidate[]>; // campaignId -> candidates[]
  loadingCampaigns: string[]; // array of campaign IDs that are being processed
  
  // Actions
  generateMatches: (campaign: Campaign, count?: number) => Promise<Candidate[]>;
  getMatchesForCampaign: (campaignId: string) => Candidate[];
  markCandidateStatus: (candidate: Candidate, newStatus: Candidate['status']) => void;
  isGeneratingForCampaign: (campaignId: string) => boolean;
  comparisonCandidates: Candidate[];
  addToComparison: (candidate: Candidate) => void;
  removeFromComparison: (candidateId: string) => void;
  clearComparison: () => void;
}

const MatchedCandidatesContext = createContext<MatchedCandidatesContextType | undefined>(undefined);

export const MatchedCandidatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for storing matched candidates by campaign ID
  const [matchedCandidates, setMatchedCandidates] = useState<Record<string, Candidate[]>>({});
  // State for tracking which campaigns are currently being processed
  const [loadingCampaigns, setLoadingCampaigns] = useState<string[]>([]);
  // State for candidate comparison feature
  const [comparisonCandidates, setComparisonCandidates] = useState<Candidate[]>([]);
  
  // Load any cached candidates from storage on initial mount
  useEffect(() => {
    const loadCachedCandidates = async () => {
      try {
        // Check if we have any candidates in localStorage
        const storedCandidates = localStorage.getItem('sk_matched_candidates_v1');
        console.log('Initial load - found stored candidates:', !!storedCandidates);
        
        if (storedCandidates) {
          try {
            // Parse the data directly as we know the format
            const parsedData = JSON.parse(storedCandidates);
            
            // Check if it has the expected structure
            if (parsedData.data && typeof parsedData.data === 'object') {
              console.log('Found valid candidate data with campaigns:', Object.keys(parsedData.data));
              setMatchedCandidates(parsedData.data);
            } else {
              console.log('Data structure is not as expected, initializing empty state');
              setMatchedCandidates({});
            }
          } catch (parseError) {
            console.error('Error parsing stored candidates:', parseError);
            setMatchedCandidates({});
          }
        } else {
          console.log('No stored candidates found, initializing empty state');
          setMatchedCandidates({});
        }
      } catch (error) {
        console.error("Error loading cached candidates:", error);
        setMatchedCandidates({});
      }
    };
    
    loadCachedCandidates();
  }, []);
  
  /**
   * Generate new candidate matches for a specific campaign
   */
  const generateMatches = async (campaign: Campaign, count: number = 5): Promise<Candidate[]> => {
    console.log(`generateMatches called for campaign ${campaign.id} with count ${count}`);
    
    // Mark this campaign as loading
    setLoadingCampaigns(prev => [...prev, campaign.id]);
    
    try {
      // First check if we already have matches for this campaign in storage
      let candidates = getCandidatesForCampaign(campaign.id);
      console.log(`Initial check found ${candidates.length} candidates in storage`);
      
      // If we don't have any matches or the count is different, generate new ones
      if (!candidates || candidates.length < count) {
        console.log(`Generating ${count} new candidates`);
        try {
          candidates = await generateCandidatesForCampaign(campaign, count);
          console.log(`Generated ${candidates.length} candidates successfully`);
        } catch (generationError) {
          console.error('Error in generateCandidatesForCampaign:', generationError);
          throw generationError;
        }
      } else {
        console.log(`Using ${candidates.length} existing candidates`);
      }
      
      // Update the state with the new/loaded candidates
      console.log(`Updating state with ${candidates.length} candidates`);
      setMatchedCandidates(prev => {
        const updated = {
          ...prev,
          [campaign.id]: candidates
        };
        console.log(`State updated, now tracking ${Object.keys(updated).length} campaigns`);
        return updated;
      });
      
      return candidates;
    } catch (error) {
      console.error("Error generating matches:", error);
      return [];
    } finally {
      // Mark this campaign as no longer loading
      setLoadingCampaigns(prev => prev.filter(id => id !== campaign.id));
    }
  };
  
  /**
   * Get existing matches for a campaign
   */
  const getMatchesForCampaign = (campaignId: string): Candidate[] => {
    // First check our current state
    if (matchedCandidates[campaignId]) {
      return matchedCandidates[campaignId];
    }
    
    // If not in state, try to load from storage
    const storedCandidates = getCandidatesForCampaign(campaignId);
    
    if (storedCandidates && storedCandidates.length > 0) {
      // Update our state with these candidates
      setMatchedCandidates(prev => ({
        ...prev,
        [campaignId]: storedCandidates
      }));
      return storedCandidates;
    }
    
    // No candidates found
    return [];
  };
  
  /**
   * Update a candidate's status
   */
  const markCandidateStatus = (candidate: Candidate, newStatus: Candidate['status']) => {
    const { campaignId } = candidate;
    
    // Get the current candidates for this campaign
    const candidates = [...(matchedCandidates[campaignId] || [])];
    
    // Find and update the candidate's status
    const updatedCandidates = candidates.map(c => 
      c.id === candidate.id ? { ...c, status: newStatus } : c
    );
    
    // Update state
    setMatchedCandidates(prev => ({
      ...prev,
      [campaignId]: updatedCandidates
    }));
    
    // Also update in storage
    storeCandidatesForCampaign(campaignId, updatedCandidates);
  };
  
  /**
   * Check if we're currently generating matches for a campaign
   */
  const isGeneratingForCampaign = (campaignId: string): boolean => {
    return loadingCampaigns.includes(campaignId);
  };
  
  /**
   * Add a candidate to comparison
   */
  const addToComparison = (candidate: Candidate) => {
    // Don't add duplicates
    if (comparisonCandidates.some(c => c.id === candidate.id)) {
      return;
    }
    
    // Limit to 4 candidates for comparison
    if (comparisonCandidates.length >= 4) {
      // Remove the oldest candidate
      setComparisonCandidates(prev => [...prev.slice(1), candidate]);
    } else {
      setComparisonCandidates(prev => [...prev, candidate]);
    }
  };
  
  /**
   * Remove a candidate from comparison
   */
  const removeFromComparison = (candidateId: string) => {
    setComparisonCandidates(prev => prev.filter(c => c.id !== candidateId));
  };
  
  /**
   * Clear all candidates from comparison
   */
  const clearComparison = () => {
    setComparisonCandidates([]);
  };
  
  // Provide the context
  return (
    <MatchedCandidatesContext.Provider
      value={{
        matchedCandidates,
        loadingCampaigns,
        generateMatches,
        getMatchesForCampaign,
        markCandidateStatus,
        isGeneratingForCampaign,
        comparisonCandidates,
        addToComparison,
        removeFromComparison,
        clearComparison
      }}
    >
      {children}
    </MatchedCandidatesContext.Provider>
  );
};

// Custom hook for consuming the context
export const useMatchedCandidates = () => {
  const context = useContext(MatchedCandidatesContext);
  
  if (context === undefined) {
    throw new Error('useMatchedCandidates must be used within a MatchedCandidatesProvider');
  }
  
  return context;
}; 