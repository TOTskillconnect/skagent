import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useCandidates } from '@/contexts/CandidatesContext';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { Candidate, Campaign } from '@/lib/candidateGenerator';

// Interview time slots
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', 
  '4:00 PM', '4:30 PM'
];

// Interview durations
const DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' }
];

// AI Bot assistant
const AiBot = {
  name: 'Iris',
  avatar: (
    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  ),
  role: 'Interview Assistant',
  description: 'Iris helps you prepare for and conduct interviews, providing real-time guidance and feedback.'
};

export default function ScheduleInterviewPage() {
  const router = useRouter();
  const { candidateId, campaignId } = router.query;
  const { getCandidateById } = useCandidates();
  const { getMatchesForCampaign, markCandidateStatus } = useMatchedCandidates();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interview scheduling form state
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [interviewType, setInterviewType] = useState<string>('video');
  const [includeAiBot, setIncludeAiBot] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  
  // AI Bot chat state
  const [chatVisible, setChatVisible] = useState<boolean>(true);
  
  useEffect(() => {
    if (candidateId && campaignId) {
      setLoading(true);
      
      // Get candidate data
      const matchedCandidates = getMatchesForCampaign(campaignId as string);
      const matchedCandidate = matchedCandidates.find(c => c.id === candidateId);
      
      if (matchedCandidate) {
        setCandidate(matchedCandidate);
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toISOString().split('T')[0]);
        
        // Set default time
        setScheduleTime('10:00 AM');
      }
      
      // Get campaign data
      try {
        const storedCampaigns = localStorage.getItem('hiringCampaigns');
        if (storedCampaigns) {
          const campaigns = JSON.parse(storedCampaigns);
          const currentCampaign = campaigns.find((c: Campaign) => c.id === campaignId);
          
          if (currentCampaign) {
            setCampaign(currentCampaign);
          }
        }
      } catch (error) {
        console.error('Error loading campaign data:', error);
      }
      
      setLoading(false);
    }
  }, [candidateId, campaignId, getCandidateById, getMatchesForCampaign]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidate || !campaign) return;
    
    // Mark candidate as contacted
    markCandidateStatus(candidate, 'contacted');
    
    // In a real app, we would save the interview scheduling data
    // For now, just redirect to a confirmation page
    router.push(`/interviews/confirmation?candidateId=${candidate.id}&campaignId=${campaign.id}`);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!candidate || !campaign) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Candidate or Campaign Not Found</h2>
              <p className="text-text-secondary mb-6">We couldn't find the specified candidate or campaign.</p>
              <Button onClick={() => router.push('/inbox')}>
                Return to Inbox
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Schedule Interview | SkillConnect</title>
        <meta name="description" content="Schedule an interview with a candidate" />
      </Head>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Schedule Interview</h1>
          </div>
          
          <Card>
            <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border">
              <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                {candidate.name.split(' ').map(name => name[0]).join('')}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{candidate.name}</h2>
                <p className="text-text-secondary">{candidate.title}</p>
              </div>
              <span className="ml-auto badge badge-primary">{candidate.matchScore}% match</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="form-label">Interview Date</label>
                  <input
                    id="date"
                    type="date"
                    className="form-control"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="form-label">Interview Time</label>
                  <select
                    id="time"
                    className="form-select"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                  >
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <select
                    id="duration"
                    className="form-select"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    required
                  >
                    {DURATIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="interviewType" className="form-label">Interview Type</label>
                  <select
                    id="interviewType"
                    className="form-select"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    required
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <input
                    id="includeAi"
                    type="checkbox"
                    className="form-checkbox"
                    checked={includeAiBot}
                    onChange={(e) => setIncludeAiBot(e.target.checked)}
                  />
                  <label htmlFor="includeAi" className="ml-2 form-label mb-0">
                    Include {AiBot.name} AI assistant in the interview
                  </label>
                </div>
                <p className="text-sm text-text-secondary">
                  {AiBot.name} will join your call to help with interview questions, 
                  note-taking, and provide real-time guidance.
                </p>
              </div>
              
              <div>
                <label htmlFor="notes" className="form-label">Interview Notes / Agenda</label>
                <textarea
                  id="notes"
                  className="form-control"
                  rows={3}
                  placeholder="Add any specific topics you'd like to discuss..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="pt-2">
                <Button type="submit">Schedule Interview</Button>
              </div>
            </form>
          </Card>
        </div>
        
        {/* AI Assistant Panel */}
        <div className="space-y-4">
          <Card className="relative">
            <div className="absolute right-4 top-4">
              <button 
                className="text-text-secondary hover:text-primary transition-colors"
                onClick={() => setChatVisible(!chatVisible)}
              >
                {chatVisible ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              {AiBot.avatar}
              <div>
                <h3 className="font-semibold">{AiBot.name}</h3>
                <p className="text-sm text-text-secondary">{AiBot.role}</p>
              </div>
            </div>
            
            {chatVisible && (
              <div className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm">
                    Hi there! I'm {AiBot.name}, your AI interview assistant. I'm here to help you 
                    prepare for your interview with {candidate.name}.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Candidate Summary</h4>
                  <p className="text-sm mb-2">
                    {candidate.name} has {candidate.experience} years of experience in {candidate.industry || 'the industry'}.
                    Their skills match {candidate.matchScore}% of what you're looking for.
                  </p>
                  <p className="text-sm">
                    Top skills: {candidate.skills.slice(0, 3).join(', ')}
                  </p>
                </div>
                
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Suggested Questions</h4>
                  <ul className="text-sm space-y-2">
                    <li>• Tell me about your experience working with {candidate.skills[0]}</li>
                    <li>• How do you approach problem-solving in {candidate.industry || 'your industry'}?</li>
                    <li>• What interests you about our {campaign.roleTitle} position?</li>
                  </ul>
                </div>
                
                <p className="text-sm text-text-secondary">
                  I'll join your scheduled call to help with these questions and provide real-time feedback.
                </p>
                
                <div className="pt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask me anything about this candidate..."
                  />
                </div>
              </div>
            )}
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium mb-3">Candidate Quick Facts</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary">Experience</p>
                <p className="font-medium">{candidate.experience} years</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Education</p>
                <p className="font-medium">{candidate.education || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Location</p>
                <p className="font-medium">{candidate.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Availability</p>
                <p className="font-medium">{candidate.availability || '2 weeks notice'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Expected Salary</p>
                <p className="font-medium">{candidate.salary || 'Not specified'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 