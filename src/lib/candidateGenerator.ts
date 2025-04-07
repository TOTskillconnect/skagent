/**
 * Candidate Generator
 * 
 * Creates realistic candidate profiles that match campaign requirements
 * with varying degrees of fit to enable meaningful comparison
 */

// First install uuid with: npm install uuid @types/uuid
// But for now let's create a simple replacement
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

import { storeCandidatesForCampaign } from './storageManager';

// Types
export interface Candidate {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  skills: string[];
  standoutSkills?: string[]; // New: marked standout skills
  contextFit: string;
  summary?: string; // New: structured summary
  experience: number;
  education?: string;
  status: 'new' | 'contacted' | 'in_assessment' | 'interviewed' | 'hired' | 'rejected';
  campaignId: string;
  matchReasons: MatchReason[];
  contextTags?: { // New: structured context tags
    stage?: string;
    culture?: string;
    industry?: string;
  };
  location?: string;
  salary?: string;
  availability?: string;
  industry?: string;
  projects?: { // New: project links
    title: string;
    url: string;
    platform: string;
  }[];
  verifications?: string[]; // New: verification badges
  avatarSeed?: string; // New: seed for avatar generation
}

export interface MatchReason {
  type: 'skill' | 'experience' | 'industry' | 'culture' | 'education';
  description: string;
  weight: number; // 0-100, how much this contributes to match score
}

export interface Campaign {
  id: string;
  title: string;
  type: string;
  dateCreated: string;
  status: string;
  jobType?: string;
  businessStage?: string;
  roleTitle?: string;
  industry?: string;
  primarySkills?: string;
  secondarySkills?: string;
  hiringNeed?: string;
  strategy?: string;
  milestones?: string;
  cultureValues?: string[];
  hiringTimeline?: string;
  candidateCount?: string;
  [key: string]: any;
}

// Constants for candidate generation

// Expanded with diverse regional names
const FIRST_NAMES = [
  // European/Western
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jesse',
  'Sarah', 'James', 'Emily', 'Michael', 'Emma', 'Joshua', 'Olivia',
  'Daniel', 'Sophia', 'William', 'Charlotte', 'Hamish', 'Fiona',
  
  // African
  'Kwame', 'Amara', 'Jabari', 'Zola', 'Sefu', 'Nia', 'Kofi', 'Aisha',
  
  // South Asian
  'Arjun', 'Divya', 'Rohan', 'Priya', 'Vikram', 'Meera', 'Raj', 'Neha',
  
  // East Asian
  'Ming', 'Li', 'Jian', 'Wei', 'Hiroshi', 'Yuki', 'Ji-hoon', 'Min-ji',
  
  // Latinx
  'Javier', 'Carmen', 'Mateo', 'Sofia', 'Diego', 'Isabella', 'Ricardo', 'Elena',
  
  // Middle Eastern/Arab
  'Omar', 'Fatima', 'Hassan', 'Layla', 'Ahmed', 'Zara', 'Ali', 'Yasmin'
];

const LAST_NAMES = [
  // European/Western
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
  'Moore', 'Scott', 'Campbell', 'MacLeod', 'MacDonald', 'O\'Connor',
  
  // African
  'Okafor', 'Mensah', 'Nkosi', 'Abara', 'Okoro', 'Diallo', 'Mwangi', 'Osei',
  
  // South Asian
  'Patel', 'Sharma', 'Singh', 'Kumar', 'Agarwal', 'Reddy', 'Banerjee', 'Desai',
  
  // East Asian
  'Zhang', 'Wang', 'Chen', 'Liu', 'Tanaka', 'Suzuki', 'Kim', 'Park',
  
  // Latinx
  'Rodriguez', 'Hernandez', 'Garcia', 'Martinez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez',
  
  // Middle Eastern/Arab
  'Al-Fayez', 'Hassan', 'Ahmed', 'Khalid', 'Rahman', 'Amir', 'Zaidi', 'Najjar'
];

// New: Regional name combinations to ensure culturally coherent names
const NAME_REGIONS = {
  western: { first: [0, 19], last: [0, 19] },
  african: { first: [20, 27], last: [20, 27] },
  southAsian: { first: [28, 35], last: [28, 35] },
  eastAsian: { first: [36, 43], last: [36, 43] },
  latinx: { first: [44, 51], last: [44, 51] },
  middleEastern: { first: [52, 59], last: [52, 59] }
};

// New: Structured startup roles
const STARTUP_ROLES = [
  // Technical roles
  'Frontend Engineer', 'Backend Engineer', 'Full-Stack Developer', 
  'DevOps Engineer', 'Mobile Developer', 'Data Scientist', 
  'Machine Learning Engineer', 'Site Reliability Engineer',
  
  // Product roles
  'Product Manager', 'Product Designer', 'UX Designer', 
  'UX Researcher', 'Product Marketing Manager',
  
  // Growth roles
  'Growth Marketer', 'Growth Hacker', 'Digital Marketing Specialist',
  'Content Strategist', 'SEO Specialist', 'Social Media Manager',
  
  // Business roles
  'Business Development', 'Sales Representative', 'Account Manager',
  'Customer Success Manager', 'Operations Manager'
];

// New: Domains mapped to startup roles
const ROLE_DOMAINS = {
  'SaaS': ['Product Manager', 'Full-Stack Developer', 'Customer Success Manager'],
  'Fintech': ['Backend Engineer', 'Data Scientist', 'Compliance Specialist'],
  'Healthtech': ['Mobile Developer', 'Product Designer', 'HIPAA Compliance Manager'],
  'E-commerce': ['Frontend Engineer', 'Growth Marketer', 'UX Designer'],
  'Edtech': ['Full-Stack Developer', 'Content Strategist', 'Product Manager'],
  'Marketplace': ['Operations Manager', 'Growth Hacker', 'Business Development'],
  'AI/ML': ['Machine Learning Engineer', 'Data Scientist', 'AI Product Manager'],
  'Consumer': ['Mobile Developer', 'UX Designer', 'Social Media Manager']
};

const EDUCATION_LEVELS = [
  'High School', 'Associate\'s Degree', 'Bachelor\'s Degree', 
  'Master\'s Degree', 'PhD', 'Bootcamp Graduate', 'Self-taught'
];

// New: Expanded locations with remote options
const LOCATIONS = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
  'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO',
  'Atlanta, GA', 'Miami, FL', 'Portland, OR', 'Nashville, TN',
  'Toronto, Canada', 'London, UK', 'Berlin, Germany', 'Singapore',
  'Remote (US)', 'Remote (EMEA)', 'Remote (APAC)', 'Remote (Global)'
];

// Map job types to salary ranges
const SALARY_RANGES: Record<string, [number, number]> = {
  'Full-time': [70000, 150000],
  'Part-time': [30000, 70000],
  'Contract': [50, 150], // hourly rate
  'Freelance': [50, 200], // hourly rate
  'Internship': [20000, 50000]
};

// New: Context tag categories (Updated based on candidatedetailrule.md)
const CONTEXT_TAGS = {
  stage: [
    'Pre-seed Ready', 
    'Seed-stage Fit', 
    'Series A Ready', 
    'MVP Builder', 
    'Post-Launch Optimizer',
    'Growth-stage Expert',
    'Scale-up Specialist',
    'Pre-Seed Specialist',
    'Built MVPs Before'
  ],
  culture: [
    'Async', 
    'Remote-First', 
    'Flat Teams', 
    'Lean Ops',
    'Agile Methodology',
    'Fast-paced',
    'Data-driven',
    'Customer-obsessed',
    'Async Team Fit',
    'Global Remote Teams',
    'No-Manager Teams',
    'Cross-Functional Leader',
    'Startup Generalist'
  ],
  industry: [
    'Fintech', 
    'Edtech', 
    'SaaS', 
    'ClimateTech',
    'Healthtech',
    'E-commerce',
    'Marketplace',
    'Consumer Apps',
    'Enterprise Software',
    'AI/ML',
    'Fintech Experience',
    'Healthcare Compliance Aware',
    'Design-to-Dev Collaboration'
  ]
};

// New: Verification checks
const VERIFICATION_CHECKS = [
  '✅ Experience Verified',
  '✅ ID Confirmed',
  '✅ Reference Provided',
  '✅ Skills Tested',
  '✅ Assessment Passed',
  '✅ Background Checked'
];

// New: Project platforms and formats
const PROJECT_PLATFORMS = {
  github: {
    prefix: 'https://github.com/',
    description: ['Portfolio', 'Code Samples', 'Open Source', 'Project']
  },
  notion: {
    prefix: 'https://notion.so/',
    description: ['Case Study', 'Documentation', 'Strategy', 'Plan']
  },
  medium: {
    prefix: 'https://medium.com/',
    description: ['Article', 'Guide', 'Tutorial', 'Analysis']
  },
  dribbble: {
    prefix: 'https://dribbble.com/',
    description: ['Portfolio', 'Designs', 'UI Showcase', 'Mockups']
  },
  linkedin: {
    prefix: 'https://linkedin.com/in/',
    description: ['Profile', 'Recommendations', 'Experience']
  }
};

// New: Role-specific skill banks
const ROLE_SKILLS = {
  'Frontend Engineer': ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Redux', 'Next.js', 'Vue.js', 'Styled Components', 'Responsive Design', 'Web Performance', 'Webpack'],
  'Backend Engineer': ['Node.js', 'Python', 'Java', 'Go', 'REST APIs', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Microservices'],
  'Full-Stack Developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Git', 'CI/CD', 'AWS', 'System Design'],
  'DevOps Engineer': ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Jenkins', 'Monitoring', 'Infrastructure as Code', 'GitOps', 'Security'],
  'Mobile Developer': ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android', 'Mobile UX', 'App Store Optimization', 'Push Notifications', 'Offline Storage'],
  'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Data Visualization', 'Statistical Analysis', 'Pandas', 'scikit-learn', 'TensorFlow', 'Big Data'],
  'Machine Learning Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'Model Deployment', 'Feature Engineering'],
  'Product Manager': ['User Research', 'Roadmapping', 'Prioritization', 'Agile', 'Jira', 'A/B Testing', 'Product Strategy', 'Stakeholder Management', 'Data Analytics'],
  'UX Designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Design Thinking', 'User Testing', 'Adobe XD', 'UI Design'],
  'Growth Marketer': ['SEO', 'Funnel Strategy', 'Lifecycle Emails', 'Retention', 'HubSpot', 'User Acquisition', 'A/B Testing', 'Analytics', 'Content Marketing'],
  'Operations Manager': ['Process Optimization', 'Project Management', 'Team Coordination', 'Resource Allocation', 'KPIs', 'Reporting', 'Risk Management'],
  'Customer Success Manager': ['Client Onboarding', 'Retention Strategies', 'SaaS Metrics', 'Relationship Building', 'Product Training', 'Customer Feedback', 'CRM']
};

// New: Startup-specific summary components
const SUMMARY_COMPONENTS = {
  actions: [
    'Led', 'Scaled', 'Built', 'Launched', 'Implemented', 'Developed', 'Architected', 
    'Managed', 'Redesigned', 'Optimized', 'Transformed', 'Streamlined', 'Established'
  ],
  objects: [
    'product development', 'engineering team', 'cross-functional teams', 'GTM strategy', 
    'user acquisition', 'platform redesign', 'customer onboarding', 'growth experiments',
    'technical stack', 'design system', 'content strategy', 'data infrastructure'
  ],
  startupTerms: [
    'MVP', 'pivoted', 'ARR', 'MRR', 'async', 'pre-seed', 'seed funding', 'Series A',
    'product-market fit', 'CAC', 'churn', 'NPS', 'runway', 'bootstrapped'
  ],
  outcomes: [
    'grew to 10K users', 'increased conversion by 25%', 'closed first $50K',
    'reduced churn by 30%', 'doubled MRR', 'achieved product-market fit',
    'expanded to 3 new markets', 'built a team of 12', 'secured seed funding'
  ],
  traits: [
    'Thrives in fast-paced environments', 'Strong in cross-functional collaboration',
    'Excels at turning ideas into execution', 'Data-driven decision maker',
    'Known for structured thinking', 'Balances speed and quality',
    'Prefers startup pace', 'Adapts to changing priorities'
  ]
};

// New: Bonus variations
const BONUS_VARIATIONS = [
  'Worked with YC-backed teams',
  'Experience in zero-to-one launches',
  'Led a team of {X} direct reports remotely',
  'Managed $XM in revenue growth',
  'Built products used by Fortune 500 companies',
  'Scaled teams from {X} to {Y} people',
  'Mentored junior talent',
  'Specialized in early-stage startups'
];

/**
 * Generate a set of candidate matches for a specific campaign
 */
export const generateCandidatesForCampaign = async (
  campaign: Campaign, 
  count: number = 5
): Promise<Candidate[]> => {
  console.log("Generating candidates for campaign:", campaign.id);
  // Return a promise to simulate async operation
  return new Promise<Candidate[]>(resolve => {
    setTimeout(() => {
      const candidates: Candidate[] = [];
      
      // Parse skills from campaign data
      const primarySkills = parseSkills(campaign.primarySkills);
      const secondarySkills = parseSkills(campaign.secondarySkills);
      const allPossibleSkills = [...primarySkills, ...secondarySkills];
      
      // Parse industry preferences
      const industries = parseList(campaign.industry);
      
      // Generate each candidate
      for (let i = 0; i < count; i++) {
        // Calculate match score based on candidategenerationrules.md (78-95% range)
        const baseMatchScore = Math.round(78 + Math.random() * 17); // 78-95 range per rule requirement
        
        // Weight by position in results (first few candidates are better matches)
        // First result should be at the top of the range, last at the bottom
        const positionFactor = 1 - (i / (count * 1.5)); // Adjustment factor based on position
        let adjustedMatchScore = Math.round(baseMatchScore * positionFactor + baseMatchScore * (1 - positionFactor));
        
        // Ensure score stays in the required 78-95% range
        adjustedMatchScore = Math.max(78, Math.min(95, adjustedMatchScore));
        
        // Create candidate with appropriate match score and attributes
        const candidate = createCandidateProfile(
          campaign,
          adjustedMatchScore,
          primarySkills,
          secondarySkills,
          allPossibleSkills,
          industries
        );
        
        candidates.push(candidate);
      }
      
      // Sort by match score
      candidates.sort((a, b) => b.matchScore - a.matchScore);
      
      // Store in local storage
      storeCandidatesForCampaign(campaign.id, candidates);
      
      resolve(candidates);
    }, 1000); // Reduced delay for better UX
  });
};

// Fix the Set issue by converting to array first
function arrayFromSet<T>(set: Set<T>): T[] {
  const result: T[] = [];
  set.forEach(item => result.push(item));
  return result;
}

/**
 * Create a candidate profile based on campaign requirements
 * 
 * Ensures each candidate meets candidatedetailrule.md requirements:
 * - 3-5 contextual fit tags
 * - At least 2 verification badges
 * - Startup-specific structured summary
 * - 4-6 role-specific skills
 * - 3-4 project links
 */
function createCandidateProfile(
  campaign: Campaign,
  matchScore: number,
  primarySkills: string[],
  secondarySkills: string[],
  allPossibleSkills: string[],
  industries: string[]
): Candidate {
  // Generate a diverse name using regional combinations
  const name = generateDiverseName();
  
  // Generate avatar seed for consistent image generation
  const avatarSeed = `${name.replace(/\s+/g, '').toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
  
  // Determine appropriate role and domain
  const roleInfo = determineRoleAndDomain(campaign, industries);
  const title = generateTitle(roleInfo.role, roleInfo.domain);
  
  // Set experience based on role and random factors
  let experience = calculateExperience(campaign, matchScore);
  
  // Generate random education level weighted by experience
  const education = generateEducation(experience);
  
  // Determine role-specific skills (4-6 per candidatedetailrule.md)
  const skillsInfo = determineSkills(campaign, roleInfo.role, primarySkills, secondarySkills, matchScore);
  
  // Generate match reasons
  const matchReasons = generateMatchReasons(
    campaign, 
    skillsInfo.candidatePrimarySkills, 
    skillsInfo.candidateSecondarySkills,
    experience,
    industries
  );
  
  // Generate context tags (3-5 per candidatedetailrule.md)
  const contextTags = generateContextTags(campaign, experience, matchScore);
  
  // Generate structured summary following the [Action] + [Outcome] + [Contextual Fit Trait] format
  // Must include startup-specific language per candidatedetailrule.md
  const summary = generateStructuredSummary(roleInfo.role, roleInfo.domain, experience, contextTags, campaign);
  
  // Generate context fit description
  const contextFit = generateContextFit(
    campaign, 
    matchReasons,
    experience,
    matchScore
  );
  
  // Generate project links (3-4 per candidatedetailrule.md)
  const projects = generateProjects(roleInfo.role, name, Math.floor(Math.random() * 2) + 3); // 3-4 projects
  
  // Generate verification checks (at least 2 per candidatedetailrule.md)
  const verifications = generateVerifications(matchScore, true);
  
  // Generate availability based on timeline
  const availability = generateAvailability(campaign.hiringTimeline);
  
  // Generate location
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  
  // Generate salary expectation
  const salary = generateSalary(campaign.jobType || 'Full-time', experience);
  
  // Generate industry specialization
  let industry: string;
  if (industries.length > 0) {
    industry = industries[Math.floor(Math.random() * industries.length)];
  } else if (roleInfo.domain) {
    industry = roleInfo.domain;
  } else {
    const industryOptions = CONTEXT_TAGS.industry;
    industry = industryOptions[Math.floor(Math.random() * industryOptions.length)];
  }
  
  // Create the candidate profile
  const candidateId = `cand-${uuidv4().slice(0, 8)}`;
  console.log(`Creating candidate ${candidateId} for campaign ${campaign.id}`);
  
  return {
    id: candidateId,
    name,
    title,
    matchScore,
    skills: skillsInfo.skills,
    standoutSkills: skillsInfo.standoutSkills,
    contextFit,
    summary,
    experience,
    education,
    status: 'new',
    campaignId: campaign.id,
    matchReasons,
    contextTags,
    location,
    salary,
    availability,
    industry,
    projects,
    verifications,
    avatarSeed
  };
}

/**
 * Generate a diverse, culturally consistent name
 */
function generateDiverseName(): string {
  // Select a random region
  const regions = Object.keys(NAME_REGIONS);
  const region = regions[Math.floor(Math.random() * regions.length)] as keyof typeof NAME_REGIONS;
  
  // Get the first and last name ranges for this region
  const { first, last } = NAME_REGIONS[region];
  
  // Select a random first and last name from the appropriate range
  const firstName = FIRST_NAMES[Math.floor(Math.random() * (first[1] - first[0] + 1)) + first[0]];
  const lastName = LAST_NAMES[Math.floor(Math.random() * (last[1] - last[0] + 1)) + last[0]];
  
  return `${firstName} ${lastName}`;
}

/**
 * Determine appropriate role and domain based on campaign
 */
function determineRoleAndDomain(campaign: Campaign, industries: string[]): { role: string; domain: string } {
  let role = '';
  let domain = '';
  
  // Check if the campaign already specifies a role
  if (campaign.roleTitle) {
    role = campaign.roleTitle;
    
    // Try to match to our standard roles for better skill mapping
    for (const standardRole of STARTUP_ROLES) {
      if (role.toLowerCase().includes(standardRole.toLowerCase())) {
        role = standardRole;
        break;
      }
    }
  } else {
    // Randomly select a role
    role = STARTUP_ROLES[Math.floor(Math.random() * STARTUP_ROLES.length)];
  }
  
  // Determine domain
  if (industries.length > 0) {
    domain = industries[Math.floor(Math.random() * industries.length)];
  } else {
    // Select a random domain
    const domains = Object.keys(ROLE_DOMAINS);
    domain = domains[Math.floor(Math.random() * domains.length)];
  }
  
  return { role, domain };
}

/**
 * Determine skills for the candidate based on role and requirements
 */
function determineSkills(
  campaign: Campaign,
  role: string,
  primarySkills: string[],
  secondarySkills: string[],
  matchScore: number
): { skills: string[]; candidatePrimarySkills: string[]; candidateSecondarySkills: string[]; standoutSkills: string[] } {
  // Determine how many skills to include (3-5 as per requirements)
  const totalSkillCount = Math.floor(Math.random() * 3) + 3; // 3-5 skills
  
  // Calculate skill counts
  const primarySkillCount = calculateSkillCount(primarySkills.length, matchScore);
  const secondarySkillCount = calculateSkillCount(secondarySkills.length, matchScore * 0.7);
  
  // Select skills from requirements
  const candidatePrimarySkills = shuffleArray(primarySkills).slice(0, primarySkillCount);
  const candidateSecondarySkills = shuffleArray(secondarySkills).slice(0, secondarySkillCount);
  
  let allSkills = [...candidatePrimarySkills, ...candidateSecondarySkills];
  
  // If we need more skills or have no skills from requirements, pull from role-specific bank
  if (allSkills.length < totalSkillCount || allSkills.length === 0) {
    const roleSpecificSkills = ROLE_SKILLS[role as keyof typeof ROLE_SKILLS] || [];
    
    if (roleSpecificSkills.length > 0) {
      // Filter out skills we already have
      const additionalRoleSkills = roleSpecificSkills
        .filter(skill => !allSkills.includes(skill))
        .slice(0, totalSkillCount - allSkills.length);
      
      allSkills = [...allSkills, ...additionalRoleSkills];
    }
  }
  
  // Ensure we have between 3-5 skills total
  allSkills = allSkills.slice(0, Math.min(5, Math.max(3, allSkills.length)));
  
  // Determine standout skills (1-2 skills marked as standout)
  const standoutCount = Math.min(allSkills.length, Math.floor(Math.random() * 2) + 1);
  const standoutSkills = shuffleArray([...allSkills]).slice(0, standoutCount);
  
  return {
    skills: allSkills,
    candidatePrimarySkills,
    candidateSecondarySkills,
    standoutSkills
  };
}

/**
 * Generate structured context tags (3-5 per candidatedetailrule.md)
 */
function generateContextTags(campaign: Campaign, experience: number, matchScore: number): { stage?: string; culture?: string; industry?: string } {
  // Per candidategenerationrules.md, select 3-5 tags from different categories
  
  // Determine how many tags to generate (3-5)
  const tagCount = Math.floor(Math.random() * 3) + 3; // 3-5 tags
  
  // Weight selection based on match score and experience
  // Higher match score = more likely to match campaign's business stage
  
  // Select stage tag
  let stageTag: string | undefined;
  const businessStage = campaign.businessStage?.toLowerCase() || '';
  
  if (businessStage.includes('pre-seed') || businessStage.includes('idea')) {
    stageTag = Math.random() > 0.3 ? 'Pre-seed Ready' : 'MVP Builder';
  } else if (businessStage.includes('seed') || businessStage.includes('mvp')) {
    stageTag = Math.random() > 0.3 ? 'Seed-stage Fit' : 'Post-Launch Optimizer';
  } else if (businessStage.includes('series a') || businessStage.includes('growth')) {
    stageTag = Math.random() > 0.3 ? 'Series A Ready' : 'Growth-stage Expert';
  } else if (businessStage.includes('series b') || businessStage.includes('scale')) {
    stageTag = Math.random() > 0.3 ? 'Scale-up Specialist' : 'Growth-stage Expert';
        } else {
    // Random selection if no business stage specified
    stageTag = CONTEXT_TAGS.stage[Math.floor(Math.random() * CONTEXT_TAGS.stage.length)];
  }
  
  // Select culture tag - try to match campaign values if available
  let cultureTag: string | undefined;
  if (campaign.cultureValues && campaign.cultureValues.length > 0) {
    // Map culture values to tags
        for (const value of campaign.cultureValues) {
      const valueLower = value.toLowerCase();
      if (valueLower.includes('remote') || valueLower.includes('distributed')) {
        cultureTag = Math.random() > 0.5 ? 'Remote-First' : 'Global Remote Teams';
            break;
          }
      if (valueLower.includes('async')) {
        cultureTag = Math.random() > 0.5 ? 'Async' : 'Async Team Fit';
        break;
      }
      if (valueLower.includes('flat') || valueLower.includes('no manager')) {
        cultureTag = Math.random() > 0.5 ? 'Flat Teams' : 'No-Manager Teams';
        break;
      }
      if (valueLower.includes('cross') || valueLower.includes('generalist')) {
        cultureTag = Math.random() > 0.5 ? 'Cross-Functional Leader' : 'Startup Generalist';
        break;
      }
    }
  }
  
  // If no match found, random selection
  if (!cultureTag) {
    cultureTag = CONTEXT_TAGS.culture[Math.floor(Math.random() * CONTEXT_TAGS.culture.length)];
  }
  
  // Select industry tag - try to match campaign industry
  let industryTag: string | undefined;
  if (campaign.industry) {
    const industryLower = campaign.industry.toLowerCase();
    for (const tag of CONTEXT_TAGS.industry) {
      if (tag.toLowerCase().includes(industryLower) || industryLower.includes(tag.toLowerCase())) {
        industryTag = tag;
        break;
      }
    }
  }
  
  // If no match found, random selection
  if (!industryTag) {
    industryTag = CONTEXT_TAGS.industry[Math.floor(Math.random() * CONTEXT_TAGS.industry.length)];
  }
  
  // Only include tags up to the determined tag count
  const tags: Record<string, string> = {};
  if (tagCount >= 1) tags.stage = stageTag;
  if (tagCount >= 2) tags.culture = cultureTag;
  if (tagCount >= 3) tags.industry = industryTag;
  
  return tags;
}

/**
 * Generate structured summary following [Action] + [Outcome] + [Contextual Fit Trait] format
 * Must include startup-specific language per candidatedetailrule.md
 */
function generateStructuredSummary(role: string, domain: string, experience: number, contextTags: any, campaign: Campaign): string {
  // Collection of startup-specific terms to inject per candidategenerationrules.md
  const startupTerms = [
    'MVP', 'pivoted', 'ARR', 'async', 'solo founder', 'pre-seed', 'seed round',
    'series A', 'product-market fit', 'runway', 'CAC', 'LTV', 'north star metric',
    'OKRs', 'growth loops', 'customer acquisition', 'product velocity'
  ];
  
  // Collection of specific outcomes to inject
  const specificOutcomes = [
    'grew to 10K users', 'closed first $50K', 'reduced CAC by 30%',
    'improved retention by 25%', 'launched in 6 weeks', 'scaled to $1M ARR',
    'increased conversion by 40%', 'built team of 15', 'shipped 20 releases',
    'managed $200K ad budget', 'reduced infrastructure costs by 40%'
  ];
  
  // Action phrases based on role
  const actionPhrases: Record<string, string[]> = {
    'engineer': [
      'Built and scaled', 'Architected and implemented', 'Developed core features for',
      'Led technical team to launch', 'Optimized and refactored'
    ],
    'designer': [
      'Redesigned UX for', 'Created design system for', 'Improved conversion through design of', 
      'Transformed user experience of', 'Led design sprints for'
    ],
    'marketer': [
      'Scaled growth channels for', 'Launched marketing campaign for', 'Built acquisition strategy for', 
      'Optimized conversion funnel for', 'Managed paid acquisition for'
    ],
    'product': [
      'Led product development of', 'Managed roadmap for', 'Shipped key features for', 
      'Defined product strategy for', 'Executed product vision for'
    ],
    'operations': [
      'Streamlined operations for', 'Built infrastructure for', 'Scaled processes for', 
      'Managed vendor relationships for', 'Implemented systems for'
    ]
  };
  
  // Outcome phrases
  const outcomePhrases = [
    `growing from ${Math.floor(Math.random() * 100) + 100} to ${Math.floor(Math.random() * 9000) + 1000} users`,
    `achieving ${Math.floor(Math.random() * 30) + 20}% ${['growth', 'retention', 'conversion'][Math.floor(Math.random() * 3)]}`,
    `reducing ${['churn', 'CAC', 'time-to-market'][Math.floor(Math.random() * 3)]} by ${Math.floor(Math.random() * 30) + 10}%`,
    `leading to ${startupTerms[Math.floor(Math.random() * startupTerms.length)]}`,
    `resulting in ${specificOutcomes[Math.floor(Math.random() * specificOutcomes.length)]}`
  ];
  
  // Contextual fit traits
  const contextualTraits = [
    `Thrives in ${contextTags.culture || 'fast-paced startup environments'}`,
    `Excels at ${Math.random() > 0.5 ? 'cross-functional collaboration' : 'independent execution'}`,
    `Known for ${['pragmatic problem-solving', 'creative solutions', 'detail-oriented execution', 'strategic thinking'][Math.floor(Math.random() * 4)]}`,
    `Specializes in ${domain || 'early-stage startups'}`,
    `Passionate about ${domain || 'building products that scale'}`
  ];
  
  // Determine which role category to use
  let roleCategory = 'engineer';
  if (role.toLowerCase().includes('design')) roleCategory = 'designer';
  if (role.toLowerCase().includes('market') || role.toLowerCase().includes('growth')) roleCategory = 'marketer';
  if (role.toLowerCase().includes('product')) roleCategory = 'product';
  if (role.toLowerCase().includes('operations') || role.toLowerCase().includes('success')) roleCategory = 'operations';
  
  // Get actions specific to role
  const actions = actionPhrases[roleCategory];
  
  // Construct summary following [Action] + [Outcome] + [Contextual Fit Trait] format
  const action = actions[Math.floor(Math.random() * actions.length)];
  const product = [
    `a ${domain || ''} ${['platform', 'product', 'solution', 'app', 'service'][Math.floor(Math.random() * 5)]}`,
    `multiple ${['features', 'products', 'releases', 'initiatives'][Math.floor(Math.random() * 4)]}`,
    `the ${['core', 'key', 'primary', 'critical'][Math.floor(Math.random() * 4)]} ${['product', 'service', 'platform', 'solution'][Math.floor(Math.random() * 4)]}`
  ][Math.floor(Math.random() * 3)];
  const outcome = outcomePhrases[Math.floor(Math.random() * outcomePhrases.length)];
  const trait = contextualTraits[Math.floor(Math.random() * contextualTraits.length)];
  
  // Add a startup-specific term
  const startupTerm = startupTerms[Math.floor(Math.random() * startupTerms.length)];
  const startupTermPhrase = Math.random() > 0.5 ? 
    ` during ${startupTerm} phase` : 
    ` with focus on ${startupTerm}`;
  
  // Construct the final summary
  const summary = `${action} ${product}${startupTermPhrase}, ${outcome}. ${trait}.`;
  
  return summary;
}

/**
 * Generate project links (3-4 per candidatedetailrule.md)
 */
function generateProjects(role: string, name: string, count: number): { title: string; url: string; platform: string }[] {
  // Per candidategenerationrules.md, 1-2 project links with descriptive text
  const projects: { title: string; url: string; platform: string }[] = [];
  
  // Project types based on role
  const projectTypes: Record<string, string[]> = {
    'Engineer': ['API', 'Microservice', 'Frontend', 'Backend', 'Mobile App', 'Integration'],
    'Designer': ['Redesign', 'Design System', 'UX Flow', 'Website', 'Mobile App', 'Branding'],
    'Marketer': ['Campaign', 'SEO Revamp', 'Content Strategy', 'Growth Plan', 'Social Media', 'Email Sequence'],
    'Product': ['Roadmap', 'Feature Launch', 'User Research', 'Analytics Dashboard', 'Product Spec'],
    'Operations': ['Process Optimization', 'Workflow System', 'Vendor Management', 'Team Structure', 'KPI Dashboard']
  };
  
  // Project platforms
  const platforms = [
    { name: 'GitHub', url: 'github.com' },
    { name: 'Notion', url: 'notion.so' },
    { name: 'Portfolio', url: 'portfolio.io' },
    { name: 'Figma', url: 'figma.com' },
    { name: 'Dribbble', url: 'dribbble.com' },
    { name: 'Medium', url: 'medium.com' },
    { name: 'LinkedIn', url: 'linkedin.com' },
    { name: 'Behance', url: 'behance.net' }
  ];
  
  // Determine role category
  let roleCategory = 'Engineer';
  if (role.toLowerCase().includes('design')) roleCategory = 'Designer';
  if (role.toLowerCase().includes('market') || role.toLowerCase().includes('growth')) roleCategory = 'Marketer';
  if (role.toLowerCase().includes('product')) roleCategory = 'Product';
  if (role.toLowerCase().includes('operations') || role.toLowerCase().includes('success')) roleCategory = 'Operations';
  
  // Get project types for this role
  const types = projectTypes[roleCategory] || projectTypes.Engineer;
  
  // Generate projects
  for (let i = 0; i < count; i++) {
    // Select random type and platform appropriate for the role
    const type = types[Math.floor(Math.random() * types.length)];
    let platform;
    
    // Match platform to role type
    if (roleCategory === 'Engineer') {
      platform = platforms[Math.floor(Math.random() * 2)]; // GitHub or Notion
    } else if (roleCategory === 'Designer') {
      platform = platforms.slice(2, 6)[Math.floor(Math.random() * 4)]; // Portfolio, Figma, Dribbble, Medium
    } else {
      platform = platforms.slice(1)[Math.floor(Math.random() * (platforms.length - 1))]; // Any except GitHub
    }
    
    // Generate project title
    const adjectives = ['Innovative', 'Scalable', 'Modern', 'Efficient', 'Robust', 'Seamless', 'Strategic'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    // Create descriptive project title format
    const title = `${adjective} ${type} ${Math.random() > 0.5 ? 'Project' : 'Implementation'}`;
    
    // Generate URL with username based on name
    const username = name.toLowerCase().replace(/\s+/g, '-');
    const url = `https://${platform.url}/${username}/${type.toLowerCase().replace(/\s+/g, '-')}`;
    
    projects.push({
      title: `${title} (${platform.name})`,
      url,
      platform: platform.name
    });
  }
  
  return projects;
}

/**
 * Generate verification badges based on match score
 * Ensures at least 2 verification badges per candidatedetailrule.md
 */
function generateVerifications(matchScore: number, atLeastTwo: boolean = false): string[] {
  // Per candidategenerationrules.md, 2-3 verification badges selected based on match score
  // Higher match score = more verified
  
  // Determine how many verifications to include
  const baseCount = Math.floor(matchScore / 35) + 1; // 1-3 based on score
  const verificationCount = atLeastTwo ? Math.max(2, baseCount) : baseCount;
  
  // Shuffle and select verifications
  const shuffledVerifications = shuffleArray([...VERIFICATION_CHECKS]);
  return shuffledVerifications.slice(0, verificationCount);
}

/**
 * Calculate how many skills to include based on available skills and match score
 */
function calculateSkillCount(availableCount: number, matchScore: number): number {
  if (availableCount === 0) return 0;
  
  // Higher match score = more matching skills
  const percentToInclude = matchScore / 100;
  
  // Always include at least 1 if available, and calculate the rest
  return Math.max(1, Math.min(availableCount, Math.ceil(availableCount * percentToInclude)));
}

/**
 * Generate a job title based on role and experience
 */
function generateTitle(baseRole: string, domain: string): string {
  if (!baseRole) return 'Professional';
  
  // Strip out existing seniority terms to avoid duplication
  const cleanRole = baseRole
    .replace(/senior|lead|principal|junior|associate/gi, '')
    .trim();
  
  // For some specific roles, add domain specialization
  if (domain && Math.random() > 0.5) {
    if (cleanRole.includes('Engineer') || cleanRole.includes('Developer')) {
      return `${domain} ${cleanRole}`;
    }
    if (cleanRole.includes('Designer')) {
      return `${domain} ${cleanRole}`;
    }
    if (cleanRole.includes('Manager')) {
      return `${domain} ${cleanRole}`;
    }
  }
  
  return cleanRole;
}

/**
 * Generate additional relevant skills not in the original requirements
 */
function generateAdditionalSkills(
  existingSkills: string[], 
  count: number,
  roleTitle: string
): string[] {
  // Use role-specific skills database for more relevant skills
  let roleKey: keyof typeof ROLE_SKILLS | undefined;
  
  // Find the closest matching role
  for (const key of Object.keys(ROLE_SKILLS)) {
    if (roleTitle.toLowerCase().includes(key.toLowerCase())) {
      roleKey = key as keyof typeof ROLE_SKILLS;
      break;
    }
  }
  
  // If we found a matching role, use its skills
  if (roleKey) {
    const roleSkills = ROLE_SKILLS[roleKey];
    const availableSkills = roleSkills.filter(skill => !existingSkills.includes(skill));
    return shuffleArray(availableSkills).slice(0, count);
  }
  
  // Fallback to existing skill pairings for backward compatibility
  const skillPairings: Record<string, string[]> = {
    'React': ['Redux', 'Next.js', 'TypeScript', 'Webpack', 'Styled Components'],
    'JavaScript': ['Node.js', 'Express', 'API Design', 'Jest', 'Cypress'],
    'Python': ['Django', 'Flask', 'Pandas', 'NumPy', 'TensorFlow'],
    'Marketing': ['SEO', 'Content Strategy', 'Google Analytics', 'Email Marketing'],
    'Sales': ['CRM', 'Negotiation', 'Lead Generation', 'Client Relations'],
    'Design': ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'UI/UX'],
    'Management': ['Team Leadership', 'Strategic Planning', 'Project Management']
  };
  
  // If we have no existing skills, generate based on role title
  if (existingSkills.length === 0) {
    for (const [key, relatedSkills] of Object.entries(skillPairings)) {
      if (roleTitle.toLowerCase().includes(key.toLowerCase())) {
        return shuffleArray(relatedSkills).slice(0, count);
      }
    }
    return [];
  }
  
  // Find potential related skills for all existing skills
  const potentialRelatedSkills: string[] = [];
  
  existingSkills.forEach(skill => {
    // Direct lookup
    if (skillPairings[skill]) {
      potentialRelatedSkills.push(...skillPairings[skill]);
    }
    
    // Look for partial matches in pairings
    for (const [key, relatedSkills] of Object.entries(skillPairings)) {
      if (skill.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(skill.toLowerCase())) {
        potentialRelatedSkills.push(...relatedSkills);
      }
    }
  });
  
  // Remove duplicates and existing skills
  const uniqueSkillsObject: Record<string, boolean> = {};
  potentialRelatedSkills.forEach(skill => {
    uniqueSkillsObject[skill] = true;
  });
  
  const uniqueNewSkills = Object.keys(uniqueSkillsObject)
    .filter(skill => !existingSkills.includes(skill));
  
  // Return random subset
  return shuffleArray(uniqueNewSkills).slice(0, count);
}

/**
 * Calculate appropriate experience based on role and match score
 */
function calculateExperience(campaign: Campaign, matchScore: number): number {
  // Base experience range
  let minExperience = 1;
  let maxExperience = 15;
  
  // Adjust based on role title
  const roleTitle = campaign.roleTitle?.toLowerCase() || '';
  
  if (roleTitle.includes('senior') || roleTitle.includes('lead') || roleTitle.includes('principal')) {
    minExperience = 5;
  } else if (roleTitle.includes('junior') || roleTitle.includes('associate')) {
    maxExperience = 4;
  }
  
  // Calculate a weighted random experience value that correlates somewhat with match score
  const matchScoreInfluence = 0.6; // How much the match score influences experience
  const randomFactor = 1 - matchScoreInfluence;
  
  // Scale match score to experience range
  const matchScoreComponent = (matchScore / 100) * (maxExperience - minExperience) * matchScoreInfluence;
  const randomComponent = Math.random() * (maxExperience - minExperience) * randomFactor;
  
  // Combine components and round to nearest half-year
  return Math.max(minExperience, Math.min(maxExperience, 
    Math.round((minExperience + matchScoreComponent + randomComponent) * 2) / 2
  ));
}

/**
 * Generate education level appropriate for experience
 */
function generateEducation(experience: number): string {
  // Weight probability by experience
  let probabilities: [string, number][] = [
    ['High School', 0.05],
    ['Associate\'s Degree', 0.15],
    ['Bachelor\'s Degree', 0.5],
    ['Master\'s Degree', 0.2],
    ['PhD', 0.05],
    ['Bootcamp Graduate', 0.03],
    ['Self-taught', 0.02]
  ];
  
  // Adjust probabilities based on experience
  if (experience > 8) {
    // More experienced candidates more likely to have advanced degrees
    probabilities = [
      ['High School', 0.03],
      ['Associate\'s Degree', 0.07],
      ['Bachelor\'s Degree', 0.4],
      ['Master\'s Degree', 0.35],
      ['PhD', 0.1],
      ['Bootcamp Graduate', 0.02],
      ['Self-taught', 0.03]
    ];
  } else if (experience < 3) {
    // Less experienced candidates more likely to have less education
    probabilities = [
      ['High School', 0.1],
      ['Associate\'s Degree', 0.2],
      ['Bachelor\'s Degree', 0.4],
      ['Master\'s Degree', 0.1],
      ['PhD', 0.02],
      ['Bootcamp Graduate', 0.08],
      ['Self-taught', 0.1]
    ];
  }
  
  // Weighted random selection
  const totalProbability = probabilities.reduce((sum, [_, p]) => sum + p, 0);
  let random = Math.random() * totalProbability;
  
  for (const [education, probability] of probabilities) {
    random -= probability;
    if (random <= 0) {
      return education;
    }
  }
  
  // Fallback
  return 'Bachelor\'s Degree';
}

/**
 * Generate context fit description based on match reasons
 * This is enhanced to include the bonus variation rules
 */
function generateContextFit(
  campaign: Campaign, 
  matchReasons: MatchReason[],
  experience: number,
  matchScore: number
): string {
  // Get the top 2 match reasons
  const topReasons = [...matchReasons]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 2);
  
  // Generate specific startup context summaries
  const startupSummaries = [
    `This candidate has launched ${Math.floor(Math.random() * 3) + 1} B2B SaaS MVPs.`,
    `Has led product development across ${Math.floor(Math.random() * 3) + 2} startup environments.`,
    `Successfully scaled engineering teams from ${Math.floor(Math.random() * 5) + 2} to ${Math.floor(Math.random() * 20) + 15} people.`,
    `Designed GTM strategy for ${Math.floor(Math.random() * 3) + 1} early-stage startups.`,
    `Drove user acquisition from zero to ${Math.floor(Math.random() * 5) + 1}0K users in previous role.`,
    `Managed product roadmap through ${Math.floor(Math.random() * 3) + 1} successful funding rounds.`,
    `Built and deployed ${Math.floor(Math.random() * 5) + 2} production-grade applications with similar tech stack.`,
    `Experienced in rapid MVP development with ${Math.floor(Math.random() * 4) + 2}-week sprint cycles.`,
    `Implemented analytics infrastructure that increased conversion by ${Math.floor(Math.random() * 20) + 15}%.`
  ];
  
  // Decide whether to use a startup summary based on role and campaign context
  const roleIsStartupFocused = 
    campaign.roleTitle?.toLowerCase().includes('startup') || 
    campaign.businessStage?.toLowerCase().includes('early') ||
    campaign.businessStage?.toLowerCase().includes('startup') ||
    (campaign.industry && ['startup', 'tech', 'saas', 'software'].some(i => 
      campaign.industry?.toLowerCase().includes(i)
    ));
  
  // Use startup summary for high match scores or startup-focused roles
  if (matchScore > 85 || roleIsStartupFocused) {
    return startupSummaries[Math.floor(Math.random() * startupSummaries.length)];
  }
  
  // Generate introductory sentence based on overall fit
  let contextFit = '';
  
  if (matchReasons.length > 0) {
    // Combine top reasons into a compelling description
    const reasonPhrases = topReasons.map(reason => {
      if (reason.type === 'skill') {
        return `expertise in ${reason.description}`;
      } else if (reason.type === 'experience') {
        return `${reason.description}`;
      } else if (reason.type === 'industry') {
        return `background in ${reason.description}`;
      } else if (reason.type === 'culture') {
        return `values aligned with ${reason.description}`;
      }
      return reason.description;
    });
    
    contextFit = `Has ${reasonPhrases.join(' and ')}.`;
  } else {
    // Fallback description for low match scores
    contextFit = `Has ${experience} years of relevant experience.`;
  }
  
  // Add bonus variation (about 50% of the time)
  if (Math.random() > 0.5) {
    let bonusVariation = BONUS_VARIATIONS[Math.floor(Math.random() * BONUS_VARIATIONS.length)];
    
    // Replace placeholders
    bonusVariation = bonusVariation
      .replace('{X}', `${Math.floor(Math.random() * 5) + 2}`)
      .replace('{Y}', `${Math.floor(Math.random() * 15) + 10}`)
      .replace('$XM', `$${Math.floor(Math.random() * 10) + 1}M`);
    
    contextFit += ` ${bonusVariation}.`;
  }
  
  // Add context about business stage if applicable
  if (campaign.businessStage) {
    contextFit += ` Has worked in ${campaign.businessStage.toLowerCase()} environments before.`;
  }
  
  return contextFit;
}

/**
 * Generate match reasons based on campaign criteria
 */
function generateMatchReasons(
  campaign: Campaign,
  primarySkills: string[],
  secondarySkills: string[],
  experience: number,
  industries: string[]
): MatchReason[] {
  const reasons: MatchReason[] = [];
  
  // Add skill-based reasons
  if (primarySkills.length > 0) {
    reasons.push({
      type: 'skill',
      description: primarySkills.slice(0, 2).join(' and '),
      weight: 35 // Primary skills are heavily weighted
    });
  }
  
  // Add experience-based reason
  const roleTitle = campaign.roleTitle || 'professional';
  reasons.push({
    type: 'experience',
    description: `${experience} years as a ${roleTitle.toLowerCase()}`,
    weight: 25
  });
  
  // Add industry-based reason if applicable
  if (industries.length > 0 && Math.random() > 0.3) {
    reasons.push({
      type: 'industry',
      description: industries[Math.floor(Math.random() * industries.length)],
      weight: 20
    });
  }
  
  // Add culture-based reason if applicable
  if (campaign.cultureValues && campaign.cultureValues.length > 0 && Math.random() > 0.5) {
    const randomValue = campaign.cultureValues[Math.floor(Math.random() * campaign.cultureValues.length)];
    reasons.push({
      type: 'culture',
      description: randomValue.toLowerCase(),
      weight: 15
    });
  }
  
  // Add secondary skills reason if applicable
  if (secondarySkills.length > 0) {
    reasons.push({
      type: 'skill',
      description: `additional skills in ${secondarySkills.join(', ')}`,
      weight: 15
    });
  }
  
  return reasons;
}

/**
 * Generate availability text based on timeline preference
 */
function generateAvailability(timeline?: string): string {
  if (!timeline) {
    return 'Available immediately';
  }
  
  if (timeline.toLowerCase().includes('1 week')) {
    return 'Available next week';
  } else if (timeline.toLowerCase().includes('2 week')) {
    return 'Available in 2 weeks';
  } else if (timeline.toLowerCase().includes('month')) {
    return 'Available in 4 weeks';
  } else if (timeline.toLowerCase().includes('flexible')) {
    const options = [
      'Available immediately',
      'Available in 2 weeks',
      'Available after 2-week notice period',
      'Flexible start date'
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  return 'Available immediately';
}

/**
 * Generate salary expectation based on job type and experience
 */
function generateSalary(jobType: string, experience: number): string {
  const range = SALARY_RANGES[jobType] || SALARY_RANGES['Full-time'];
  
  // Experience factor (0.8 to 1.5)
  const experienceFactor = 0.8 + (experience / 10);
  
  // Random factor (0.9 to 1.1)
  const randomFactor = 0.9 + (Math.random() * 0.2);
  
  // Calculate base salary
  const baseSalary = range[0] + ((range[1] - range[0]) * 0.6);
  
  // Apply factors
  const adjustedSalary = Math.round(baseSalary * experienceFactor * randomFactor / 1000) * 1000;
  
  // Format based on job type
  if (jobType === 'Contract' || jobType === 'Freelance') {
    return `$${adjustedSalary / 1000}/hr`;
  } else {
    return `$${adjustedSalary.toLocaleString()}/year`;
  }
}

/**
 * Parse comma-separated string into array
 */
function parseList(listString?: string): string[] {
  if (!listString) return [];
  
  return listString
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Parse skills from comma-separated string
 */
function parseSkills(skillsString?: string): string[] {
  return parseList(skillsString);
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
} 