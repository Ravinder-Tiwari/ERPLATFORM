import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 
import useGetAllJobs from '@/hooks/useGetAllJobs'; // Import your custom hook


// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto px-4 md:px-8 pb-20 relative'>

       <svg
        className="absolute top-0 left-0 w-1/2 h-1/3 opacity-10 z-[-1] pointer-events-none animate-move-slow"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M500,0C229.6,0,0,229.6,0,500c0,270.4,229.6,500,500,700s500-229.6,500-500C1000,229.6,770.4,0,500,0z"
          fill="currentColor"
          stroke="none"
        />
      </svg>

      {/* Title Section */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-[#55679C] dark:text-blue-400">Latest & Top </span>
          Job Openings
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore the newest and most sought-after job openings on prep4Job. Whether you prefer remote work or a dynamic office environment, we have a wide range of opportunities to suit your career goals.
        </p>
      </div>

           
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                {allJobs.length <= 0 ? 
                    <p className='col-span-full text-center text-xl text-gray-500 dark:text-gray-400'>No jobs available at the moment.</p> : 
                    allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </div>
    )
}

export default LatestJobs
