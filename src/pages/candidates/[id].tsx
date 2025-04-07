import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCandidates } from '@/contexts/CandidatesContext';
import Link from 'next/link';
import { Candidate, Experience, Project } from '@/types/candidates';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { getCandidatesForCampaign } from '@/lib/storageManager';

interface Tag {
  text: string;
  type: 'stage' | 'culture' | 'domain';
}

interface Campaign {
  id: string;
  title: string;
  stage?: string;
  industry?: string;
}

// Use this type to handle the union of candidate types from different sources
type AnyCandidate = any;

export default function CandidateDetailPage() {
  const router = useRouter();
  const { id, campaignId } = router.query;
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<AnyCandidate | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  // Use both contexts to try to find the candidate by ID
  const { getCandidateById } = useCandidates();
  const { getMatchesForCampaign } = useMatchedCandidates();

  // Fetch candidate and campaign data
  useEffect(() => {
    if (id && campaignId) {
      setLoading(true);
      let foundCandidate = null;

      try {
        console.log(`Looking for candidate ${id} from campaign ${campaignId}`);
        
        // First check if this candidate is in the matched candidates storage directly
        // This accesses the localStorage directly for generated candidates
        const storedCampaignCandidates = getCandidatesForCampaign(campaignId as string);
        foundCandidate = storedCampaignCandidates.find(c => c.id === id);
        
        if (foundCandidate) {
          console.log('Found candidate in storage:', foundCandidate);
        } else {
          // If not found in storage, try the MatchedCandidatesContext
          const contextCampaignCandidates = getMatchesForCampaign(campaignId as string);
          foundCandidate = contextCampaignCandidates.find(c => c.id === id);
          
          if (foundCandidate) {
            console.log('Found candidate in context:', foundCandidate);
          } else {
            // Last resort - try the regular candidates context
            foundCandidate = getCandidateById(id as string);
            
            if (foundCandidate) {
              console.log('Found candidate in regular context:', foundCandidate);
            } else {
              console.warn('Candidate not found in any source');
            }
          }
        }

        // If found in any source, use the candidate data
        if (foundCandidate) {
          // Use type assertion to avoid TypeScript conflicts
          setCandidate(foundCandidate as AnyCandidate);
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
      }
      
      // Create a mock campaign
      const mockCampaign: Campaign = {
        id: campaignId as string,
        title: 'Current Campaign',
        stage: 'Series A',
        industry: 'Tech'
      };

      // Try to get the campaign from localStorage
      if (typeof window !== 'undefined') {
        try {
          const storedCampaigns = localStorage.getItem('hiringCampaigns');
          if (storedCampaigns) {
            const parsedCampaigns = JSON.parse(storedCampaigns);
            const storedCampaign = parsedCampaigns.find((c: any) => c.id === campaignId);
            if (storedCampaign) {
              console.log('Found campaign in localStorage:', storedCampaign);
              setCampaign(storedCampaign);
            } else {
              setCampaign(mockCampaign);
            }
          } else {
            setCampaign(mockCampaign);
          }
        } catch (err) {
          console.error('Error retrieving campaign from localStorage:', err);
          setCampaign(mockCampaign);
        }
      } else {
        setCampaign(mockCampaign);
      }
      
      setLoading(false);
    }
  }, [id, campaignId, getCandidateById, getMatchesForCampaign]);

  // Generate a "why they fit" paragraph
  const generateWhyTheyFit = () => {
    if (!candidate || !campaign) return '';
    
    // If the candidate already has a context_fit_summary or summary, use that
    if (candidate.context_fit_summary) return candidate.context_fit_summary;
    if (candidate.contextFit) return candidate.contextFit;
    if (candidate.summary) return candidate.summary;
    
    const skills = candidate.matchingSkills?.join(', ') || '';
    const stage = campaign.stage || 'early-stage';
    const industry = campaign.industry || candidate.industry || 'tech';
    const role = candidate.title || 'professional';
    
    let fitReason = '';
    
    // Create a summary based on available data
    fitReason = `Based on your ${stage} needs, ${candidate.name} is a strong match because `;
    
    // Add experience context
    if (candidate.experience && Array.isArray(candidate.experience) && candidate.experience.length > 0) {
      const latestExperience = candidate.experience[0];
      fitReason += `they have ${latestExperience.period?.includes('year') ? latestExperience.period : 'extensive'} experience at ${latestExperience.company}`;
      
      if (candidate.experience_tags && candidate.experience_tags.length > 0) {
        fitReason += `, worked in ${candidate.experience_tags[0].toLowerCase()} environments`;
      }
    } else if (candidate.experience && typeof candidate.experience === 'number') {
      fitReason += `they have ${candidate.experience}+ years of relevant experience in ${industry}`;
    } else {
      fitReason += `they have relevant experience in ${industry}`;
    }
    
    // Add skills context
    if (candidate.matchingSkills && candidate.matchingSkills.length > 0) {
      fitReason += `, and demonstrated expertise in ${candidate.matchingSkills.slice(0, 3).join(', ')}`;
    } else if (candidate.standoutSkills && candidate.standoutSkills.length > 0) {
      fitReason += `, and demonstrated expertise in ${candidate.standoutSkills.slice(0, 3).join(', ')}`;
    }
    
    fitReason += '.';
    
    return fitReason;
  };

  // Handle actions
  const handleArchive = () => {
    window.alert(`Archived candidate: ${candidate?.name}`);
    router.push(`/campaign-matches/${campaignId}`);
  };

  const handleReject = () => {
    window.alert(`Rejected candidate: ${candidate?.name}`);
    router.push(`/campaign-matches/${campaignId}`);
  };

  const handleScheduleInterview = () => {
    setShowInterviewModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-4">Candidate Not Found</h1>
          <p className="text-gray-600 mb-6">The candidate you're looking for doesn't exist or has been removed.</p>
          <Link 
            href={campaignId ? `/campaign-matches/${campaignId}` : "/candidates"} 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Back to Candidates
          </Link>
        </div>
      </div>
    );
  }

  // Calculate match score as a number
  const matchScore = candidate.matchScore 
    ? candidate.matchScore 
    : candidate.match_score 
      ? parseInt(candidate.match_score) 
      : 0;

  // Get match score color
  const getMatchScoreColor = () => {
    if (matchScore >= 85) return 'bg-green-100 text-green-700';
    if (matchScore >= 70) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  // Format verification badges
  const getVerificationBadges = (): string[] => {
    if (candidate.verification_badges && candidate.verification_badges.length > 0) {
      return candidate.verification_badges;
    }
    if (candidate.verifications && candidate.verifications.length > 0) {
      return candidate.verifications;
    }
    return [];
  };

  // Get contextual fit tags
  const getContextualFitTags = (): Tag[] => {
    const tags: Tag[] = [];
    
    // From contextTags object if available
    if (candidate.contextTags) {
      if (candidate.contextTags.stage) tags.push({ text: candidate.contextTags.stage, type: 'stage' });
      if (candidate.contextTags.culture) tags.push({ text: candidate.contextTags.culture, type: 'culture' });
      if (candidate.contextTags.industry) tags.push({ text: candidate.contextTags.industry, type: 'domain' });
    }
    
    // From experience_tags
    if (candidate.experience_tags && candidate.experience_tags.length > 0) {
      candidate.experience_tags.forEach((tag: string) => {
        const lowerTag = tag.toLowerCase();
        let type: 'stage' | 'culture' | 'domain' = 'domain';
        
        if (lowerTag.includes('ready') || lowerTag.includes('stage') || lowerTag.includes('seed') || lowerTag.includes('series')) {
          type = 'stage';
        } else if (lowerTag.includes('team') || lowerTag.includes('async') || lowerTag.includes('remote') || lowerTag.includes('culture')) {
          type = 'culture';
        }
        
        tags.push({ text: tag, type });
      });
    }
    
    return tags;
  };

  const verificationBadges = getVerificationBadges();
  const contextualFitTags = getContextualFitTags();
  const whyTheyFit = generateWhyTheyFit();

  return (
    <>
      <Head>
        <title>{candidate.name} | Candidate Profile</title>
        <meta name="description" content={`Detailed profile for ${candidate.name}`} />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 1. Header Section */}
        <div className="bg-white border-b p-6 flex justify-between items-start rounded-t-xl shadow-sm">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#043444]">{candidate.name}</h1>
            <p className="text-gray-600">{candidate.title || 'Professional'}</p>
            
            <div className="flex items-center mt-2 space-x-2">
              <div className={`rounded-full px-3 py-1 text-sm font-medium ${getMatchScoreColor()}`}>
                {matchScore}% Fit
              </div>
              
              {verificationBadges.slice(0, 3).map((badge: string, index: number) => (
                <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {badge.startsWith('✅') ? badge : `✅ ${badge}`}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleArchive}
              className="text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Archive
            </button>
            <button 
              onClick={handleScheduleInterview}
              className="bg-[#FFB130] text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-[#F9A919] transition-colors"
            >
              Schedule Interview
            </button>
            <button 
              onClick={handleReject}
              className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-b-xl shadow-sm px-6 py-6">
          {/* 2. Hero Overview Box */}
          <div className="bg-[#f9fafb] rounded-xl p-5 text-sm leading-relaxed mb-8">
            <h2 className="font-bold text-[#043444] mb-2">Why {candidate.name.split(' ')[0]} is a Fit</h2>
            <p>
              {whyTheyFit}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {/* 3. Experience Timeline */}
              <div className="border-t pt-6">
                <h2 className="font-bold text-[#043444] mb-4">Experience</h2>
                <div className="text-sm grid gap-6">
                  {candidate.experience && Array.isArray(candidate.experience) && candidate.experience.length > 0 ? (
                    candidate.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-gray-200 pl-4 relative">
                        <div className="absolute w-3 h-3 rounded-full bg-gray-300 -left-[7px] top-1.5"></div>
                        <div className="font-medium text-[#043444]">{exp.role}</div>
                        <div className="text-gray-600">{exp.company}</div>
                        <div className="text-gray-500 text-xs mb-2">{exp.period}</div>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                          {exp.achievements ? (
                            exp.achievements.map((achievement: string, i: number) => (
                              <li key={i}>{achievement}</li>
                            ))
                          ) : (
                            <li>{exp.description}</li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : candidate.experience && typeof candidate.experience === 'number' ? (
                    <p className="text-gray-600">{candidate.experience}+ years of professional experience</p>
                  ) : (
                    <p className="text-gray-500">No experience information available.</p>
                  )}
                </div>
              </div>
              
              {/* 6. Linked Projects */}
              {candidate.projects && candidate.projects.length > 0 && (
                <div className="border-t mt-8 pt-6">
                  <h2 className="font-bold text-[#043444] mb-4">Projects & Portfolio</h2>
                  <div className="text-sm space-y-3">
                    {candidate.projects.map((project: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <Link 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {project.title} ({project.platform})
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {/* 4. Vetted Skills Panel */}
              <div className="bg-white rounded-md border p-4 mb-6">
                <h2 className="font-bold text-[#043444] mb-3">Vetted Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        candidate.matchingSkills?.includes(skill)
                          ? 'bg-green-100 text-green-700'
                          : candidate.standoutSkills?.includes(skill)
                            ? 'bg-primary/10 text-primary-dark font-medium'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {candidate.standoutSkills?.includes(skill) && '⭐ '}
                      {skill}
                      {candidate.matchingSkills?.includes(skill) && 
                        <span className="ml-1 text-green-800">✓</span>}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 5. Contextual Fit Tags */}
              {contextualFitTags.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-[#043444] mb-3">Contextual Fit</h2>
                  <div className="text-xs flex flex-wrap gap-2 text-[#043444]">
                    {contextualFitTags.map((tag: Tag, index: number) => (
                      <span
                        key={index}
                        className={`px-2.5 py-1 rounded-md font-medium ${
                          tag.type === 'stage' 
                            ? 'bg-blue-100 text-blue-700' 
                            : tag.type === 'culture'
                              ? 'bg-teal-100 text-teal-700' 
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 7. Interview Prep Panel */}
              <div className="border-t pt-6 mt-6 flex flex-col gap-2">
                <h2 className="font-bold text-[#043444] mb-3">Interview Prep</h2>
                <div className="bg-[#f9fafb] rounded-md p-4 text-sm">
                  <h3 className="font-medium text-[#043444] mb-2">Suggested Questions</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Tell me about your experience with {candidate.matchingSkills?.[0] || candidate.skills[0]}</li>
                    <li>How have you approached {contextualFitTags[0]?.text || 'challenging projects'} in your previous roles?</li>
                    <li>Can you describe your ideal team structure and work environment?</li>
                  </ul>
                </div>
                
                {/* Comment box for internal team feedback */}
                <div className="mt-4">
                  <h3 className="font-medium text-[#043444] mb-2">Team Feedback</h3>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-600"
                    rows={3}
                    placeholder="Add notes about this candidate..."
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                    <button className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors">
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 