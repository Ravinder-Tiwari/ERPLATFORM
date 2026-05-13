import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import { Briefcase, ArrowLeft, DollarSign, MapPin, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { successToast, errorToast } from '@/utils/toast'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        experience: "",
        location: "",
        jobType: "",
        position: "",
        company: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, company: selectedCompany._id });
        setErrors({ ...errors, company: "" });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!input.title.trim()) newErrors.title = "Job title is required";
        if (!input.description.trim()) newErrors.description = "Job description is required";
        if (!input.requirements.trim()) newErrors.requirements = "At least one requirement is needed";
        if (!input.salary || input.salary <= 0) newErrors.salary = "Please enter a valid salary";
        if (!input.experience || input.experience < 0) newErrors.experience = "Please enter a valid experience level";
        if (!input.location.trim()) newErrors.location = "Location is required";
        if (!input.jobType.trim()) newErrors.jobType = "Job type is required";
        if (!input.position || input.position <= 0) newErrors.position = "Please enter a valid number of positions";
        if (!input.company) newErrors.company = "Please select a company";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            if (!input.company) {
                errorToast("Please select a company before posting a job");
                return;
            }

            const processedRequirements = input.requirements
                .split('\n')
                .map(req => req.trim())
                .filter(req => req && req !== 'Responsibilities:')
                .join(', ');


                
            const formattedInput = {
                title: input.title,
                description: input.description,
                requirements: processedRequirements,
                salary: parseFloat(input.salary),
                experience: parseInt(input.experience),
                location: input.location,
                jobType: input.jobType,
                position: parseInt(input.position),
                companyId: input.company
            };
            
            const res = await axios({
                method: 'post',
                url: `${JOB_API_END_POINT}/post`,
                data: formattedInput,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                console.log("hii")
                successToast(res.data.message || 'Job posted successfully!');
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Job posting error:", error);
            
            if (error.response) {
                if (error.response.status === 400) {
                    errorToast(error.response.data.message || "Invalid job data. Please check your inputs.");
                } else if (error.response.status === 401) {
                    errorToast("Unauthorized. Please log in again.");
                } else if (error.response.status === 404) {
                    errorToast("Job posting endpoint not found. Please contact support.");
                } else {
                    errorToast("An unexpected error occurred while posting the job.");
                }
            } else if (error.request) {
                errorToast("No response received from the server. Please check your internet connection.");
            } else {
                errorToast("Error setting up job posting request.");
            }
        }
    };

    return (
        <div className='bg-mesh-light dark:bg-mesh-dark min-h-screen pt-16'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-4xl mx-auto px-4 py-8'
            >
                <div className='glass-card rounded-2xl p-8'>
                    <div className='flex items-center mb-8'>
                        <div className="bg-red-600 p-3 rounded-xl mr-5">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400 tracking-widest uppercase mb-1">Creation</p>
                            <h1 className='font-bold text-3xl text-gray-900 dark:text-white'>Post New Job</h1>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    placeholder="e.g., Senior React Developer"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    className={`bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.title ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary (per annum)</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="salary"
                                        type="number"
                                        name="salary"
                                        placeholder="120000"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        className={`pl-10 bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.salary ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Experience (years)</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="experience"
                                        type="number"
                                        name="experience"
                                        placeholder="5"
                                        value={input.experience}
                                        onChange={changeEventHandler}
                                        className={`pl-10 bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.experience ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="location"
                                        type="text"
                                        name="location"
                                        placeholder="San Francisco, CA"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className={`pl-10 bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.location ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the role..."
                                value={input.description}
                                onChange={changeEventHandler}
                                className={`bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.description ? 'border-red-500' : ''}`}
                                required
                                rows={4}
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Requirements</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                placeholder="List key requirements..."
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className={`bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.requirements ? 'border-red-500' : ''}`}
                                rows={4}
                            />
                            {errors.requirements && <p className="mt-1 text-xs text-red-500">{errors.requirements}</p>}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className="space-y-2">
                                <Label htmlFor="jobType" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Type</Label>
                                <Input
                                    id="jobType"
                                    type="text"
                                    name="jobType"
                                    placeholder="Full-time"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    className={`bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.jobType ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.jobType && <p className="mt-1 text-xs text-red-500">{errors.jobType}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Positions Available</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="position"
                                        type="number"
                                        name="position"
                                        placeholder="2"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        className={`pl-10 bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.position ? 'border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
                            </div>
                        </div>

                        {companies.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Company</Label>
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger id="company" className={`bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white ${errors.company ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card">
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>{company.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
                            </div>
                        )}

                        <div className='flex items-center justify-between gap-4 pt-6'>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate("/admin/jobs")}
                                className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="px-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 red-glow flex items-center gap-2"
                            >
                                <span>Post Job</span>
                                <Briefcase size={18} />
                            </Button>
                        </div>
                    </form>

                    {companies.length === 0 && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className='text-sm text-red-600 dark:text-red-400 font-semibold text-center'>
                                * Please register a company first, before posting a job
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default PostJob
