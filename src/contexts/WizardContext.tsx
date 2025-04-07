import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useSavedSearch } from './SavedSearchContext';

type FormDataType = {
  roleTitle?: string;
  jobType?: string;
  hiringNeed?: string;
  businessStage?: string;
  strategy?: string;
  milestones?: string;
  industry?: string;
  hiringTimeline?: string;
  cultureValues?: string[];
  primarySkills?: string;
  secondarySkills?: string;
  suggestSkills?: boolean;
  candidateCount?: string;
  [key: string]: any;
};

type WizardStep = 
  | 'roleOverview'
  | 'startupContext' 
  | 'teamFit'
  | 'skillRequirements'
  | 'finalPreferences';

interface WizardContextType {
  currentStep: WizardStep;
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  resetWizard: () => void;
  goToStep: (step: WizardStep) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const router = useRouter();
  const { savedSearchId } = router.query;
  const { getSavedSearch } = useSavedSearch();
  
  const steps: WizardStep[] = [
    'roleOverview',
    'startupContext',
    'teamFit',
    'skillRequirements',
    'finalPreferences'
  ];

  const [currentStep, setCurrentStep] = useState<WizardStep>('roleOverview');
  const [formData, setFormData] = useState<FormDataType>({});

  // Load saved search if savedSearchId is provided in the URL
  useEffect(() => {
    if (savedSearchId && typeof savedSearchId === 'string') {
      const savedSearch = getSavedSearch(savedSearchId);
      if (savedSearch) {
        // Load the saved search parameters into the form data
        setFormData(savedSearch.parameters);
      }
    }
  }, [savedSearchId, getSavedSearch]);

  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const resetWizard = () => {
    setCurrentStep('roleOverview');
    setFormData({});
  };

  const isFirstStep = currentStep === steps[0];
  const isLastStep = currentStep === steps[steps.length - 1];

  return (
    <WizardContext.Provider value={{
      currentStep,
      formData,
      updateFormData,
      nextStep,
      prevStep,
      isFirstStep,
      isLastStep,
      resetWizard,
      goToStep
    }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}; 