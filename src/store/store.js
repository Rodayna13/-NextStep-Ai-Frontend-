
import { configureStore } from '@reduxjs/toolkit';
import LinkedinSlice from './slices/LinkedinSlice';
import OCRSlice from './slices/OCRSlice';
import ManualEntrySlice from './slices/ManualEntrySlice';
import authSlice from './slices/authSlice';



const store = configureStore({
    reducer: {
        linkedin: LinkedinSlice,
        ocr: OCRSlice,
        manualEntry: ManualEntrySlice,
        auth: authSlice,
    },
});

export default store;