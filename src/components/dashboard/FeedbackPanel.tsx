import { motion } from 'framer-motion';
import { Heart, TrendingUp, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLinkedInJobUrl } from '@/lib/api';

interface FeedbackPanelProps {
  feedback: string;
  score: number;
  targetRole: string;
}

export function FeedbackPanel({ feedback, score, targetRole }: FeedbackPanelProps) {
  const showJobLink = score >= 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Heart className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Your Personal Career Coach Says...
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">{feedback}</p>

          {showJobLink ? (
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="font-medium text-foreground">You're Job Ready!</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your score qualifies you to start applying. Check out live opportunities on LinkedIn!
              </p>
              <Button asChild className="w-full sm:w-auto">
                <a
                  href={getLinkedInJobUrl(targetRole)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore Job Opportunities
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-primary">
              <ArrowRight className="w-4 h-4" />
              <span>Follow your roadmap to unlock job recommendations!</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
