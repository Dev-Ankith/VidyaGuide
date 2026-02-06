import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Circle, ChevronDown, BookOpen, Code, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { authService } from '@/lib/auth';
import type { RoadmapWeek } from '@/lib/api';

// Sample roadmap data - in production this would come from backend
const sampleRoadmap: RoadmapWeek[] = [
  {
    week: 1,
    title: 'Foundation Building',
    skills: ['Core Programming', 'Problem Solving'],
    tasks: ['Complete fundamentals course', 'Practice 10 coding problems', 'Set up development environment'],
    project: 'Build a calculator application',
    completed: true,
  },
  {
    week: 2,
    title: 'Web Development Basics',
    skills: ['HTML/CSS', 'JavaScript', 'Responsive Design'],
    tasks: ['Learn HTML structure', 'Master CSS layouts', 'JavaScript fundamentals'],
    project: 'Create a personal portfolio page',
    completed: true,
  },
  {
    week: 3,
    title: 'Frontend Frameworks',
    skills: ['React', 'State Management', 'Component Design'],
    tasks: ['React basics tutorial', 'Build 3 components', 'Understand hooks'],
    project: 'Build a todo application with React',
    completed: false,
  },
  {
    week: 4,
    title: 'Interview Preparation',
    skills: ['Technical Interviews', 'Behavioral Questions'],
    tasks: ['Practice system design', 'Mock interviews', 'Prepare STAR stories'],
    project: 'Complete 5 mock interviews',
    completed: false,
  },
];

export default function Roadmap() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>(sampleRoadmap);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(2);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const completedCount = roadmap.filter((w) => w.completed).length;
  const progressPercentage = (completedCount / roadmap.length) * 100;

  const toggleComplete = (index: number) => {
    const updated = [...roadmap];
    updated[index] = { ...updated[index], completed: !updated[index].completed };
    setRoadmap(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Your Learning Roadmap
              </h1>
            </div>
            <p className="text-muted-foreground">
              Follow this personalized 4-week plan to become job-ready.
            </p>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Overall Progress</h2>
              <span className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="skill-bar h-3">
              <motion.div
                className="h-full rounded-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {completedCount} of {roadmap.length} weeks completed
            </p>
          </motion.div>

          {/* Roadmap Timeline */}
          <div className="space-y-4">
            {roadmap.map((week, index) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-card rounded-2xl border transition-colors ${
                  week.completed ? 'border-secondary/30' : 'border-border'
                }`}
              >
                <button
                  onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(index);
                      }}
                      className="flex-shrink-0"
                    >
                      {week.completed ? (
                        <CheckCircle className="w-6 h-6 text-secondary" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                    <div className="text-left">
                      <span className="text-sm text-primary font-medium">Week {week.week}</span>
                      <h3 className="text-lg font-semibold text-foreground">{week.title}</h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedWeek === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedWeek === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-border px-6 pb-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6 pt-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">Skills to Learn</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {week.skills.map((skill) => (
                            <span key={skill} className="tag-chip text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <span className="font-medium text-foreground mb-3 block">Tasks</span>
                        <ul className="space-y-2">
                          {week.tasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="bg-primary/5 rounded-xl p-4 h-full">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-5 h-5 text-primary" />
                            <span className="font-medium text-foreground">Week Project</span>
                          </div>
                          <p className="text-muted-foreground">{week.project}</p>
                          
                          <Button
                            className="w-full mt-4"
                            variant={week.completed ? 'outline' : 'default'}
                            onClick={() => toggleComplete(index)}
                          >
                            {week.completed ? 'Mark Incomplete' : 'Mark Complete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
