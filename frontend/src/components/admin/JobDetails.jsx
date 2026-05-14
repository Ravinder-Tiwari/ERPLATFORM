import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, Users } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { allAdminJobs } = useSelector(store => store.job);
  const [job, setJob] = useState(null);
  useEffect(() => {
    const selectedJob = allAdminJobs.find(job => job._id === id);
    setJob(selectedJob);
  }, [id, allAdminJobs]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E1D7B7] to-white dark:from-gray-900 dark:to-gray-800">
     
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <Link to="/admin/jobs" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Jobs</Link>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{job.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{job.company.name}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{job.location}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{job.salary}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Job Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Requirements</h2>
            <p className="text-gray-700 dark:text-gray-300">{job.requirements}</p>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{job?.applications?.length || 0} Applicants</span>
            </div>
            <Link 
              to={`/admin/jobs/${job._id}/applicants`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              View Applicants
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetails;
