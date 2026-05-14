import { createSlice } from "@reduxjs/toolkit";

const syncJobCollection = (jobs, updatedJob) => {
    const hasJob = jobs.some((job) => job._id === updatedJob._id);

    if (!hasJob) {
        return jobs;
    }

    if (!updatedJob.isActive || updatedJob.position <= 0) {
        return jobs.filter((job) => job._id !== updatedJob._id);
    }

    return jobs.map((job) =>
        job._id === updatedJob._id ? { ...job, ...updatedJob } : job
    );
};

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        removeJobFromAllJobs:(state, action) => {
            state.allJobs = state.allJobs.filter(job => job._id !== action.payload);
        },
        removeJobFromAllAdminJobs:(state, action) => {
            state.allAdminJobs = state.allAdminJobs.filter(job => job._id !== action.payload);
        },
        syncJobAvailability:(state, action) => {
            const updatedJob = action.payload;

            state.allJobs = syncJobCollection(state.allJobs, updatedJob);
            state.allAdminJobs = syncJobCollection(state.allAdminJobs, updatedJob);

            if (state.singleJob?._id === updatedJob._id) {
                state.singleJob = {
                    ...state.singleJob,
                    ...updatedJob
                };
            }
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        }
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    removeJobFromAllJobs,
    removeJobFromAllAdminJobs,
    syncJobAvailability,
    setSearchedQuery
} = jobSlice.actions;
export default jobSlice.reducer;
