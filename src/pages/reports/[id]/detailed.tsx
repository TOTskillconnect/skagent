import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useReports } from '@/contexts/ReportsContext';
import { useCandidates } from '@/contexts/CandidatesContext';
import Card from '@/components/common/Card';

// Icons for confidence meter (flames)
const FlameIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'text-amber-500' : 'text-gray-300'}`}
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
  </svg>
);

// Confidence meter component
const ConfidenceMeter = ({ level }: { level: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <FlameIcon key={i} filled={i < level} />
      ))}
    </div>
  );
};

// Progress bar component for fit meters
const ProgressBar = ({ percentage, label, color = 'primary' }: { percentage: number; label: string; color?: string }) => {
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getColorClass()}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Tag component
const Tag = ({ children, color = "blue" }: { children: React.ReactNode; color?: string }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    gray: "bg-gray-100 text-gray-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };
  
  return (
    <span className={`${colorClasses[color as keyof typeof colorClasses]} px-2.5 py-1 text-xs font-medium rounded-full`}>
      {children}
    </span>
  );
};

// Verdict badge component
const VerdictBadge = ({ verdict }: { verdict: 'Recommended' | 'On Hold' | 'Reject' }) => {
  const getBadgeColor = () => {
    switch (verdict) {
      case 'Recommended': return 'bg-green-100 text-green-800 border-green-200';
      case 'On Hold': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Reject': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`${getBadgeColor()} px-3 py-1.5 text-sm font-medium rounded-md border`}>
      {verdict}
    </span>
  );
};

// Section Header component
const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{children}</h2>
);

// Insight Section component
const InsightSection = ({ 
  title, 
  scoutSummary, 
  teamNotes = "", 
  confidenceLevel, 
  suggestedFollowUp,
  redFlag
}: { 
  title: string; 
  scoutSummary: string; 
  teamNotes?: string; 
  confidenceLevel: number;
  suggestedFollowUp?: string;
  redFlag?: string;
}) => (
  <div className="mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
    <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
    
    <div className="mb-3">
      <div className="text-sm font-medium text-gray-500 mb-1">Scout Says:</div>
      <p className="text-gray-800">"{scoutSummary}"</p>
    </div>

    {teamNotes && (
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-500 mb-1">Team Notes:</div>
        <p className="text-gray-600 italic">{teamNotes}</p>
      </div>
    )}

    <div className="flex items-center justify-between mt-3">
      <div>
        <div className="text-sm font-medium text-gray-500 mb-1">Confidence:</div>
        <ConfidenceMeter level={confidenceLevel} />
      </div>
      
      {suggestedFollowUp && (
        <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
          <span className="font-medium">Suggestion:</span> {suggestedFollowUp}
        </div>
      )}
    </div>
    
    {redFlag && (
      <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-2 text-sm text-red-700">
        <span className="font-medium">Red flag:</span> {redFlag}
      </div>
    )}
  </div>
);

export default function DetailedReport() {
  const router = useRouter();
  const { id } = router.query;
  const { reports } = useReports();
  const { candidates } = useCandidates();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'Hire Now' | 'Still Considering' | 'Not a Fit'>('Still Considering');

  // Find the specific report by ID
  const report = reports.find(r => r.id === id);
  
  // Find candidate
  let candidate = report ? Object.values(candidates).find(c => c.id === report.candidateId) : undefined;
  
  // If not found, try alternate ID formats or create fallback
  if (report && !candidate) {
    const normalizedId = report.candidateId.startsWith('cand') 
      ? report.candidateId.replace('cand', 'c')
      : report.candidateId;
    
    candidate = Object.values(candidates).find(c => 
      c.id === normalizedId || 
      `cand${c.id.substring(1)}` === report.candidateId
    );
    
    if (!candidate) {
      candidate = {
        id: report.candidateId,
        name: `Candidate ${report.candidateId}`,
        title: "Unknown Role",
        skills: []
      };
    }
  }

  if (!report || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Report Not Found</h1>
            <p className="text-gray-500 mb-6">
              {!report ? "The requested report could not be found." : "The candidate associated with this report could not be found."}
            </p>
            <button
              onClick={() => router.push('/reports')}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-black"
            >
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate verdict based on report score
  const getVerdict = () => {
    if (report.overallScore >= 85) return 'Recommended';
    if (report.overallScore >= 70) return 'On Hold';
    return 'Reject';
  };

  // Get interview role based on candidate title or fallback
  const interviewRole = candidate.title || "Software Developer";

  // Convert existing scores to fit scores
  const stageFitScore = Math.round((report.cultureFitScore * 0.7 + report.technicalScore * 0.3));
  const skillMatchScore = Math.round(report.technicalScore);
  const workStyleScore = Math.round((report.problemSolvingScore * 0.6 + report.cultureFitScore * 0.4));
  const cultureFitScore = Math.round(report.cultureFitScore);

  // Handle decision button clicks
  const handleDecisionClick = (status: 'Hire Now' | 'Still Considering' | 'Not a Fit') => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  // Close modal and process decision
  const confirmDecision = () => {
    // In a real app, this would update the report status
    window.alert(`Decision recorded: ${selectedStatus}`);
    setShowStatusModal(false);
  };

  return (
    <>
      <Head>
        <title>Scout Interview Report - {candidate.name}</title>
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => router.push('/reports')}
              className="flex items-center text-gray-600 hover:text-primary mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Reports</span>
            </button>
          </div>

          {/* Top Summary Panel (Snapshot Decision Bar) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{candidate.name}</h1>
                <p className="text-gray-600">{interviewRole}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md font-medium text-sm">
                  {report.overallScore}% Match Score
                </div>
                <VerdictBadge verdict={getVerdict()} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag color="blue">Series A Ready</Tag>
              <Tag color="green">Async Team Fit</Tag>
              <Tag color="indigo">Technical Leadership</Tag>
              <Tag color="amber">Fast Learner</Tag>
            </div>
            
            <div className="space-y-3">
              <ProgressBar percentage={stageFitScore} label="Stage Fit" />
              <ProgressBar percentage={skillMatchScore} label="Skill Match" />
              <ProgressBar percentage={workStyleScore} label="Work Style" />
              <ProgressBar percentage={cultureFitScore} label="Culture Fit" />
            </div>
          </div>

          {/* Qualitative Insights by Category */}
          <div className="mb-8">
            <SectionHeader>Qualitative Insights</SectionHeader>
            
            <InsightSection 
              title="Technical Competence"
              scoutSummary="The candidate demonstrated strong frontend reasoning and scaling strategy. Comfortable refactoring legacy systems and working with modular architecture."
              confidenceLevel={4}
              suggestedFollowUp="Live coding test OR system design deep dive"
            />
            
            <InsightSection 
              title="Communication & Collaboration"
              scoutSummary="Communicates clearly and proactively asked clarifying questions. Comfortable working async and collaborating with product and design."
              confidenceLevel={5}
            />
            
            <InsightSection 
              title="Strategic Thinking"
              scoutSummary="Understands trade-offs between speed and scale. Tied technical decisions back to user needs and team velocity."
              confidenceLevel={3}
            />
            
            <InsightSection 
              title="Role Context Fit"
              scoutSummary="Has prior experience launching MVPs and scaling to Series A. Described relevant project involving cross-functional leadership."
              confidenceLevel={4}
              suggestedFollowUp="Can Own Roadmap"
            />
            
            <InsightSection 
              title="Culture & Values Alignment"
              scoutSummary="Values speed, autonomy, and learning—mirrors startup ethos. Expressed comfort working without strict structure."
              confidenceLevel={5}
              redFlag="Prefers minimal feedback cycles (may need alignment on check-ins)"
            />
          </div>

          {/* Candidate Quotables */}
          <div className="mb-8">
            <SectionHeader>Candidate Quotables</SectionHeader>
            
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <div className="space-y-4">
                <div className="pl-4 border-l-4 border-blue-500 py-2">
                  <p className="text-gray-800 italic">"My superpower is simplifying complexity. I love translating big messy problems into focused sprints."</p>
                </div>
                
                <div className="pl-4 border-l-4 border-blue-500 py-2">
                  <p className="text-gray-800 italic">"I joined an 8-person team and helped it scale to 40 while keeping shipping speed intact."</p>
                </div>
                
                <div className="pl-4 border-l-4 border-blue-500 py-2">
                  <p className="text-gray-800 italic">"I believe in failing fast and learning faster. My best projects started with rapid prototypes."</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Scout Thinks */}
          <div className="mb-8">
            <SectionHeader>What Scout Thinks</SectionHeader>
            
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              {report.overallScore >= 85 ? (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-700">Recommended to Hire</h3>
                  </div>
                  <p className="text-gray-700">
                    Candidate demonstrated strong alignment with your current needs and company stage. Scored 90% on async collaboration fit and technical problem-solving.
                  </p>
                </div>
              ) : report.overallScore >= 70 ? (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-amber-700">Worth Considering</h3>
                  </div>
                  <p className="text-gray-700">
                    Good skillset and values alignment, but flagged slight mismatch in autonomy expectations. Recommend internal discussion.
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-700">Not a Fit</h3>
                  </div>
                  <p className="text-gray-700">
                    Gaps in contextual experience or core priorities (e.g., async readiness, early-stage exposure). Not aligned with current role needs.
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors in This Assessment:</h4>
                <ul className="text-sm text-gray-600 space-y-1 pl-4 list-disc">
                  <li>Technical skills alignment with current tech stack</li>
                  <li>Startup experience relevant to company stage</li>
                  <li>Cultural alignment with company values</li>
                  <li>Communication style and team collaboration approach</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Final Rating & Team Input */}
          <div className="mb-8">
            <SectionHeader>Final Rating & Team Input</SectionHeader>
            
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <svg 
                        key={rating} 
                        className={`w-8 h-8 ${rating <= 4 ? 'text-amber-500' : 'text-gray-300'} cursor-pointer`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-lg font-medium text-gray-700 ml-2">4.0</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes from Interviewer
                  </label>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                    Strong technical skills and cultural alignment. Would be a good addition to the team, but might need mentoring on some aspects of our stack.
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDecisionClick('Hire Now')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
                  >
                    Hire Now
                  </button>
                  <button 
                    onClick={() => handleDecisionClick('Still Considering')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
                  >
                    Still Considering
                  </button>
                  <button 
                    onClick={() => handleDecisionClick('Not a Fit')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
                  >
                    Not a Fit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Decision</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to mark this candidate as "<span className="font-medium">{selectedStatus}</span>"?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDecision}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 