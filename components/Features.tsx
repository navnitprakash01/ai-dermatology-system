'use client';

import { motion } from 'framer-motion';
import { Zap, Lock, TrendingUp, BarChart3, Brain, Shield } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Fast Detection',
      description: 'Analyze skin conditions in seconds with AI acceleration',
      color: 'text-secondary',
      bgGradient: 'from-secondary/20 to-secondary/5',
    },
    {
      icon: TrendingUp,
      title: '99% Accuracy',
      description: 'Clinically validated accuracy across diverse skin types',
      color: 'text-tertiary',
      bgGradient: 'from-tertiary/20 to-tertiary/5',
    },
    {
      icon: Lock,
      title: 'Secure & Encrypted',
      description: 'HIPAA compliant with end-to-end encryption',
      color: 'text-primary',
      bgGradient: 'from-primary/20 to-primary/5',
    },
    {
      icon: BarChart3,
      title: 'Real-time Insights',
      description: 'Live AI synthesis and instant medical dashboards',
      color: 'text-secondary',
      bgGradient: 'from-secondary/20 to-secondary/5',
    },
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Advanced neural networks and computer vision',
      color: 'text-tertiary',
      bgGradient: 'from-tertiary/20 to-tertiary/5',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data never leaves your device unless authorized',
      color: 'text-primary',
      bgGradient: 'from-primary/20 to-primary/5',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-surface-container/50 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          style={{ bottom: '-10%', right: '-5%' }}
          animate={{
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Core Features</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Everything you need for accurate, secure, and fast dermatological analysis
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className={`glass-card rounded-2xl p-8 h-full backdrop-blur-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br ${feature.bgGradient}`}>
                  {/* Icon */}
                  <motion.div
                    className="mb-6 p-4 rounded-xl bg-white/[0.15] w-fit group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 12 }}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Indicator */}
                  <motion.div
                    className="mt-6 h-1 bg-gradient-to-r from-secondary to-secondary-light rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-on-surface-variant mb-6 max-w-2xl mx-auto">
            Built with the latest advancements in computer vision and machine learning to provide the most reliable dermatological analysis available.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
