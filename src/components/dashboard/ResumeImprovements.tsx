import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResumeImprovement } from '@/lib/api';

interface ResumeImprovementsProps {
  improvements: ResumeImprovement[];
}

export function ResumeImprovements({ improvements }: ResumeImprovementsProps) {
  const [showImproved, setShowImproved] = useState<Record<number, boolean>>({});

  const toggleImproved = (index: number) => {
    setShowImproved((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Resume Improvements</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Click on each bullet to see the AI-optimized version.
      </p>

      <div className="space-y-4">
        {improvements.map((improvement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleImproved(index)}
              className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${showImproved[index] ? 'bg-secondary' : 'bg-accent'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${showImproved[index] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {improvement.original}
                  </p>
                  
                  {showImproved[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <div className="flex items-center gap-2 text-xs text-secondary mb-2">
                        <ArrowRight className="w-3 h-3" />
                        <span className="font-medium">Improved version</span>
                      </div>
                      <p className="text-sm text-foreground font-medium">{improvement.improved}</p>
                      <p className="text-xs text-muted-foreground mt-2 italic">{improvement.reason}</p>
                    </motion.div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  {showImproved[index] ? 'Hide' : 'Show'} Fix
                </Button>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
