
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiEndpoints } from '../../api/endpoints';

const initialState = {
    ocrResult: null,
    loading: false,
    error: null,
};


// Async thunk for sending file/image to OCR API
export const fetchOCR = createAsyncThunk(
    'ocr/fetchOCR',
    async (file, thunkAPI) => {
        try {
            // You may need to adjust the endpoint and payload as per your backend
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(`${apiEndpoints.BASE_URL}/api/ocr`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to extract text');
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const OCRSlice = createSlice({
    name: 'ocr',
    initialState,
    reducers: {
        clearOCRResult(state) {
            state.ocrResult = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOCR.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOCR.fulfilled, (state, action) => {
                state.loading = false;
                state.ocrResult = action.payload;
            })
            .addCase(fetchOCR.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { clearOCRResult } = OCRSlice.actions;
export default OCRSlice.reducer;