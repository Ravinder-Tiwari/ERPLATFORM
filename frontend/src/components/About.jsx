import React from 'react';
import { Users, Briefcase, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div>
      <div className=" pt-10  dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-center mb-8 text-gray-800 dark:text-white"
            {...fadeIn}
          >
            About <span className="text-red-600 dark:text-red-400">prep4Job</span>
          </motion.h1>
          
          <motion.div 
            className="glass-card rounded-2xl p-8 mb-16"
            {...fadeIn}
          >
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              prep4Job is a cutting-edge job search platform designed to connect talented professionals with their dream careers. Our mission is to revolutionize the job search experience by leveraging advanced technology and a user-centric approach.
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Founded in 2023, prep4Job has quickly become a trusted resource for job seekers and employers alike. We're committed to fostering meaningful connections and empowering individuals to reach their full potential in their professional lives.
            </p>
          </motion.div>

          <motion.h2 
            className="text-4xl font-semibold text-center mb-12 text-gray-800 dark:text-white"
            {...fadeIn}
          >
            Why Choose <span className="text-red-600 dark:text-red-400">prep4Job</span>?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: Users, title: "Large Network", description: "Access to thousands of job listings from top companies." },
              { icon: Briefcase, title: "Diverse Opportunities", description: "Jobs across various industries and experience levels." },
              { icon: Award, title: "Quality Matches", description: "Advanced algorithms to match you with suitable positions." },
              { icon: TrendingUp, title: "Career Growth", description: "Resources and tools to help you advance your career." }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="glass-card rounded-2xl p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <feature.icon size={64} className="text-red-500 mb-6 flex-shrink-0" />
                <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="bg-red-600 text-white rounded-xl shadow-xl p-10 text-center"
            {...fadeIn}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8">Join prep4Job today and take the first step towards your dream career.</p>
          <Link to="/signup">
         
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Sign Up Now
            </button>
            </Link>
          </motion.div>

          <motion.div 
            className="glass-card rounded-2xl p-8 mt-16"
            {...fadeIn}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">What Our Users Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Sarah J.", role: "Software Engineer", quote: "prep4Job helped me land my dream job at a top tech company!" },
                { name: "Michael L.", role: "Marketing Manager", quote: "The diverse opportunities on prep4Job are unmatched. Highly recommended!" }
              ].map((testimonial, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-2">"{testimonial.quote}"</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">- {testimonial.name}, {testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    
  );
};

export default About;
