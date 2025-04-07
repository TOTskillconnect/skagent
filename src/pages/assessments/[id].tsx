import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAssessments } from '@/contexts/AssessmentsContext';
import type { Assessment } from '@/types/assessments';
import Link from 'next/link';
import BackButton from '@/components/common/BackButton';

export default function AssessmentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getAssessmentById, assignedAssessments = {} } = useAssessments();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const assessmentData = getAssessmentById(id as string);
      if (assessmentData) {
        setAssessment(assessmentData);
      } else {
        router.push('/assessments');
      }
      setLoading(false);
    }
  }, [id, getAssessmentById, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  // Get assigned assessments for this assessment
  const assignedForAssessment = Object.values(assignedAssessments).filter(
    assigned => assigned.assessmentId === assessment.id
  );

  return (
    <>
      <Head>
        <title>{`${assessment.title} | SkillConnect`}</title>
        <meta name="description" content={assessment.description} />
      </Head>

      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-6">
          <BackButton className="mb-4" />
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">{assessment.title}</h1>
            <div className={`text-xs font-medium px-3 py-1 rounded-full ${
              assessment.type === 'technical' 
                ? 'bg-primary/10 text-primary' 
                : assessment.type === 'behavioral'
                  ? 'bg-accent-1/10 text-accent-1' 
                  : assessment.type === 'cultural'
                    ? 'bg-accent-2/10 text-accent-2' 
                    : 'bg-background text-text-primary'
            }`}>
              {assessment.type.replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </div>
          </div>
          
          <p className="text-text-secondary mb-6">{assessment.description}</p>
          
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4">Assessment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Instructions</h3>
                <p className="text-text-secondary whitespace-pre-line">{assessment.instructions}</p>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Duration</h3>
                    <p className="text-text-secondary">{assessment.duration} minutes</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Difficulty</h3>
                    <p className="text-text-secondary">{assessment.difficulty.replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Status</h3>
                    <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      assessment.status === 'active' 
                        ? 'bg-accent-2/10 text-accent-2' 
                        : 'bg-text-secondary/10 text-text-secondary'
                    }`}>
                      {assessment.status.replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Assigned Candidates ({assignedForAssessment.length})</h2>
              <Link href={`/assessments/assign/${assessment.id}`} className="btn-outline-primary text-sm">
                Assign to Candidates
              </Link>
            </div>
            
            {assignedForAssessment.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                No candidates have been assigned to this assessment yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {assignedForAssessment.map(assignment => (
                  <div key={assignment.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{assignment.candidateName}</p>
                      <p className="text-sm text-text-secondary">
                        Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 text-xs rounded-full font-medium ${
                      assignment.status === 'completed' 
                        ? 'bg-accent-2/10 text-accent-2' 
                        : assignment.status === 'in_progress' 
                          ? 'bg-accent-1/10 text-accent-1' 
                          : 'bg-text-secondary/10 text-text-secondary'
                    }`}>
                      {assignment.status.replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 