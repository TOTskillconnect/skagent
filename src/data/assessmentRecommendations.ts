import { AssessmentTemplate } from '@/types/assessments';

// Role-specific assessment recommendations
export interface RoleRecommendation {
  role: string;
  industry: string;
  recommendedTemplates: {
    technical?: string[];
    behavioral?: string[];
    cultural?: string[];
  };
  description: string;
  keySkills: string[];
}

export const roleRecommendations: Record<string, RoleRecommendation> = {
  'frontend-engineer': {
    role: 'Frontend Engineer',
    industry: 'Technology',
    description: 'Focus on React, TypeScript, and modern web development practices',
    keySkills: ['React', 'TypeScript', 'UI/UX', 'Performance', 'Testing'],
    recommendedTemplates: {
      technical: ['tpl000001', 'tpl000003'],
      behavioral: ['tpl000005', 'tpl000011'],
      cultural: ['tpl000020', 'tpl000024']
    }
  },
  'product-manager': {
    role: 'Product Manager',
    industry: 'Technology',
    description: 'Focus on product strategy, stakeholder management, and user-centric thinking',
    keySkills: ['Product Strategy', 'Stakeholder Management', 'Data Analysis', 'User Research'],
    recommendedTemplates: {
      technical: ['tpl000003'],
      behavioral: ['tpl000007', 'tpl000012', 'tpl000016'],
      cultural: ['tpl000018', 'tpl000022']
    }
  },
  'growth-marketer': {
    role: 'Growth Marketer',
    industry: 'Marketing',
    description: 'Focus on data-driven marketing, user acquisition, and growth strategies',
    keySkills: ['Data Analysis', 'User Acquisition', 'A/B Testing', 'Content Strategy'],
    recommendedTemplates: {
      technical: ['tpl000003'],
      behavioral: ['tpl000009', 'tpl000013', 'tpl000017'],
      cultural: ['tpl000019', 'tpl000023']
    }
  },
  'sales-leader': {
    role: 'Sales Leader',
    industry: 'Sales',
    description: 'Focus on sales strategy, team leadership, and revenue growth',
    keySkills: ['Sales Strategy', 'Team Leadership', 'Pipeline Management', 'Revenue Growth'],
    recommendedTemplates: {
      technical: ['tpl000003'],
      behavioral: ['tpl000008', 'tpl000015', 'tpl000016'],
      cultural: ['tpl000021', 'tpl000022']
    }
  },
  'devops-engineer': {
    role: 'DevOps Engineer',
    industry: 'Technology',
    description: 'Focus on infrastructure, automation, and system reliability',
    keySkills: ['Infrastructure', 'CI/CD', 'Monitoring', 'Security'],
    recommendedTemplates: {
      technical: ['tpl000004'],
      behavioral: ['tpl000010', 'tpl000011'],
      cultural: ['tpl000020', 'tpl000024']
    }
  }
};

// Industry-specific assessment recommendations
export interface IndustryRecommendation {
  industry: string;
  recommendedTemplates: {
    technical?: string[];
    behavioral?: string[];
    cultural?: string[];
  };
  description: string;
  keyFocus: string[];
}

export const industryRecommendations: Record<string, IndustryRecommendation> = {
  'fintech': {
    industry: 'FinTech',
    description: 'Focus on security, compliance, and financial domain knowledge',
    keyFocus: ['Security', 'Compliance', 'Financial Literacy', 'Risk Management'],
    recommendedTemplates: {
      technical: ['tpl000003', 'tpl000004'],
      behavioral: ['tpl000008', 'tpl000010'],
      cultural: ['tpl000018', 'tpl000021']
    }
  },
  'healthcare': {
    industry: 'Healthcare',
    description: 'Focus on patient care, compliance, and healthcare domain knowledge',
    keyFocus: ['Patient Care', 'Compliance', 'Healthcare Knowledge', 'Privacy'],
    recommendedTemplates: {
      technical: ['tpl000003'],
      behavioral: ['tpl000010', 'tpl000013'],
      cultural: ['tpl000019', 'tpl000022']
    }
  },
  'ecommerce': {
    industry: 'E-commerce',
    description: 'Focus on user experience, performance, and retail domain knowledge',
    keyFocus: ['User Experience', 'Performance', 'Retail Knowledge', 'Customer Service'],
    recommendedTemplates: {
      technical: ['tpl000001', 'tpl000003'],
      behavioral: ['tpl000009', 'tpl000013'],
      cultural: ['tpl000020', 'tpl000023']
    }
  }
};

// Template recommendation function
export function getRecommendedTemplates(
  role: string,
  industry: string,
  templates: Record<string, AssessmentTemplate>
): AssessmentTemplate[] {
  const roleRec = roleRecommendations[role];
  const industryRec = industryRecommendations[industry];
  
  if (!roleRec && !industryRec) {
    return Object.values(templates);
  }

  const recommendedIds: string[] = [];
  
  // Add role-specific templates
  if (roleRec) {
    Object.values(roleRec.recommendedTemplates).forEach(templateIds => {
      templateIds?.forEach(id => {
        if (!recommendedIds.includes(id)) {
          recommendedIds.push(id);
        }
      });
    });
  }

  // Add industry-specific templates
  if (industryRec) {
    Object.values(industryRec.recommendedTemplates).forEach(templateIds => {
      templateIds?.forEach(id => {
        if (!recommendedIds.includes(id)) {
          recommendedIds.push(id);
        }
      });
    });
  }

  // Convert IDs to template objects
  return recommendedIds
    .map(id => templates[id])
    .filter((template): template is AssessmentTemplate => template !== undefined);
}

// Get role-specific description
export function getRoleDescription(role: string): string {
  return roleRecommendations[role]?.description || 'General assessment for the role';
}

// Get industry-specific description
export function getIndustryDescription(industry: string): string {
  return industryRecommendations[industry]?.description || 'General assessment for the industry';
}

// Get key skills and focus areas
export function getKeyAreas(role: string, industry: string): string[] {
  const roleSkills = roleRecommendations[role]?.keySkills || [];
  const industryFocus = industryRecommendations[industry]?.keyFocus || [];
  
  // Create a combined array with unique values
  const combinedArray = [...roleSkills];
  industryFocus.forEach(focus => {
    if (!combinedArray.includes(focus)) {
      combinedArray.push(focus);
    }
  });
  
  return combinedArray;
} 