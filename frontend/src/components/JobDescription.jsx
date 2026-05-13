import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { CalendarDays, MapPin, Briefcase, DollarSign, Users, Clock } from 'lucide-react'

const JobDescription = () => {
  const { singleJob } = useSelector(store => store.job)
  const { user } = useSelector(store => store.auth)
  const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
  const [isApplied, setIsApplied] = useState(isInitiallyApplied)

  const params = useParams()
  const jobId = params.id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canApply = !user || user?.role === 'student'

  const applyJobHandler = async () => {
    if (!user) {
      if (window.confirm('You must log in first to apply for this job. Click OK to log in.')) {
        navigate('/login')
      }
      return
    }

    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
      if (res.data.success) {
        setIsApplied(true)
        const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
        dispatch(setSingleJob(updatedSingleJob))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job))
          setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSingleJob()
  }, [jobId, dispatch, user?._id])

  return (
    <div className="bg-mesh-light dark:bg-mesh-dark min-h-screen text-gray-900 dark:text-gray-100 pt-6 relative overflow-hidden">
      <svg className="absolute top-0 left-0 w-48 h-48 opacity-30 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="#E0BBE4">
        <path d="M40.5,-62.1C52.3,-54.2,58.9,-42.3,62.6,-29.9C66.3,-17.5,67.1,-4.6,67.3,10.3C67.5,25.3,67.2,42.1,57.6,50.8C48.1,59.5,29.3,60.1,13.7,56.7C-2,53.3,-15.4,45.9,-27.3,37.3C-39.1,28.8,-49.3,19,-55.4,5.5C-61.5,-8,-63.5,-25.1,-56.5,-37.5C-49.6,-49.8,-33.7,-57.5,-18.6,-62.5C-3.6,-67.5,10.7,-69.9,25.2,-66.2C39.7,-62.4,53.4,-52.1,62.1,-40.5Z" transform="translate(100 100)" />
      </svg>

      <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-20 animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="#FEC8D8">
        <path d="M32.7,-58.1C44.4,-54.7,55.5,-44.1,64.4,-31.3C73.3,-18.5,80,-3.5,77.4,9.3C74.9,22.1,63.1,32.8,52.7,41.6C42.4,50.4,33.4,57.3,23,61.3C12.5,65.3,0.6,66.3,-10.2,63.2C-21.1,60.2,-31.8,52.9,-42.5,44.3C-53.2,35.8,-63.9,25.9,-66.4,14.3C-69,-2.4,-63.5,-16.5,-56.5,-28.8C-49.5,-41.1,-41,-51.6,-30.5,-55.6C-20,-59.6,-10,-57,-0.3,-56.5C9.5,-56.1,19,-57.6,32.7,-58.1Z" transform="translate(100 100)" />
      </svg>


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="font-extrabold text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
                  {singleJob?.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  {singleJob?.company?.name}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 font-semibold">
                    {singleJob?.position} Positions
                  </Badge>
                  <Badge className="px-3 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300 font-semibold">
                    {singleJob?.jobType}
                  </Badge>
                  <Badge className="px-3 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 font-semibold">
                    {singleJob?.salary} LPA
                  </Badge>
                </div>
              </div>
              {canApply && (
                <Button
                  onClick={isApplied ? null : applyJobHandler}
                  disabled={isApplied}
                  className={`mt-6 sm:mt-0 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${isApplied
                    ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50"
                    : "bg-red-600 hover:bg-red-700 text-white red-glow shadow-lg shadow-red-500/20"
                    }`}
                >
                  {isApplied ? "Already Applied" : "Apply Now"}
                </Button>
              )}
            </div>

            <div className="space-y-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10">
                <MapPin className="w-6 h-6 mr-4 text-red-600 dark:text-red-400" />
                <span className="text-lg">
                  <strong className="text-gray-900 dark:text-white">Location:</strong> <span className="text-gray-600 dark:text-gray-400">{singleJob?.location}</span>
                </span>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10">
                <Clock className="w-6 h-6 mr-4 text-red-600 dark:text-red-400" />
                <span className="text-lg">
                  <strong className="text-gray-900 dark:text-white">Experience:</strong> <span className="text-gray-600 dark:text-gray-400">{singleJob?.experience} years</span>
                </span>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10">
                <DollarSign className="w-6 h-6 mr-4 text-red-600 dark:text-red-400" />
                <span className="text-lg">
                  <strong className="text-gray-900 dark:text-white">Salary:</strong> <span className="text-gray-600 dark:text-gray-400">{singleJob?.salary} LPA</span>
                </span>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10">
                <Users className="w-6 h-6 mr-4 text-red-600 dark:text-red-400" />
                <span className="text-lg">
                  <strong className="text-gray-900 dark:text-white">Applicants:</strong> <span className="text-gray-600 dark:text-gray-400">{singleJob?.applications?.length}</span>
                </span>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10">
                <CalendarDays className="w-6 h-6 mr-4 text-red-600 dark:text-red-400" />
                <span className="text-lg">
                  <strong className="text-gray-900 dark:text-white">Posted Date:</strong> <span className="text-gray-600 dark:text-gray-400">{new Date(singleJob?.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/10">
                <Briefcase className="w-6 h-6 mr-4 text-red-600 dark:text-red-400" />
                <span className="text-lg">
                  <strong className="text-gray-900 dark:text-white">Job Type:</strong> <span className="text-gray-600 dark:text-gray-400">{singleJob?.jobType}</span>
                </span>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                <Briefcase className="w-5 h-5 mr-2 text-red-600" />
                Job Description
              </h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {singleJob?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default JobDescription
