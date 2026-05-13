import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    console.log(filterJobs)
    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            console.log(filteredJobs)
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
            // console.log(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
<div className=' text-[#1E2A5E] pt-20 dark:bg-gray-900 dark:text-white min-h-screen'>
   
    <div className='max-w-7xl mx-auto mt-5'>
        {/* Define the grid for desktop view */}
        <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5'> {/* 300px for FilterCard, 1fr for the rest */}
            
            {/* FilterCard takes a fixed width in desktop view */}
            <div className=''>
                <FilterCard />
            </div>

            {/* Job cards container */}
            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                {filterJobs.length <= 0 ? (
                    <span>Job not found</span>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filterJobs.map((job) => (
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                key={job?._id}
                            >
                                <Job job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
</div>


        // <div className='bg-[#E1D7B7] text-[#1E2A5E]  dark:bg-gray-900 dark:text-white min-h-screen'>
        //     <Navbar />
        //     <div className='max-w-7xl mx-auto mt-5'>
        //         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>

        //             <div className='w-40'>
        //                 <FilterCard />
        //             </div>

        //             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full'>
        //                 {
        //                     filterJobs.length <= 0 ? <span>Job not found</span> : (
        //                         <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
        //                             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        //                                 {
        //                                     filterJobs.map((job) => (
        //                                         <motion.div
        //                                             initial={{ opacity: 0, x: 100 }}
        //                                             animate={{ opacity: 1, x: 0 }}
        //                                             exit={{ opacity: 0, x: -100 }}
        //                                             transition={{ duration: 0.3 }}
        //                                             key={job?._id}>
        //                                             <Job job={job} />
        //                                         </motion.div>
        //                                     ))
        //                                 }
        //                             </div>
        //                         </div>
        //                     )
        //                 }

        //             </div>
        //         </div>
        //     </div>


        // </div>


    )
}

export default Jobs