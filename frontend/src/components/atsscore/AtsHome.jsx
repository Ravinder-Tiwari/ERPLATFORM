import React, { useState } from 'react';
import { ATS_RESUME_SCORE_END_POINT } from '@/utils/constant';
import { motion } from 'framer-motion';
import FileUpload from './components/FileUpload';
import ScoreCard from './components/ScoreCard';
import AnalysisSection from './components/AnalysisSection';
import CTASection from './components/CTASection';

export default function AtsHome() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const validateFile = (file) => {
    // Check file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF and Word documents are allowed');
    }

    return true;
  };

  const handleFileUpload = async (event) => {
    try {
      setError(null);
      const uploadedFile = event.target.files[0];
      
      if (!uploadedFile) {
        throw new Error('Please select a file');
      }

      validateFile(uploadedFile);
      setFile(uploadedFile);
      await analyzeResume(uploadedFile);
    } catch (err) {
      setError(err.message);
      setFile(null);
    }
  };

  const analyzeResume = async (resumeFile) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await fetch(ATS_RESUME_SCORE_END_POINT, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // If it's an AI model error and we haven't exceeded retries, try again
        if (data.error?.includes('AI model') && retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          console.log(`Retrying analysis... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
          await analyzeResume(resumeFile);
          return;
        }
        throw new Error(data.error || 'Error analyzing resume');
      }

      if (!data.score || !data.analysis) {
        throw new Error('Invalid response from server');
      }

      setScore(data.score);
      setAnalysis(data.analysis);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      setError(err.message || 'Error analyzing resume. Please try again.');
      console.error('Resume analysis error:', err);
      setScore(null);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (file) {
      setRetryCount(0);
      analyzeResume(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ATS Resume Scorer</h1>
          <p className="text-lg text-gray-600">
            Upload your resume to get an ATS compatibility score and detailed analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FileUpload onFileUpload={handleFileUpload} />
        </motion.div>
        <div>
        {/* <CTASection /> */}

        </div>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">
              {retryCount > 0 ? `Retrying analysis... Attempt ${retryCount}/${MAX_RETRIES}` : 'Analyzing your resume...'}
            </p>
          </motion.div>
        )}

        {/* <CTASection /> */}
        {score && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard score={score} />
              <AnalysisSection analysis={analysis} />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* <CTASection /> */}
            </motion.div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4"
          >
            <div className="flex flex-col space-y-2">
              <p className="text-red-600">{error}</p>
              {error.includes('AI model') && (
                <button
                  onClick={handleRetry}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors w-fit"
                >
                  Retry Analysis
                </button>
              )}
            </div>
          </motion.div>
        )}
        <CTASection />
      </div>
    </div>
  );
}
