import { motion } from 'framer-motion';

interface AnalysisSkeletonProps {
  message?: string;
}

export function AnalysisSkeleton({ message = 'Analyzing your career profile...' }: AnalysisSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
        <div className="flex items-center justify-center flex-col gap-6">
          <div className="relative w-48 h-48">
            <div className="w-full h-full rounded-full bg-muted" />
            <div className="absolute inset-8 rounded-full bg-card" />
          </div>
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
      </div>

      {/* Loading message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-primary font-medium">{message}</span>
        </div>
      </motion.div>

      {/* Skill gaps skeleton */}
      <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
        <div className="h-5 w-40 bg-muted rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
              <div className="h-2 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Keywords skeleton */}
      <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
        <div className="h-5 w-36 bg-muted rounded mb-4" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
