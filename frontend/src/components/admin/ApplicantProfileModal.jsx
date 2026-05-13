import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Mail, Phone, MapPin, Award, FileText, Download, User, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const ApplicantProfileModal = ({ isOpen, onClose, applicant, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(applicant?.status || 'Pending')
  
  if (!applicant) return null;

  const statusColors = {
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    onUpdateStatus(status, applicant._id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Applicant Profile</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <div className="flex items-start space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <Avatar className="h-24 w-24">
              <AvatarImage src={applicant?.applicant?.profile?.profilePhoto} alt={applicant?.applicant?.fullname} />
              <AvatarFallback>{applicant?.applicant?.fullname?.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold">{applicant?.applicant?.fullname}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {applicant?.applicant?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {applicant?.applicant?.phoneNumber}
              </p>
              
              <div className="flex items-center space-x-3 mt-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                <Badge className={`${statusColors[selectedStatus?.toLowerCase()]}`}>
                  {selectedStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Job Applied */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-500" />
              Job Applied For
            </h3>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{applicant?.job?.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <Calendar className="w-4 h-4 inline mr-2" />
              Applied on {new Date(applicant?.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Skills */}
          {applicant?.applicant?.profile?.skills && applicant?.applicant?.profile?.skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-500" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant?.applicant?.profile?.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {applicant?.applicant?.profile?.bio && (
            <div>
              <h3 className="font-semibold text-lg mb-2">About</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {applicant?.applicant?.profile?.bio}
              </p>
            </div>
          )}

          {/* Resume */}
          {applicant?.applicant?.profile?.resume && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Resume
              </h3>
              <a 
                href={applicant?.applicant?.profile?.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                File: {applicant?.applicant?.profile?.resumeOriginalName || 'Resume'}
              </p>
            </div>
          )}

          {/* Status Update Actions */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Update Application Status</h3>
            <div className="flex flex-wrap gap-2">
              {['Accepted', 'Rejected', 'Pending'].map((status) => (
                <Button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  className={`
                    ${selectedStatus === status 
                      ? status === 'Accepted' 
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : status === 'Rejected'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : ''
                    }
                  `}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex space-x-3">
            <a
              href={`mailto:${applicant?.applicant?.email}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </a>
            <a
              href={`tel:${applicant?.applicant?.phoneNumber}`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </a>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicantProfileModal
