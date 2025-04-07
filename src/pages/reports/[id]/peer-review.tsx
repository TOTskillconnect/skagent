import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useResults } from '@/contexts/ResultsContext';
import { useCandidates } from '@/contexts/CandidatesContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Candidate } from '@/types/candidates';

interface PeerReview {
  id: string;
  reviewerName: string;
  role: string;
  technicalRating: number;
  cultureFitRating: number;
  communicationRating: number;
  feedback: string;
  strengths: string[];
  concerns: string[];
  createdAt: string;
}

export default function PeerReview() {
  const router = useRouter();
  const { id } = router.query;
  const { reports } = useResults();
  const { candidates } = useCandidates();
  const [reviews, setReviews] = useState<PeerReview[]>([]);
  const [newReview, setNewReview] = useState<Partial<PeerReview>>({
    reviewerName: '',
    role: '',
    technicalRating: 0,
    cultureFitRating: 0,
    communicationRating: 0,
    feedback: '',
    strengths: [],
    concerns: []
  });

  const report = reports.find(r => r.id === id);
  const candidate = report ? Object.values(candidates).find(c => c.id === report.candidateId) : null;

  if (!report || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h1 className="text-xl font-bold text-primary mb-4">Report Not Found</h1>
            <p className="text-text-secondary mb-6">
              The report you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/reports')}>
              Back to Reports
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleAddReview = () => {
    if (newReview.reviewerName && newReview.feedback) {
      const review: PeerReview = {
        id: `pr${reviews.length + 1}`.padStart(4, '0'),
        reviewerName: newReview.reviewerName,
        role: newReview.role || '',
        technicalRating: newReview.technicalRating || 0,
        cultureFitRating: newReview.cultureFitRating || 0,
        communicationRating: newReview.communicationRating || 0,
        feedback: newReview.feedback,
        strengths: newReview.strengths || [],
        concerns: newReview.concerns || [],
        createdAt: new Date().toISOString()
      };
      setReviews([...reviews, review]);
      setNewReview({
        reviewerName: '',
        role: '',
        technicalRating: 0,
        cultureFitRating: 0,
        communicationRating: 0,
        feedback: '',
        strengths: [],
        concerns: []
      });
    }
  };

  return (
    <>
      <Head>
        <title>Peer Review | SkillConnect</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Peer Review
            </h1>
            <p className="text-text-secondary">
              {candidate.name}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push(`/reports/${report.id}`)}>
              Back to Overview
            </Button>
            <Button onClick={() => router.push(`/reports/${report.id}/detailed`)}>
              Detailed Report
            </Button>
            <Button onClick={() => router.push(`/reports/${report.id}/schedule`)}>
              Schedule Interview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Add Peer Review">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newReview.reviewerName}
                  onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Your Role
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Technical Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newReview.technicalRating}
                  onChange={(e) => setNewReview({ ...newReview, technicalRating: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Culture Fit Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newReview.cultureFitRating}
                  onChange={(e) => setNewReview({ ...newReview, cultureFitRating: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Communication Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newReview.communicationRating}
                  onChange={(e) => setNewReview({ ...newReview, communicationRating: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Feedback
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  rows={4}
                  value={newReview.feedback}
                  onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}
                />
              </div>
              <Button onClick={handleAddReview}>Submit Review</Button>
            </div>
          </Card>

          <Card title="Peer Reviews">
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-background rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-text-primary">{review.reviewerName}</h3>
                        <p className="text-sm text-text-secondary">{review.role}</p>
                      </div>
                      <div className="text-sm text-text-secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-text-secondary">Technical</p>
                        <p className="font-medium">{review.technicalRating}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Culture Fit</p>
                        <p className="font-medium">{review.cultureFitRating}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Communication</p>
                        <p className="font-medium">{review.communicationRating}/5</p>
                      </div>
                    </div>
                    <p className="text-text-primary mb-4">{review.feedback}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {review.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-text-primary">
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">Concerns</h4>
                        <ul className="space-y-1">
                          {review.concerns.map((concern, index) => (
                            <li key={index} className="text-sm text-text-primary">
                              • {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-center py-4">
                  No peer reviews yet. Be the first to add your feedback!
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
} 