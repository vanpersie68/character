import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}`;

// Define the initial state
const initialState={
    status: "", 
    error: "", 
    characters: [
        {
            id: "",
            active: false,
            name: "",
            subtitle: "",
            image_url: "",
            strength: 0,
            speed: 0, 
            skill: 0, 
            fear_factor: 0, 
            power: 0, 
            intelligence: 0, 
            wealth: 0, 
        }
    ]
};

export const getAllCharacters=createAsyncThunk("characters/getAllCharacters", async(values, {rejectWithValue}) => {
    try{
        const { data } = await axios.get(`${AUTH_ENDPOINT}/characters`)
        return data;
    } catch(error) {
        return rejectWithValue(error.response.data.error.message);
    }
});

export const deleteCharacter = createAsyncThunk(
    'characters/deleteCharacter',
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${AUTH_ENDPOINT}/characters/${id}`);
        return response.data;  
      } catch (error) {
        return rejectWithValue(error.response.data.error.message);
      }
    }
  );

  
export const addCharacter = createAsyncThunk("characters/addCharacter", async (values, { rejectWithValue }) => {
    const { token, action, data } = values;
    try {
        console.log("组合结果: ", data);
        const response = await axios.post(`${AUTH_ENDPOINT}/contributions`, { 
            action, data
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editCharacter = createAsyncThunk("characters/editCharacter", async (values, { rejectWithValue }) => {
    const { token, action, data } = values;
    const { characterId } = data;
    try {
        console.log("组合结果: ", data);
        const response = await axios.put(`${AUTH_ENDPOINT}/contributions/${characterId}`, { 
            action, data
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response: ", response);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const characterSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCharacters.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllCharacters.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.characters = action.payload;
            })
            .addCase(getAllCharacters.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteCharacter.fulfilled, (state, action) => {
                state.characters = state.characters.filter(character => character.id !== action.meta.arg);
                state.status = 'succeeded';
              })
            .addCase(deleteCharacter.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
            })
            // .addCase(addCharacter.pending, (state) => {
            //     state.status = 'loading';
            // })
            // .addCase(addCharacter.fulfilled, (state, action) => {
            //     state.status = 'succeeded';
            //     state.characters = action.payload;
            // })
            // .addCase(addCharacter.rejected, (state, action) => {
            //     state.status = 'failed';
            //     state.error = action.payload;
            // })
            // .addCase(editCharacter.pending, (state) => {
            //     state.status = 'loading';
            // })
            // .addCase(editCharacter.fulfilled, (state, action) => {
            //     state.status = 'succeeded';
            //     state.characters = action.payload;
            // })
            // .addCase(editCharacter.rejected, (state, action) => {
            //     state.status = 'failed';
            //     state.error = action.payload;
            // })
    }
});

export const { resetCharacterState } = characterSlice.actions;

export default characterSlice.reducer;