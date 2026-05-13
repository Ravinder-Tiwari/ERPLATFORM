import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import FilterCard from '@/components/FilterCard'
import Job from '@/components/Job'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  useEffect(() => {
    if (input) {
      const filtered = (allAdminJobs || []).filter(job => {
        const q = input.toLowerCase();
        return (job?.title || '').toLowerCase().includes(q) ||
          (job?.company?.name || '').toLowerCase().includes(q) ||
          (job?.description || '').toLowerCase().includes(q) ||
          (job?.location || '').toLowerCase().includes(q)
      })
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allAdminJobs || []);
    }
  }, [allAdminJobs, input]);

  return (
    <div className='bg-mesh-light dark:bg-mesh-dark min-h-screen'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='max-w-6xl mx-auto my-10 px-4'
      >
        <div className='flex pt-16 flex-col sm:flex-row items-center justify-between my-5 space-y-4 sm:space-y-0'>
          <div className='relative w-full sm:w-64'>
            <Input
              className="pl-10 pr-4 py-2 w-full"
              placeholder="Filter by name, role"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              New Job
            </Button>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5'>
          <div>
            <FilterCard />
          </div>

          <div className='flex-1 h-[78vh] overflow-y-auto pb-5'>
            {(!filterJobs || filterJobs.length === 0) ? (
              <div className='text-center py-10'>No jobs found</div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filterJobs.map(job => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminJobs
