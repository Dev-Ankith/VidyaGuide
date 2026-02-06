import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Circle, Calendar, BookOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RoadmapWeek } from '@/lib/api';

interface LearningRoadmapProps {
  roadmap: RoadmapWeek[];
  onToggleComplete: (weekIndex: number) => void;
}

export function LearningRoadmap({ roadmap, onToggleComplete }: LearningRoadmapProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  const completedCount = roadmap.filter((w) => w.completed).length;
  const progressPercentage = (completedCount / roadmap.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Your Learning Roadmap</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{roadmap.length} weeks completed
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="skill-bar">
          <motion.div
            className="h-full rounded-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {roadmap.map((week, index) => (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`border rounded-xl overflow-hidden transition-colors ${
              week.completed ? 'border-secondary/30 bg-secondary/5' : 'border-border'
            }`}
          >
            <button
              onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(index);
                  }}
                  className="flex-shrink-0"
                >
                  {week.completed ? (
                    <CheckCircle className="w-5 h-5 text-secondary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <div className="text-left">
                  <span className="text-xs text-primary font-medium">Week {week.week}</span>
                  <h4 className="font-medium text-foreground">{week.title}</h4>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  expandedWeek === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedWeek === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border"
                >
                  <div className="p-4 space-y-4">
                    {/* Skills to learn */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Skills to Learn</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {week.skills.map((skill) => (
                          <span key={skill} className="tag-chip text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div>
                      <span className="text-sm font-medium text-foreground mb-2 block">Tasks</span>
                      <ul className="space-y-2">
                        {week.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Project */}
                    <div className="bg-primary/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Code className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Mini Project</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{week.project}</p>
                    </div>

                    <Button
                      variant={week.completed ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => onToggleComplete(index)}
                      className="w-full"
                    >
                      {week.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
