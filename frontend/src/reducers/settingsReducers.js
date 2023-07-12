import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
export const updateSettings = createAsyncThunk('settings/updateSettings', async ({language, country, currency}, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.put('https://bamboo-shop-backend-53cf.onrender.com/api/users/user/updateLanguage', {language, country, currency}, config);
  return response.data;
});

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async (_,{ getState, rejectWithValue }) => {
 try{
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('https://bamboo-shop-backend-53cf.onrender.com/api/users/fetchLanguage', config);
  console.log(response)
  return response.data;
 } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { success: false },
  reducers: {
    updateSettingsReset: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase( updateSettings.pending, (state) => {
      state.success = false;
    })
    .addCase( updateSettings.fulfilled, (state, action) => {
      state.language = action.payload.language;
      state.country = action.payload.country;
      state.currency = action.payload.currency;
      state.success = true;
    })
    .addCase( updateSettings.rejected, (state) => {
      state.success = false;
    })
    .addCase( fetchSettings.fulfilled, (state, action) => {
      state.language = action.payload.language;
      state.country = action.payload.country;
      state.currency = action.payload.currency;
      state.success = true;
    })
  },
});

export const { updateSettingsReset } = settingsSlice.actions;
const settingsReducer = settingsSlice.reducer;
export default settingsReducer;
