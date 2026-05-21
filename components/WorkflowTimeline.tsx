'use client';

import { motion } from 'framer-motion';
import { FileImage, Zap, Database, CheckCircle2 } from 'lucide-react';

export function WorkflowTimeline() {
  const steps = [
    {
      icon: FileImage,
      title: 'Upload Image',
      description: 'Capture a clear photo of the affected area with your mobile lens.',
      color: 'from-secondary to-secondary-light',
    },
    {
      icon: Zap,
      title: 'AI Analysis',
      description: 'Computer vision algorithms identify key dermatological patterns.',
      color: 'from-tertiary-light to-tertiary',
    },
    {
      icon: Database,
      title: 'Neural Processing',
      description: 'Cross-reference with a database of 10M+ clinical samples.',
      color: 'from-secondary to-tertiary',
    },
    {
      icon: CheckCircle2,
      title: 'Expert Prediction',
      description: 'Receive a comprehensive report with high-confidence diagnostics.',
      color: 'from-success to-secondary-light',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-surface-container">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg text-on-surface-variant">
            A seamless workflow powered by state-of-the-art AI technology
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Timeline Connector (excluding last) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="absolute left-8 top-20 w-1 h-24 bg-gradient-to-b from-secondary/40 to-secondary/10"
                    initial={{ height: 0 }}
                    whileInView={{ height: '96px' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
                  />
                )}

                {/* Timeline Item */}
                <div className="flex gap-6 md:gap-8">
                  {/* Icon Circle */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} p-0.5`}>
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center glass-glow">
                        <Icon className="w-7 h-7 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="flex-1 pt-2 pb-8"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-card p-6 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-secondary">Step {index + 1}</span>
                        <div className="hidden sm:flex h-px flex-1 bg-border/30" />
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                      <p className="text-on-surface-variant">{step.description}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border"
        >
          {[
            { label: 'Average Analysis Time', value: '2.3s' },
            { label: 'Database Samples', value: '10M+' },
            { label: 'Detection Accuracy', value: '99.2%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="glass-card p-6 rounded-xl text-center"
              whileHover={{ y: -5 }}
            >
              <p className="text-sm text-on-surface-variant mb-2">{stat.label}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
