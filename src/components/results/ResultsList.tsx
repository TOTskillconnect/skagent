import React from 'react';
import { AssessmentResult } from '@/types/results';
import ScoreCard from './ScoreCard';

interface ResultsListProps {
  results: AssessmentResult[];
  onResultClick?: (result: AssessmentResult) => void;
}

export default function ResultsList({ results, onResultClick }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-text-secondary">No results available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onResultClick?.(result)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-primary mb-1">
                Assessment {result.assessmentId}
              </h3>
              <div className="text-sm text-text-secondary">
                Completed in {result.completionTime}
              </div>
            </div>
            <ScoreCard
              title="Score"
              score={result.score}
              color="primary"
              size="small"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Strengths
              </h4>
              <ul className="space-y-1">
                {result.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-sm text-text-primary flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-accent-2 rounded-full mr-2" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {result.areasForImprovement.map((area, index) => (
                  <li
                    key={index}
                    className="text-sm text-text-primary flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-accent-1 rounded-full mr-2" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-secondary mb-2">
              Feedback
            </h4>
            <p className="text-sm text-text-primary">{result.feedback}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 