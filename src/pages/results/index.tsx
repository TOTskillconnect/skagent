import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useResults } from '@/contexts/ResultsContext';
import { useAssessments } from '@/contexts/AssessmentsContext';
import { useCandidates } from '@/contexts/CandidatesContext';
import ResultsList from '@/components/results/ResultsList';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { AssessmentStatus } from '@/types/results';

export default function ResultsDashboard() {
  const router = useRouter();
  const { results, filters, setFilters } = useResults();
  const { assessments } = useAssessments();
  const { candidates } = useCandidates();
  const [selectedStatus, setSelectedStatus] = useState<AssessmentStatus | 'all'>('all');

  // Filter results based on current filters
  const filteredResults = results.filter(result => {
    if (filters.candidateId && result.candidateId !== filters.candidateId) return false;
    if (filters.assessmentType && !result.assessmentId.startsWith(filters.assessmentType)) return false;
    if (selectedStatus !== 'all' && result.status !== selectedStatus) return false;
    return true;
  });

  const handleResultClick = (result: any) => {
    router.push(`/results/${result.id}`);
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <>
      <Head>
        <title>Assessment Results | SkillConnect</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Assessment Results</h1>
          <Button onClick={() => router.push('/assessments')}>
            View Assessments
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'completed', 'in_progress', 'pending'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status as AssessmentStatus | 'all')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedStatus === status
                        ? 'bg-primary text-white'
                        : 'bg-background text-text-secondary hover:bg-background-secondary'
                    }`}
                  >
                    {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary">Filter by Candidate</h3>
              <select
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                value={filters.candidateId || ''}
                onChange={(e) => handleFilterChange('candidateId', e.target.value)}
              >
                <option value="">All Candidates</option>
                {Object.values(candidates).map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h3 className="font-medium text-text-primary">Filter by Assessment</h3>
              <select
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                value={filters.assessmentType || ''}
                onChange={(e) => handleFilterChange('assessmentType', e.target.value)}
              >
                <option value="">All Assessments</option>
                {Object.values(assessments).map((assessment) => (
                  <option key={assessment.id} value={assessment.type}>
                    {assessment.title}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </div>

        <Card>
          <ResultsList
            results={filteredResults}
            onResultClick={handleResultClick}
          />
        </Card>
      </div>
    </>
  );
} 