// API service for career analysis
// All data is dynamic - this simulates backend AI responses

export interface SkillGap {
  category: string;
  completion: number;
  missingSkills: string[];
}

export interface ResumeImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  skills: string[];
  tasks: string[];
  project: string;
  completed: boolean;
}

export interface ProjectIdea {
  title: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CareerAnalysisResult {
  score: number;
  status: 'needs-improvement' | 'almost-there' | 'job-ready';
  skillGaps: SkillGap[];
  missingKeywords: string[];
  resumeImprovements: ResumeImprovement[];
  roadmap: RoadmapWeek[];
  projectIdeas: ProjectIdea[];
  feedback: string;
  targetRole: string;
}

export interface AnalysisRequest {
  resumeFile: File;
  targetRole: string;
  experienceLevel: string;
}

// Simulate AI backend analysis
export const analyzeCareer = async (request: AnalysisRequest): Promise<CareerAnalysisResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // This would be replaced by actual backend AI analysis
  // The backend would use the resume content and return personalized results
  
  // For demo: Generate dynamic results based on inputs
  const roleKeywords: Record<string, string[]> = {
    'Software Engineer Intern': ['JavaScript', 'React', 'Node.js', 'Git', 'REST APIs', 'TypeScript', 'Agile', 'CI/CD'],
    'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'Data Visualization', 'ETL'],
    'Product Manager': ['Product Strategy', 'User Research', 'Roadmapping', 'Agile', 'Stakeholder Management', 'Analytics', 'PRD', 'A/B Testing'],
    'UI/UX Designer': ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Adobe XD', 'Accessibility'],
  };

  const defaultKeywords = ['Communication', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Leadership'];
  const keywords = roleKeywords[request.targetRole] || defaultKeywords;
  
  // Generate a score based on experience level
  const baseScore = request.experienceLevel === 'Student' ? 45 : 
                    request.experienceLevel === 'Fresher' ? 58 : 72;
  const variance = Math.floor(Math.random() * 15);
  const score = Math.min(95, baseScore + variance);
  
  const status: CareerAnalysisResult['status'] = 
    score < 50 ? 'needs-improvement' : 
    score < 75 ? 'almost-there' : 'job-ready';

  return {
    score,
    status,
    targetRole: request.targetRole,
    skillGaps: [
      {
        category: 'Technical Skills',
        completion: Math.min(95, score + 5),
        missingSkills: keywords.slice(0, 3),
      },
      {
        category: 'Projects & Experience',
        completion: Math.max(20, score - 15),
        missingSkills: ['Portfolio Projects', 'Open Source Contributions', 'Internship Experience'],
      },
      {
        category: 'Resume Quality',
        completion: Math.min(90, score + 10),
        missingSkills: ['Action Verbs', 'Quantified Achievements', 'ATS Optimization'],
      },
      {
        category: 'Soft Skills',
        completion: Math.min(85, score + 8),
        missingSkills: ['Leadership Examples', 'Team Collaboration Stories', 'Problem-Solving Scenarios'],
      },
    ],
    missingKeywords: keywords.slice(0, 6),
    resumeImprovements: [
      {
        original: 'Worked on web development projects',
        improved: 'Developed 3 full-stack web applications using React and Node.js, improving user engagement by 40%',
        reason: 'Added specifics, technologies, and quantified impact',
      },
      {
        original: 'Good communication skills',
        improved: 'Led weekly stand-ups for a 5-member team, presenting project updates to stakeholders',
        reason: 'Replaced vague claim with concrete example',
      },
      {
        original: 'Familiar with databases',
        improved: 'Designed and optimized PostgreSQL databases handling 10K+ daily transactions',
        reason: 'Specified technology and scale',
      },
    ],
    roadmap: [
      {
        week: 1,
        title: 'Core Skills Foundation',
        skills: keywords.slice(0, 2),
        tasks: ['Complete online course', 'Build 2 practice projects', 'Join community forums'],
        project: `Build a ${request.targetRole.toLowerCase()} portfolio piece`,
        completed: false,
      },
      {
        week: 2,
        title: 'Project Development',
        skills: keywords.slice(2, 4),
        tasks: ['Start main portfolio project', 'Document your process', 'Get peer feedback'],
        project: 'Create an end-to-end project showcasing your skills',
        completed: false,
      },
      {
        week: 3,
        title: 'Interview Preparation',
        skills: ['Interview Skills', 'Technical Communication'],
        tasks: ['Practice behavioral questions', 'Mock interviews', 'Refine resume'],
        project: 'Prepare 5 STAR method stories',
        completed: false,
      },
      {
        week: 4,
        title: 'Application & Networking',
        skills: ['Networking', 'Personal Branding'],
        tasks: ['Update LinkedIn', 'Apply to 10 positions', 'Reach out to professionals'],
        project: 'Build your professional network',
        completed: false,
      },
    ],
    projectIdeas: [
      {
        title: `${request.targetRole} Portfolio Website`,
        description: `Create a stunning portfolio showcasing your ${request.targetRole.toLowerCase()} work with case studies`,
        skills: keywords.slice(0, 3),
        difficulty: 'Beginner',
      },
      {
        title: 'Real-World Problem Solver',
        description: `Build a solution addressing a real problem in the ${request.targetRole.toLowerCase()} domain`,
        skills: keywords.slice(2, 5),
        difficulty: 'Intermediate',
      },
      {
        title: 'Industry Collaboration Project',
        description: 'Contribute to open source or collaborate with peers on a team project',
        skills: keywords.slice(3, 6),
        difficulty: 'Advanced',
      },
    ],
    feedback: score >= 75 
      ? `Excellent work! You're job-ready for ${request.targetRole} positions. Focus on networking and applying to opportunities.`
      : score >= 50
      ? `You're making great progress! Focus on ${keywords.slice(0, 2).join(' and ')} to boost your readiness by 20%.`
      : `You're on the right path! Start with the fundamentals and follow the learning roadmap. You can increase your score by 30% in just 2 weeks.`,
  };
};

export const getLinkedInJobUrl = (role: string): string => {
  const encodedRole = encodeURIComponent(role);
  return `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&f_E=1%2C2&f_TPR=r604800`;
};
