import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Building2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { motion } from 'framer-motion'

const CompanySetup = () => {
    const params = useParams();
    const dispatch = useDispatch();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const validate = () => {
        let errors = {};
        if (!input.name) errors.name = "Company name is required";
        if (!input.description) errors.description = "Description is required";
        if (!input.website) errors.website = "Website is required";
        if (!input.location) errors.location = "Location is required";
        if (!input.file && !singleCompany.logo) errors.file = "Logo is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("Submit handler triggered");
        
        if (!validate()) {
            toast.error("Please fill all the required fields.");
            return;
        }
        
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        
        console.log("FormData prepared:", {
            name: input.name,
            description: input.description,
            website: input.website,
            location: input.location,
            hasFile: !!input.file
        });
        
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            console.log("Response from update:", res.data);
            
            if (res.data.success) {
                // Dispatch updated company to Redux
                if (res.data.company) {
                    console.log("Dispatching company to Redux:", res.data.company);
                    dispatch(setSingleCompany(res.data.company));
                }
                toast.success(res.data.message);
                navigate("/admin");
            }
        } catch (error) {
            console.log("Error updating company:", error);
            console.log("Error response:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to update company.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    }, [singleCompany]);

    return (
        <div className='bg-mesh-light dark:bg-mesh-dark min-h-screen pt-16'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-2xl mx-auto px-4 py-8'
            >
                <div className='glass-card rounded-2xl p-8'>
                    <div className='flex items-center mb-8'>
                        <div className="bg-red-600 p-3 rounded-xl mr-5">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400 tracking-widest uppercase mb-1">Configuration</p>
                            <h1 className='font-bold text-3xl text-gray-900 dark:text-white'>Company Setup</h1>
                        </div>
                    </div>
                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name</Label>
                                <Input
                                    id="name"
                                    className='bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white'
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                                <Input
                                    id="description"
                                    className='bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white'
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                />
                                {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website URL</Label>
                                <Input
                                    id="website"
                                    className='bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white'
                                    type="text"
                                    name="website"
                                    value={input.website}
                                    onChange={changeEventHandler}
                                />
                                {errors.website && <span className="text-red-500 text-xs">{errors.website}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</Label>
                                <Input
                                    id="location"
                                    className='bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white'
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                />
                                {errors.location && <span className="text-red-500 text-xs">{errors.location}</span>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Logo</Label>
                            <Input
                                id="logo"
                                className='bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white'
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                            {errors.file && <span className="text-red-500 text-xs">{errors.file}</span>}
                        </div>
                        <div className='flex items-center justify-between gap-4 pt-6'>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate("/admin/companies")}
                                className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="px-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 red-glow"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Company'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default CompanySetup;





