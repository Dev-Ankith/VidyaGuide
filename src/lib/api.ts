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
  recruiters?: string[];
}

export interface AnalysisRequest {
  resumeFile: File;
  targetRole: string;
  experienceLevel: string;
}

// Real backend AI analysis
export const analyzeCareer = async (request: AnalysisRequest): Promise<CareerAnalysisResult> => {
  const formData = new FormData();
  formData.append('resume', request.resumeFile);
  formData.append('jobRole', request.targetRole);
  // experienceLevel is not currently used by backend prompt but could be added if needed

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }

    const data = await response.json();
    return data as CareerAnalysisResult;
  } catch (error) {
    console.error("Career Analysis Error:", error);
    throw error;
  }
};

export const getLinkedInJobUrl = (role: string): string => {
  const encodedRole = encodeURIComponent(role);
  return `https://www.linkedin.com/jobs/search/?keywords=${encodedRole}&f_E=1%2C2&f_TPR=r604800`;
};
