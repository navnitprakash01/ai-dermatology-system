'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, AlertCircle, Zap, Eye, Brain } from 'lucide-react';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadSectionProps {
  onImageSelect: (file: File) => void;
  onAnalyzeStart: () => void;
}

interface ImageQuality {
  brightness: number;
  clarity: number;
  coverage: number;
  isValid: boolean;
}

export function UploadSection({ onImageSelect, onAnalyzeStart }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState<ImageQuality | null>(null);
  const [invalidImageReason, setInvalidImageReason] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const analyzeImageQuality = (file: File, imageUrl: string): Promise<ImageQuality> => {
    return new Promise((resolve) => {
      const image = new window.Image();
      image.src = imageUrl;

      image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        const fileSize = file.size;
        const isValidType = ALLOWED_IMAGE_TYPES.includes(file.type);
        const isSupportedSize = fileSize > 0 && fileSize <= 10 * 1024 * 1024;

        // Temporarily disable frontend dimension validation.
        // Only validate file type, file size, and image load success.
        const isValid = isValidType && isSupportedSize;

        console.group('[UploadSection] image validation');
        console.log('file.size:', fileSize);
        console.log('naturalWidth:', width);
        console.log('naturalHeight:', height);
        console.log('threshold:', 224);
        console.log('validation result:', isValid);
        console.groupEnd();

        let brightness = 70;
        try {
          const canvas = document.createElement('canvas');
          const targetSize = 128;
          const ratio = Math.min(targetSize / width, targetSize / height, 1);
          canvas.width = Math.max(1, Math.round(width * ratio));
          canvas.height = Math.max(1, Math.round(height * ratio));
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let totalLuma = 0;
            for (let i = 0; i < data.length; i += 4) {
              totalLuma += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
            }
            const pixelCount = data.length / 4 || 1;
            brightness = Math.round(totalLuma / pixelCount / 2.55);
          }
        } catch {
          brightness = 70;
        }

        const coverage = Math.min(100, Math.round((Math.min(width, height) / 224) * 100));
        const clarity = Math.min(100, Math.round((Math.sqrt(width * height) / 1000) * 100));

        resolve({ brightness, clarity, coverage, isValid });
      };

      image.onerror = () => {
        console.group('[UploadSection] image validation');
        console.log('file.size:', file.size);
        console.log('naturalWidth:', 0);
        console.log('naturalHeight:', 0);
        console.log('threshold:', 224);
        console.log('validation result:', false);
        console.groupEnd();
        resolve({ brightness: 0, clarity: 0, coverage: 0, isValid: false });
      };
    });
  };

  const processFile = (file: File) => {
    const isSupportedType = ALLOWED_IMAGE_TYPES.includes(file.type);
    if (!isSupportedType) {
      setSelectedImage(null);
      setPreview(null);
      setImageQuality(null);
      setInvalidImageReason('Unsupported file type. Please upload JPEG, PNG, or WebP.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedImage(file);
    onImageSelect(file);
    setCurrentStep(1);
    setInvalidImageReason(null);

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setImageQuality(null);

    setTimeout(async () => {
      const quality = await analyzeImageQuality(file, imageUrl);
      setImageQuality(quality);
      if (!quality.isValid) {
        setInvalidImageReason(
          file.size === 0
            ? 'Uploaded file is empty or corrupted.'
            : file.size > 10 * 1024 * 1024
            ? 'Image is too large. Maximum file size is 10MB.'
            : 'Unable to read this image. Please try a different file.'
        );
      } else {
        setInvalidImageReason(null);
      }
      setCurrentStep(2);
    }, 600);
  };

  const handleClear = () => {
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setSelectedImage(null);
    setPreview(null);
    setImageQuality(null);
    setInvalidImageReason(null);
    setCurrentStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const canAnalyze = Boolean(selectedImage && !invalidImageReason);

  const handleAnalyze = () => {
    if (selectedImage && !invalidImageReason) {
      onAnalyzeStart();
    }
  };

  return (
    <section id="upload-section" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-tertiary/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">Upload & Analyze</h2>
          
          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {[
              { step: 1, label: 'Upload', icon: Upload },
              { step: 2, label: 'Validate', icon: Eye },
              { step: 3, label: 'Analyze', icon: Brain },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= item.step
                      ? 'bg-secondary border-secondary-light text-white'
                      : 'border-border bg-surface-container text-on-surface-variant'
                  }`}
                  animate={currentStep === item.step ? { scale: 1.1 } : { scale: 1 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-sm font-semibold ml-2 ${
                  currentStep >= item.step ? 'text-secondary' : 'text-on-surface-variant'
                }`}>
                  {item.label}
                </span>
                {idx < 2 && (
                  <motion.div
                    className={`w-12 h-0.5 ml-4 transition-all ${
                      currentStep > item.step ? 'bg-secondary' : 'bg-border'
                    }`}
                    animate={currentStep > item.step ? { scaleX: 1 } : { scaleX: 0 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          <p className="text-center text-on-surface-variant">
            {currentStep === 1 && 'Upload a clear photo of the affected area'}
            {currentStep === 2 && 'Image quality is being validated'}
            {currentStep === 3 && 'Ready for AI analysis'}
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="upload-zone"
                exit={{ opacity: 0 }}
                className={`relative rounded-3xl transition-all cursor-pointer group overflow-hidden lg:col-span-1 min-h-[400px] flex items-center justify-center border-2 border-dashed ${
                  isDragging
                    ? 'border-secondary-light bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent scale-105'
                    : 'border-secondary/30 bg-gradient-to-br from-secondary/5 via-transparent to-secondary/5 hover:from-secondary/10'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Animated grid background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5"
                  animate={isDragging ? { opacity: 0.1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="50" height="50" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h50v50H0z" fill="none" stroke="%2300696e" stroke-width="1"/%3E%3C/svg%3E")',
                  }}
                />

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0"
                  animate={isDragging ? { opacity: 0.15 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <motion.div
                  className="text-center relative z-10 px-6 py-12 flex flex-col items-center justify-center"
                  animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                >
                  {/* Animated upload icon with glow */}
                  <motion.div
                    className="mb-8 flex justify-center relative"
                    animate={isDragging ? { y: -12, scale: 1.15 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-secondary/30 blur-2xl"
                      animate={isDragging ? { scale: 1.5, opacity: 0.8 } : { scale: 1, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-md border border-secondary/30"
                      whileHover={!isDragging ? { rotate: 5 } : {}}
                    >
                      <motion.div
                        animate={isDragging ? { rotate: 15, scale: 1.2 } : { rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Upload className="w-16 h-16 text-secondary-light" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Main text */}
                  <motion.h3
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3"
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {isDragging ? 'Release to upload' : 'Upload Skin Image'}
                  </motion.h3>

                  {/* Subtitle */}
                  <motion.p
                    className="text-on-surface-variant mb-8 text-lg font-medium"
                    animate={isDragging ? { opacity: 0.5 } : { opacity: 1 }}
                  >
                    {isDragging ? 'Drop your image here' : 'Drag & drop or click to select'}
                  </motion.p>
                  
                  {/* Requirements checklist */}
                  <motion.div
                    className="space-y-3 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {[
                      { text: 'JPG, PNG, WebP formats', icon: '📸' },
                      { text: 'Maximum 10MB file size', icon: '📦' },
                      { text: 'Clear, well-lit photos', icon: '💡' },
                    ].map((item, idx) => (
                      <motion.p
                        key={idx}
                        className="flex items-center justify-center gap-3 text-on-surface-variant/70 font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        {item.text}
                      </motion.p>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="preview-zone"
                exit={{ opacity: 0 }}
                className="space-y-6 lg:col-span-2"
              >
                {/* Main preview area */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/10 to-tertiary/10 border border-secondary/30 backdrop-blur-sm p-1"
                >
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-container">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    {/* Quality overlay badge */}
                    {imageQuality && (
                      <motion.div
                        className={`absolute top-6 right-6 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 backdrop-blur-md border ${
                          imageQuality.isValid
                            ? 'bg-success/20 text-success border-success/50'
                            : 'bg-error/20 text-error border-error/50'
                        }`}
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {imageQuality.isValid ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {imageQuality.isValid ? 'Quality Good' : 'Improve Quality'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* File Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl p-6 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/30 backdrop-blur-sm"
                  >
                    <h4 className="font-bold text-primary mb-5 flex items-center gap-3 text-lg">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                        <Upload className="w-4 h-4 text-secondary" />
                      </div>
                      File Information
                    </h4>
                    <div className="space-y-3">
                      <motion.div
                        className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-surface-container/50 border border-secondary/20"
                        whileHover={{ backgroundColor: 'rgba(0, 105, 110, 0.1)' }}
                      >
                        <span className="text-on-surface-variant text-sm">Filename</span>
                        <span className="font-semibold text-primary text-sm truncate ml-2 max-w-xs">
                          {selectedImage?.name.split('.')[0]}
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-surface-container/50 border border-secondary/20"
                        whileHover={{ backgroundColor: 'rgba(0, 105, 110, 0.1)' }}
                      >
                        <span className="text-on-surface-variant text-sm">File Size</span>
                        <span className="font-semibold text-primary text-sm">
                          {(selectedImage?.size ? selectedImage.size / 1024 / 1024 : 0).toFixed(2)} MB
                        </span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-surface-container/50 border border-secondary/20"
                        whileHover={{ backgroundColor: 'rgba(0, 105, 110, 0.1)' }}
                      >
                        <span className="text-on-surface-variant text-sm">Format</span>
                        <span className="font-semibold text-primary text-sm">
                          {selectedImage?.type.split('/')[1]?.toUpperCase()}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Quality Metrics */}
                  {imageQuality && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, x: 20 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="rounded-2xl p-6 bg-gradient-to-br from-tertiary/10 to-transparent border border-tertiary/30 backdrop-blur-sm"
                    >
                      <h4 className="font-bold text-primary mb-5 flex items-center gap-3 text-lg">
                        <div className="w-8 h-8 rounded-lg bg-tertiary/20 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-tertiary-light" />
                        </div>
                        Image Quality
                      </h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Brightness', value: imageQuality.brightness, icon: '☀️', color: 'from-yellow-400/50' },
                          { label: 'Clarity', value: imageQuality.clarity, icon: '🔍', color: 'from-blue-400/50' },
                          { label: 'Coverage', value: imageQuality.coverage, icon: '📐', color: 'from-purple-400/50' },
                        ].map((metric, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-on-surface-variant font-medium flex items-center gap-2">
                                <span className="text-lg">{metric.icon}</span>
                                {metric.label}
                              </span>
                              <motion.span
                                className="font-bold text-primary bg-secondary/20 px-3 py-1 rounded-full text-xs"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                              >
                                {Math.round(metric.value)}%
                              </motion.span>
                            </div>
                            <div className="h-2.5 bg-surface-container/50 rounded-full overflow-hidden border border-secondary/10">
                              <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${
                                  metric.value > 70
                                    ? 'from-success to-success/70'
                                    : metric.value > 50
                                    ? 'from-tertiary to-tertiary/70'
                                    : 'from-error to-error/70'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ delay: 0.35 + idx * 0.1, duration: 0.9, ease: 'easeOut' }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className={`flex-1 sm:flex-initial px-8 py-4 font-bold rounded-xl flex items-center justify-center gap-2 group transition-all relative overflow-hidden ${
                      canAnalyze
                        ? 'bg-gradient-to-r from-secondary via-secondary-light to-secondary text-white shadow-lg hover:shadow-2xl border border-secondary-light/50'
                        : 'bg-surface-container/50 text-on-surface-variant/50 cursor-not-allowed border border-border/30'
                    }`}
                    whileHover={canAnalyze ? { scale: 1.05, y: -2 } : {}}
                    whileTap={canAnalyze ? { scale: 0.95 } : {}}
                  >
                    {/* Shimmer effect */}
                    {imageQuality?.isValid && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['100%', '-100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <Zap className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Analyze Image</span>
                    {imageQuality?.isValid && (
                      <motion.span
                        className="relative z-10"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={handleClear}
                    className="px-6 py-4 rounded-xl font-semibold border border-secondary/30 text-primary bg-secondary/10 hover:bg-secondary/20 transition-all hover:border-secondary/50"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>
                
                {/* Feedback message */}
                {invalidImageReason && (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-error/20 to-error/10 border border-error/40 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm"
                  >
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                    <p className="text-sm text-error font-semibold">
                      {invalidImageReason}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
