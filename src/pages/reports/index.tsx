import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useReports } from '@/contexts/ReportsContext';
import { useCandidates } from '@/contexts/CandidatesContext';
import Card from '@/components/common/Card';
import PeerReviewModal from '@/components/reports/PeerReviewModal';

// Tag component for the Scout Report card
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
    {children}
  </span>
);

export default function ReportsPage() {
  const router = useRouter();
  const { reports } = useReports();
  const { candidates } = useCandidates();
  const [selectedReport, setSelectedReport] = useState<{ id: string; candidateName: string } | null>(null);

  // Debug information
  console.log('Reports available:', reports);
  console.log('Candidates available:', candidates);
  console.log('Candidate IDs:', Object.keys(candidates));
  
  // Check candidateIds in reports that don't exist in candidates
  const missingCandidateIds = reports
    .map(report => report.candidateId)
    .filter(candidateId => !Object.keys(candidates).includes(candidateId) && 
                          !Object.values(candidates).some(c => c.id === candidateId));
  console.log('Missing candidate IDs:', missingCandidateIds);

  const handlePeerReview = (reportId: string, candidateName: string) => {
    setSelectedReport({ id: reportId, candidateName });
  };

  const handleSubmitReview = (reviewers: string[], message: string) => {
    // Here you would typically make an API call to send the review request
    console.log('Sending review request:', {
      reportId: selectedReport?.id,
      reviewers,
      message
    });
    // Show success notification
  };

  // Generate sample tags for each report in a deterministic way
  const getTagsForReport = (report: any) => {
    const tags = [];
    
    // Base tags on report scores
    if (report.technicalScore > 85) tags.push("Technical Strong");
    if (report.cultureFitScore > 85) tags.push("Team Fit");
    
    // Add startup stage tags
    if (report.overallScore > 85) {
      tags.push("Series A Ready");
    } else if (report.overallScore > 75) {
      tags.push("Seed Stage Fit");
    }
    
    // Add collaboration style tags
    if (report.cultureFitScore > 80) {
      tags.push("Async Team Fit");
    }
    
    // Add industry tags based on report ID (deterministic)
    const industries = ["B2B", "SaaS", "AI/ML", "Fintech", "Healthcare"];
    // Use the last character of the report ID to determine the industry
    // This ensures consistency between server and client rendering
    if (report.id) {
      const lastChar = report.id.slice(-1);
      const charCode = lastChar.charCodeAt(0);
      const industryIndex = charCode % industries.length;
      tags.push(industries[industryIndex]);
    } else {
      // Fallback to a consistent default
      tags.push("SaaS");
    }
    
    return tags.slice(0, 3); // Limit to 3 tags
  };

  return (
    <>
      <Head>
        <title>Reports | SkillConnect</title>
        <meta name="description" content="View candidate assessment reports and insights" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Scout Interview Reports</h1>
          <div className="relative">
            <select className="form-select pr-12 appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700">
              <option value="all">All Campaigns</option>
              <option value="growth">Growth Marketer</option>
              <option value="frontend">Frontend Developer</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <Card elevated className="max-w-2xl mx-auto">
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">No Reports Available</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                When candidates complete assessments, their reports will appear here with AI-generated insights.
              </p>
              <button 
                onClick={() => router.push('/assessments')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Manage Assessments
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report) => {
              // Find candidate using alternate search method
              // First try exact match, then try normalized format
              let candidate = Object.values(candidates).find(c => c.id === report.candidateId);
              
              // If not found, try to find by prefix - some IDs might be formatted differently
              if (!candidate) {
                // Special handling for cand/c prefix variation
                const normalizedId = report.candidateId.startsWith('cand') 
                  ? report.candidateId.replace('cand', 'c')
                  : report.candidateId;
                
                candidate = Object.values(candidates).find(c => 
                  c.id === normalizedId || 
                  `cand${c.id.substring(1)}` === report.candidateId
                );
              }
              
              if (!candidate) {
                console.error(`Candidate ${report.candidateId} not found for report ${report.id}`);
                // Use a fallback candidate
                candidate = {
                  id: report.candidateId,
                  name: `Candidate ${report.candidateId}`,
                  title: "Unknown Role",
                  skills: []
                };
              }

              // Generate skill match and context fit scores
              const skillMatchScore = report.technicalScore;
              const contextFitScore = Math.round((report.cultureFitScore * 0.6) + (report.problemSolvingScore * 0.4));
              
              // Get mock tags for the report
              const tags = getTagsForReport(report);

              return (
                <Card 
                  key={report.id}
                  elevated
                  className="transition-all duration-200 hover:translate-y-[-2px]"
                >
                  {/* Header with candidate info */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.title}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-blue-600">{report.overallScore}% Match Score</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-gray-500">ID: {report.campaignId}</span>
                    </div>
                  </div>
                  
                  {/* Tags section */}
                  <div className="border-t border-b border-gray-100 py-3 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress bars */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Skill Match</span>
                        <span className="ml-auto text-sm font-medium text-gray-700">{skillMatchScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div className="bg-[#1AD3BB] h-2 rounded" style={{ width: `${skillMatchScore}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Context Fit</span>
                        <span className="ml-auto text-sm font-medium text-gray-700">{contextFitScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div className="bg-[#fbb130] h-2 rounded" style={{ width: `${contextFitScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Strengths and Areas for Discussion */}
                  <div className="mb-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Key Strengths
                      </h4>
                      <ul className="space-y-1">
                        {report.strengths.slice(0, 2).map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 flex">
                            <span className="text-green-500 mr-1">✅</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="w-4 h-4 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Areas for Discussion
                      </h4>
                      <ul className="space-y-1">
                        {report.risks.slice(0, 2).map((risk, index) => (
                          <li key={index} className="text-sm text-gray-700 flex">
                            <span className="text-blue-500 mr-1">ℹ️</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="border-t border-gray-100 pt-4 flex justify-end">
                    <button 
                      onClick={() => router.push(`/reports/${report.id}/detailed`)}
                      className="bg-[#000] text-white text-sm px-4 py-2 rounded hover:bg-opacity-80"
                    >
                      Detailed Report
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {selectedReport && (
        <PeerReviewModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          onSubmit={handleSubmitReview}
          candidateName={selectedReport.candidateName}
        />
      )}
    </>
  );
} 