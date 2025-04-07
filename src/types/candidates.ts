export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface Project {
  title: string;
  url: string;
  platform: string;
}

export interface ContextTags {
  stage?: string;
  culture?: string;
  industry?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  status?: string;
  match_score?: string;
  matchScore?: number;
  skills: string[];
  standoutSkills?: string[];
  matchingSkills?: string[];
  experience_tags?: string[];
  context_fit_summary?: string;
  contextFit?: string;
  summary?: string;
  verification_badges?: string[];
  verifications?: string[];
  badges?: string[];
  industry?: string;
  location?: string;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  contextTags?: ContextTags;
  avatarSeed?: string;
  matchReasons?: any[];
  campaignId?: string;
  createdAt?: string;
  updatedAt?: string;
} 