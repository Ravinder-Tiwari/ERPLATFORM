import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleCompany, setCompanies } from '@/redux/companySlice';
import { motion } from 'framer-motion';
import { Building, ArrowLeft } from 'lucide-react';
import { selectUserId } from '@/redux/authSlice';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // Get userId from Redux store
    const userId = useSelector(selectUserId);
    const { companies } = useSelector(store => store.company);

    // Check if recruiter has already created a company
    useEffect(() => {
        if (companies && companies.length > 0) {
            toast.error("You can only create one company. You have already created a company.");
            navigate("/admin/companies");
        }
    }, [companies, navigate]);

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Please enter a company name");
            return;
        }

        // Check if userId exists
        if (!userId) {
            toast.error("User not authenticated. Please log in.");
            return;
        }

        setLoading(true); // Start loading
        try {
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                
                // Refresh companies list
                try {
                    const companiesRes = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                    if (companiesRes.data.success) {
                        dispatch(setCompanies(companiesRes.data.companies));
                    }
                } catch (error) {
                    console.log('Error refreshing companies:', error);
                }
                
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred while registering the company.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto px-4 py-8"
            >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <Building className="w-10 h-10 text-blue-500 mr-4" />
                        <div>
                            <h1 className="font-bold text-3xl text-gray-800 dark:text-white">Create New Company</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Enter your company name to get started</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="companyName" className="text-lg font-medium text-gray-700 dark:text-gray-300">Company Name</Label>
                            <Input
                                id="companyName"
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g., JobHunt, Microsoft, etc."
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/admin/companies")}
                                className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={registerNewCompany}
                                disabled={loading}
                                className={`bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 ${loading && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {loading ? "Creating..." : "Create Company"}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CompanyCreate;
