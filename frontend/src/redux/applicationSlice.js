import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

// export const fetchApplicants = createAsyncThunk(
//   "application/fetchApplicants",
//   async (jobId = null, { rejectWithValue }) => {
//     try {
//       const url = jobId 
//         ? `${APPLICATION_API_END_POINT}/job/${jobId}`
//         : APPLICATION_API_END_POINT
//       const response = await axios.get(url, { withCredentials: true });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchApplicants = createAsyncThunk(
  "application/fetchApplicants",
  async (jobId = null, { rejectWithValue }) => {
    try {
      const url = jobId 
        ? `${APPLICATION_API_END_POINT}/${jobId}/applicants`
        : `${APPLICATION_API_END_POINT}/admin`
      
      console.log("Fetching applicants from URL:", url);
      
      const response = await axios.get(url, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Full API Response:", JSON.stringify(response.data, null, 2));
      
      // More robust way to extract applications
      const applicationsData = response.data.applications ||
                response.data.data?.applications || 
                response.data.application || 
                response.data || 
                [];
      
      console.log("Extracted Applicants:", applicationsData);
      
      if (applicationsData.length === 0) {
        console.warn("No applications found in the response");
      }
      
      return applicationsData;
    } catch (error) {
      console.error("Fetch Applicants Full Error:", error);
      console.error("Error Response:", error.response?.data);
      console.error("Error Status:", error.response?.status);
      console.error("Error Headers:", error.response?.headers);
      
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch applicants",
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:[],
        loading:false,
        error:null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        updateApplicantStatus:(state, action) => {
            const { applicationId, status } = action.payload;
            state.applicants = state.applicants.map((application) =>
                application._id === applicationId
                    ? { ...application, status }
                    : application
            );
        },
        removeApplicantById:(state, action) => {
            state.applicants = state.applicants.filter(
                (application) => application._id !== action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApplicants.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchApplicants.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure we're setting an array
                state.applicants = Array.isArray(action.payload) ? action.payload : [];
                console.log("Applicants in slice:", state.applicants);
            })
            .addCase(fetchApplicants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Applicants fetch error:", action.payload);
            });
    }
});

export const {
  setAllApplicants,
  updateApplicantStatus,
  removeApplicantById
} = applicationSlice.actions;
export default applicationSlice.reducer;
