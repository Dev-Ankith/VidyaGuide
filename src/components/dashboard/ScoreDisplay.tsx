import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  status: 'needs-improvement' | 'almost-there' | 'job-ready';
  targetRole: string;
}

export function ScoreDisplay({ score, status, targetRole }: ScoreDisplayProps) {
  const statusConfig = {
    'needs-improvement': {
      label: 'Needs Improvement',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
    },
    'almost-there': {
      label: 'Almost There',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
    },
    'job-ready': {
      label: 'Job Ready',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/30',
    },
  };

  const config = statusConfig[status];

  // Calculate stroke dashoffset based on score (circumference = 2 * π * r = 2 * 3.14159 * 80 ≈ 502)
  const circumference = 502;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6 md:p-8 text-center"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div className="text-left">
          <p className="text-sm text-muted-foreground mb-1">Career Readiness Score</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{targetRole}</h2>
        </div>
        <div className={`px-4 py-2 rounded-full ${config.bgColor} ${config.borderColor} border`}>
          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48 md:w-56 md:h-56">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="80"
              stroke="currentColor"
              strokeWidth="16"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="80"
              stroke="url(#scoreGradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(230 70% 45%)" />
                <stop offset="50%" stopColor="hsl(200 70% 50%)" />
                <stop offset="100%" stopColor="hsl(152 60% 42%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-5xl md:text-6xl font-bold text-foreground"
            >
              {score}
            </motion.span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground max-w-md mx-auto">
        {status === 'job-ready'
          ? "Excellent! You're well-prepared for this role. Focus on applying and networking."
          : status === 'almost-there'
          ? "You're making great progress! A few improvements will make you highly competitive."
          : "Don't worry! Everyone starts somewhere. Follow the roadmap to boost your score."}
      </p>
    </motion.div>
  );
}
