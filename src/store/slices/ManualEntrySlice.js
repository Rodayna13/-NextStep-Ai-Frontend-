import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    active: false,
};

const ManualEntrySlice = createSlice({
    name: 'manualEntry',
    initialState,
    reducers: {
        setManualEntryActive(state, action) {
            state.active = action.payload;
        },
        toggleManualEntry(state) {
            state.active = !state.active;
        },
        resetManualEntry(state) {
            state.active = false;
        }
    },
});

export const { setManualEntryActive, toggleManualEntry, resetManualEntry } = ManualEntrySlice.actions;
export default ManualEntrySlice.reducer;
