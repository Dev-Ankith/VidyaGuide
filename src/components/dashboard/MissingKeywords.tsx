import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface MissingKeywordsProps {
  keywords: string[];
}

export function MissingKeywords({ keywords }: MissingKeywordsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Missing Keywords</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        These ATS keywords and skills are commonly required but missing from your resume.
      </p>
      
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <motion.span
            key={keyword}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="tag-chip"
          >
            {keyword}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
