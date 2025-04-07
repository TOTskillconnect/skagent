import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

// Mock interview data for development
const MOCK_INTERVIEWS = [
  {
    id: "int_1",
    candidateName: "Alex Morgan",
    candidateTitle: "Frontend Developer",
    role: "Senior Frontend Developer",
    date: "2023-11-15",
    time: "11:00 AM",
    duration: "45 minutes",
    type: "Technical Interview",
    status: "upcoming",
    aiAssistant: true,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Focus on React experience and system design skills. Ask about previous project architecture decisions.",
    candidateBackground: {
      skills: ["React", "TypeScript", "Node.js", "UI/UX", "Jest"],
      experience: "5 years of frontend development experience with a focus on React applications."
    },
    interviewer: "Sam Taylor"
  },
  {
    id: "int_2",
    candidateName: "Jordan Lee",
    candidateTitle: "Product Manager",
    role: "Senior Product Manager",
    date: "2023-11-10",
    time: "2:00 PM",
    duration: "60 minutes",
    type: "Cultural Fit & Experience",
    status: "completed",
    aiAssistant: true,
    meetingLink: "https://meet.google.com/jkl-mnop-qrs",
    notes: "Candidate has strong background in B2B products. Discuss experience with agile methodologies and stakeholder management.",
    candidateBackground: {
      skills: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Roadmapping"],
      experience: "7 years of product management with both startups and enterprise companies."
    },
    interviewer: "Taylor Rodriguez"
  }
];

// Mock CheckCircle component since we don't have Lucide React
const CheckCircle = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function InterviewDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Review candidate's resume", completed: false },
    { id: 2, text: "Prepare interview questions", completed: false },
    { id: 3, text: "Check meeting link works", completed: false },
    { id: 4, text: "Test audio and video", completed: false },
    { id: 5, text: "Prepare environment (quiet space)", completed: false }
  ]);

  useEffect(() => {
    if (id) {
      // Simulate API fetch with delay
      setTimeout(() => {
        const foundInterview = MOCK_INTERVIEWS.find(i => i.id === id);
        if (foundInterview) {
          setInterview(foundInterview);
          setNotes(foundInterview.notes || "");
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleSaveNotes = () => {
    setIsSaving(true);
    // Simulate API call to save notes
    setTimeout(() => {
      setInterview({...interview, notes});
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  }

  const joinInterview = (meetingLink: string) => {
    window.open(meetingLink, '_blank', 'noopener,noreferrer');
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? {...item, completed: !item.completed} : item
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Interview Not Found</h2>
            <p className="text-text-secondary mb-6">We couldn't find the specified interview.</p>
            <Button onClick={() => router.push('/interviews')}>
              Return to Interviews
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Interview Details | SkillConnect</title>
        <meta name="description" content="View interview details" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/interviews">
              <button className="mr-4 text-text-secondary hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </Link>
            <h1 className="text-2xl font-bold">Interview Details</h1>
          </div>
          
          <Button 
            onClick={() => joinInterview(interview.meetingLink)}
            className="bg-btn-bg text-btn-text"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join Interview
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card shadow-card">
              <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border">
                <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  {interview.candidateName.split(' ').map((name: string) => name[0]).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{interview.candidateName}</h2>
                  <p className="text-text-secondary">{interview.candidateTitle}</p>
                </div>
                <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  {interview.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Position</p>
                  <p className="font-medium">{interview.role}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Interview Type</p>
                  <p className="font-medium">{interview.type}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Date & Time</p>
                  <p className="font-medium">
                    {new Date(interview.date).toLocaleDateString('en-US', { 
                      month: 'long', day: 'numeric', year: 'numeric' 
                    })}, {interview.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Duration</p>
                  <p className="font-medium">{interview.duration}</p>
                </div>
              </div>
              
              <Card className="mb-4 bg-card shadow-card">
                <h3 className="text-md font-medium mb-2">Interview Notes</h3>
                <div className="mb-2">
                  <textarea
                    className="w-full p-3 border border-border rounded-md min-h-[120px] bg-background"
                    placeholder="Add your notes for this interview here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <Button 
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                    className="mr-2"
                  >
                    {isSaving ? 'Saving...' : 'Save Notes'}
                  </Button>
                  {saved && <span className="text-sm text-primary">Notes saved successfully!</span>}
                </div>
              </Card>
              
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm text-text-secondary">Iris AI Assistant will join this interview</p>
              </div>

              {interview.status === 'upcoming' && (
                <Card className="mb-4 bg-card shadow-card">
                  <h3 className="text-md font-medium mb-3">Interview Preparation Checklist</h3>
                  <div className="space-y-2">
                    {checklist.map(item => (
                      <div 
                        key={item.id} 
                        className="flex items-center p-2 rounded-md hover:bg-background-alt cursor-pointer"
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                          item.completed ? 'bg-primary border-primary' : 'border-text-secondary'
                        }`}>
                          {item.completed && <CheckCircle size={14} className="text-white" />}
                        </div>
                        <span className={item.completed ? 'line-through text-text-secondary' : ''}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-card shadow-card">
              <h3 className="font-semibold mb-4">Interview Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Meeting Link</p>
                  <a 
                    href={interview.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {interview.meetingLink}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Interviewer</p>
                  <p className="font-medium">{interview.interviewer}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-card shadow-card">
              <h3 className="font-semibold mb-4">Candidate Background</h3>
              {interview.candidateBackground && (
                <div className="space-y-2">
                  {interview.candidateBackground.skills && (
                    <div>
                      <p className="text-sm font-medium">Skills</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {interview.candidateBackground.skills.map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {interview.candidateBackground.experience && (
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm mt-1">{interview.candidateBackground.experience}</p>
                    </div>
                  )}
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={() => router.push(`/candidates/${interview.id}`)}
                className="w-full"
              >
                View Full Profile
              </Button>
            </Card>
            
            <Card className="bg-card shadow-card">
              <h3 className="font-semibold mb-4">Iris AI Assistant</h3>
              <p className="text-sm text-text-secondary mb-4">
                Iris will help you conduct this interview by:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Suggesting relevant questions
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Taking notes during the interview
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Analyzing candidate responses
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Generating a post-interview report
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 