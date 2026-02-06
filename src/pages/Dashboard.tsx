import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { ResumeUpload } from '@/components/dashboard/ResumeUpload';
import { RoleSelection } from '@/components/dashboard/RoleSelection';
import { ScoreDisplay } from '@/components/dashboard/ScoreDisplay';
import { SkillGaps } from '@/components/dashboard/SkillGaps';
import { MissingKeywords } from '@/components/dashboard/MissingKeywords';
import { ResumeImprovements } from '@/components/dashboard/ResumeImprovements';
import { LearningRoadmap } from '@/components/dashboard/LearningRoadmap';
import { RecruiterRecommendations } from '@/components/dashboard/RecruiterRecommendations';
import { ProjectIdeas } from '@/components/dashboard/ProjectIdeas';
import { FeedbackPanel } from '@/components/dashboard/FeedbackPanel';
import { AnalysisSkeleton } from '@/components/dashboard/AnalysisSkeleton';
import { authService } from '@/lib/auth';
import { analyzeCareer, type CareerAnalysisResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type Step = 'upload' | 'analyze' | 'results';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const [step, setStep] = useState<Step>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CareerAnalysisResult | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const targetRole = selectedRole === 'custom' ? customRole : selectedRole;
  const canAnalyze = resumeFile && targetRole && experienceLevel;

  const handleAnalyze = async () => {
    if (!resumeFile || !targetRole || !experienceLevel) return;

    setStep('analyze');
    setIsAnalyzing(true);

    try {
      const analysisResults = await analyzeCareer({
        resumeFile,
        targetRole,
        experienceLevel,
      });
      setResults(analysisResults);
      setStep('results');
      toast({
        title: 'Analysis Complete!',
        description: 'Your career readiness report is ready.',
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setStep('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRoadmapToggle = (weekIndex: number) => {
    if (!results) return;

    const updatedRoadmap = [...results.roadmap];
    updatedRoadmap[weekIndex] = {
      ...updatedRoadmap[weekIndex],
      completed: !updatedRoadmap[weekIndex].completed,
    };
    setResults({ ...results, roadmap: updatedRoadmap });
  };

  const handleStartOver = () => {
    setStep('upload');
    setResumeFile(null);
    setSelectedRole('');
    setCustomRole('');
    setExperienceLevel('');
    setResults(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              {step === 'results'
                ? 'Here\'s your personalized career analysis.'
                : 'Let\'s analyze your career readiness and create a path to success.'}
            </p>
          </motion.div>

          {/* Upload & Analysis Step */}
          {step !== 'results' && (
            <div className="max-w-3xl mx-auto">
              {/* Steps Indicator */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[
                  { num: 1, label: 'Upload Resume', icon: FileText },
                  { num: 2, label: 'Select Role', icon: Target },
                  { num: 3, label: 'Get Analysis', icon: Sparkles },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i === 0 && resumeFile ? 'bg-secondary text-secondary-foreground' :
                      i === 1 && targetRole && experienceLevel ? 'bg-secondary text-secondary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                      {s.num}
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:inline">{s.label}</span>
                    {i < 2 && <div className="w-8 h-0.5 bg-border hidden sm:block" />}
                  </div>
                ))}
              </div>

              {step === 'upload' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Resume Upload Card */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Step 1: Upload Your Resume
                    </h2>
                    <ResumeUpload
                      onFileSelect={setResumeFile}
                      selectedFile={resumeFile}
                    />
                  </div>

                  {/* Role Selection Card */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Step 2: Choose Your Target Role
                    </h2>
                    <RoleSelection
                      selectedRole={selectedRole}
                      customRole={customRole}
                      experienceLevel={experienceLevel}
                      onRoleChange={setSelectedRole}
                      onCustomRoleChange={setCustomRole}
                      onExperienceLevelChange={setExperienceLevel}
                    />
                  </div>

                  {/* Analyze Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!canAnalyze}
                    onClick={handleAnalyze}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze My Career
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 'analyze' && (
                <AnalysisSkeleton message="Our AI is analyzing your resume..." />
              )}
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Action bar */}
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={handleStartOver}>
                  Analyze Another Resume
                </Button>
              </div>

              {/* Score Display */}
              <ScoreDisplay
                score={results.score}
                status={results.status}
                targetRole={results.targetRole}
              />

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Skill Gaps */}
                <SkillGaps skillGaps={results.skillGaps} />

                {/* Missing Keywords */}
                <MissingKeywords keywords={results.missingKeywords} />
              </div>

              {/* Resume Improvements */}
              <ResumeImprovements improvements={results.resumeImprovements} />

              {/* Recruiter Recommendations - only show if score >= 75 */}
              {results.score >= 75 && results.recruiters && (
                <RecruiterRecommendations recruiters={results.recruiters} />
              )}

              {/* Learning Roadmap - only show if score < 75 */}
              {results.score < 75 && (
                <LearningRoadmap
                  roadmap={results.roadmap}
                  onToggleComplete={handleRoadmapToggle}
                />
              )}

              {/* Project Ideas */}
              <ProjectIdeas projects={results.projectIdeas} />

              {/* Feedback Panel */}
              <FeedbackPanel
                feedback={results.feedback}
                score={results.score}
                targetRole={results.targetRole}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
