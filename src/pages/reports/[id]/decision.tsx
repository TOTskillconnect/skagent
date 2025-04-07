import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useReports } from '@/contexts/ReportsContext';
import { useCandidates } from '@/contexts/CandidatesContext';

const DecisionMatrix: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { reports } = useReports();
  const { candidates } = useCandidates();
  const [decision, setDecision] = useState<'offer' | 'reject' | 'archive' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [teamFeedback, setTeamFeedback] = useState<Array<{ name: string; feedback: string }>>([]);

  const report = reports.find(r => r.id === id);
  const candidate = report ? candidates[report.candidateId] : null;

  if (!report || !candidate) {
    return <div>Loading...</div>;
  }

  const handleAddTeamFeedback = () => {
    setTeamFeedback([...teamFeedback, { name: '', feedback: '' }]);
  };

  const handleUpdateTeamFeedback = (index: number, field: 'name' | 'feedback', value: string) => {
    const newFeedback = [...teamFeedback];
    newFeedback[index] = { ...newFeedback[index], [field]: value };
    setTeamFeedback(newFeedback);
  };

  const handleSubmitDecision = async () => {
    // Here you would typically update the report with the decision and feedback
    // For now, we'll just redirect back to the reports page
    router.push('/reports');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hiring Decision</h1>

      {/* Candidate Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Candidate Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{candidate.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Campaign</p>
            <p className="font-medium">{report.campaignId || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600">Overall Score</p>
            <p className="font-medium">{report.overallScore}/100</p>
          </div>
          <div>
            <p className="text-gray-600">Recommendation</p>
            <p className="font-medium">{report.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Decision Matrix</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDecision('offer')}
              className={`px-4 py-2 rounded-md ${
                decision === 'offer'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Make Offer
            </button>
            <button
              onClick={() => setDecision('reject')}
              className={`px-4 py-2 rounded-md ${
                decision === 'reject'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Reject
            </button>
            <button
              onClick={() => setDecision('archive')}
              className={`px-4 py-2 rounded-md ${
                decision === 'archive'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Archive for Later
            </button>
          </div>

          {decision && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision Notes
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Add notes about your decision..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Team Feedback */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Feedback</h2>
          <button
            onClick={handleAddTeamFeedback}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
          >
            Add Team Member
          </button>
        </div>

        <div className="space-y-4">
          {teamFeedback.map((item, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Member Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateTeamFeedback(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={item.feedback}
                    onChange={(e) => handleUpdateTeamFeedback(index, 'feedback', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmitDecision}
          disabled={!decision}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Submit Decision
        </button>
      </div>
    </div>
  );
};

export default DecisionMatrix; 