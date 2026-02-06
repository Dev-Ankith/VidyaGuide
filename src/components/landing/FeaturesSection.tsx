import { motion } from 'framer-motion';
import { Gauge, BarChart3, Map, FileCheck, Brain, Rocket } from 'lucide-react';

const features = [
  {
    icon: Gauge,
    title: 'Career Readiness Score',
    description: 'Get an instant, comprehensive score that tells you exactly how prepared you are for your dream role.',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analyzer',
    description: 'Identify exactly which skills you need to develop with detailed breakdowns by category.',
    color: 'secondary',
  },
  {
    icon: Map,
    title: 'Personalized Roadmap',
    description: 'Follow a week-by-week learning plan tailored to your goals and current skill level.',
    color: 'accent',
  },
  {
    icon: FileCheck,
    title: 'Resume Optimization',
    description: 'Transform weak resume bullets into powerful, ATS-friendly statements that get noticed.',
    color: 'primary',
  },
  {
    icon: Brain,
    title: 'Smart Career Engine',
    description: 'Our AI analyzes thousands of job postings to give you the most relevant insights.',
    color: 'secondary',
  },
  {
    icon: Rocket,
    title: 'Project Ideas',
    description: 'Get role-specific project recommendations to build your portfolio and stand out.',
    color: 'accent',
  },
];

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Land Your Dream Job</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive career guidance tailored specifically for students and fresh graduates.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card rounded-2xl border border-border p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
