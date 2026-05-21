'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [expanded, setExpanded] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How accurate is the Stich AI analysis?',
      answer:
        'Stich has been clinically validated to achieve 99.2% accuracy across diverse skin types and conditions. However, always consult with a dermatologist for professional diagnosis and treatment recommendations.',
    },
    {
      question: 'Is my data secure and private?',
      answer:
        'Yes. All data is encrypted end-to-end and compliant with HIPAA standards. Your images are never stored unless you explicitly authorize it, and they are never shared with third parties.',
    },
    {
      question: 'What skin conditions can Stich detect?',
      answer:
        'Stich can identify over 50+ dermatological conditions including eczema, psoriasis, melanoma, acne, rosacea, and vitiligo. New conditions are continuously added to our database.',
    },
    {
      question: 'How long does analysis take?',
      answer:
        'Most analyses complete in 2-3 seconds after image submission. Processing time may vary depending on image quality and complexity of the condition.',
    },
    {
      question: 'Can I use this as a replacement for professional dermatology?',
      answer:
        'No. Stich is designed as a screening and informational tool only. Always consult with a licensed dermatologist for professional diagnosis, treatment plans, and medical advice.',
    },
    {
      question: 'What image quality is needed for accurate results?',
      answer:
        'For best results, upload clear, well-lit photos of the affected area without shadows or obstructions. Images should be high resolution (minimum 2MP) and taken with steady hands.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-on-surface-variant">
            Everything you need to know about Stich AI
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.05] transition-colors"
              >
                <h3 className="text-lg font-semibold text-primary text-left">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: expanded === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-secondary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-on-surface-variant leading-relaxed border-t border-white/[0.1]">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <p className="text-on-surface-variant mb-6">Still have questions?</p>
          <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}
