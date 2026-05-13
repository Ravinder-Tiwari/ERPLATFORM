import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

import { Input } from './ui/input';
import { Search, MapPin, BriefcaseIcon, IndianRupeeIcon, ChevronDown, ChevronUp, CloudCog } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    const dispatch = useDispatch();
    const { allJobs } = useSelector(store => store.job);
    console.log(allJobs)
    // Initialize jobs loading
    useGetAllJobs()

    // Filter states with error handling
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState(null);
    const [salaryRange, setSalaryRange] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [error, setError] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter options
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const salaryRanges = [
        { label: 'All Ranges', value: 'all', min: 0, max: Infinity },
        { label: '0-3 LPA', value: '0-3', min: 0, max: 3 },
        { label: '3-7 LPA', value: '3-7', min: 3, max: 7 },
        { label: '7-15 LPA', value: '7-15', min: 7, max: 15 },
        { label: '15+ LPA', value: '15+', min: 15, max: Infinity }
    ];

    // Initialize filtered jobs with all jobs
    useEffect(() => {
        if (allJobs) {
            setFilteredJobs(allJobs);
        }
    }, [allJobs]);

    // Apply filters with error handling
    useEffect(() => {
        try {
            if (!Array.isArray(allJobs)) {
                console.error('Jobs data is not an array:', allJobs);
                setError('Error loading jobs data');
                return;
            }

            let filtered = [...allJobs];

            // Search filter
            if (searchQuery?.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(job => 
                    (job?.title || '').toLowerCase().includes(query) ||
                    (job?.description || '').toLowerCase().includes(query) ||
                    (job?.company?.name || '').toLowerCase().includes(query)
                );
            }

            // Location filter
            if (location?.trim()) {
                const locationQuery = location.toLowerCase();
                filtered = filtered.filter(job => 
                    (job?.location || '').toLowerCase().includes(locationQuery)
                );
            }

            // Job type filter
            if (jobType) {
                filtered = filtered.filter(job => 
                    (job?.jobType || '').toLowerCase() === jobType.toLowerCase()
                );
            }

            // Salary range filter
            if (salaryRange && salaryRange !== 'all') {
                const range = salaryRanges.find(r => r.value === salaryRange);
                if (range) {
                    filtered = filtered.filter(job => 
                        job?.salary >= range.min && job?.salary <= range.max
                    );
                }
            }

            setFilteredJobs(filtered);
            setError(null);
        } catch (err) {
            console.error('Error applying filters:', err);
            setError('Error filtering jobs');
        }
    }, [searchQuery, location, jobType, salaryRange, allJobs]);

    // Clear filters
    const handleClearFilters = () => {
        try {
            setSearchQuery('');
            setLocation('');
            setJobType(null);
            setSalaryRange(null);
            setFilteredJobs(allJobs);
            setError(null);
        } catch (err) {
            console.error('Error clearing filters:', err);
            setError('Error clearing filters');
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch]);

    return (
        <div className='bg-mesh-light dark:bg-mesh-dark text-gray-900 dark:text-gray-100 min-h-screen'>
            <div className='max-w-7xl md:mx-10 mx-4'>
                {/* Search and Filters Section */}
                <div className="py-8 space-y-6">
                    {/* Search Bar - Always visible */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search jobs by title, company, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="w-full md:hidden flex items-center justify-between px-4 py-2 glass rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                        <span className="font-medium">Filters</span>
                        {showMobileFilters ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>

                    {/* Filters - Hidden on mobile unless toggled */}
                    <div className={`grid grid-cols-1 gap-4 ${showMobileFilters ? 'block' : 'hidden'} md:grid md:grid-cols-4 md:gap-4`}>
                        {/* Location Filter */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                            />
                        </div>

                        {/* Job Type Filter */}
                        <Select value={jobType} onValueChange={setJobType}>
                            <SelectTrigger className="w-full">
                                <BriefcaseIcon className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {jobTypes.map(type => (
                                    <SelectItem key={type} value={type.toLowerCase()}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Salary Range Filter */}
                        <Select value={salaryRange} onValueChange={setSalaryRange}>
                            <SelectTrigger className="w-full">
                                <IndianRupeeIcon className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Salary Range" />
                            </SelectTrigger>
                            <SelectContent>
                                {salaryRanges.map(range => (
                                    <SelectItem key={range.value} value={range.value}>
                                        {range.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button */}
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                <div>
                    <h1 className='font-bold text-xl pb-6 text-gray-900 dark:text-white'>
                        Search Results ({filteredJobs?.length || 0})
                        {(searchQuery || location || jobType || salaryRange) && 
                            <span className="text-gray-500 text-sm ml-2">
                                (Filtered from {allJobs?.length || 0} total jobs)
                            </span>
                        }
                    </h1>
                    
                    {!filteredJobs?.length ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">
                                {error ? 'Error loading jobs. Please try again later.' : 'No jobs found matching your criteria. Try adjusting your filters.'}
                            </p>
                        </div>
                    ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {filteredJobs.map((job) => (
                                <Job key={job._id} job={job}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Browse