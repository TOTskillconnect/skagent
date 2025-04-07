import { Candidate } from '@/types/candidates';

export const mockCandidates: Record<string, Candidate> = {
  "c001": {
    id: "c001",
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    match_score: "95",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "CI/CD"],
    experience_tags: ["7+ years", "Startup", "Enterprise", "Remote"],
    context_fit_summary: "Alex has significant experience in building scalable web applications with modern JavaScript frameworks. Their background in both startup and enterprise environments makes them adaptable to different work cultures.",
    verification_badges: ["Identity", "Skills"],
    experience: [
      {
        role: "Senior Frontend Engineer",
        company: "TechVision Inc.",
        period: "2020 - Present",
        description: "Leading the frontend development team in building a complex SaaS platform using React, TypeScript, and GraphQL.",
        achievements: [
          "Improved application performance by 40% through code optimization and architecture redesign",
          "Implemented CI/CD pipeline reducing deployment time by 65%",
          "Mentored junior developers and established coding standards"
        ]
      },
      {
        role: "Software Engineer",
        company: "GlobalTech Solutions",
        period: "2016 - 2020",
        description: "Developed and maintained multiple web applications for enterprise clients using Angular and Node.js.",
        achievements: [
          "Built a real-time dashboard that improved client decision-making process",
          "Integrated multiple third-party APIs into existing applications",
          "Reduced bug rate by 30% through implementing comprehensive test coverage"
        ]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        year: "2016"
      }
    ]
  },
  "c002": {
    id: "c002",
    name: "Jordan Lee",
    title: "Full Stack Developer",
    match_score: "87",
    skills: ["JavaScript", "React", "Express", "MongoDB", "Docker"],
    experience_tags: ["5+ years", "E-commerce", "Agile"],
    context_fit_summary: "Jordan has strong experience in full stack development with a focus on e-commerce platforms. They excel in agile environments and have a track record of delivering projects on time.",
    verification_badges: ["Identity"],
    experience: [
      {
        role: "Full Stack Developer",
        company: "E-Shop Solutions",
        period: "2018 - Present",
        description: "Developing and maintaining e-commerce platforms using MERN stack and implementing payment gateways.",
        achievements: [
          "Redesigned checkout process improving conversion rate by 25%",
          "Implemented microservices architecture improving system reliability",
          "Created a custom CMS for content management"
        ]
      },
      {
        role: "Web Developer",
        company: "Creative Digital Agency",
        period: "2015 - 2018",
        description: "Built responsive websites and web applications for various clients across different industries.",
        achievements: [
          "Developed a custom booking system for a hospitality client",
          "Optimized website loading speed improving SEO rankings",
          "Created reusable component library for faster development"
        ]
      }
    ],
    education: [
      {
        institution: "Georgia Institute of Technology",
        degree: "Master of Science",
        field: "Information Technology",
        year: "2015"
      }
    ]
  }
}; 