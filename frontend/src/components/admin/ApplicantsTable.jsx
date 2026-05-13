import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, FileText, Mail, Phone, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import ApplicantProfileModal from './ApplicantProfileModal';

const shortlistingStatus = ["Accepted", "Rejected", "Pending"];

const ApplicantsTable = ({ applicants: applicantsProp }) => {
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { applicants } = useSelector(store => store.application);
    const applicationRows = Array.isArray(applicantsProp)
        ? applicantsProp
        : Array.isArray(applicants)
            ? applicants
            : [];

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
                // Refresh the page to see updated status
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleViewProfile = (applicant) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedApplicant(null);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'
        >
            <Table>
                <TableCaption>A list of recent job applicants</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Job Applied</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicationRows.length > 0 ? applicationRows.map((item, index) => (
                        <motion.tr
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TableCell>
                                <div className="font-medium">{item?.applicant?.fullname}</div>
                                <div className="text-sm text-gray-500">{item?.applicant?.email}</div>
                            </TableCell>
                            <TableCell>{item?.job?.title}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <a href={`mailto:${item?.applicant?.email}`} className="text-blue-500 hover:underline">{item?.applicant?.email}</a>
                                </div>
                                <div className="flex items-center mt-1">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <a href={`tel:${item?.applicant?.phoneNumber}`} className="text-blue-500 hover:underline">{item?.applicant?.phoneNumber}</a>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a className="flex items-center text-blue-600 hover:underline cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                        <FileText className="w-4 h-4 mr-2" />
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span className="text-gray-500">Not available</span>
                                )}
                            </TableCell>
                            <TableCell>{new Date(item?.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={item.status === 'Accepted' ? 'success' : item.status === 'Rejected' ? 'destructive' : 'secondary'}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <MoreHorizontal className="cursor-pointer" />
                                        </motion.div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48">
                                        <motion.div 
                                            whileHover={{ backgroundColor: "#f3f4f6" }}
                                            onClick={() => handleViewProfile(item)}
                                            className='flex w-full items-center my-2 cursor-pointer p-2 rounded gap-2'
                                        >
                                            <Eye className='w-4 h-4' />
                                            <span>View Profile</span>
                                        </motion.div>
                                        {shortlistingStatus.map((status, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                                onClick={() => statusHandler(status, item?._id)}
                                                className='flex w-full items-center my-2 cursor-pointer p-2 rounded'
                                            >
                                                <span>{status}</span>
                                            </motion.div>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </motion.tr>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-gray-500 py-10">
                                No applicants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            {/* Applicant Profile Modal */}
            <ApplicantProfileModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                applicant={selectedApplicant}
                onUpdateStatus={statusHandler}
            />
        </motion.div>
    )
}

export default ApplicantsTable
