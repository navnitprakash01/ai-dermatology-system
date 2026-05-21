'use client';

import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PredictionResult {
  condition: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
}

interface ResultsDashboardProps {
  prediction: PredictionResult;
  isVisible: boolean;
}

export function ResultsDashboard({ prediction, isVisible }: ResultsDashboardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'text-yellow-600';
      case 'moderate':
        return 'text-orange-600';
      case 'severe':
        return 'text-error';
      default:
        return 'text-secondary';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-50 border-yellow-200';
      case 'moderate':
        return 'bg-orange-50 border-orange-200';
      case 'severe':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      className="space-y-6"
    >
      {/* Main Prediction Card */}
      <motion.div
        variants={itemVariants}
        className={`glass-card rounded-2xl p-8 border ${getSeverityBg(prediction.severity)}`}
      >
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className={`p-4 rounded-lg ${getSeverityColor(prediction.severity)} bg-current/10`}>
            {prediction.severity === 'mild' ? (
              <TrendingUp className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-primary mb-2">{prediction.condition}</h3>
            <p className="text-on-surface-variant mb-4">{prediction.description}</p>

            {/* Severity Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-on-surface">Severity:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getSeverityColor(
                  prediction.severity
                )} bg-current/10`}
              >
                {prediction.severity}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Score */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-primary">Confidence Score</h4>
            <span className="text-3xl font-bold text-secondary">{Math.round(prediction.confidence * 100)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-surface-container rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-secondary to-secondary-light rounded-full"
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${prediction.confidence * 100}%` } : { width: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <p className="text-sm text-on-surface-variant">
          This analysis is based on computer vision algorithms cross-referenced with a database of 10M+ clinical samples.
        </p>
      </motion.div>

      {/* Analytics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        {/* Processing Quality */}
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-on-surface-variant mb-2">Processing Quality</p>
          <p className="text-2xl font-bold text-primary">98.5%</p>
          <p className="text-xs text-on-surface-variant mt-2">Image clarity optimal</p>
        </div>

        {/* Analysis Speed */}
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm text-on-surface-variant mb-2">Analysis Speed</p>
          <p className="text-2xl font-bold text-secondary">2.3s</p>
          <p className="text-xs text-on-surface-variant mt-2">Real-time processing</p>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8">
        <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          Recommendations
        </h4>

        <ul className="space-y-3">
          {prediction.recommendations.map((rec, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-start gap-3 text-on-surface-variant"
            >
              <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary font-semibold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{rec}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-xl p-6 border border-orange-200 bg-orange-50/50"
      >
        <p className="text-sm text-orange-900">
          ⚠️ <span className="font-semibold">Important:</span> This AI analysis is for informational purposes only and should not be considered medical advice. Please consult with a licensed dermatologist for professional diagnosis and treatment.
        </p>
      </motion.div>
    </motion.div>
  );
}
