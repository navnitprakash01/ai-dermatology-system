'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Dermatologist, Boston Medical Center',
      content:
        'Stich has revolutionized how we screen patients. The accuracy and speed are remarkable—it catches conditions that might have been missed initially.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Healthcare Tech Director',
      content:
        'The implementation was seamless. Our patients love the quick analysis, and clinically it holds up to professional standards. Highly recommended.',
      rating: 5,
    },
    {
      name: 'Dr. Elena Rodriguez',
      role: 'Dermatology Researcher, Stanford',
      content:
        "The precision of Stich AI is outstanding. We've incorporated it into our clinical trials and the results are consistent with traditional methods.",
      rating: 5,
    },
    {
      name: 'James Park',
      role: 'Patient, San Francisco',
      content:
        'Quick, easy, and accurate. I got results in seconds and felt confident sharing them with my dermatologist. Great experience overall.',
      rating: 5,
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-surface-container">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Trusted by Medical Professionals</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Healthcare providers worldwide rely on Stich for accurate dermatological screening
          </p>
        </motion.div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { label: 'Healthcare Facilities', value: '500+' },
            { label: 'Analyses Performed', value: '2M+' },
            { label: 'User Satisfaction', value: '98%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="glass-card p-6 rounded-xl text-center"
              whileHover={{ y: -5 }}
            >
              <p className="text-3xl font-bold text-secondary mb-2">{stat.value}</p>
              <p className="text-on-surface-variant">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-8 h-full hover:glass-glow transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p className="text-on-surface-variant mb-6 leading-relaxed italic text-lg">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="border-t border-white/[0.1] pt-6">
                  <p className="font-bold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-on-surface-variant">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-on-surface-variant mb-8 text-lg">
            Join hundreds of healthcare providers using Stich AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg">
              Get Started Today
            </button>
            <button className="px-8 py-3 glass-card text-primary font-semibold rounded-lg hover:bg-white/[0.12] transition-colors">
              Schedule Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
