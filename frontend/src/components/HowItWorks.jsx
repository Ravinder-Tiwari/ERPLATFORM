import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Sign up and build your professional profile with ease.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgSvg: (
        <svg className="absolute inset-0 w-full h-full text-indigo-100 dark:text-indigo-900 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.4,-51.6C58.8,-39.5,69.5,-24.3,71.7,-7.8C73.9,8.7,67.6,26.5,56.2,39.1C44.8,51.7,28.3,59.2,11.2,61.9C-5.9,64.6,-23.6,62.5,-39.4,53.9C-55.2,45.3,-69,30.3,-73.3,12.4C-77.6,-5.5,-72.3,-26.2,-60,-41.2C-47.7,-56.2,-28.4,-65.4,-9.5,-64.5C9.4,-63.6,31.9,-63.7,45.4,-51.6Z" transform="translate(100 100)" />
        </svg>
      ),
    },
    {
      title: "Discover Opportunities",
      description: "Browse through a wide range of job listings tailored to your skills.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      bgSvg: (
        <svg className="absolute inset-0 w-full h-full text-purple-100 dark:text-purple-900 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M37.9,-64.3C49,-56.5,57.9,-45.5,65.9,-33.1C73.9,-20.7,81,-6.9,80.3,6.7C79.7,20.3,71.3,33.7,61.6,44.7C51.9,55.7,41,64.3,28.5,69.1C16,73.9,1.9,74.9,-12.9,73.6C-27.7,72.4,-43.2,69,-56.1,60.4C-69,51.8,-79.3,38.1,-83.7,22.7C-88.1,7.3,-86.6,-9.7,-80.8,-24.5C-75,-39.3,-64.9,-51.8,-52.1,-59.2C-39.3,-66.6,-23.8,-68.9,-9.2,-67.1C5.4,-65.3,26.8,-72.1,37.9,-64.3Z" transform="translate(100 100)" />
        </svg>
      ),
    },
    {
      title: "Apply with Confidence",
      description: "Use our AI-powered tools to perfect your application and stand out.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgSvg: (
        <svg className="absolute inset-0 w-full h-full text-pink-100 dark:text-pink-900 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M42.7,-73.4C55.9,-67.3,67.7,-56.6,76.6,-43.2C85.5,-29.8,91.6,-14.9,90.5,-0.6C89.4,13.6,81.2,27.3,72.1,39.7C63,52.1,53.1,63.3,40.9,70.9C28.7,78.5,14.4,82.5,-0.2,82.8C-14.7,83.2,-29.4,79.8,-42.4,72.6C-55.4,65.3,-66.7,54.2,-74.8,41C-82.9,27.8,-87.8,12.4,-86.8,-2.3C-85.8,-17,-78.9,-31.1,-70.3,-43.6C-61.7,-56.1,-51.4,-67,-39.1,-73.1C-26.8,-79.3,-13.4,-80.7,0.8,-82C15,-83.3,29.5,-79.5,42.7,-73.4Z" transform="translate(100 100)" />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-16 bg-mesh-light dark:bg-mesh-dark relative overflow-hidden">
      {/* Background SVG */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="container mx-auto px-4 relative z-10">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400 tracking-widest uppercase text-center mb-2">Process</p>
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              variants={itemVariants}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
              >
                {step.bgSvg}
              </motion.div>
              <motion.div 
                className="flex justify-center mb-4 text-red-600 dark:text-red-400 relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 relative z-10">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 relative z-10">{step.description}</p>
              <motion.div
                className="absolute bottom-2 right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-red-700 transition-colors duration-300 red-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

  