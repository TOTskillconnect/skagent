import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { getInterviews, updateInterviewStatus, deleteInterview, Interview } from '@/services/interviewService';
import { InterviewPriority, InterviewStyle } from '@/components/candidates/GuidedInterviewTypes';

// Status chip component using TailwindCSS
const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <span className={`${getStatusColor()} text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}>
      {getStatusLabel()}
    </span>
  );
};

// Interview mode icon component
const InterviewModeIcon = ({ mode }: { mode: string }) => {
  switch (mode.toLowerCase()) {
    case 'video':
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'phone':
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case 'in-person':
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    default:
      return null;
  }
};

// Calculate date string with proper formatting
const formatDateString = (date: string | undefined | null): string => {
  if (!date) return 'Not scheduled';
  try {
    const dateObj = new Date(date);
    
    // Get month as abbreviated name
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateObj.getMonth()];
    
    // Get day of month
    const day = dateObj.getDate();
    
    // Get full year
    const year = dateObj.getFullYear();
    
    // Return formatted string (e.g., "Jan 5, 2023")
    return `${month} ${day}, ${year}`;
  } catch (e) {
    console.error('Date formatting error:', e);
    return date;
  }
};

// Interview card component for better UI
const InterviewCard = ({ 
  interview, 
  onClick 
}: { 
  interview: Interview, 
  onClick: () => void 
}) => {
  // Get the first scheduled date from the dates array
  const firstDate = interview.dates && interview.dates.length > 0 ? interview.dates[0] : null;
  
  // Precompute values to avoid recalculation in render
  const dateString = useMemo(() => 
    firstDate ? formatDateString(firstDate.date) : 'Not scheduled', 
    [firstDate]
  );
  
  const timeAgo = useMemo(() => 
    formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true }), 
    [interview.createdAt]
  );
  
  // Get candidate name (in a real app, would fetch from a candidates service)
  const candidateName = useMemo(() => 
    `Candidate ${interview.candidateId || 'Unknown'}`,
    [interview.candidateId]
  );
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-800">{candidateName}</h3>
        <StatusChip status={interview.status} />
      </div>
      
      <div className="flex items-center mb-2 text-sm text-gray-600">
        <InterviewModeIcon mode={interview.mode} />
        <span className="ml-2 capitalize">{interview.mode} Interview</span>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Date:</span> {dateString}
        </div>
        {firstDate && firstDate.startTime && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Time:</span> {firstDate.startTime}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Created {timeAgo}</span>
        <span>{interview.timezone}</span>
      </div>
    </div>
  );
};

// Interview details modal component
const InterviewDetailsModal = ({ 
  interview, 
  onClose 
}: { 
  interview: Interview, 
  onClose: () => void 
}) => {
  const router = useRouter();
  
  // Get the first scheduled date from the dates array
  const firstDate = interview.dates && interview.dates.length > 0 ? interview.dates[0] : null;
  
  // Get candidate name (in a real app, would fetch from a candidates service)
  const candidateName = `Candidate ${interview.candidateId || 'Unknown'}`;

  // Get human-readable interview style name
  const getInterviewStyleName = (style?: InterviewStyle): string => {
    switch(style) {
      case InterviewStyle.CONTEXT_SIMULATION:
        return 'Context Simulation';
      case InterviewStyle.LIVE_COLLABORATION:
        return 'Live Collaboration Challenge';
      case InterviewStyle.ROLE_REVERSAL:
        return 'Role-Reversal Interview';
      case InterviewStyle.WILDCARD:
        return 'Wildcard Challenge';
      case InterviewStyle.CUSTOM:
        return 'Custom Format';
      default:
        return 'Standard Interview';
    }
  };

  // Get human-readable priority name
  const getPriorityName = (priority?: InterviewPriority): string => {
    switch(priority) {
      case InterviewPriority.SPEED:
        return 'Speed';
      case InterviewPriority.TECHNICAL:
        return 'Technical Strength';
      case InterviewPriority.CULTURE:
        return 'Culture & Team Fit';
      case InterviewPriority.INITIATIVE:
        return 'Initiative & Ownership';
      default:
        return 'Standard Priority';
    }
  };

  const viewCandidate = () => {
    router.push(`/interview-guides/${interview.id}`);
    onClose();
  };

  const isUpcoming = interview.status === 'confirmed' || interview.status === 'pending';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Interview Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">CANDIDATE</h3>
            <p className="text-gray-800 font-medium">{candidateName}</p>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">STATUS</h3>
              <StatusChip status={interview.status} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">MODE</h3>
              <p className="text-gray-800 capitalize">{interview.mode}</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">INTERVIEW STYLE</h3>
              <p className="text-gray-800">{getInterviewStyleName(interview.interviewStyle)}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">PRIORITY</h3>
              <p className="text-gray-800">{getPriorityName(interview.interviewPriority)}</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">DATE</h3>
              <p className="text-gray-800">{firstDate ? formatDateString(firstDate.date) : 'Not scheduled'}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">TIME</h3>
              <p className="text-gray-800">{firstDate && firstDate.startTime ? firstDate.startTime : 'Not set'}</p>
            </div>
          </div>
          
          {interview.focusAreas && interview.focusAreas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">FOCUS AREAS</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {interview.focusAreas.map((area, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {interview.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">NOTES</h3>
              <p className="text-gray-700 text-sm">{interview.notes}</p>
            </div>
          )}
          
          <div className="pt-4 flex justify-between">
            <div className="flex space-x-4">
              <button 
                onClick={viewCandidate}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Candidate Summary
              </button>
              <button
                onClick={() => router.push(`/interview-guides/${interview.id}`)}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Get Interview Guide
              </button>
            </div>
            
            {isUpcoming ? (
              <button 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-200 hover:text-black transition-colors"
                onClick={() => window.alert('This would join the interview in a real application.')}
              >
                Join Interview
              </button>
            ) : (
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled
              >
                View Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab types for the interview page
type TabType = 'pending' | 'upcoming' | 'completed';

const InterviewsPage = () => {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Use useCallback to prevent recreating this function on every render
  const loadInterviews = useCallback(() => {
    try {
      if (!dataInitialized) {
        setLoading(true);
      }
      
      // Get interviews from service
      const data = getInterviews();
      
      // Sort by date (upcoming first) then by creation date
      const sortedData = [...data].sort((a, b) => {
        // First sort by status to prioritize confirmed/pending
        if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
        if (a.status !== 'confirmed' && b.status === 'confirmed') return 1;
        
        // Then sort by scheduled date if both have it
        if (a.dates && b.dates && a.dates.length > 0 && b.dates.length > 0) {
          const aDate = a.dates[0].date ? new Date(a.dates[0].date) : new Date(a.createdAt);
          const bDate = b.dates[0].date ? new Date(b.dates[0].date) : new Date(b.createdAt);
          return aDate.getTime() - bDate.getTime();
        }
        
        // If one has a date and the other doesn't, prioritize the one with a date
        if (a.dates && a.dates.length > 0 && (!b.dates || b.dates.length === 0)) return -1;
        if (!a.dates || a.dates.length === 0 && b.dates && b.dates.length > 0) return 1;
        
        // Finally sort by creation date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setInterviews(sortedData);
      setError(null);
      setDataInitialized(true);
    } catch (error) {
      console.error('Error loading interviews:', error);
      setError('Failed to load interviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [dataInitialized]);

  useEffect(() => {
    // Only load data once when component mounts (we use polling below for updates)
    if (!dataInitialized) {
      loadInterviews();
    }
    
    // Poll for updates less frequently after initial load to improve performance
    const intervalId = setInterval(loadInterviews, 60000); // Check every minute instead of 30s
    
    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [loadInterviews, dataInitialized]);

  // Memoize filtered interviews by tab to prevent recalculation on every render
  const filteredInterviews = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return interviews.filter(i => i.status === 'pending');
      case 'upcoming':
        return interviews.filter(i => i.status === 'confirmed');
      case 'completed':
        return interviews.filter(i => i.status === 'completed');
      default:
        return interviews;
    }
  }, [interviews, activeTab]);

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const renderTabButton = (tabName: TabType, label: string, count: number) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 ${
        activeTab === tabName
          ? 'text-primary border-primary bg-white'
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={() => setActiveTab(tabName)}
    >
      {label} ({count})
    </button>
  );

  // Count interviews by status (memoized for performance)
  const pendingCount = useMemo(() => interviews.filter(i => i.status === 'pending').length, [interviews]);
  const upcomingCount = useMemo(() => interviews.filter(i => i.status === 'confirmed').length, [interviews]);
  const completedCount = useMemo(() => interviews.filter(i => i.status === 'completed').length, [interviews]);

  if (loading && !dataInitialized) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Interviews</h1>
        <p className="text-gray-600">Manage and track your candidate interviews</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
          <button 
            onClick={loadInterviews}
            className="mt-2 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No interviews scheduled yet</h2>
          <p className="text-gray-500 mb-6">
            When you schedule interviews with candidates, they will appear here.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            onClick={() => router.push('/candidates')}
          >
            Browse Candidates
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-100 rounded-t-lg border-b border-gray-200 mb-4">
            <div className="flex">
              {renderTabButton('pending', 'Pending', pendingCount)}
              {renderTabButton('upcoming', 'Upcoming', upcomingCount)}
              {renderTabButton('completed', 'Completed', completedCount)}
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}

          {!loading && filteredInterviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No {activeTab} interviews found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInterviews.map(interview => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={() => handleInterviewClick(interview)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Interview Details Modal */}
      {showDetailModal && selectedInterview && (
        <InterviewDetailsModal 
          interview={selectedInterview} 
          onClose={closeDetailModal} 
        />
      )}
    </div>
  );
};

export default InterviewsPage; 