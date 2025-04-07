import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import CandidateCard from '@/components/candidates/CandidateCard';
import { useCandidates } from '@/contexts/CandidatesContext';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { Candidate } from '@/types/candidates';
import { mockCampaigns, Campaign } from '@/data/mockCampaigns';
import ScheduleInterviewModal from '@/components/interviews/ScheduleInterviewModal';
import { getCandidatesByCampaign } from '@/services/candidateService';

// Extended candidate interface with matchingSkills
interface CandidateWithMatching extends Candidate {
  matchingSkills?: string[];
}

export default function CampaignMatchesPage() {
  const router = useRouter();
  const { id: campaignId } = router.query;
  const { candidates: candidatesRecord } = useCandidates();
  const { getMatchesForCampaign } = useMatchedCandidates();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [campaignCandidates, setCampaignCandidates] = useState<Candidate[]>([]);

  // Convert candidates record to array
  const candidatesArray = useMemo(() => {
    return Object.values(candidatesRecord || {});
  }, [candidatesRecord]);

  // Get campaign data
  const campaign = useMemo(() => {
    if (!campaignId) return null;
    
    // First try to get the campaign from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const storedCampaigns = localStorage.getItem('hiringCampaigns');
        if (storedCampaigns) {
          const parsedCampaigns = JSON.parse(storedCampaigns);
          const storedCampaign = parsedCampaigns.find((c: any) => c.id === campaignId);
          if (storedCampaign) {
            console.log('Found campaign in localStorage:', storedCampaign);
            return storedCampaign;
          }
        }
      } catch (err) {
        console.error('Error retrieving campaign from localStorage:', err);
      }
    }
    
    // Fall back to mock campaigns if not found in localStorage
    console.log('Looking for campaign in mockCampaigns');
    return mockCampaigns.find((c: Campaign) => c.id === campaignId);
  }, [campaignId]);

  // Load candidates for this campaign
  useEffect(() => {
    if (router.isReady && campaignId) {
      if (typeof campaignId !== 'string') {
        setError('Invalid campaign ID');
        setLoading(false);
        return;
      }

      try {
        console.log(`Loading candidates for campaign: ${campaignId as string}`);
        
        // Check if campaign exists
        if (!campaign) {
          console.error(`Campaign with ID ${campaignId as string} not found`);
          setLoading(false);
          return;
        }
        
        // Try to get candidates from the legacy service
        const serviceCandidates = getCandidatesByCampaign(campaignId as string);
        
        if (serviceCandidates && serviceCandidates.length > 0) {
          // We found candidates with this campaign ID in the legacy service
          console.log(`Found ${serviceCandidates.length} legacy candidates`);
          setCampaignCandidates(serviceCandidates);
          setLoading(false);
        } else {
          // If no candidates found, use the enhanced candidate generator
          console.log("No candidates found in legacy service, using enhanced candidate generator");
          
          // Import the generateCandidatesForCampaign function locally to avoid circular dependencies
          import('@/lib/candidateGenerator').then(({ generateCandidatesForCampaign }) => {
            // Use the campaign object to generate candidates
            generateCandidatesForCampaign(campaign, 6).then(generatedCandidates => {
              console.log(`Generated ${generatedCandidates.length} candidates using the enhanced generator`);
              
              // Create a proper candidate object
              const typedCandidates = generatedCandidates.map(c => {
                const candidate = {
                  id: c.id,
                  name: c.name,
                  title: c.title || '',
                  match_score: c.matchScore.toString(),
                  skills: c.skills || [],
                  standoutSkills: c.standoutSkills,
                  experience_tags: c.experience ? [`${c.experience}+ years`] : [],
                  context_fit_summary: c.contextFit || c.summary,
                  verification_badges: c.verifications,
                  campaignId: c.campaignId
                } as Candidate;

                // Safely add matching skills - will be available at runtime
                try {
                  // @ts-ignore - matchingSkills will be used by the CandidateCard component
                  candidate.matchingSkills = c.matchingSkills || [];
                } catch (e) {
                  console.log('Unable to add matching skills property');
                }
                
                return candidate;
              });
              
              setCampaignCandidates(typedCandidates);
              setLoading(false);
            }).catch(error => {
              console.error("Error generating candidates:", error);
              // Fall back to the existing skill matching logic
              console.log("Falling back to basic skill matching algorithm");
              generateFallbackCandidates();
            });
          });
          return; // Return early since we're handling loading in the Promise
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading campaign candidates:", err);
        setError('Failed to load candidates');
        setLoading(false);
      }
    }
  }, [router.isReady, campaignId, candidatesArray, campaign]);

  // Separate function for the fallback candidate generation logic
  function generateFallbackCandidates() {
    // Extract campaign skills requirements
    const campaignSkills = campaign.requiredSkills || [];
    console.log(`Campaign skills: ${campaignSkills.join(', ')}`);
    
    // Create a seed from campaignId for consistent pseudo-randomness
    const numericSeed = (campaignId as string).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Score and sort candidates based on skill matching
    const scoredCandidates = candidatesArray.map(candidate => {
      // Calculate a match score based on overlapping skills
      const candidateSkills = candidate.skills || [];
      const matchingSkills = campaignSkills.filter((skill: string) => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      // Calculate match percentage (skills match / total required skills)
      const matchScore = campaignSkills.length > 0 
        ? Math.round((matchingSkills.length / campaignSkills.length) * 100) 
        : 50; // Default score if no skills specified
        
      // Add some deterministic variance based on candidate ID + campaign ID
      const idSeed = (candidate.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const variance = ((idSeed + numericSeed) % 20) - 10; // -10 to +10 variance
      
      return {
        ...candidate,
        matchScore: Math.min(100, Math.max(0, matchScore + variance)), // Keep between 0-100
        matchingSkills
      } as Candidate;
    });
    
    // Sort by match score (highest first)
    const sortedCandidates = scoredCandidates.sort((a, b) => 
      (b.matchScore || 0) - (a.matchScore || 0)
    );
    
    // Take top candidates (4-7 based on campaign ID for consistency)
    const candidateCount = 4 + (numericSeed % 4); // 4-7 candidates
    const topCandidates = sortedCandidates.slice(0, candidateCount);
    
    console.log(`Generated ${topCandidates.length} optimized candidates with match scores`);
    setCampaignCandidates(topCandidates);
    setLoading(false);
  }

  // Handle opening the schedule modal
  const openScheduleModal = () => {
    setIsScheduleModalOpen(true);
  };

  // Handle closing the schedule modal
  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  // Handle schedule interview submission
  const handleScheduleInterviews = (interviewData: any) => {
    console.log(`Scheduling interviews for ${interviewData.candidates?.length || 0} candidates`);
    window.alert(`Interview requests sent to ${interviewData.candidates?.length || 0} candidates`);
    setIsScheduleModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
        <Link href="/dashboard" className="mt-4 text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Campaign Not Found</h1>
        <p className="text-gray-600">The campaign you're looking for doesn't exist.</p>
        <Link href="/dashboard" className="mt-4 text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{campaign.title} Matches | SKILLCONNECT</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.title} Matches</h1>
            <p className="text-gray-600">
              {campaignCandidates.length} candidates matched to this campaign
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={openScheduleModal}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-200 hover:text-black transition-all duration-200"
            >
              Schedule Campaign Interviews
            </button>
          </div>
        </div>

        {campaignCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignCandidates.map((candidate: Candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate}
                campaign={campaignId as string}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No candidates found</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              There are no candidates matched to this campaign yet. Start by creating a hiring campaign.
            </p>
            <Link href="/wizard" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-gray-200 hover:text-black transition-all duration-200">
              Create a New Campaign
            </Link>
          </div>
        )}
      </div>

      {/* Schedule Campaign Interviews Modal */}
      {isScheduleModalOpen && campaign && (
        <ScheduleInterviewModal
          campaign={campaign}
          isOpen={isScheduleModalOpen}
          onClose={closeScheduleModal}
          onSchedule={handleScheduleInterviews}
        />
      )}
    </>
  );
} 