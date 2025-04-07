import '@/styles/globals.css';
import '@/styles/components.css';
import '@/styles/variables.css';
import type { AppProps } from 'next/app';
import { CandidatesProvider } from '@/contexts/CandidatesContext';
import { AssessmentsProvider } from '@/contexts/AssessmentsContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { ResultsProvider } from '@/contexts/ResultsContext';
import { WizardProvider } from '@/contexts/WizardContext';
import { MatchedCandidatesProvider } from '@/contexts/MatchedCandidatesContext';
import { SavedSearchProvider } from '@/contexts/SavedSearchContext';
import { ArchivedCandidatesProvider } from '@/contexts/ArchivedCandidatesContext';
import Layout from '@/components/common/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CandidatesProvider>
      <AssessmentsProvider>
        <ReportsProvider>
          <ResultsProvider>
            <SavedSearchProvider>
              <ArchivedCandidatesProvider>
                <WizardProvider>
                  <MatchedCandidatesProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </MatchedCandidatesProvider>
                </WizardProvider>
              </ArchivedCandidatesProvider>
            </SavedSearchProvider>
          </ResultsProvider>
        </ReportsProvider>
      </AssessmentsProvider>
    </CandidatesProvider>
  );
} 