import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SavedSearch {
  id: string;
  name: string;
  dateCreated: string;
  parameters: {
    roleTitle?: string;
    jobType?: string;
    hiringNeed?: string;
    businessStage?: string;
    industry?: string;
    primarySkills?: string;
    secondarySkills?: string;
    cultureValues?: string[];
    hiringTimeline?: string;
    candidateCount?: string;
    [key: string]: any;
  };
}

interface SavedSearchContextType {
  savedSearches: SavedSearch[];
  saveSearch: (name: string, parameters: SavedSearch['parameters']) => SavedSearch;
  deleteSavedSearch: (id: string) => void;
  getSavedSearch: (id: string) => SavedSearch | undefined;
}

const SavedSearchContext = createContext<SavedSearchContextType | undefined>(undefined);

export const SavedSearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      try {
        setSavedSearches(JSON.parse(storedSearches));
      } catch (error) {
        console.error('Error parsing saved searches:', error);
        setSavedSearches([]);
      }
    }
  }, []);

  // Save searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  // Save a new search
  const saveSearch = (name: string, parameters: SavedSearch['parameters']): SavedSearch => {
    const newSearch: SavedSearch = {
      id: String(Date.now()),
      name,
      dateCreated: new Date().toISOString(),
      parameters
    };

    setSavedSearches((prev) => [...prev, newSearch]);
    return newSearch;
  };

  // Delete a saved search
  const deleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== id));
  };

  // Get a specific saved search by ID
  const getSavedSearch = (id: string): SavedSearch | undefined => {
    return savedSearches.find((search) => search.id === id);
  };

  return (
    <SavedSearchContext.Provider
      value={{
        savedSearches,
        saveSearch,
        deleteSavedSearch,
        getSavedSearch,
      }}
    >
      {children}
    </SavedSearchContext.Provider>
  );
};

// Custom hook to use the saved search context
export const useSavedSearch = (): SavedSearchContextType => {
  const context = useContext(SavedSearchContext);
  if (context === undefined) {
    throw new Error('useSavedSearch must be used within a SavedSearchProvider');
  }
  return context;
}; 