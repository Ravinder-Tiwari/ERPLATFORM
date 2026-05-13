import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { JOB_API_END_POINT } from '@/utils/constant'
import { removeJobFromAllJobs, removeJobFromAllAdminJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const handleRemoveJob = async () => {
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${job?._id}`, { withCredentials: true });
            if (res.data.success) {
                // remove from proper slice depending on user
                if (user?.role === 'recruiter') {
                    dispatch(removeJobFromAllAdminJobs(job?._id));
                } else {
                    dispatch(removeJobFromAllJobs(job?._id));
                }
                toast.success(res.data.message || 'Job removed');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to remove job');
        }
    }

    return (
        <div className='flex flex-col p-6 pb-8 rounded-2xl glass-card hover:shadow-2xl hover:-translate-y-1 text-gray-800 dark:text-gray-100 transition-all duration-300 h-full min-h-[350px]'>
            <div className='flex items-center justify-between mb-4'>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400 border-gray-200 dark:border-gray-700" size="icon"><Bookmark className="h-4 w-4" /></Button>
            </div>

            <div className='flex items-center gap-4 mb-4'>
                <Avatar className="h-16 w-16">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                </Avatar>
                <div>
                    <h2 className='font-semibold text-xl'>{job?.company?.name}</h2>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>India</p>
                </div>
            </div>

            <div className='mb-4 flex-grow'>
                <h1 className='font-bold text-xl mb-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-3'>

                    {/* {job?.description} */}
                    {job?.description?.split(" ").slice(0, 10).join(" ")}...



                </p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mb-6'>
                <Badge className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-none font-semibold shadow-none">{job?.position} Positions</Badge>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border-none font-semibold shadow-none">{job?.jobType}</Badge>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border-none font-semibold shadow-none">{job?.salary} LPA</Badge>
            </div>

            <div className='mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className='w-full min-w-0 sm:flex-1 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'>Details</Button>
                {user?.role === 'recruiter' ? (
                    <Button onClick={handleRemoveJob} className="w-full min-w-0 sm:flex-1 bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm">Remove Job</Button>
                ) : (
                    <Button className="w-full min-w-0 sm:flex-1 bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm">Save For Later</Button>
                )}
            </div>
        </div>
    )
}

export default Job
