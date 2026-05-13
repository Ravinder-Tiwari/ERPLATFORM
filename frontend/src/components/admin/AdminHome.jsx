import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Briefcase, Users, PlusCircle, ArrowRight, MapPin, DollarSign, Users2 } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import useGetAdminApplicants from '@/hooks/useGetAdminApplicants';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage } from '../ui/avatar';

const AdminHome = () => {
  const { companies } = useSelector(store => store.company);
  const { allAdminJobs } = useSelector(store => store.job);
  const { applicants } = useSelector(store => store.application);
  const navigate = useNavigate();

  useGetAllCompanies();
  useGetAllAdminJobs();
  useGetAdminApplicants();

  const totalApplicants = applicants.length;
  const currentCompany = companies[0];
  const companyName = currentCompany?.name || 'N/A';

  // Get recent jobs sorted by creation date (latest first)
  const recentJobs = useMemo(() => {
    return [...allAdminJobs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
  }, [allAdminJobs]);

  const stats = [
    { title: 'Company Name', value: companyName, icon: Building, accent: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', clickable: false },
    { title: 'Listed Jobs', value: allAdminJobs.length, icon: Briefcase, accent: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', onClick: () => navigate('/admin/jobs') },
    { title: 'Total Applicants', value: totalApplicants, icon: Users, accent: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', onClick: () => navigate('/admin/applicants') },
  ];

  const quickLinks = [
    { 
      title: 'Post New Job', 
      path: '/admin/jobs/create', 
      icon: PlusCircle, 
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => navigate('/admin/jobs/create')
    },
    {
      title: 'Update Company',
      path: currentCompany?._id ? `/admin/companies/${currentCompany._id}` : '/admin/companies/create',
      icon: Building,
      color: 'from-red-500 to-red-600',
      onClick: () => {
        const companyPath = currentCompany?._id ? `/admin/companies/${currentCompany._id}` : '/admin/companies/create';
        console.log('Navigating to:', companyPath, 'currentCompany:', currentCompany);
        navigate(companyPath);
      }
    },
  ];

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 tracking-widest uppercase mb-1">Overview</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={item.clickable === false ? undefined : { y: -4 }}
              className={`glass-card rounded-2xl p-6 flex items-center transition-all duration-300 ${item.clickable === false ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={item.clickable === false ? undefined : item.onClick}
            >
              <div className={`${item.bg} p-4 rounded-xl mr-5 transition-colors duration-200`}>
                <item.icon className={`w-6 h-6 ${item.accent}`} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.title}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-600 ml-auto" />
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 tracking-widest uppercase mb-1">Actions</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={link.onClick}
                className="cursor-pointer"
              >
                <div className={`bg-gradient-to-r ${link.color} rounded-2xl p-6 flex items-center text-white red-glow transition-all duration-300 hover:shadow-lg`}>
                  <div className="bg-white/20 p-3 rounded-xl mr-4">
                    <link.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{link.title}</h3>
                  <ArrowRight className="w-5 h-5 ml-auto opacity-70" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Job Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Job Posts</h2>
              <Link 
                to="/admin/jobs"
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                View All
              </Link>
            </div>

            {recentJobs && recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.1 }}
                    onClick={() => navigate(`/admin/jobs/${job._id}`)}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400 hover:shadow-md transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {job.company?.logo && (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={job.company.logo} alt={job.company.name} />
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {job.company?.name}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Users2 className="w-4 h-4" />
                        <span>{job.applications?.length || 0} applicants</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-500">No recent job posts to display.</p>
                <Link 
                  to="/admin/jobs/create"
                  className="inline-block mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Create your first job post
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Applicants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Applicants</h2>
              <Link 
                to="/admin/applicants"
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                View All
              </Link>
            </div>

            {applicants && applicants.length > 0 ? (
              <div className="space-y-4">
                {applicants.slice(0, 5).map((applicant, index) => (
                  <motion.div
                    key={applicant._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.1 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-md transition-all bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarImage src={applicant.applicant?.profile?.profilePhoto} alt={applicant.applicant?.fullname} />
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {applicant.applicant?.fullname}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {applicant.job?.title}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          applicant.status === 'accepted' ? 'default' :
                          applicant.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                        className="text-xs capitalize"
                      >
                        {applicant.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Applied {new Date(applicant.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-500">No recent applicants to display.</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
