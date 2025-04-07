import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessments, AssessmentSubtype, AssessmentType as AssessmentTypeEnum } from '@/contexts/AssessmentsContext';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { Campaign } from '@/lib/candidateGenerator';
import { mockAssessmentTemplates } from '@/data/mockAssessments';
import { getRecommendedTemplates, getRoleDescription, getIndustryDescription, getKeyAreas } from '@/data/assessmentRecommendations';
import { AssessmentTemplate } from '@/types/assessments';
import BackButton from '@/components/common/BackButton';
import Layout from '@/components/common/Layout';

// Type definitions
type AssessmentType = 'technical' | 'behavioral' | 'roleplay' | 'culture_fit';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Step 1: Define assessment type options
const typeOptions = [
  {
    id: 'technical',
    name: 'Technical Challenge',
    description: 'Evaluate specific technical skills through hands-on coding, design, or technical problem-solving exercises',
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'behavioral',
    name: 'Behavioral Game',
    description: 'Interactive, game-like challenges that reveal how candidates think, react, and solve problems under pressure',
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'roleplay',
    name: 'Roleplay Exercise',
    description: 'Realistic interactions where candidates perform in dynamic, startup-style social and professional scenarios',
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    id: 'culture_fit',
    name: 'Values Assessment',
    description: 'Open-ended storytelling prompts that reveal core motivations, values, and personal decision-making frameworks',
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

// Subtypes based on selected type
const subtypeOptions = {
  technical: [
    { id: 'frontend_dev', name: 'Frontend Development' },
    { id: 'backend_dev', name: 'Backend Development' },
    { id: 'product_design', name: 'Product/Design' },
    { id: 'marketing', name: 'Marketing/Growth' }
  ],
  behavioral: [
    { id: 'decision_simulation', name: 'Decision Simulation' },
    { id: 'ethical_dilemma', name: 'Ethical Dilemmas' },
    { id: 'strategic_thinking', name: 'Strategic Thinking' }
  ],
  roleplay: [
    { id: 'leadership', name: 'Leadership Scenarios' },
    { id: 'client_interaction', name: 'Client/Customer Interaction' },
    { id: 'startup_scenarios', name: 'Startup-specific Scenarios' }
  ],
  culture_fit: [
    { id: 'values_assessment', name: 'Values Assessment' },
    { id: 'work_style', name: 'Work Style Exploration' },
    { id: 'startup_fit', name: 'Startup Fit Assessment' }
  ]
};

// Add subtype descriptions
const subtypeDescriptions: Record<string, string> = {
  // Technical Challenge subtypes
  frontend_dev: "Evaluate frontend development skills including UI/UX implementation, responsive design, and modern frameworks",
  backend_dev: "Assess backend development capabilities including API design, database management, and server architecture",
  product_design: "Test product design skills including user research, wireframing, and design systems",
  marketing: "Measure marketing and growth skills including analytics, content strategy, and campaign management",

  // Behavioral Game subtypes
  decision_simulation: "Evaluate how candidates approach complex decisions and handle uncertainty",
  ethical_dilemma: "Assess ethical judgment and decision-making in challenging situations",
  strategic_thinking: "Test strategic planning and long-term thinking capabilities",

  // Roleplay Exercise subtypes
  leadership: "Simulate leadership scenarios to evaluate management and team-building skills",
  client_interaction: "Test client communication and relationship management abilities",
  startup_scenarios: "Assess how candidates handle common startup challenges and situations",

  // Values Assessment subtypes
  values_assessment: "Evaluate alignment with company values and cultural fit",
  work_style: "Assess preferred working methods and collaboration style",
  startup_fit: "Measure suitability for startup environment and fast-paced growth"
};

// Add tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
      <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
        {content}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
      </div>
    </div>
  </div>
);

const getSubtypeDescription = (subtypeId: string): string => {
  return subtypeDescriptions[subtypeId] || "Select this option to proceed with assessment creation";
};

// Function to get recommended templates based on campaign context
const getRecommendedTemplatesByRole = (roleTitle: string, templates: Record<string, AssessmentTemplate>): Record<string, AssessmentTemplate[]> => {
  const result: Record<string, AssessmentTemplate[]> = {
    technical: [],
    behavioral: [],
    roleplay: [],
    culture_fit: []
  };
  
  const lowerRole = (roleTitle || '').toLowerCase();
  
  // Convert templates object to array for filtering
  const templateArray = Object.values(templates);
  
  // Filter templates based on role
  if (lowerRole.includes('engineer') || lowerRole.includes('developer') || lowerRole.includes('programmer')) {
    result.technical = templateArray.filter(t => 
      t.type === 'technical' && 
      (t.title.toLowerCase().includes('coding') || 
       t.title.toLowerCase().includes('frontend') || 
       t.title.toLowerCase().includes('backend') || 
       t.title.toLowerCase().includes('fullstack'))
    );
  } else if (lowerRole.includes('designer') || lowerRole.includes('ux') || lowerRole.includes('ui')) {
    result.technical = templateArray.filter(t => 
      t.type === 'technical' && 
      (t.title.toLowerCase().includes('design') || 
       t.title.toLowerCase().includes('ux') || 
       t.title.toLowerCase().includes('ui'))
    );
  } else if (lowerRole.includes('product')) {
    result.technical = templateArray.filter(t => 
      t.type === 'technical' && 
      (t.title.toLowerCase().includes('product') || 
       t.title.toLowerCase().includes('roadmap') || 
       t.title.toLowerCase().includes('strategy'))
    );
  } else if (lowerRole.includes('market') || lowerRole.includes('growth')) {
    result.technical = templateArray.filter(t => 
      t.type === 'technical' && 
      (t.title.toLowerCase().includes('market') || 
       t.title.toLowerCase().includes('growth') || 
       t.title.toLowerCase().includes('analytics'))
    );
  }
  
  // Always include behavioral assessments
  result.behavioral = templateArray.filter(t => t.type === 'behavioral');
  
  // Always include roleplay exercises - using title match since 'roleplay' might not be a standard type
  result.roleplay = templateArray.filter(t => 
    t.title.toLowerCase().includes('roleplay') || 
    t.title.toLowerCase().includes('simulation') ||
    t.description.toLowerCase().includes('roleplay') ||
    t.description.toLowerCase().includes('simulation')
  );
  
  // Always include culture fit assessments
  result.culture_fit = templateArray.filter(t => 
    t.type === 'cultural' || 
    t.title.toLowerCase().includes('value') ||
    t.title.toLowerCase().includes('culture')
  );
  
  return result;
};

const CreateAssessmentPage = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const { addAssessment } = useAssessments();
  const { getMatchesForCampaign } = useMatchedCandidates();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'technical' as AssessmentTypeEnum,
    description: '',
    instructions: '',
    duration: 60,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });
  const [loading, setLoading] = useState(true);
  const [candidateCount, setCandidateCount] = useState(0);
  
  // Load campaign data
  useEffect(() => {
    if (campaignId) {
      setLoading(true);
      try {
        // Get campaign data from localStorage
        const storedCampaigns = localStorage.getItem('hiringCampaigns');
        if (storedCampaigns) {
          const campaigns = JSON.parse(storedCampaigns);
          const currentCampaign = campaigns.find((c: Campaign) => c.id === campaignId);
          
          if (currentCampaign) {
            setCampaign(currentCampaign);
            
            // Get candidate count
            const candidates = getMatchesForCampaign(campaignId as string);
            setCandidateCount(candidates.length);
          } else {
            router.push('/assessments');
          }
        }
      } catch (error) {
        console.error('Error loading campaign data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [campaignId, router, getMatchesForCampaign]);
  
  // Get recommended templates based on campaign role
  const recommendedTemplates = campaign 
    ? getRecommendedTemplatesByRole(campaign.roleTitle || '', mockAssessmentTemplates) 
    : null;
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = mockAssessmentTemplates[templateId];
    if (template) {
      setSelectedTemplate(templateId);
      setFormData({
        title: template.title,
        type: template.type as AssessmentTypeEnum,
        description: template.description,
        instructions: template.instructions,
        duration: template.duration,
        difficulty: template.difficulty as 'easy' | 'medium' | 'hard',
      });
    }
  };
  
  // Handle assessment type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSelectedTemplate(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create assessment
      const assessment = {
        ...formData,
        type: formData.type as AssessmentTypeEnum,
        difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
        status: 'active' as const,
      };
      
      await addAssessment(assessment);
      router.push('/assessments');
    } catch (error) {
      console.error('Error creating assessment:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-lg font-medium text-red-800">Campaign Not Found</h2>
          <p className="text-red-600 mt-2">Please select a valid hiring campaign to create an assessment.</p>
          <button
            onClick={() => router.push('/assessments')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-gray-200 hover:text-black"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Create Assessment | SkillConnect</title>
        <meta name="description" content="Create a new skills assessment" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Assessment</h1>
        </div>
        
        <div className="card border border-border">
          <h2 className="text-lg font-semibold mb-4">New Skills Assessment</h2>
          <p>Create a new assessment for your candidates.</p>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAssessmentPage; 