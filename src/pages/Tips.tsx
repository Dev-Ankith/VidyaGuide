import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Target, Zap, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { authService } from '@/lib/auth';

const tips = [
  {
    category: 'Action Verbs',
    icon: Zap,
    color: 'primary',
    tips: [
      'Start each bullet point with a strong action verb',
      'Use varied verbs: Led, Developed, Implemented, Optimized, Designed',
      'Avoid weak starters like "Helped with" or "Assisted in"',
    ],
    examples: {
      bad: 'Was responsible for managing the team',
      good: 'Led a cross-functional team of 8 engineers to deliver project 2 weeks early',
    },
  },
  {
    category: 'Quantify Achievements',
    icon: Target,
    color: 'secondary',
    tips: [
      'Include numbers, percentages, and metrics wherever possible',
      'Show impact: revenue, efficiency, user growth, cost savings',
      'Even estimates are better than no numbers',
    ],
    examples: {
      bad: 'Improved website performance significantly',
      good: 'Improved website load time by 40%, increasing user retention by 15%',
    },
  },
  {
    category: 'ATS Optimization',
    icon: Sparkles,
    color: 'accent',
    tips: [
      'Include keywords from the job description',
      'Use standard section headings: Experience, Education, Skills',
      'Avoid tables, graphics, and complex formatting',
    ],
    examples: {
      bad: 'Proficient in coding and development',
      good: 'Proficient in Python, JavaScript, React, Node.js, PostgreSQL, AWS',
    },
  },
  {
    category: 'Clarity & Brevity',
    icon: CheckCircle,
    color: 'primary',
    tips: [
      'Keep bullet points to 1-2 lines maximum',
      'Remove filler words: very, really, basically',
      'Focus on results, not just responsibilities',
    ],
    examples: {
      bad: 'I was basically in charge of handling all the customer service stuff and making sure everything was running smoothly',
      good: 'Resolved 50+ customer inquiries daily, maintaining 98% satisfaction rate',
    },
  },
];

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
};

export default function Tips() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

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
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Resume Writing Tips
              </h1>
            </div>
            <p className="text-muted-foreground">
              Transform your resume with these proven strategies used by successful candidates.
            </p>
          </motion.div>

          {/* Tips Grid */}
          <div className="space-y-6">
            {tips.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${colorClasses[section.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">{section.category}</h2>
                </div>

                <ul className="space-y-2 mb-6">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Avoid</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{section.examples.bad}"</p>
                  </div>
                  
                  <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-secondary">Better</span>
                    </div>
                    <p className="text-sm text-foreground">"{section.examples.good}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ready to Apply These Tips?
            </h3>
            <p className="text-muted-foreground mb-4">
              Upload your resume and get personalized AI-powered suggestions.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Analyze My Resume
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
