'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Settings, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  onStartTrial?: () => void;
}

export function Header({ onStartTrial }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#workflow' },
    { label: 'Diseases', href: '#diseases' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 glass-card backdrop-blur-md border-b border-white/[0.2]" />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Doctor Profile - Top Left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="flex items-center gap-3 group"
        >
          <motion.div
            className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-secondary-light shadow-lg"
            whileHover={{ scale: 1.08 }}
          >
            <Image
              src="/dr-james-chen.jpg"
              alt="Dr. James Chen"
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-primary">Dr. James Chen</span>
              <CheckCircle className="w-3.5 h-3.5 text-secondary" />
            </div>
            <span className="text-xs text-on-surface-variant">Chief Dermatologist</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.href}
              className="text-primary font-medium hover:text-secondary transition-colors relative group"
              whileHover={{ y: -2 }}
            >
              {link.label}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-secondary-light group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </motion.div>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onStartTrial}
            className="hidden md:flex px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.1] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-white/[0.2] p-4 md:hidden"
          >
            <div className="space-y-3">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  className="block px-4 py-2 text-primary hover:bg-white/[0.1] rounded-lg transition-colors"
                  whileHover={{ x: 4 }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                onClick={() => {
                  onStartTrial?.();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Start Free Trial
              </motion.button>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
