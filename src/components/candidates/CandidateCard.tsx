import React, { useState } from 'react';
import { Candidate } from '@/types/candidates';
import ScheduleInterviewModal from '@/components/interviews/ScheduleInterviewModal';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CampaignInfo {
  id: string;
  title: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  campaign?: CampaignInfo | string; // Can accept just a campaign ID string
  onShortlist?: (id: string) => void;
  isShortlisted?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, campaign, onShortlist, isShortlisted }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get campaign ID regardless of whether campaign is an object or a string
  const campaignId = typeof campaign === 'string' ? campaign : campaign?.id || candidate.campaignId;

  // Calculate match score as a number
  const matchScore = candidate.matchScore 
    ? candidate.matchScore 
    : candidate.match_score 
      ? parseInt(candidate.match_score) 
      : 0;

  // Handle viewing the candidate's profile
  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Navigate to the candidate profile
    router.push({
      pathname: '/candidates/[id]',
      query: { 
        id: candidate.id,
        campaignId: campaignId
      }
    });
  };

  // Handle scheduling an interview for the candidate
  const handleScheduleInterview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Handle closing the schedule interview modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle submitting the interview schedule
  const handleScheduleSubmit = (interviewData: any) => {
    console.log('Scheduling interview for candidate:', candidate.name, interviewData);
    window.alert(`Interview scheduled for ${candidate.name}`);
    setIsModalOpen(false);
  };
  
  // Handle shortlisting if the function is provided
  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShortlist) {
      onShortlist(candidate.id);
    }
  };

  // Helper function to determine tag type
  const getTagType = (tag: string): 'stage' | 'culture' | 'domain' => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('ready') || lowerTag.includes('stage') || lowerTag.includes('seed') || lowerTag.includes('series')) {
      return 'stage';
    } else if (lowerTag.includes('team') || lowerTag.includes('async') || lowerTag.includes('remote') || lowerTag.includes('culture')) {
      return 'culture';
    } else {
      return 'domain';
    }
  };

  // Get appropriate color for match score
  const getMatchScoreColor = () => {
    if (matchScore >= 85) return 'bg-green-100 text-green-700';
    if (matchScore >= 70) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  // Format context tags from candidate
  const getContextTags = () => {
    // Define the tag type
    type ContextTag = {
      text: string;
      type: 'stage' | 'culture' | 'domain';
    };

    // From contextTags object if available
    if (candidate.contextTags) {
      const tags: ContextTag[] = [];
      if (candidate.contextTags.stage) tags.push({ text: candidate.contextTags.stage, type: 'stage' as const });
      if (candidate.contextTags.culture) tags.push({ text: candidate.contextTags.culture, type: 'culture' as const });
      if (candidate.contextTags.industry) tags.push({ text: candidate.contextTags.industry, type: 'domain' as const });
      return tags;
    }
    
    // Otherwise try to extract from experience_tags or other fields
    const tags: ContextTag[] = [];
    if (candidate.experience_tags && candidate.experience_tags.length > 0) {
      // Try to intelligently categorize each tag
      candidate.experience_tags.slice(0, 3).forEach(tag => {
        tags.push({ text: tag, type: getTagType(tag) });
      });
    }
    
    return tags;
  };

  // Get verification badges
  const getVerificationBadges = () => {
    // From verification_badges or verifications
    if (candidate.verification_badges && candidate.verification_badges.length > 0) {
      return candidate.verification_badges;
    }
    if (candidate.verifications && candidate.verifications.length > 0) {
      return candidate.verifications;
    }
    // Fallback
    return [];
  };

  // Get projects
  const getProjects = () => {
    if (candidate.projects && candidate.projects.length > 0) {
      return candidate.projects;
    }
    return [];
  };

  // Get summary
  const getSummary = () => {
    if (candidate.summary) return candidate.summary;
    if (candidate.contextFit) return candidate.contextFit;
    if (candidate.context_fit_summary) return candidate.context_fit_summary;
    return '';
  };

  const contextTags = getContextTags();
  const verificationBadges = getVerificationBadges();
  const projects = getProjects();
  const summary = getSummary();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-6">
      {/* Top Bar (Name, Role, Match Score) */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#043444] text-lg">{candidate.name}</h3>
          <p className="text-gray-600">{candidate.title || 'Professional'}</p>
        </div>
        
        <div className={`rounded-full h-12 w-12 flex items-center justify-center text-sm font-bold ${getMatchScoreColor()}`}>
          {matchScore ? `${matchScore}%` : 'N/A'}
        </div>
      </div>
      
      {/* Summary Section */}
      {summary && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm">{summary}</p>
        </div>
      )}
      
      {/* Context Fit Tags */}
      {contextTags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {contextTags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-2.5 py-1 rounded-md font-medium ${
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
      
      {/* Pre-Vetted Skills */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-medium">Pre-Vetted Skills</div>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.slice(0, 4).map((skill, index) => (
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
              {skill}
              {candidate.matchingSkills?.includes(skill) && 
                <span className="ml-1 text-green-800">✓</span>}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              +{candidate.skills.length - 4}
            </span>
          )}
        </div>
      </div>
      
      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 font-medium">Projects</div>
          <div className="space-y-1.5">
            {projects.slice(0, 2).map((project, index) => (
              <div key={index} className="flex items-center">
                <Link 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center"
                >
                  <span className="mr-1.5">•</span>
                  {project.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Verification Status */}
      {verificationBadges.length > 0 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {verificationBadges.slice(0, 3).map((badge, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {badge.startsWith('✅') ? badge : `✅ ${badge}`}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={handleViewProfile}
          className="text-sm text-primary hover:underline font-medium"
        >
          View Profile
        </button>
        
        <button
          onClick={handleScheduleInterview}
          className="bg-[#FFB130] text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-[#F9A919] transition-colors"
        >
          Schedule Interview
        </button>
      </div>

      {/* Interview Modal */}
      {isModalOpen && (
        <ScheduleInterviewModal
          candidate={candidate}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSchedule={handleScheduleSubmit}
        />
      )}
    </div>
  );
};

export default CandidateCard; 