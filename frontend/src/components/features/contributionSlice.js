import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}`;

const initialState = {
    contributions: [], 
    status: 'idle',  // 'loading', 'succeeded', 'failed'
    error: null,  
    message: null,
}

// get all contributions
export const fetchContributions = createAsyncThunk('contributions/fetchContributions', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/contributions/history`);
        if (response && response.data) {
            return response.data; 
        } else {

            throw new Error("No data available");
        }

    } catch (error) {
        return rejectWithValue(error.response ? error.response.data.error.message : error.message);
    }
});


// Create Contributions
export const createContribution = createAsyncThunk('contributions/createContribution', async (contribution, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${API_ENDPOINT}/contributions`, contribution);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.error.message);
    }
});

// Update the approval status of contributions
export const updateContributionReview = createAsyncThunk(
    'contributions/updateReview',
    async ({ contributionId, status, reviewerId }, { getState, rejectWithValue }) => { 
      const token = getState().user.user.token;  
      try {
        const response = await axios.put(`${API_ENDPOINT}/contributions/${contributionId}/review`, {
          status: status,
          reviewed_by: { _id: reviewerId }
        }, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        return response.data;
      } catch (error) {
       
        return rejectWithValue(error.response ? error.response.data.error.message : error.message);
      }
    }
  );


export const contributionSlice = createSlice({
    name: 'contributions',
    initialState,
    reducers: {
        resetContributionState: (state) => {
            state.contributions = [];
            state.status = 'idle';
            state.error = null;
            state.message = '';
        },
    },

    extraReducers(builder) {
        builder
            .addCase(fetchContributions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContributions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.contributions = action.payload;  
            })
            .addCase(fetchContributions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createContribution.fulfilled, (state, action) => {
                state.contributions.push(action.payload);
            })
            .addCase(updateContributionReview.fulfilled, (state, action) => {
                
                state.message = `Success: ${action.payload.result.data.name} has been ${action.payload.result.status.toLowerCase()}.`;
            })
            .addCase(updateContributionReview.rejected, (state, action) => {
                state.error = action.payload;
            });;
    },
});


export const { resetContributionState } = contributionSlice.actions;

export default contributionSlice.reducer;
