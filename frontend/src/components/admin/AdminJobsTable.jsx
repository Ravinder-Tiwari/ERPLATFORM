import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Briefcase, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '../ui/badge'
import { Tab } from 'react-bootstrap'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { successToast, errorToast } from '@/utils/toast'

const AdminJobsTable = ({ onJobClick }) => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const { singleJob } = useSelector(store => store.job);


    useEffect(()=>{ 
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    const handleDeleteJob = async (jobId) => {
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                successToast(res.data.message);
                // Refresh the jobs list
                window.location.reload();
            }
        } catch (error) {
            errorToast(error.response?.data?.message || 'Failed to delete job');
            console.error('Error deleting job:', error);
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='glass-card rounded-2xl overflow-hidden'
        >
            <Table>
                <TableCaption>A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Date Posted</TableHead>
                        <TableHead>Total Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job, index) => (
                        <motion.tr
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onJobClick(job._id)}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <TableCell>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                    </Avatar>
                                    <span>{job?.company?.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{job?.location}</TableCell>
                            <TableCell>{job?.salary}</TableCell>
                            <TableCell>{new Date(job?.createdAt).toLocaleDateString()}</TableCell>
                         <TableCell>{ singleJob?.applications?.length|| 0}</TableCell> 
                            <TableCell>
                                <Badge variant={job?.isActive ? "success" : "secondary"}>
                                    {job?.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <MoreHorizontal className="cursor-pointer" />
                                        </motion.div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40">
                                        <motion.div 
                                            whileHover={{ backgroundColor: "#f3f4f6" }}
                                            onClick={() => navigate(`/admin/jobs/${job._id}`)} 
                                            className='flex items-center gap-2 w-full cursor-pointer p-2 rounded'
                                        >
                                            <Edit2 className='w-4' />
                                            <span>Edit Job</span>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ backgroundColor: "#f3f4f6" }}
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                            className='flex items-center w-full gap-2 cursor-pointer mt-2 p-2 rounded'
                                        >
                                            <Eye className='w-4'/>
                                            <span>View Applicants</span>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ backgroundColor: "#fef2f2" }}
                                            onClick={() => handleDeleteJob(job._id)} 
                                            className='flex items-center w-full gap-2 cursor-pointer mt-2 p-2 rounded hover:text-red-600'
                                        >
                                            <Trash2 className='w-4'/>
                                            <span>Delete Job</span>
                                        </motion.div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </motion.div>
    )
}

export default AdminJobsTable
