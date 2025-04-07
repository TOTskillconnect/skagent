import { Assessment, AssessmentTemplate } from '@/types/assessments';

// Mock assessments data
export const mockAssessments: Record<string, Assessment> = {
  "ass000001": {
    id: "ass000001",
    type: "technical",
    title: "Frontend Development Challenge",
    description: "Create a responsive component using React and CSS",
    instructions: "You are tasked with building a responsive navigation component that includes dropdown menus. Use React hooks for state management and write clean, maintainable CSS.",
    duration: 120, // minutes
    difficulty: "medium",
    status: "pending",
    createdAt: "2024-01-15T09:00:00.000Z",
    updatedAt: "2024-01-15T09:00:00.000Z"
  },
  "ass000002": {
    id: "ass000002",
    type: "behavioral",
    title: "Problem Solving Assessment",
    description: "Assesses your approach to complex problems",
    instructions: "You will be presented with a series of business scenarios. For each, outline your approach to solving the problem, the steps you would take, and what success would look like.",
    duration: 45, // minutes
    difficulty: "hard",
    status: "completed",
    createdAt: "2024-01-10T10:30:00.000Z",
    updatedAt: "2024-01-12T14:15:00.000Z"
  },
  "ass000003": {
    id: "ass000003",
    type: "cultural",
    title: "Values Alignment",
    description: "Evaluate alignment with company values",
    instructions: "Read each company value and provide an example from your experience that demonstrates how you've embodied this value in your professional life.",
    duration: 30, // minutes
    difficulty: "easy",
    status: "in_progress",
    createdAt: "2024-01-20T11:45:00.000Z",
    updatedAt: "2024-01-20T11:45:00.000Z"
  }
};

// Mock assessment templates
export const mockAssessmentTemplates: Record<string, AssessmentTemplate> = {
  "tpl000001": {
    id: "tpl000001",
    type: "technical",
    subtype: "frontend_dev",
    title: "Frontend Development Challenge",
    description: "Create a responsive component using React and CSS",
    instructions: "You are tasked with building a responsive navigation component that includes dropdown menus. Use React hooks for state management and write clean, maintainable CSS.",
    duration: 120, // minutes
    difficulty: "medium",
    createdAt: "2024-01-10T09:00:00.000Z",
    updatedAt: "2024-01-10T09:00:00.000Z"
  },
  "tpl000002": {
    id: "tpl000002",
    type: "behavioral",
    subtype: "decision_simulation",
    title: "Problem Solving Assessment",
    description: "Assesses your approach to complex problems",
    instructions: "You will be presented with a series of business scenarios. For each, outline your approach to solving the problem, the steps you would take, and what success would look like.",
    duration: 45, // minutes
    difficulty: "hard",
    createdAt: "2024-01-05T10:30:00.000Z",
    updatedAt: "2024-01-05T10:30:00.000Z"
  },
  'tpl000003': {
    id: 'tpl000003',
    type: 'technical',
    title: 'Full Stack Development Template',
    description: 'End-to-end development assessment covering both frontend and backend skills.',
    instructions: 'Complete the following tasks:\n1. Design and implement a full-stack application\n2. Set up CI/CD pipeline\n3. Implement security measures\n4. Write comprehensive tests',
    duration: 180,
    difficulty: 'hard',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  'tpl000004': {
    id: 'tpl000004',
    type: 'technical',
    title: 'DevOps Engineering Template',
    description: 'DevOps assessment focusing on infrastructure, deployment, and automation.',
    instructions: 'Complete the following tasks:\n1. Set up cloud infrastructure\n2. Configure CI/CD pipeline\n3. Implement monitoring\n4. Write infrastructure as code',
    duration: 120,
    difficulty: 'hard',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Behavioral Game Templates
  'tpl000005': {
    id: 'tpl000005',
    type: 'behavioral',
    title: 'Decision Simulation: Team Deadline Crisis',
    description: 'Navigate conflicting stakeholder feedback, morale issues, and tight timelines. See how they prioritize and communicate.',
    instructions: 'You are a team lead whose team just missed a critical deadline. Handle stakeholder feedback, team morale, and project timeline adjustments.',
    duration: 60,
    difficulty: 'hard',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000006': {
    id: 'tpl000006',
    type: 'behavioral',
    title: 'Survive the Pivot Game',
    description: 'Simulate a sudden product pivot. Candidate must reassign teams, communicate trade-offs, and decide what features to cut.',
    instructions: 'Your product is pivoting to a new direction. Reassign teams, communicate changes, and make feature cut decisions while maintaining team morale.',
    duration: 45,
    difficulty: 'hard',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000007': {
    id: 'tpl000007',
    type: 'behavioral',
    title: 'Founder Feedback Test',
    description: 'Candidate plays the role of a PM or team lead getting vague, high-pressure feedback from a founder.',
    instructions: 'You are a PM receiving vague, high-pressure feedback from the founder. Translate it into actionable strategy and communicate it to your team.',
    duration: 45,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000008': {
    id: 'tpl000008',
    type: 'behavioral',
    title: 'Ethical Budget Cut Dilemma',
    description: 'Choose between laying off a top performer or cutting a product feature that affects user trust.',
    instructions: 'You must make a difficult budget cut decision. Choose between laying off a top performer or cutting a critical product feature. Justify your decision.',
    duration: 30,
    difficulty: 'hard',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000009': {
    id: 'tpl000009',
    type: 'behavioral',
    title: 'Investor Fire Drill',
    description: 'Simulate a situation where a prospective investor suddenly wants data insights, pitch slides, and roadmap answers—fast.',
    instructions: 'An investor has requested immediate access to key metrics, pitch materials, and roadmap details. Prepare and present this information effectively.',
    duration: 45,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000010': {
    id: 'tpl000010',
    type: 'behavioral',
    title: 'Crisis Response Mini-Game',
    description: 'A public bug or customer data leak has occurred—candidate must draft a communication plan under stress.',
    instructions: 'A critical bug has affected customer data. Create a communication plan addressing stakeholders, customers, and the public.',
    duration: 30,
    difficulty: 'hard',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000011': {
    id: 'tpl000011',
    type: 'behavioral',
    title: 'Team Conflict Resolution Puzzle',
    description: 'Candidate is given three differing teammate viewpoints. How do they mediate and align the team?',
    instructions: 'You have three team members with conflicting views on a project direction. Mediate the situation and align the team on a path forward.',
    duration: 45,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },

  // Roleplay Exercise Templates
  'tpl000012': {
    id: 'tpl000012',
    type: 'behavioral',
    title: 'Founder 1:1 Roleplay - Launch Delay',
    description: 'The candidate must challenge the founder\'s timeline with data or user feedback—assertive yet diplomatic.',
    instructions: 'You need to convince the founder to delay a product launch. Use data and user feedback to make your case diplomatically.',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000013': {
    id: 'tpl000013',
    type: 'behavioral',
    title: 'Client Escalation Simulation',
    description: 'Handle a difficult client call regarding scope creep or product failure. Test problem ownership and empathy.',
    instructions: 'A client is upset about scope changes and product issues. Handle the situation professionally while maintaining the relationship.',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000014': {
    id: 'tpl000014',
    type: 'behavioral',
    title: 'Remote Team Standup',
    description: 'Run a simulated async standup in Slack/Notion. Communicate what\'s blocking progress, share wins, and ask for support.',
    instructions: 'Lead an async standup meeting. Share updates, address blockers, and maintain team engagement in a remote setting.',
    duration: 30,
    difficulty: 'easy',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000015': {
    id: 'tpl000015',
    type: 'behavioral',
    title: 'Difficult Peer Feedback',
    description: 'Roleplay giving constructive feedback to a peer who\'s missed deadlines—test tact, emotional intelligence.',
    instructions: 'You need to give constructive feedback to a peer who has consistently missed deadlines. Deliver the feedback tactfully and effectively.',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000016': {
    id: 'tpl000016',
    type: 'behavioral',
    title: 'Boardroom Briefing Simulation',
    description: 'The candidate must walk "the board" through quarterly progress, challenges, and a bold roadmap pivot.',
    instructions: 'Present quarterly progress to the board, including challenges and a proposed pivot in the product roadmap.',
    duration: 45,
    difficulty: 'hard',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  'tpl000017': {
    id: 'tpl000017',
    type: 'behavioral',
    title: 'Cross-functional Debrief',
    description: 'Candidate plays the team lead sharing product metrics with design, sales, and marketing after a failed launch.',
    instructions: 'Lead a cross-functional debrief after a failed product launch. Share metrics and align teams on next steps.',
    duration: 45,
    difficulty: 'medium',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },

  // Values Assessment Templates (Life Story Prompts)
  'tpl000018': {
    id: 'tpl000018',
    type: 'cultural',
    title: 'Values Alignment: Success Walkaway',
    description: 'Reveals values around integrity, alignment, purpose.',
    instructions: 'Tell us about a time you walked away from something "successful" and why you made that decision.',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  'tpl000019': {
    id: 'tpl000019',
    type: 'cultural',
    title: 'Work Environment Fit',
    description: 'Surfaces environment preferences and emotional triggers.',
    instructions: 'When did you feel most out of place at work—and why?',
    duration: 30,
    difficulty: 'easy',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  'tpl000020': {
    id: 'tpl000020',
    type: 'cultural',
    title: 'Innovation Philosophy',
    description: 'Assesses risk-taking and innovation philosophy.',
    instructions: 'Describe a time you broke something to fix something better.',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  'tpl000021': {
    id: 'tpl000021',
    type: 'cultural',
    title: 'Leadership Journey',
    description: 'Brings out character growth and leadership style.',
    instructions: 'What\'s a difficult personal decision that shaped how you lead today?',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  'tpl000022': {
    id: 'tpl000022',
    type: 'cultural',
    title: 'Purpose and Mission',
    description: 'Tests mission-alignment, curiosity, purpose.',
    instructions: 'If we gave you 3 months paid to solve any problem—what would you do?',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  'tpl000023': {
    id: 'tpl000023',
    type: 'cultural',
    title: 'Personal Achievement',
    description: 'Reveals what fulfillment looks like for them.',
    instructions: 'When were you most proud—professionally or personally?',
    duration: 30,
    difficulty: 'easy',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  'tpl000024': {
    id: 'tpl000024',
    type: 'cultural',
    title: 'Hidden Strengths',
    description: 'Unlocks personality, non-linear growth, hidden strengths.',
    instructions: 'Tell us a story that your résumé doesn\'t.',
    duration: 30,
    difficulty: 'medium',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
}; 