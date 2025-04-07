// Interview priority types
export enum InterviewPriority {
  SPEED = 'speed',
  TECHNICAL = 'technical',
  CULTURE = 'culture',
  INITIATIVE = 'initiative'
}

// Interview style types
export enum InterviewStyle {
  CONTEXT_SIMULATION = 'context_simulation',
  LIVE_COLLABORATION = 'live_collaboration',
  ROLE_REVERSAL = 'role_reversal',
  WILDCARD = 'wildcard',
  CUSTOM = 'custom'
}

// Priority option data structure
export interface PriorityOption {
  value: InterviewPriority;
  label: string;
  description: string;
  icon: string;
}

// Interview style data structure
export interface InterviewStyleOption {
  value: InterviewStyle;
  label: string;
  description: string;
  icon: string;
  details: string[];
  recommendedFor: InterviewPriority;
}

// Interview format data
export const priorityOptions: PriorityOption[] = [
  {
    value: InterviewPriority.SPEED,
    label: 'Speed',
    description: 'I need to hire quickly and confidently.',
    icon: '⚡'
  },
  {
    value: InterviewPriority.TECHNICAL,
    label: 'Technical Strength',
    description: 'I want to deeply validate hard skills or real-world experience.',
    icon: '🧪'
  },
  {
    value: InterviewPriority.CULTURE,
    label: 'Culture & Team Fit',
    description: 'This person needs to thrive in our working style and values.',
    icon: '🤝'
  },
  {
    value: InterviewPriority.INITIATIVE,
    label: 'Initiative & Ownership',
    description: 'I want someone who can take charge and think like a builder.',
    icon: '🎯'
  }
];

// Interview style recommendations
export const interviewStyleOptions: InterviewStyleOption[] = [
  {
    value: InterviewStyle.CONTEXT_SIMULATION,
    label: 'Context Simulation Interview',
    description: 'Preview how they\'d handle real upcoming tasks in your startup.',
    icon: '🔧',
    details: [
      'See how the candidate would approach their first 30 days with your team',
      'Assess quick thinking and adaptation to your specific challenges',
      'Identify practical problem-solving capabilities'
    ],
    recommendedFor: InterviewPriority.SPEED
  },
  {
    value: InterviewStyle.LIVE_COLLABORATION,
    label: 'Live Collaboration Challenge',
    description: 'Work together on a real scenario, code, or decision.',
    icon: '👩‍💻',
    details: [
      'Solve a real startup problem together to evaluate real-world ability',
      'Observe communication skills and thought process in action',
      'Gain insight into technical depth and approach to collaboration'
    ],
    recommendedFor: InterviewPriority.TECHNICAL
  },
  {
    value: InterviewStyle.ROLE_REVERSAL,
    label: 'Role-Reversal Interview',
    description: 'They challenge your thinking and pitch their roadmap.',
    icon: '🫱',
    details: [
      'Flip the dynamic and assess chemistry, thinking style, and values alignment',
      'Evaluate how they would contribute to team discussions',
      'Understand their perspective on company culture and team dynamics'
    ],
    recommendedFor: InterviewPriority.CULTURE
  },
  {
    value: InterviewStyle.WILDCARD,
    label: 'Wildcard Challenge',
    description: 'Let them take the reins and impress.',
    icon: '🎲',
    details: [
      'Give them 30 minutes to show how they\'d contribute—on their terms',
      'Assess creativity, initiative, and self-direction',
      'Discover unexpected strengths and approaches'
    ],
    recommendedFor: InterviewPriority.INITIATIVE
  },
  {
    value: InterviewStyle.CUSTOM,
    label: 'Custom Interview Format',
    description: 'Design your own interview approach.',
    icon: '✏️',
    details: [
      'Create a personalized interview format',
      'Combine elements from different interview styles',
      'Tailor the experience to your specific evaluation needs'
    ],
    recommendedFor: InterviewPriority.SPEED // Default, but this won't be auto-recommended
  }
]; 