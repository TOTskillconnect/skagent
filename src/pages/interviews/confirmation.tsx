import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { Candidate, Campaign } from '@/lib/candidateGenerator';

export default function InterviewConfirmationPage() {
  const router = useRouter();
  const { candidateId, campaignId } = router.query;
  const { getMatchesForCampaign } = useMatchedCandidates();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (candidateId && campaignId) {
      setLoading(true);
      
      // Get candidate data
      const matchedCandidates = getMatchesForCampaign(campaignId as string);
      const matchedCandidate = matchedCandidates.find(c => c.id === candidateId);
      
      if (matchedCandidate) {
        setCandidate(matchedCandidate);
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
  }, [candidateId, campaignId, getMatchesForCampaign]);
  
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
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
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
        <title>Interview Scheduled | SkillConnect</title>
        <meta name="description" content="Your interview has been scheduled" />
      </Head>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-6">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Interview Scheduled</h1>
              <p className="text-text-secondary">
                Your interview with {candidate.name} has been scheduled successfully.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
              <div className="bg-background-alt p-4 rounded-lg">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Candidate</h3>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                    {candidate.name.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-text-secondary">{candidate.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background-alt p-4 rounded-lg">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Position</h3>
                <p className="font-medium">{campaign.roleTitle}</p>
                <p className="text-sm text-text-secondary">{campaign.departmentName} • {campaign.locationName}</p>
              </div>
              
              <div className="bg-background-alt p-4 rounded-lg">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Date & Time</h3>
                <p className="font-medium">Tomorrow at 10:00 AM</p>
                <p className="text-sm text-text-secondary">60 minutes, Video Call</p>
              </div>
              
              <div className="bg-background-alt p-4 rounded-lg">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Iris AI Assistant</h3>
                <p className="font-medium">Iris will join your call</p>
                <p className="text-sm text-text-secondary">Will assist with questions and taking notes</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => router.push('/interviews')}>View All Interviews</Button>
              <Link href="/inbox">
                <Button variant="outline">Back to Inbox</Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium">1</span>
              </div>
              <div>
                <p className="font-medium">Check your calendar</p>
                <p className="text-sm text-text-secondary">The interview has been added to your calendar with a video call link.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium">2</span>
              </div>
              <div>
                <p className="font-medium">Prepare with Iris</p>
                <p className="text-sm text-text-secondary">
                  Iris will analyze the candidate's profile and prepare targeted questions and discussion points.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium">3</span>
              </div>
              <div>
                <p className="font-medium">Join the interview</p>
                <p className="text-sm text-text-secondary">
                  Iris will join you in the call to help with questions and take notes on the candidate's responses.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">
                <span className="text-sm font-medium">4</span>
              </div>
              <div>
                <p className="font-medium">Review the interview report</p>
                <p className="text-sm text-text-secondary">
                  After the interview, Iris will generate a detailed report to help guide your hiring decision.
                </p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
} 