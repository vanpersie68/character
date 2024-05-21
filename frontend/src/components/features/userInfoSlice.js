import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}`;

const initialState = {
    status: "", 
    error: "", 
    userInfo: {
        favourites: {
            characters: []
        },
        contributions: [],
    },
};


export const getUserInfoDetail=createAsyncThunk("userInfo/getUserInfoDetail", async(values, {rejectWithValue}) => {
    const { user_id } = values;
    try{
        const { data } = await axios.get(`${AUTH_ENDPOINT}/users/${user_id}`)
        return data;
    } catch(error) {
        return rejectWithValue(error.response.data.error.message);
    }
});

export const revoke=createAsyncThunk("userInfo/revoke", async(values, {rejectWithValue}) => {
    const { contributionId } = values;
    try{
        const { data } = await axios.patch(`${AUTH_ENDPOINT}/users/revoke/${contributionId}`)
        return data;
    } catch(error) {
        return rejectWithValue(error.response.data.error.message);
    }
});

export const addCharacterToFavourites = createAsyncThunk(
    'userInfo/addCharacterToFavourites',
    async ({ userId, characterId }, { getState, rejectWithValue }) => {
      const token = getState().user.user.token;  

      try {
        const response = await axios.post(`${AUTH_ENDPOINT}/favourites/${userId}/characters/${characterId}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`  
            }
          });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : "An error occurred");
      }
    }
  );

  
export const removeCharacterFromFavourites = createAsyncThunk(
  'userInfo/removeCharacterFromFavourites',
  async ({ userId, characterId }, { getState, rejectWithValue }) => {
    const token = getState().user.user.token;  // Correctly fetching the token from Redux state
    try {
      const response = await axios.delete(`${AUTH_ENDPOINT}/favourites/${userId}/characters/${characterId}`, {
        headers: {
          Authorization: `Bearer ${token}`  // Correctly included in the configuration object
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : "An error occurred");
    }
  }
);


const userSliceInfo = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfoDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserInfoDetail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(getUserInfoDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(revoke.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(revoke.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload;
            })
            .addCase(revoke.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })      
            .addCase(addCharacterToFavourites.fulfilled, (state, action) => {
                if (state.userInfo.favourites && Array.isArray(state.userInfo.favourites.characters)) {
                    state.userInfo.favourites.characters.push(action.meta.arg.characterId);
                }
                state.status = 'succeeded';
            })
            .addCase(removeCharacterFromFavourites.fulfilled, (state, action) => {
                if (state.userInfo.favourites && Array.isArray(state.userInfo.favourites.characters)) {
                    state.userInfo.favourites.characters = state.userInfo.favourites.characters.filter(
                        character => character !== action.meta.arg.characterId
                    );
                }
                state.status = 'succeeded';
            })
            
            

            .addCase(addCharacterToFavourites.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            })
            .addCase(removeCharacterFromFavourites.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            })
    }
});

export default userSliceInfo.reducer;