import { motion } from 'framer-motion';
import { Upload, Target, BarChart2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Your Resume',
    description: 'Simply drag and drop your resume in PDF or DOC format. Our AI will parse it instantly.',
  },
  {
    icon: Target,
    number: '02',
    title: 'Choose Your Goal',
    description: 'Select your dream role and experience level. We support 50+ career paths.',
  },
  {
    icon: BarChart2,
    number: '03',
    title: 'Get Your Analysis',
    description: 'Receive a detailed breakdown of your readiness score, skill gaps, and improvement areas.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Follow Your Roadmap',
    description: 'Execute your personalized learning plan and watch your score improve week by week.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            How It Works
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Get career-ready in four simple steps. Our streamlined process makes career planning effortless.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl border border-border p-6 text-center relative z-10">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mt-4 mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
