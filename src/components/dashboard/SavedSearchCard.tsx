import React from 'react';
import { SavedSearch } from '@/contexts/SavedSearchContext';
import { useRouter } from 'next/router';

interface SavedSearchCardProps {
  search: SavedSearch;
  onDelete: (id: string) => void;
}

export default function SavedSearchCard({ search, onDelete }: SavedSearchCardProps) {
  const router = useRouter();

  // Handle applying a saved search
  const applySearch = () => {
    router.push({
      pathname: '/wizard',
      query: { savedSearchId: search.id }
    });
  };

  // Format date to be more readable
  const formattedDate = new Date(search.dateCreated).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:border-[#FFB130] hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{search.name}</h3>
        <button 
          onClick={() => onDelete(search.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-50"
          aria-label="Delete saved search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        Saved on {formattedDate}
      </div>
      
      <div className="mb-4 min-h-[40px]">
        {search.parameters.roleTitle && (
          <div className="bg-[#FFB130]/10 text-[#FFB130] text-xs py-1 px-2 rounded-full font-medium inline-block mr-2 mb-2">
            {search.parameters.roleTitle}
          </div>
        )}
        {search.parameters.jobType && (
          <div className="bg-[#FFB130]/10 text-[#FFB130] text-xs py-1 px-2 rounded-full font-medium inline-block mr-2 mb-2">
            {search.parameters.jobType}
          </div>
        )}
        {search.parameters.primarySkills && (
          <div className="bg-[#FFB130]/10 text-[#FFB130] text-xs py-1 px-2 rounded-full font-medium inline-block mr-2 mb-2">
            {search.parameters.primarySkills.split(',')[0].trim()}
            {search.parameters.primarySkills.includes(',') && ' + more'}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={applySearch}
          className="flex-1 bg-gray-50 hover:bg-gray-200 hover:text-black text-gray-800 font-medium py-2 rounded-md transition-all duration-200 text-sm"
        >
          Apply search
        </button>
      </div>
    </div>
  );
} 