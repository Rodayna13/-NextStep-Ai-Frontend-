import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoints } from './../../api/endpoints';

const initialState = {
    profile: null,
    viewModal: false,
    loading: false,
    error: null,
};

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
    'Linkedin/fetchProfile',
    async (linkedinUrl, thunkAPI) => {
        try {
            console.log(`${apiEndpoints.linkedin.fetchProfile}?url=${linkedinUrl}`)
            // Replace with your API call
            const response = await fetch(`${apiEndpoints.linkedin.fetchProfile}?url=${linkedinUrl}`);
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const LinkedinSlice = createSlice({
    name: 'linkedIN',
    initialState,
    reducers: {
        clearProfile(state) {
            state.profile = null;
            state.connections = [];
            state.error = null;
            state.loading = false;
        },
        setViewModal(state, action) {
            state.viewModal = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.viewModal = false;
                state.profile = action.payload?.data[0] || [];
                
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    setViewModal,
    clearProfile,
} = LinkedinSlice.actions;

export default LinkedinSlice.reducer;