import React, { ReactNode } from 'react';
import { WizardProvider } from './WizardContext';
import { CandidatesProvider } from './CandidatesContext';
import { AssessmentsProvider } from './AssessmentsContext';
import { ReportsProvider } from './ReportsContext';

// AppProvider combines all context providers
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WizardProvider>
      <CandidatesProvider>
        <AssessmentsProvider>
          <ReportsProvider>
            {children}
          </ReportsProvider>
        </AssessmentsProvider>
      </CandidatesProvider>
    </WizardProvider>
  );
}; 