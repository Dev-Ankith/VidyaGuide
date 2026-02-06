import { motion } from 'framer-motion';
import { Lightbulb, Star } from 'lucide-react';
import type { ProjectIdea } from '@/lib/api';

interface ProjectIdeasProps {
  projects: ProjectIdea[];
}

const difficultyColors = {
  Beginner: 'bg-secondary/10 text-secondary border-secondary/30',
  Intermediate: 'bg-warning/10 text-warning border-warning/30',
  Advanced: 'bg-accent/10 text-accent border-accent/30',
};

export function ProjectIdeas({ projects }: ProjectIdeasProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">Project Ideas</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-foreground">{project.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[project.difficulty]}`}>
                {project.difficulty}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-1">
              {project.skills.map((skill) => (
                <span key={skill} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
