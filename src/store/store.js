
import { configureStore } from '@reduxjs/toolkit';
import LinkedinSlice from './slices/LinkedinSlice';
import OCRSlice from './slices/OCRSlice';
import ManualEntrySlice from './slices/ManualEntrySlice';



const store = configureStore({
    reducer: {
        linkedin: LinkedinSlice,
        ocr: OCRSlice,
        manualEntry: ManualEntrySlice,
    },
});

export default store;