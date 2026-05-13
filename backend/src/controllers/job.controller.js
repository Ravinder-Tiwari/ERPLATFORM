import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        console.log("Received job posting data:", {
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experience, 
            position, 
            companyId,
            userId
        });

        // Validate all required fields
        const requiredFields = [
            { name: 'title', value: title },
            { name: 'description', value: description },
            { name: 'requirements', value: requirements },
            { name: 'salary', value: salary },
            { name: 'location', value: location },
            { name: 'jobType', value: jobType },
            { name: 'experience', value: experience },
            { name: 'position', value: position },
            { name: 'companyId', value: companyId }
        ];

        const missingFields = requiredFields
            .filter(field => !field.value)
            .map(field => field.name);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
                missingFields,
                success: false
            });
        }

        // Validate numeric fields
        if (isNaN(Number(salary)) || Number(salary) <= 0) {
            return res.status(400).json({
                message: "Invalid salary. Must be a positive number.",
                success: false
            });
        }

        if (isNaN(Number(experience)) || Number(experience) < 0) {
            return res.status(400).json({
                message: "Invalid experience level. Must be a non-negative number.",
                success: false
            });
        }

        if (isNaN(Number(position)) || Number(position) <= 0) {
            return res.status(400).json({
                message: "Invalid number of positions. Must be a positive number.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(req => req.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Job creation error:", error);
        
        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors,
                success: false
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A job with similar details already exists.",
                success: false
            });
        }

        // Generic server error
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        console.log("getAllJobs route hit");  
        const keyword = req.query.keyword || "";
        const query = {
            isActive: true,
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs.length) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId, isActive: true }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Delete a job (soft delete - set isActive to false)
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        // Find the job and verify the current user is the creator
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (job.created_by.toString() !== adminId.toString()) {
            return res.status(403).json({
                message: "You can only delete your own jobs.",
                success: false
            });
        }

        // Soft delete - set isActive to false
        job.isActive = false;
        await job.save();

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error deleting job.",
            success: false
        });
    }
}
