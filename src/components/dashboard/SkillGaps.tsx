import { motion } from 'framer-motion';
import type { SkillGap } from '@/lib/api';

interface SkillGapsProps {
  skillGaps: SkillGap[];
}

export function SkillGaps({ skillGaps }: SkillGapsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Skill Gap Breakdown</h3>
      
      <div className="space-y-6">
        {skillGaps.map((gap, index) => (
          <motion.div
            key={gap.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-foreground">{gap.category}</span>
              <span className="text-sm font-semibold text-primary">{gap.completion}%</span>
            </div>
            
            <div className="skill-bar mb-3">
              <motion.div
                className="skill-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${gap.completion}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              />
            </div>
            
            {gap.missingSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gap.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
