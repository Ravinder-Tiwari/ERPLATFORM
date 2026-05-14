import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { successToast, errorToast } from '@/utils/toast';
import { getResumeFileName, getResumeViewUrl } from '@/utils/resume';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const { user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: null,
    });

    const resumeUrl = getResumeViewUrl(user?.profile);
    const resumeName = getResumeFileName(user?.profile);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                successToast(res.data.message || 'Profile updated successfully!');
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            errorToast(error.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px] glass-card border-white/10 text-gray-900 dark:text-white overflow-hidden p-0">
                <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
                    <Upload className="w-6 h-6 text-white" />
                    <DialogTitle className="text-xl font-bold text-white">Update Profile</DialogTitle>
                </div>
                <form onSubmit={submitHandler} className="p-6 space-y-5">
                    <div className='space-y-4'>
                        <div className='space-y-1.5'>
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                            <Input
                                id="name"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                className="bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className="bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor="number" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</Label>
                            <Input
                                id="number"
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Short Bio</Label>
                            <Input
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className="bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor="skills" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skills (comma-separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className="bg-white/50 dark:bg-gray-900/50 rounded-xl focus:ring-red-500 border-gray-200 dark:border-white/10 dark:text-white"
                            />
                        </div>
                        <div className='space-y-2 pt-2'>
                            <Label htmlFor="file" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resume (PDF, DOC, DOCX)</Label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <label htmlFor="file" className="cursor-pointer bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white py-2 px-4 rounded-xl inline-flex items-center text-sm font-medium transition-all">
                                        <Upload className="mr-2 h-4 w-4 text-red-600" />
                                        {input.file ? "Change File" : "Upload Resume"}
                                    </label>
                                    {input.file && (
                                        <span className='text-xs text-red-600 dark:text-red-400 font-medium truncate max-w-[150px]'>{input.file.name}</span>
                                    )}
                                </div>
                                {!input.file && resumeUrl && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-500">Current:</span>
                                        <a 
                                            target='_blank' 
                                            rel='noopener noreferrer' 
                                            href={resumeUrl} 
                                            className='text-red-600 dark:text-red-400 hover:underline font-semibold'
                                        >
                                            {resumeName}
                                        </a>
                                    </div>
                                )}
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={fileChangeHandler}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 rounded-xl transition-all duration-300 red-glow shadow-lg shadow-red-500/20"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
