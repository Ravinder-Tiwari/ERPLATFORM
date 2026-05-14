import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// ================= APPLY FOR A JOB =================

export const applyJob = async (req, res) => {
    try {
        // Logged in user id coming from auth middleware
        const userId = req.id;

        // Job id coming from route params
        const jobId = req.params.id;

        // Check if job id exists
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };

        // Check if user has already applied for this job
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        // If application already exists then stop user
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // Find the job in database
        const job = await Job.findById(jobId);

        // If job does not exist
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        if (!job.isActive || job.position <= 0) {
            return res.status(400).json({
                message: "This job is no longer accepting applications.",
                success: false
            });
        }

        // Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Push application id into job applications array
        job.applications.push(newApplication._id);

        // Save updated job
        await job.save();

        // Success response
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
};

// ================= GET ALL APPLIED JOBS OF USER =================

export const getAppliedJobs = async (req, res) => {
    try {

        // Logged in user id
        const userId = req.id;

        // Find all applications of current user
        const application = await Application.find({
            applicant: userId
        })
            // Sort applications by latest first
            .sort({ createdAt: -1 })

            // Populate job details
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },

                // Populate company details inside job
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                }
            });

        // If no applications found
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };

        // Return all applications
        return res.status(200).json({
            application,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

// ================= GET ALL APPLICANTS FOR A PARTICULAR JOB =================
// Admin can see how many users applied for a job
export const getApplicants = async (req, res) => {
    try {

        // Get job id from params
        const jobId = req.params.id;

        // Find job and populate applications + applicant details
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            match: {
                status: { $ne: 'rejected' }
            },
            options: { sort: { createdAt: -1 } },

            // Populate applicant data inside applications
            populate: {
                path: 'applicant'
            }
        });

        // If job not found
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        };

        if (job.created_by.toString() !== req.id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to view applicants for this job.",
                success: false
            });
        }

        // Add job info with every application
        const applications = job.applications.map((application) => ({
            ...application.toObject(),

            // Custom job object
            job: {
                _id: job._id,
                title: job.title,
                company: job.company,
                position: job.position,
                isActive: job.isActive,
            }
        }));

        // Return applications
        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

// ================= GET ALL APPLICANTS FOR ADMIN =================
export const getAdminApplicants = async (req, res) => {
    try {

        // Logged in admin id
        const adminId = req.id;

        // Find all jobs created by admin
        const jobs = await Job.find({
            created_by: adminId
        }).populate({
            path: 'applications',
            match: {
                status: { $ne: 'rejected' }
            },
            options: { sort: { createdAt: -1 } },

            // Populate applicant details
            populate: {
                path: 'applicant'
            }
        });

        // Convert jobs data into applications array
        const applications = jobs.flatMap((job) =>
            (job.applications || []).map((application) => ({
                ...application.toObject(),

                // Attach job info
                job: {
                    _id: job._id,
                    title: job.title,
                    company: job.company,
                    position: job.position,
                    isActive: job.isActive,
                }
            }))
        );

        // Return all non-rejected applications
        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

// ================= UPDATE APPLICATION STATUS =================
export const updateStatus = async (req, res) => {
    try {

        // Get status from request body
        const { status } = req.body;

        // Get application id from params
        const applicationId = req.params.id;

        const normalizedStatus =
            typeof status === 'string' ? status.toLowerCase().trim() : '';
        const allowedStatuses = ['pending', 'accepted', 'rejected'];

        // Check if status exists
        if (!normalizedStatus) {
            return res.status(400).json({
                message: 'status is required',
                success: false
            })
        };

        if (!allowedStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                message: 'Invalid status value.',
                success: false
            });
        }

        // Find application using application id
        const application = await Application.findById(applicationId).populate({
            path: 'job',
            select: 'title company created_by position isActive isFilled'
        });

        // If application not found
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        if (!application.job) {
            return res.status(404).json({
                message: "Job not found for this application.",
                success: false
            });
        }

        if (application.job.created_by.toString() !== req.id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to update this application.",
                success: false
            });
        }

        const previousStatus = application.status;
        const job = application.job;

        if (previousStatus === normalizedStatus) {
            return res.status(200).json({
                message: "Status updated successfully.",
                success: true,
                application: {
                    _id: application._id,
                    status: application.status,
                },
                job: {
                    _id: job._id,
                    position: job.position,
                    isActive: job.isActive,
                    isFilled: job.isFilled
                },
                removedFromRecruiterQueue: normalizedStatus === 'rejected',
                jobRemovedFromListings: !job.isActive || job.position <= 0
            });
        }

        if (previousStatus !== 'accepted' && normalizedStatus === 'accepted') {
            if ((!job.isActive && !job.isFilled) || job.position <= 0) {
                return res.status(400).json({
                    message: "No open positions are left for this job.",
                    success: false
                });
            }

            job.position -= 1;

            if (job.position === 0) {
                job.isFilled = true;
                job.isActive = false;
            }
        }

        if (previousStatus === 'accepted' && normalizedStatus !== 'accepted') {
            job.position += 1;

            if (job.isFilled && job.position > 0) {
                job.isFilled = false;
                job.isActive = true;
            }
        }

        // Update application status
        application.status = normalizedStatus;

        // Save updated application
        await Promise.all([application.save(), job.save()]);

        const filledJobMessage =
            normalizedStatus === 'accepted' && !job.isActive && job.position === 0
                ? ' Applicant accepted and the job is now filled, so it has been removed from active listings.'
                : '';

        // Success response
        return res.status(200).json({
            message:
                normalizedStatus === 'rejected'
                    ? "Applicant rejected and removed from the recruiter list."
                    : `Status updated successfully.${filledJobMessage}`,
            success: true,
            application: {
                _id: application._id,
                status: application.status,
            },
            job: {
                _id: job._id,
                position: job.position,
                isActive: job.isActive,
                isFilled: job.isFilled
            },
            removedFromRecruiterQueue: normalizedStatus === 'rejected',
            jobRemovedFromListings: !job.isActive || job.position <= 0
        });

    } catch (error) {
        console.log(error);
    }
}
