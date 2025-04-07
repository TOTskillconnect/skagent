import React from 'react';

// Define the possible tag types
type TagType = 'stage' | 'culture' | 'domain' | 'skill' | 'verification';

interface ContextTagProps {
  text: string;
  type: TagType;
  className?: string;
}

/**
 * ContextTag component displays tags with different styles based on their type
 * - stage: Yellow background (for stage-related context, e.g. "Series A Ready")
 * - culture: Teal background (for culture/team context, e.g. "Remote Team Fit")
 * - domain: Gray background (for domain/industry context, e.g. "Fintech Experience")
 * - skill: Light gray background (for skills, e.g. "React", "TypeScript")
 * - verification: Green background (for verification badges, e.g. "✅ Identity Verified")
 */
const ContextTag: React.FC<ContextTagProps> = ({ text, type, className = '' }) => {
  // Define the style variants based on type
  const getTagStyle = () => {
    switch (type) {
      case 'stage':
        return 'bg-amber-100 text-amber-700'; // Yellow
      case 'culture':
        return 'bg-teal-100 text-teal-700'; // Teal
      case 'domain':
        return 'bg-gray-100 text-gray-700'; // Gray
      case 'skill':
        return 'bg-slate-100 text-slate-700'; // Light gray
      case 'verification':
        return 'bg-green-100 text-green-700'; // Green
      default:
        return 'bg-gray-100 text-gray-700'; // Default to gray
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getTagStyle()} ${className}`}>
      {type === 'verification' && !text.startsWith('✅') && '✅ '}
      {text}
    </span>
  );
};

export default ContextTag; 