import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}`;

// Define initial state
const initialState={
    status: "", 
    error: "", 
    user: {
        id: "",
        name: "",
        email: "", 
        token: "",
        isAdmin: false,
    },
}
export const fetchAllUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${AUTH_ENDPOINT}/users`);
        return response.data.users; 
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data.error : error.message);
    }
});

export const registerUser=createAsyncThunk("auth/register", async(values, {rejectWithValue}) => {
    try{
        const {data} = await axios.post(`${AUTH_ENDPOINT}/users/register`, {
            ...values,
        });
        return data;
    } catch(error) {
        return rejectWithValue(error.response.data.error.message);
    }
});

export const updateUserRole = createAsyncThunk("users/updateRole", async ({ userId, isAdmin }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${AUTH_ENDPOINT}/users/${userId}/role`, { role: isAdmin });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.error.message);
    }
});


export const loginUser=createAsyncThunk("auth/login", async(values, {rejectWithValue}) => {
    try{
        const {data} = await axios.post(`${AUTH_ENDPOINT}/login`, {
            ...values,
        });

        return data;
    } catch(error) {
        return rejectWithValue(error.response.data.error.message);
    }
});


// Created a Redux reducer with createSlice and named it "user".
export const userSlice=createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.status = "";
            state.error = "";
            state.user = {
                id: "",
                name: "",
                email: "",
                isAdmin: false,
            };
            state.token = "";
        },

        changeStatus: (state, action) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder){
        builder
        .addCase(fetchAllUsers.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.users = action.payload; 
        })
        .addCase(fetchAllUsers.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
        .addCase(registerUser.pending, (state, action) => {
            state.status = "loading";
        }) 
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.error = "";
            state.user = action.payload.user; 
            state.user.token = action.payload.token; // Add the code to update the token here
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
        .addCase(loginUser.pending, (state, action) => {
            state.status = "loading";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.error = "";
            state.user = action.payload.user; 
            state.user.token = action.payload.token; // Add the code to update the token here
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
        .addCase(updateUserRole.fulfilled, (state, action) => {
            const index = state.users.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
                state.users[index].isAdmin = action.payload.wasPromoted;
            }
        });
        
    },
})

export const {logout, changeStatus} = userSlice.actions;

export default userSlice.reducer;