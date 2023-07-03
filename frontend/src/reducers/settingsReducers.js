import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { success: false },
  reducers: {
    updateSettings: (state, action) => {
      // You can access the payload directly
      const { language, country, currency } = action.payload;
      state.language = language;
      state.country = country;
      state.currency = currency;
      state.success = true;
    },
    updateSettingsReset: (state) => {
      state.success = false;
    },
  },
});

export const { updateSettings,  updateSettingsReset } = settingsSlice.actions;
const settingsReducer = settingsSlice.reducer;
export default settingsReducer;
