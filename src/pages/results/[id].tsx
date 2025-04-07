import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useResults } from '@/contexts/ResultsContext';
import { useAssessments } from '@/contexts/AssessmentsContext';
import { useCandidates } from '@/contexts/CandidatesContext';
import Card from '@/components/common/Card';
import ScoreCard from '@/components/results/ScoreCard';
import Button from '@/components/common/Button';
import { Assessment } from '@/types/assessments';
import { Candidate } from '@/types/candidates';

export default function AssessmentResultDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { results } = useResults();
  const { assessments } = useAssessments();
  const { candidates } = useCandidates();

  const result = results.find(r => r.id === id);
  const assessment = result ? Object.values(assessments).find(a => a.id === result.assessmentId) : null;
  const candidate = result ? Object.values(candidates).find(c => c.id === result.candidateId) : null;

  if (!result || !assessment || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h1 className="text-xl font-bold text-primary mb-4">Result Not Found</h1>
            <p className="text-text-secondary mb-6">
              The assessment result you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/results')}>
              Back to Results
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Assessment Result | SkillConnect</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Assessment Result
            </h1>
            <p className="text-text-secondary">
              {candidate.name} - {assessment.type}
            </p>
          </div>
          <Button onClick={() => router.push('/results')}>
            Back to Results
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ScoreCard
            title="Overall Score"
            score={result.score}
            color="primary"
            size="large"
          />
          <ScoreCard
            title="Completion Time"
            score={parseInt(result.completionTime)}
            maxScore={120}
            color="accent1"
            size="medium"
          />
          <ScoreCard
            title="Status"
            score={result.status === 'completed' ? 100 : result.status === 'in_progress' ? 50 : 0}
            maxScore={100}
            color="accent2"
            size="medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Assessment Details">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-1">
                  Assessment Type
                </h3>
                <p className="text-text-primary">{assessment.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-1">
                  Difficulty
                </h3>
                <p className="text-text-primary capitalize">{assessment.difficulty}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-1">
                  Instructions
                </h3>
                <p className="text-text-primary whitespace-pre-wrap">
                  {assessment.instructions}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Evaluation">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start text-text-primary"
                    >
                      <span className="w-1.5 h-1.5 bg-accent-2 rounded-full mt-2 mr-2" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.areasForImprovement.map((area: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start text-text-primary"
                    >
                      <span className="w-1.5 h-1.5 bg-accent-1 rounded-full mt-2 mr-2" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-2">
                  Feedback
                </h3>
                <p className="text-text-primary whitespace-pre-wrap">
                  {result.feedback}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
} 