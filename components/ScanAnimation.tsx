'use client';

import { motion } from 'framer-motion';

interface ScanAnimationProps {
  imageUrl: string;
  isVisible: boolean;
}

export function ScanAnimation({ imageUrl, isVisible }: ScanAnimationProps) {
  return (
    <motion.div
      className="relative aspect-video rounded-2xl overflow-hidden glass-card"
      animate={isVisible ? { scale: 1 } : { scale: 0.95 }}
    >
      {/* Image Background */}
      <img src={imageUrl} alt="Scanning" className="w-full h-full object-cover" />

      {/* Scanning Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />

      {/* Animated Scan Line */}
      <motion.div
        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary-light to-transparent"
        animate={{
          top: isVisible ? ['0%', '100%'] : '0%',
        }}
        transition={{
          duration: 3,
          repeat: isVisible ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Corner Markers */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 border-2 border-secondary-light ${
            i === 0 ? 'top-4 left-4' : i === 1 ? 'top-4 right-4' : i === 2 ? 'bottom-4 left-4' : 'bottom-4 right-4'
          }`}
          animate={isVisible ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}

      {/* Processing Indicator */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-secondary/30 border-t-secondary mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-white font-semibold text-sm">Analyzing...</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
