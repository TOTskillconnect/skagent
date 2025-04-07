import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { Candidate, Campaign } from '@/lib/candidateGenerator';

export default function InboxPage() {
  const router = useRouter();
  const { matchedCandidates, getMatchesForCampaign } = useMatchedCandidates();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allMatches, setAllMatches] = useState<{
    campaign: Campaign;
    candidates: Candidate[];
    unread: boolean;
  }[]>([]);

  useEffect(() => {
    // Load campaigns from localStorage
    const loadCampaigns = () => {
      try {
        const storedCampaigns = localStorage.getItem('hiringCampaigns');
        if (storedCampaigns) {
          const parsedCampaigns = JSON.parse(storedCampaigns);
          setCampaigns(parsedCampaigns);
        }
      } catch (error) {
        console.error('Error loading campaigns:', error);
      }
    };

    loadCampaigns();
  }, []);

  useEffect(() => {
    // Organize matches by campaign for display
    if (campaigns.length > 0) {
      const matches = campaigns.map(campaign => {
        const candidates = getMatchesForCampaign(campaign.id);
        // Mark as unread if any candidate has status 'new'
        const unread = candidates.some(c => c.status === 'new');
        
        return {
          campaign,
          candidates,
          unread
        };
      });
      
      setAllMatches(matches);
    }
  }, [campaigns, getMatchesForCampaign, matchedCandidates]);

  const scheduleInterview = (candidate: Candidate) => {
    router.push(`/interviews/schedule?candidateId=${candidate.id}&campaignId=${candidate.campaignId}`);
  };

  return (
    <Layout>
      <Head>
        <title>Inbox | SkillConnect</title>
        <meta name="description" content="Review matched candidates in your inbox" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Link href="/wizard">
            <Button>Create New Requisition</Button>
          </Link>
        </div>

        {allMatches.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-primary opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Your inbox is empty</h3>
              <p className="text-text-secondary mb-6">Create a new requisition to find matching candidates.</p>
              <Link href="/wizard">
                <Button>Create Requisition</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {allMatches.map(({ campaign, candidates, unread }) => (
              <Card key={campaign.id} className={unread ? "border-primary border-2" : ""}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center">
                      {unread && (
                        <span className="h-2 w-2 bg-primary rounded-full mr-2" aria-hidden="true"></span>
                      )}
                      {campaign.roleTitle}
                    </h2>
                    <p className="text-text-secondary text-sm">{campaign.departmentName} • {campaign.locationName}</p>
                  </div>
                  <span className="badge badge-primary">{candidates.length} matches</span>
                </div>
                
                <div className="space-y-4">
                  {candidates.slice(0, 3).map(candidate => (
                    <div key={candidate.id} className="flex justify-between items-center p-3 bg-background-alt rounded-md">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                          {candidate.name.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-text-secondary">{candidate.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="badge badge-primary">{candidate.matchScore}% match</span>
                        <Button 
                          variant="outline" 
                          onClick={() => scheduleInterview(candidate)}
                          className="text-sm"
                        >
                          Schedule Interview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {candidates.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link href={`/candidates?campaignId=${campaign.id}`}>
                      <Button variant="outline">View All {candidates.length} Candidates</Button>
                    </Link>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 