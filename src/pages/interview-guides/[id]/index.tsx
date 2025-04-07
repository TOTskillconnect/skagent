import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getInterviews, Interview } from '@/services/interviewService';
import { InterviewPriority, InterviewStyle } from '@/components/candidates/GuidedInterviewTypes';

// A simple component for section headings
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
    {children}
  </h2>
);

// A simple component for guide sections
const GuideSection = ({ 
  title, 
  children,
  icon 
}: { 
  title: string; 
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      {children}
    </div>
  </div>
);

// Tip component for interview advice
const Tip = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-blue-800">{children}</p>
      </div>
    </div>
  </div>
);

// Question component for suggested interview questions
const Question = ({ question, children }: { question: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <p className="font-medium text-gray-800 mb-2">{question}</p>
    <p className="text-gray-600 text-sm italic pl-4 border-l-2 border-gray-300">
      {children}
    </p>
  </div>
);

// Main component for the interview guide page
export default function InterviewGuidePage() {
  const router = useRouter();
  const { id } = router.query;
  const [interview, setInterview] = useState<Interview | null>(null);
  const [candidateName, setCandidateName] = useState<string>("Candidate");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Fetch interview data
    try {
      const interviews = getInterviews();
      const foundInterview = interviews.find(interview => interview.id === id);
      
      if (foundInterview) {
        setInterview(foundInterview);
        // In a real application, we would fetch the candidate's name using the candidateId
        // For now, just use a placeholder name based on the ID
        setCandidateName(`Candidate ${foundInterview.candidateId || 'Unknown'}`);
      } else {
        setError('Interview not found');
      }
    } catch (err) {
      console.error('Error fetching interview:', err);
      setError('Error loading interview data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Generate questions based on interview style
  const getStyleBasedQuestions = (style?: InterviewStyle) => {
    switch(style) {
      case InterviewStyle.CONTEXT_SIMULATION:
        return [
          {
            question: "How would you approach your first 30 days in this role?",
            reasoning: "Evaluates their planning and prioritization skills in real-world context."
          },
          {
            question: "We're facing [specific challenge]. Walk me through how you'd tackle this.",
            reasoning: "Assesses problem-solving approach and adaptability."
          },
          {
            question: "What metrics would you track to measure success in this position?",
            reasoning: "Reveals understanding of business impact and results-focused mindset."
          }
        ];
      case InterviewStyle.LIVE_COLLABORATION:
        return [
          {
            question: "Let's work through this problem together: [technical/business challenge]",
            reasoning: "Observes real-time thinking and collaboration style."
          },
          {
            question: "How would you improve this piece of code/design/process?",
            reasoning: "Evaluates critical thinking and improvement mindset."
          },
          {
            question: "When we get stuck here, what approach would you suggest?",
            reasoning: "Tests resilience and creative problem-solving."
          }
        ];
      case InterviewStyle.ROLE_REVERSAL:
        return [
          {
            question: "What questions do you have about our team's culture and working style?",
            reasoning: "Reveals what they value in work environment."
          },
          {
            question: "If you were hiring for this role, what would you look for?",
            reasoning: "Shows their understanding of what makes someone successful."
          },
          {
            question: "What would you change about our current approach to [relevant area]?",
            reasoning: "Tests ability to provide constructive feedback and strategic thinking."
          }
        ];
      case InterviewStyle.WILDCARD:
        return [
          {
            question: "I'd like to give you 30 minutes to show us something you think demonstrates your value.",
            reasoning: "Evaluates self-direction and core strengths identification."
          },
          {
            question: "If resources were unlimited, how would you solve [major industry challenge]?",
            reasoning: "Tests big-picture thinking and creativity."
          },
          {
            question: "What's a contrarian view you hold about our industry?",
            reasoning: "Reveals independent thinking and conviction."
          }
        ];
      default:
        return [
          {
            question: "Tell me about your most significant professional achievement and why it matters.",
            reasoning: "Identifies values and what they consider important work."
          },
          {
            question: "Describe a situation where you had to make a difficult decision with incomplete information.",
            reasoning: "Tests decision-making under uncertainty."
          },
          {
            question: "How do you approach collaboration with team members who have different working styles?",
            reasoning: "Evaluates adaptability and emotional intelligence."
          }
        ];
    }
  };

  // Generate focus area based questions
  const getFocusAreaQuestions = (focusAreas?: string[]) => {
    if (!focusAreas || focusAreas.length === 0) return [];
    
    const questionMap: Record<string, {question: string, reasoning: string}[]> = {
      'Leadership': [
        {
          question: "Tell me about a time when you had to lead a team through a significant challenge.",
          reasoning: "Evaluates leadership style under pressure."
        },
        {
          question: "How do you motivate team members who are struggling with their performance?",
          reasoning: "Tests empathy and coaching abilities."
        }
      ],
      'Communication': [
        {
          question: "Describe a situation where your communication skills made a difference in a project outcome.",
          reasoning: "Assesses impact of communication effectiveness."
        },
        {
          question: "How do you tailor your communication style for different audiences?",
          reasoning: "Tests adaptability and awareness of others' needs."
        }
      ],
      'Team Work': [
        {
          question: "Tell me about a time when you had to work with someone difficult. How did you handle it?",
          reasoning: "Evaluates conflict resolution skills."
        },
        {
          question: "How do you ensure everyone's voice is heard in team discussions?",
          reasoning: "Tests inclusivity and facilitation skills."
        }
      ],
      'Problem Solving': [
        {
          question: "Walk me through the most complex problem you've solved recently.",
          reasoning: "Assesses analytical thinking and methodology."
        },
        {
          question: "How do you approach problems where conventional solutions don't work?",
          reasoning: "Tests creativity and adaptability."
        }
      ],
      'Technical': [
        {
          question: "How do you stay updated with the latest developments in your field?",
          reasoning: "Evaluates learning mindset and technical curiosity."
        },
        {
          question: "Describe a technical decision you made that you later regretted. What did you learn?",
          reasoning: "Tests humility and growth from mistakes."
        }
      ],
      'Initiative': [
        {
          question: "Tell me about a time you identified and solved a problem before others noticed it.",
          reasoning: "Assesses proactivity and ownership."
        },
        {
          question: "How do you decide when to act independently versus when to consult others?",
          reasoning: "Tests judgment and decision-making autonomy."
        }
      ]
    };
    
    // Collect questions for each focus area
    return focusAreas.flatMap(area => {
      const matchingArea = Object.keys(questionMap).find(
        key => area.toLowerCase().includes(key.toLowerCase())
      );
      return matchingArea ? questionMap[matchingArea] : [];
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Interview not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the interview guide you're looking for.
          </p>
          <button
            onClick={() => router.push('/interviews')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-200 hover:text-black"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  // Generate questions based on interview details
  const styleQuestions = getStyleBasedQuestions(interview.interviewStyle);
  const focusAreaQuestions = getFocusAreaQuestions(interview.focusAreas);
  
  // Get interview style name
  const getInterviewStyleName = (style?: InterviewStyle): string => {
    switch(style) {
      case InterviewStyle.CONTEXT_SIMULATION:
        return 'Context Simulation';
      case InterviewStyle.LIVE_COLLABORATION:
        return 'Live Collaboration Challenge';
      case InterviewStyle.ROLE_REVERSAL:
        return 'Role-Reversal Interview';
      case InterviewStyle.WILDCARD:
        return 'Wildcard Challenge';
      case InterviewStyle.CUSTOM:
        return 'Custom Format';
      default:
        return 'Standard Interview';
    }
  };

  // Get priority name
  const getPriorityName = (priority?: InterviewPriority): string => {
    switch(priority) {
      case InterviewPriority.SPEED:
        return 'Speed';
      case InterviewPriority.TECHNICAL:
        return 'Technical Strength';
      case InterviewPriority.CULTURE:
        return 'Culture & Team Fit';
      case InterviewPriority.INITIATIVE:
        return 'Initiative & Ownership';
      default:
        return 'Standard Priority';
    }
  };

  return (
    <>
      <Head>
        <title>Interview Guide for {candidateName}</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/interviews')}
          className="flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Interviews</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Interview Guide: {candidateName}
              </h1>
              <p className="text-gray-600">
                {getInterviewStyleName(interview.interviewStyle)} · {getPriorityName(interview.interviewPriority)}
              </p>
            </div>
            <div className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-md">
              {interview.dates && interview.dates.length > 0 
                ? `${new Date(interview.dates[0].date).toLocaleDateString()} · ${interview.dates[0].startTime}`
                : 'No date scheduled'}
            </div>
          </div>
        </div>

        {/* Interview Strategy */}
        <SectionHeading>Interview Strategy</SectionHeading>
        
        <GuideSection 
          title="Approach & Goals"
          icon={
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              This is a <strong className="text-blue-700">{getInterviewStyleName(interview.interviewStyle)}</strong> focused on assessing the candidate's <strong className="text-blue-700">{getPriorityName(interview.interviewPriority)}</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Primary Objectives</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Evaluate fit for current company stage</li>
                  <li>Assess alignment with team working style</li>
                  <li>Identify strengths in key focus areas</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Areas to Focus On</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {interview.focusAreas?.map((area, index) => (
                    <li key={index}>{area}</li>
                  )) || <li>General qualifications and experience</li>}
                </ul>
              </div>
            </div>
            
            <Tip>
              Remember: This interview style focuses on {interview.interviewStyle === InterviewStyle.CONTEXT_SIMULATION ? 
                'seeing how the candidate would handle real situations relevant to your company stage' : 
                interview.interviewStyle === InterviewStyle.LIVE_COLLABORATION ? 
                'working together on a real problem to evaluate their practical skills and collaboration style' :
                interview.interviewStyle === InterviewStyle.ROLE_REVERSAL ? 
                'allowing the candidate to ask questions and assess team fit from both sides' :
                interview.interviewStyle === InterviewStyle.WILDCARD ? 
                'giving the candidate freedom to demonstrate their value in their own way' :
                'assessing general qualifications and experience'}.
            </Tip>
          </div>
        </GuideSection>

        {/* Recommended Questions */}
        <SectionHeading>Recommended Questions</SectionHeading>
        
        <GuideSection 
          title="Style-Based Questions"
          icon={
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-700 mb-4">
              These questions are specifically designed for the <strong>{getInterviewStyleName(interview.interviewStyle)}</strong> format.
            </p>
            
            {styleQuestions.map((q, index) => (
              <Question key={index} question={q.question}>
                {q.reasoning}
              </Question>
            ))}
          </div>
        </GuideSection>
        
        {focusAreaQuestions.length > 0 && (
          <GuideSection 
            title="Focus Area Questions"
            icon={
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                These questions target the specific focus areas for this interview.
              </p>
              
              {focusAreaQuestions.map((q, index) => (
                <Question key={index} question={q.question}>
                  {q.reasoning}
                </Question>
              ))}
            </div>
          </GuideSection>
        )}

        {/* Interview Tips */}
        <SectionHeading>Interview Tips</SectionHeading>
        
        <GuideSection 
          title="Best Practices"
          icon={
            <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Do's</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Focus on specific examples and behaviors</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Allow comfortable silence for thoughtful responses</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Take notes on key points and observations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Share context about your company and team</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Don'ts</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Dominate the conversation or interrupt</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Ask leading questions that suggest the answer</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Make snap judgments based on first impressions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Forget to leave time for candidate questions</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Tip>
              Remember to give the candidate your full attention. This interview style should feel like a collaborative session, not an interrogation.
            </Tip>
          </div>
        </GuideSection>

        {/* Next Steps */}
        <SectionHeading>After the Interview</SectionHeading>
        
        <GuideSection 
          title="Evaluation & Follow-up"
          icon={
            <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        >
          <div className="space-y-4">
            <ol className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-700 font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Document your observations</p>
                  <p className="text-gray-600 text-sm">Record specific examples and quotes that stood out, not just general impressions.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-700 font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Rate focus areas</p>
                  <p className="text-gray-600 text-sm">Provide numerical scores for each focus area to enable objective comparison.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-700 font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Share your feedback within 24 hours</p>
                  <p className="text-gray-600 text-sm">Submit your evaluation while the interview is still fresh in your mind.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-gray-700 font-medium">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Discuss with the hiring team</p>
                  <p className="text-gray-600 text-sm">Be prepared to explain your reasoning and provide specific examples during the debrief.</p>
                </div>
              </li>
            </ol>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Final Assessment</h4>
              <p className="text-gray-700">
                Consider how the candidate's skills and experience align with your company's current needs and stage. Focus on both immediate contributions and growth potential.
              </p>
            </div>
          </div>
        </GuideSection>

        {/* Download button */}
        <div className="flex justify-center mt-10">
          <button 
            onClick={() => window.alert('This would download a PDF version of this guide in a real application.')}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF Guide
          </button>
        </div>
      </div>
    </>
  );
} 