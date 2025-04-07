import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWizard } from '@/contexts/WizardContext';
import { useMatchedCandidates } from '@/contexts/MatchedCandidatesContext';
import { useSavedSearch } from '@/contexts/SavedSearchContext';
import Progress from '@/components/common/Progress';

// Define WizardStep type to match the context
type WizardStep = 
  | 'roleOverview'
  | 'startupContext' 
  | 'teamFit'
  | 'skillRequirements'
  | 'finalPreferences';

// Step labels for the progress bar
const stepLabels = [
  "Role",
  "Context",
  "Team",
  "Skills",
  "Review"
];

export default function WizardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [matchProcessing, setMatchProcessing] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  
  const { 
    currentStep, 
    formData, 
    updateFormData, 
    nextStep, 
    prevStep, 
    isFirstStep,
    isLastStep,
    resetWizard,
    goToStep
  } = useWizard();

  // Get access to the matched candidates context
  const { generateMatches, isGeneratingForCampaign } = useMatchedCandidates();
  
  // Get access to the saved search context
  const { saveSearch } = useSavedSearch();
  
  // Handle saving search parameters
  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      saveSearch(saveSearchName, formData);
      setSaveSearchName('');
      setShowSaveSearch(false);
    }
  };

  // Map steps to step numbers
  const steps: WizardStep[] = ['roleOverview', 'startupContext', 'teamFit', 'skillRequirements', 'finalPreferences'];
  const stepNumber = steps.indexOf(currentStep) + 1;
  const totalSteps = steps.length;

  // Handle step click
  const handleStepClick = (step: number) => {
    if (step <= stepNumber) {
      goToStep(steps[step - 1]);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLastStep) {
      setIsSubmitting(true);
      
      try {
        // Save the campaign to local storage
        const campaignId = String(Date.now());
        const newCampaign = {
          id: campaignId,
          title: formData.roleTitle || 'Untitled Campaign',
          jobType: formData.jobType || 'Full-time',
          dateCreated: new Date().toISOString(),
          status: 'active',
          ...formData
        };
        
        // Add to existing campaigns
        const existingCampaigns = JSON.parse(localStorage.getItem('hiringCampaigns') || '[]');
        localStorage.setItem('hiringCampaigns', JSON.stringify([...existingCampaigns, newCampaign]));
        
        // Show success message
        setShowSuccess(true);
        
        // After a delay, show match processing
        setTimeout(() => {
          setMatchProcessing(true);
          
          // Start the match generation
          const campaign = {
            id: campaignId,
            title: formData.roleTitle || 'Untitled Campaign',
            type: formData.jobType || 'Full-time',
            status: 'active',
            dateCreated: new Date().toISOString(),
            skills: formData.primarySkills ? formData.primarySkills.split(',').map((s: string) => s.trim()) : [],
            experience: '3-5 years',
            location: 'Remote',
            roleDescription: formData.hiringNeed || ''
          };
          
          // We'll give it 3-5 candidates immediately
          const count = parseInt(formData.candidateCount?.split(' ')[0] || '5', 10) || 5;
          
          // This will trigger candidate generation
          generateMatches(campaign, count).then(() => {
            setMatchSuccess(true);
            
            // After another delay, navigate to candidates
            setTimeout(() => {
              router.push(`/candidates?campaign=${campaignId}`);
            }, 1500);
          });
        }, 1500);
      } catch (error) {
        console.error('Error processing campaign:', error);
        setIsSubmitting(false);
      }
    } else {
      nextStep();
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    if (showSuccess) {
      return (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFB130] text-white rounded-full mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Hiring Request Created!</h2>
          <p className="text-gray-600 mb-6">
            We've added your new hiring request for a <span className="font-medium">{formData.roleTitle}</span> to your campaigns.
          </p>
          <div className="wizard-section mx-auto max-w-md">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#FFB130] rounded-full mr-2"></div>
              <p className="font-medium">
                {matchProcessing 
                  ? "Finding candidates that match your requirements..."
                  : matchSuccess 
                    ? "Candidate matches found and ready to view!"
                    : "Preparing to search for candidates..."}
              </p>
            </div>
            {matchProcessing && (
              <div className="mt-2 w-full bg-[#E5E5E5] h-2 rounded overflow-hidden">
                <div className="bg-[#FFB130] h-full animate-pulse"></div>
              </div>
            )}
            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>Expected matches: {formData.candidateCount || '5+ candidates'}</span>
              <span>{matchSuccess ? "Completed!" : "Processing..."}</span>
            </div>
          </div>
          
          {/* Save Search Option */}
          {!showSaveSearch && !matchSuccess && (
            <button
              type="button"
              onClick={() => setShowSaveSearch(true)}
              className="text-[#FFB130] underline mb-4 block mx-auto"
            >
              Save these search parameters for later
            </button>
          )}
          
          {showSaveSearch && (
            <div className="mb-6 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="Name this search"
                  className="wizard-input flex-1"
                />
                <button
                  type="button"
                  onClick={handleSaveSearch}
                  className="wizard-btn-next"
                  disabled={!saveSearchName.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="wizard-btn-next"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
    
    switch (currentStep) {
      case 'roleOverview':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-[#1E1E1E]">Tell us what you're looking for</h2>
            <p className="text-gray-600 mb-6">
              Help us understand what this person will do and how they'll contribute.
            </p>
            
            <div className="wizard-section">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="roleTitle" className="wizard-label">Role Title</label>
                  <input
                    id="roleTitle"
                    type="text"
                    className="wizard-input"
                    placeholder="e.g., Frontend Developer, Marketing Manager"
                    value={formData.roleTitle || ''}
                    onChange={(e) => updateFormData({ roleTitle: e.target.value })}
                    required
                  />
                  <p className="wizard-hint">
                    What position are you hiring for?
                  </p>
                </div>
                
                <div>
                  <label htmlFor="jobType" className="wizard-label">Job Type</label>
                  <div className="relative">
                    <select
                      id="jobType"
                      className="wizard-select"
                      value={formData.jobType || ''}
                      onChange={(e) => updateFormData({ jobType: e.target.value })}
                      required
                    >
                      <option value="">Select job type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="hiringNeed" className="wizard-label">What do you need this person to do?</label>
                <textarea
                  id="hiringNeed"
                  className="wizard-textarea h-24"
                  placeholder="e.g., Drive leads for a new product launch, or Build a scalable frontend architecture"
                  value={formData.hiringNeed || ''}
                  onChange={(e) => updateFormData({ hiringNeed: e.target.value })}
                  required
                />
                <p className="wizard-hint">
                  What problem will they solve for your business?
                </p>
              </div>
            </div>
            
            <div className="wizard-tip">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#FFB130] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#FFB130]">Pro Tip:</span> Be specific about immediate problems this person will solve. This helps our AI understand the real context of the role.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'startupContext':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-[#1E1E1E]">What's happening in your business right now?</h2>
            <p className="text-gray-600 mb-6">
              This helps us match you with people who've worked in similar stages or situations.
            </p>
            
            <div className="wizard-section">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessStage" className="wizard-label">Current Business Stage</label>
                  <div className="relative">
                    <select
                      id="businessStage"
                      className="wizard-select"
                      value={formData.businessStage || ''}
                      onChange={(e) => updateFormData({ businessStage: e.target.value })}
                      required
                    >
                      <option value="">Select business stage</option>
                      <option value="MVP">MVP</option>
                      <option value="Pre-seed">Pre-seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Growth">Growth</option>
                      <option value="Established">Established</option>
                      <option value="Small local business">Small local business</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="milestones" className="wizard-label">Key Milestones This Role Will Support</label>
                  <input
                    id="milestones"
                    type="text"
                    className="wizard-input"
                    placeholder="e.g., Launch V1, Close 10 enterprise clients, Raise seed round"
                    value={formData.milestones || ''}
                    onChange={(e) => updateFormData({ milestones: e.target.value })}
                  />
                  <p className="wizard-hint">
                    Separate multiple milestones with commas
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="strategy" className="wizard-label">Strategic Direction</label>
                <textarea
                  id="strategy"
                  className="wizard-textarea h-24"
                  placeholder="e.g., Scaling to the US market, or Launching a new product line"
                  value={formData.strategy || ''}
                  onChange={(e) => updateFormData({ strategy: e.target.value })}
                />
                <p className="wizard-hint">
                  Where are you headed in the next 6 months?
                </p>
              </div>
            </div>
            
            <div className="wizard-tip">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#FFB130] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#FFB130]">Pro Tip:</span> Being specific about your stage and goals helps us match candidates who've delivered in similar contexts.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'teamFit':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-[#1E1E1E]">What kind of person thrives on your team?</h2>
            <p className="text-gray-600 mb-6">
              We'll use this to align personalities and working styles.
            </p>
            
            <div className="wizard-section">
              <div className="p-4 bg-gray-100 text-sm font-medium text-[#1E1E1E] rounded-lg mb-5">
                <div className="flex items-center justify-between">
                  <span>Culture Values</span>
                  {formData.cultureValues && formData.cultureValues.length > 0 ? (
                    <span className="bg-[#FFB130]/20 text-[#FFB130] text-xs py-0.5 px-2 rounded-full">
                      {formData.cultureValues.length} selected
                    </span>
                  ) : null}
                </div>
              </div>
              
              <div className="mb-6 border-t border-[#E5E5E5] pt-5">
                <h3 className="text-base font-medium text-[#1E1E1E] mb-3">
                  Selected Values {formData.cultureValues && formData.cultureValues.length > 0 && 
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      ({formData.cultureValues.length} selected)
                    </span>
                  }
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.cultureValues && formData.cultureValues.map((value: string, index: number) => (
                    <span key={index} className="wizard-tag">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="industry" className="wizard-label">Industry/Background Preferences</label>
                  <input
                    id="industry"
                    type="text"
                    className="wizard-input"
                    placeholder="e.g., B2B SaaS, Marketplace, Fintech"
                    value={formData.industry || ''}
                    onChange={(e) => updateFormData({ industry: e.target.value })}
                  />
                  <p className="wizard-hint">
                    Separate multiple industries with commas
                  </p>
                </div>
                
                <div>
                  <label htmlFor="hiringTimeline" className="wizard-label">How soon do you need this person?</label>
                  <div className="relative">
                    <select
                      id="hiringTimeline"
                      className="wizard-select"
                      value={formData.hiringTimeline || ''}
                      onChange={(e) => updateFormData({ hiringTimeline: e.target.value })}
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="Within 1 week">Within 1 week</option>
                      <option value="Within 2 weeks">Within 2 weeks</option>
                      <option value="Within a month">Within a month</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="wizard-tip">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#FFB130] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#FFB130]">Pro Tip:</span> Consider both technical skills and communication style when describing your ideal candidate.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'skillRequirements':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-[#1E1E1E]">Which skills are essential—and which are nice to have?</h2>
            <p className="text-gray-600 mb-6">
              We'll use this to filter and rank candidates.
            </p>
            
            <div className="wizard-section">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primarySkills" className="wizard-label">Must-Have Skills</label>
                  <textarea
                    id="primarySkills"
                    className="wizard-textarea h-24"
                    placeholder="e.g., React, SQL, Lead Gen, Conversion Copy (separate with commas)"
                    value={formData.primarySkills || ''}
                    onChange={(e) => updateFormData({ primarySkills: e.target.value })}
                    required
                  />
                  <p className="wizard-hint">
                    These are the skills a candidate must possess
                  </p>
                </div>
                
                <div>
                  <label htmlFor="secondarySkills" className="wizard-label">Nice-to-Have Skills</label>
                  <textarea
                    id="secondarySkills"
                    className="wizard-textarea h-24"
                    placeholder="e.g., TypeScript, GraphQL, A/B Testing (separate with commas)"
                    value={formData.secondarySkills || ''}
                    onChange={(e) => updateFormData({ secondarySkills: e.target.value })}
                  />
                  <p className="wizard-hint">
                    These are skills that would be beneficial but aren't required
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <input
                  id="suggestSkills"
                  type="checkbox"
                  className="h-5 w-5 text-[#FFB130] rounded border-[#E5E5E5] focus:ring-[#FFB130]"
                  checked={formData.suggestSkills || false}
                  onChange={(e) => updateFormData({ suggestSkills: e.target.checked })}
                />
                <label htmlFor="suggestSkills" className="ml-2 text-sm text-[#1E1E1E]">
                  Let AI recommend missing skills based on role
                </label>
              </div>
            </div>
            
            <div className="wizard-tip">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#FFB130] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#FFB130]">Pro Tip:</span> For tech roles, include specific technologies. For business roles, include industry-specific competencies.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'finalPreferences':
        // Prepare a summary of the job brief
        const jobBrief = formData.roleTitle && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-[#1E1E1E]">Job Brief</h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">Role:</span> {formData.roleTitle} ({formData.jobType})
              </p>
              {formData.hiringNeed && (
                <p>
                  <span className="font-semibold">Need:</span> {formData.hiringNeed}
                </p>
              )}
              {formData.businessStage && (
                <p>
                  <span className="font-semibold">Business Stage:</span> {formData.businessStage}
                </p>
              )}
              {formData.strategy && (
                <p>
                  <span className="font-semibold">Strategic Direction:</span> {formData.strategy}
                </p>
              )}
              {formData.milestones && (
                <p>
                  <span className="font-semibold">Key Milestones:</span> {formData.milestones}
                </p>
              )}
              {formData.cultureValues && formData.cultureValues.length > 0 && (
                <p>
                  <span className="font-semibold">Values:</span> {formData.cultureValues.join(', ')}
                </p>
              )}
              {formData.industry && (
                <p>
                  <span className="font-semibold">Industry/Background:</span> {formData.industry}
                </p>
              )}
              {formData.hiringTimeline && (
                <p>
                  <span className="font-semibold">Timeline:</span> {formData.hiringTimeline}
                </p>
              )}
              {formData.primarySkills && (
                <p>
                  <span className="font-semibold">Must-Have Skills:</span> {formData.primarySkills}
                </p>
              )}
              {formData.secondarySkills && (
                <p>
                  <span className="font-semibold">Nice-to-Have Skills:</span> {formData.secondarySkills}
                </p>
              )}
            </div>
          </div>
        );
        
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-[#1E1E1E]">Review your brief—we'll take it from here</h2>
            <p className="text-gray-600 mb-6">
              You're almost done. Just tell us how many matches you want, and let SkillConnect find them for you.
            </p>
            
            <div className="wizard-section">
              <div className="mb-6">
                <label htmlFor="candidateCount" className="wizard-label">How many matches would you like to see?</label>
                <div className="relative max-w-xs">
                  <select
                    id="candidateCount"
                    className="wizard-select"
                    value={formData.candidateCount || '5 matches'}
                    onChange={(e) => updateFormData({ candidateCount: e.target.value })}
                  >
                    <option value="5 matches">5 matches</option>
                    <option value="10 matches">10 matches</option>
                    <option value="15 matches">15 matches</option>
                    <option value="25 matches">25 matches</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-5 border border-[#E5E5E5]">
                {jobBrief || (
                  <div className="text-center py-4 text-gray-500">
                    Complete previous steps to see your job brief
                  </div>
                )}
              </div>
            </div>
            
            <div className="wizard-tip">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#FFB130] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-[#FFB130]">Pro Tip:</span> Start with fewer top matches to quickly identify the best candidates, then explore more if needed.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Step: {currentStep}</h2>
            <p className="text-text-secondary mb-4">
              This step is under development. Please click Next to continue.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <Head>
        <title>{`Smart Hire Wizard | SkillConnect`}</title>
        <meta name="description" content="Create a new hiring request with our smart wizard" />
      </Head>

      {/* Progress Bar - Now Sticky */}
      <Progress 
        value={stepNumber}
        max={totalSteps}
        steps={stepLabels}
        currentStep={stepNumber}
        onStepClick={handleStepClick}
        sticky={true}
        size="sm"
      />

      <div className="max-w-4xl mx-auto px-4 pt-12 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E1E1E]">Smart Hire Wizard</h1>
          <p className="text-gray-600 mt-2">
            Tell us about your hiring needs and we'll find the perfect candidates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="wizard-card">
          <div className="p-6">
            {renderStepContent()}
          </div>

          <div className="mt-6 p-6 border-t border-[#E5E5E5] bg-gray-50 flex justify-between rounded-b-xl">
            <button
              type="button"
              onClick={prevStep}
              disabled={isFirstStep || isSubmitting || showSuccess}
              className={`wizard-btn-back ${(isFirstStep || isSubmitting || showSuccess) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Back
            </button>
            <button
              type={isLastStep ? 'submit' : 'button'}
              onClick={isLastStep ? undefined : nextStep}
              disabled={isSubmitting || showSuccess}
              className={`wizard-btn-next ${isSubmitting ? 'opacity-75' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : isLastStep ? 'Find My Matches' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 