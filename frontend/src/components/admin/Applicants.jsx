import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ApplicantsTable from './ApplicantsTable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplicants } from '@/redux/applicationSlice'
import { motion } from 'framer-motion'
import ResumePreviewSidebar from './ResumePreviewSidebar'

const Applicants = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { applicants } = useSelector(store => store.application)
    const [previewApplicant, setPreviewApplicant] = useState(null)

    useEffect(() => {
        if (id) {
            dispatch(fetchApplicants(id))
        } else {
            dispatch(fetchApplicants())
        }
    }, [dispatch, id])

    const handleOpenResumePreview = (applicant) => {
        setPreviewApplicant(applicant)
    }

    const handleCloseResumePreview = () => {
        setPreviewApplicant(null)
    }

    return (
        <div className='dark:bg-gray-900 bg-gray-50 min-h-screen'>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-7xl mx-auto dark:bg-gray-800 bg-white rounded-lg shadow-lg p-8 mt-20'
            >
                <h1 className='font-bold text-2xl mb-6 text-gray-800 dark:text-white'>
                    {id ? 'Job Applicants' : 'All Applicants'}
                </h1>
                <ApplicantsTable
                    applicants={applicants}
                    onViewResume={handleOpenResumePreview}
                />
            </motion.div>

            <ResumePreviewSidebar
                applicant={previewApplicant}
                isOpen={Boolean(previewApplicant)}
                onClose={handleCloseResumePreview}
            />
        </div>
    )
}

export default Applicants
