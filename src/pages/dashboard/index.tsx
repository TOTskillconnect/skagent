import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCandidates } from '@/contexts/CandidatesContext';
import { useAssessments } from '@/contexts/AssessmentsContext';
import { useReports } from '@/contexts/ReportsContext';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { useSavedSearch, SavedSearch } from '@/contexts/SavedSearchContext';
import { useRouter } from 'next/router';
import SavedSearchCard from '@/components/dashboard/SavedSearchCard';
import ScheduleInterviewModal from '@/components/interviews/ScheduleInterviewModal';

interface HiringCampaign {
  id: string;
  title: string;
  type: string;
  dateCreated: string;
  status: string;
  jobType?: string;
  businessStage?: string;
  candidateCount?: string;
  [key: string]: any;
}

interface ActivityItem {
  type: string;
  title: string;
  date: Date;
  icon: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { candidates } = useCandidates();
  const { assessments } = useAssessments();
  const { reports } = useReports();
  const { matchedCandidates, getMatchesForCampaign } = useMatchedCandidates();
  const { savedSearches, deleteSavedSearch } = useSavedSearch();
  const [campaigns, setCampaigns] = useState<HiringCampaign[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  // Load campaigns from localStorage on client-side
  useEffect(() => {
    const storedCampaigns = localStorage.getItem('hiringCampaigns');
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    }
  }, []);
  
  // Get matched candidate count for each campaign
  const getCampaignWithCandidateCount = (campaign: HiringCampaign) => {
    const matchedCount = getMatchesForCampaign(campaign.id).length;
    
    // If we have matches from the new system, use that count
    if (matchedCount > 0) {
      return {
        ...campaign,
        actualCandidateCount: matchedCount
      };
    }
    
    // Otherwise fall back to the stored count or legacy system
    const legacyCandidates = Array.isArray(candidates) 
      ? candidates.filter((c: any) => c.campaignId === campaign.id).length
      : 0;
      
    return {
      ...campaign,
      actualCandidateCount: legacyCandidates || parseInt(campaign.candidateCount || '0') || 0
    };
  };
  
  // Campaigns with candidate counts
  const campaignsWithCounts = campaigns.map(getCampaignWithCandidateCount);
  
  // Recent activity - combine data from various sources
  const recentActivity: ActivityItem[] = [
    ...campaigns.map(c => ({
      type: 'campaign',
      title: `New hiring campaign created: ${c.title}`,
      date: new Date(c.dateCreated),
      icon: 'briefcase'
    })),
    // Add matched candidate activity if available
    ...Object.entries(matchedCandidates).flatMap(([campaignId, candidates]) => {
      const campaign = campaigns.find(c => c.id === campaignId);
      return candidates.slice(0, 2).map(candidate => ({
        type: 'candidate',
        title: `New match for ${campaign?.title || 'campaign'}: ${candidate.name}`,
        date: new Date(Date.now() - Math.random() * 86400000 * 2), // Random time in last 2 days
        icon: 'user'
      }));
    }),
    // Fallback to legacy candidates if needed
    ...(Object.keys(matchedCandidates).length === 0 && Array.isArray(candidates) 
      ? candidates.slice(0, 3).map((c: any) => ({
        type: 'candidate',
        title: `New candidate match: ${c.name}`,
        date: new Date(Date.now() - Math.random() * 86400000 * 3),
        icon: 'user'
      })) 
      : []
    ),
    ...(Array.isArray(assessments) ? assessments.slice(0, 2).map((a: any) => ({
      type: 'assessment',
      title: `Assessment completed: ${a.name}`,
      date: new Date(Date.now() - Math.random() * 86400000 * 5),
      icon: 'document-text'
    })) : [])
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  // Get counts for display
  // Combine matched candidates with legacy candidates for total count
  const matchedCandidatesCount = Object.values(matchedCandidates).reduce(
    (sum, candidates) => sum + candidates.length, 0
  );
  const legacyCandidatesCount = Array.isArray(candidates) ? candidates.length : 0;
  const totalCandidatesCount = matchedCandidatesCount + legacyCandidatesCount;
  
  const activeCandidates = Math.floor(totalCandidatesCount * 0.6);
  const assessmentsCount = Array.isArray(assessments) ? assessments.length : 0;
  const reportsCount = Array.isArray(reports) ? reports.length : 0;

  // Handle applying a saved search
  const applySearch = (search: SavedSearch) => {
    // Navigate to the wizard with saved search parameters
    router.push({
      pathname: '/wizard',
      query: { savedSearchId: search.id }
    });
  };

  const openScheduleModal = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedCampaignId(null);
  };

  const handleScheduleInterviews = (interviewData: any) => {
    // In a real app, this would send the interview requests to the API
    window.alert(`Interview requests sent to ${interviewData.candidates.length} candidates. Mode: ${interviewData.mode}`);
    closeScheduleModal();
  };
  
  // Find the selected campaign object
  const selectedCampaign = campaignsWithCounts.find(campaign => campaign.id === selectedCampaignId);

  return (
    <>
      <Head>
        <title>{`Dashboard | SkillConnect`}</title>
        <meta name="description" content="Dashboard for your talent matching" />
      </Head>

      <div className="space-y-8 bg-gray-50 py-6 px-4 -mt-6 -mx-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-500">Total Candidates</h3>
                  <p className="text-2xl font-bold mt-2 text-gray-900">{totalCandidatesCount}</p>
                </div>
                <div className="bg-teal-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600">
                  {matchedCandidatesCount > 0 && (
                    <span className="text-primary font-semibold">+{matchedCandidatesCount} new matches</span>
                  )}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-500">Active Candidates</h3>
                  <p className="text-2xl font-bold mt-2 text-gray-900">{activeCandidates}</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600">
                  <span className="text-primary font-bold">+5%</span> in engagement
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-500">Pending Assessments</h3>
                  <p className="text-2xl font-bold mt-2 text-gray-900">{assessmentsCount}</p>
                </div>
                <div className="bg-indigo-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600">
                  <span className="text-primary font-bold">3</span> due this week
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-500">Reports Generated</h3>
                  <p className="text-2xl font-bold mt-2 text-gray-900">{reportsCount}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600">
                  <span className="text-primary font-bold">+2</span> new this week
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Campaigns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Active Hiring Campaigns</h2>
                {campaignsWithCounts.length > 0 ? (
                  <div className="space-y-4">
                    {campaignsWithCounts.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col md:flex-row justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-100 transition-all duration-200">
                        <div className="mb-3 md:mb-0">
                          <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                          <p className="text-sm text-gray-500">
                            {campaign.dateCreated && new Date(campaign.dateCreated).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="bg-teal-500 text-white text-xs py-1 px-3 rounded-full font-medium">
                            {campaign.actualCandidateCount > 0
                              ? `${campaign.actualCandidateCount} candidates`
                              : campaign.candidateCount || '5+ candidates'
                            }
                          </div>
                          <div className="bg-indigo-500/20 text-indigo-700 text-xs py-1 px-3 rounded-full font-medium">
                            {campaign.status}
                          </div>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Link 
                              href={`/campaign-matches/${campaign.id}`} 
                              className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-200 hover:text-black hover:border-gray-300 transition-all duration-200 text-sm py-1.5 px-3 rounded-md font-medium"
                            >
                              View
                            </Link>
                            <button 
                              onClick={() => openScheduleModal(campaign.id)}
                              className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-200 hover:text-black hover:border-gray-300 transition-all duration-200 text-sm py-1.5 px-3 rounded-md font-medium"
                            >
                              Schedule Interview
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg className="w-14 h-14 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active campaigns</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first hiring campaign</p>
                    <Link href="/wizard" className="bg-black hover:bg-gray-200 hover:text-black transition-all duration-200 text-white font-medium py-2 px-4 rounded-md inline-flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Campaign
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-5">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-2 rounded-lg text-white ${
                          activity.icon === 'briefcase' ? 'bg-emerald-500' : 
                          activity.icon === 'user' ? 'bg-purple-500' : 
                          'bg-indigo-500'
                        }`}>
                          {activity.icon === 'briefcase' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                          {activity.icon === 'user' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {activity.icon === 'document-text' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600 mt-0.5">{activity.title}</p>
                          <span className="text-xs text-gray-500 block mt-1">{activity.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Searches Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Saved Searches</h2>
              <Link href="/wizard" className="text-black hover:underline font-medium text-sm">
                Create New Search
              </Link>
            </div>
            
            {savedSearches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSearches.map((search) => (
                  <SavedSearchCard 
                    key={search.id}
                    search={search}
                    onDelete={deleteSavedSearch}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg className="w-14 h-14 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved searches</h3>
                <p className="text-gray-500 mb-4">Save your search criteria to quickly access them again</p>
                <Link href="/wizard" className="bg-black hover:bg-gray-200 hover:text-black transition-all duration-200 text-white font-medium py-2 px-4 rounded-md inline-flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Search
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && selectedCampaign && (
        <ScheduleInterviewModal 
          campaign={selectedCampaign}
          isOpen={isScheduleModalOpen}
          onClose={closeScheduleModal}
          onSchedule={handleScheduleInterviews}
        />
      )}
    </>
  );
} 