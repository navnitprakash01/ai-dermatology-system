'use client';

import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Github, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'Documentation'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy'],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <footer className="bg-primary text-white pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 glass-card bg-white/[0.08] rounded-2xl p-8 text-center border border-white/[0.2]"
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Get the latest updates on AI dermatology, clinical insights, and product releases.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/[0.1] text-white placeholder-white/50 border border-white/[0.2] focus:outline-none focus:border-secondary-light transition-colors"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  console.log('[v0] Newsletter subscription submitted');
                  alert('Thank you for subscribing!');
                }
              }}
            />
            <button
              onClick={() => {
                console.log('[v0] Newsletter subscription clicked');
                alert('Thank you for subscribing to our newsletter!');
              }}
              className="px-6 py-3 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary-light transition-colors"
            >
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold">Dr. James Chen</h2>
              <p className="text-white/70 mt-2 text-sm">
                AI-powered dermatology platform by Chief Dermatologist
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => console.log(`[v0] Social link clicked: ${social.label}`)}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-white/[0.1] text-white hover:bg-secondary/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants} className="md:col-span-1">
              <h4 className="font-bold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <button
                      onClick={() => console.log(`[v0] Footer link clicked: ${link}`)}
                      className="text-white/70 hover:text-white transition-colors text-sm text-left hover:underline"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/[0.1] mb-8" />

        {/* Bottom Footer */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <motion.p variants={itemVariants} className="text-white/70 text-sm">
            &copy; {currentYear} Dr. James Chen Dermatology. All rights reserved. Built with care for healthcare.
          </motion.p>

          {/* Contact */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer group"
          >
            <Mail className="w-4 h-4 group-hover:text-secondary transition-colors" />
            <a href="mailto:hello@drchen.ai" className="text-sm">
              hello@drchen.ai
            </a>
          </motion.div>
        </motion.div>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/[0.1]"
        >
          <p className="text-white/50 text-xs leading-relaxed">
            Dr. James Chen&apos;s AI Dermatology Platform is an AI-powered tool designed for informational and screening purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with Dr. Chen or a qualified healthcare provider for medical advice. This tool does not diagnose, treat, cure, or prevent any medical condition.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
