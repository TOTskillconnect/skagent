import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useResults } from '@/contexts/ResultsContext';
import { useCandidates } from '@/contexts/CandidatesContext';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Candidate } from '@/types/candidates';

interface InterviewSchedule {
  id: string;
  type: 'technical' | 'behavioral' | 'final';
  date: string;
  time: string;
  duration: number;
  interviewers: string[];
  format: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export default function ScheduleInterview() {
  const router = useRouter();
  const { id } = router.query;
  const { reports } = useResults();
  const { candidates } = useCandidates();
  const [scheduledInterviews, setScheduledInterviews] = useState<InterviewSchedule[]>([]);
  const [newInterview, setNewInterview] = useState<Partial<InterviewSchedule>>({
    type: 'technical',
    date: '',
    time: '',
    duration: 60,
    interviewers: [],
    format: 'video',
    status: 'scheduled',
    notes: ''
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

  const handleScheduleInterview = () => {
    if (newInterview.date && newInterview.time) {
      const interview: InterviewSchedule = {
        id: `int${scheduledInterviews.length + 1}`.padStart(4, '0'),
        type: newInterview.type || 'technical',
        date: newInterview.date,
        time: newInterview.time,
        duration: newInterview.duration || 60,
        interviewers: newInterview.interviewers || [],
        format: newInterview.format || 'video',
        status: 'scheduled',
        notes: newInterview.notes || '',
        createdAt: new Date().toISOString()
      };
      setScheduledInterviews([...scheduledInterviews, interview]);
      setNewInterview({
        type: 'technical',
        date: '',
        time: '',
        duration: 60,
        interviewers: [],
        format: 'video',
        status: 'scheduled',
        notes: ''
      });
    }
  };

  return (
    <>
      <Head>
        <title>Schedule Interview | SkillConnect</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Schedule Interview
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
            <Button onClick={() => router.push(`/reports/${report.id}/peer-review`)}>
              Peer Review
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Schedule New Interview">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Interview Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newInterview.type}
                  onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as InterviewSchedule['type'] })}
                >
                  <option value="technical">Technical Interview</option>
                  <option value="behavioral">Behavioral Interview</option>
                  <option value="final">Final Interview</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newInterview.date}
                  onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newInterview.time}
                  onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="30"
                  max="180"
                  step="30"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newInterview.duration}
                  onChange={(e) => setNewInterview({ ...newInterview, duration: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Format
                </label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newInterview.format}
                  onChange={(e) => setNewInterview({ ...newInterview, format: e.target.value as InterviewSchedule['format'] })}
                >
                  <option value="video">Video Call</option>
                  <option value="in-person">In Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Interviewers (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  value={newInterview.interviewers?.join(', ')}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewers: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-1"
                  rows={3}
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleScheduleInterview}>Schedule Interview</Button>
            </div>
          </Card>

          <Card title="Scheduled Interviews">
            <div className="space-y-6">
              {scheduledInterviews.length > 0 ? (
                scheduledInterviews.map((interview) => (
                  <div key={interview.id} className="p-4 bg-background rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-text-primary capitalize">
                          {interview.type} Interview
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {new Date(interview.date).toLocaleDateString()} at {interview.time}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        interview.status === 'scheduled' ? 'bg-accent-2 text-white' :
                        interview.status === 'completed' ? 'bg-accent-1 text-white' :
                        'bg-error text-white'
                      }`}>
                        {interview.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-text-secondary">Duration</p>
                        <p className="font-medium">{interview.duration} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Format</p>
                        <p className="font-medium capitalize">{interview.format}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Interviewers</p>
                      <div className="flex flex-wrap gap-2">
                        {interview.interviewers.map((interviewer, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-background rounded-full text-sm"
                          >
                            {interviewer}
                          </span>
                        ))}
                      </div>
                    </div>
                    {interview.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-text-secondary mb-1">Notes</p>
                        <p className="text-text-primary">{interview.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-center py-4">
                  No interviews scheduled yet. Schedule the first interview!
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
} 