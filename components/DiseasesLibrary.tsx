'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function DiseasesLibrary() {
  const diseases = [
    {
      name: 'Eczema',
      type: 'ATOPIC',
      description: 'Chronic inflammatory skin condition causing itching and redness.',
      image: '/disease-eczema.jpg',
    },
    {
      name: 'Psoriasis',
      type: 'PLAQUE',
      description: 'Autoimmune condition resulting in thick, scaly patches.',
      image: '/disease-psoriasis.jpg',
    },
    {
      name: 'Melanoma',
      type: 'MALIGNANT',
      description: 'Serious skin cancer arising from melanocytes.',
      image: '/disease-melanoma.jpg',
    },
    {
      name: 'Rosacea',
      type: 'CHRONIC',
      description: 'Persistent facial redness with visible blood vessels.',
      image: '/disease-rosacea.jpg',
    },
    {
      name: 'Acne',
      type: 'COMEDONAL',
      description: 'Common condition with pimples and blackheads.',
      image: '/disease-acne.jpg',
    },
    {
      name: 'Vitiligo',
      type: 'PIGMENT',
      description: 'Loss of skin pigmentation creating white patches.',
      image: '/disease-vitiligo.jpg',
    },
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Disease Library</h2>
            <p className="text-lg text-on-surface-variant">
              Commonly supported dermatological conditions
            </p>
          </div>
          <motion.button
            className="mt-6 md:mt-0 px-6 py-3 glass-card text-primary font-semibold rounded-lg hover:bg-white/[0.12] transition-colors flex items-center gap-2 group w-fit"
            whileHover={{ x: 4 }}
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Disease Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {diseases.map((disease, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group cursor-pointer"
              whileHover={{ y: -8 }}
            >
              {/* Card Background with gradient overlay */}
              <div className="relative glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:glass-glow transition-all">
                {/* Disease Image */}
                <motion.div
                  className="relative h-48 w-full overflow-hidden bg-surface-container"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={disease.image}
                    alt={disease.name}
                    fill
                    className="object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                </motion.div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-tertiary/5 group-hover:from-secondary/10 group-hover:to-tertiary/10 transition-all" />

                  {/* Type Badge */}
                  <motion.div
                    className="relative z-10 inline-block mb-3 w-fit"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-secondary bg-secondary/10">
                      {disease.type}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <h3 className="relative z-10 text-2xl font-bold text-primary mb-2">{disease.name}</h3>
                  <p className="relative z-10 text-on-surface-variant text-sm leading-relaxed mb-6 flex-1">
                    {disease.description}
                  </p>

                  {/* Hover Action */}
                  <motion.button
                    className="relative z-10 flex items-center gap-2 text-secondary font-semibold hover:text-secondary-light transition-colors w-fit group/link"
                    whileHover={{ x: 4 }}
                    onClick={() => console.log(`[v0] Learn more clicked for ${disease.name}`)}
                  >
                    <span className="text-sm">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
