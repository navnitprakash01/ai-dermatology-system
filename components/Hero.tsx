'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-surface-container to-background pt-20">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-secondary-light/20 to-secondary/10 rounded-full blur-3xl"
          style={{ top: '-10%', right: '-5%' }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-tertiary-light/15 to-tertiary/10 rounded-full blur-3xl"
          style={{ bottom: '10%', left: '-5%' }}
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-secondary-light rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-primary">AI-Powered Detection</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6 text-primary leading-tight"
        >
          Skin Disease Detection{' '}
          <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
            Reimagined
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Harness the power of advanced computer vision and neural networks to detect dermatological conditions with unparalleled accuracy in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <motion.button
            onClick={() => {
              const uploadSection = document.getElementById('upload-section');
              if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="relative px-8 py-4 bg-primary text-white font-semibold rounded-lg overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-light/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-2">
              Start Detection
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            onClick={() => {
              const workflowSection = document.getElementById('workflow');
              if (workflowSection) {
                workflowSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 glass-card text-primary font-semibold rounded-lg hover:bg-white/[0.12] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="glass-card p-3 rounded-full">
            <ArrowDown className="w-5 h-5 text-secondary" />
          </div>
        </motion.div>
      </motion.div>


    </section>
  );
}
