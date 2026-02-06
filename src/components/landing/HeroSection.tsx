import { ArrowRight, Play, Sparkles, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Career Guidance</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Know Exactly How{' '}
              <span className="gradient-text">Job-Ready</span>{' '}
              You Are.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Upload your resume, choose your dream role, and get a personalized career roadmap in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group" asChild>
                <Link to="/signup">
                  Analyze My Career
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group">
                <Play className="w-5 h-5 mr-2" />
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>5,000+ students guided</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Score Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card rounded-2xl shadow-xl border border-border p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Career Readiness Score</p>
                  <h3 className="text-xl font-semibold text-foreground">Software Engineer</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                  Almost There
                </div>
              </div>

              {/* Score Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="440"
                      strokeDashoffset="132"
                      className="progress-ring"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(230 70% 45%)" />
                        <stop offset="100%" stopColor="hsl(152 60% 42%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">72</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>

              {/* Skill Bars */}
              <div className="space-y-4">
                {[
                  { label: 'Technical Skills', value: 78 },
                  { label: 'Projects', value: 65 },
                  { label: 'Resume Quality', value: 82 },
                ].map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{skill.label}</span>
                      <span className="font-medium text-foreground">{skill.value}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-card rounded-lg shadow-lg border border-border px-3 py-2 flex items-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">+15% this week</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-card rounded-lg shadow-lg border border-border px-3 py-2 flex items-center gap-2"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">3 skills to go</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
