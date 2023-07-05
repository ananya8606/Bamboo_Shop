import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const register = createAsyncThunk('user/register', async ({ name, email, password, funcNumber }) => {
  const response = await api.post(`https://bamboo-shop-backend.onrender.com/api/users/register/${funcNumber}`, { name, email, password });
  if(funcNumber == 'googlesignin')
  localStorage.setItem('userInformation', JSON.stringify(response.data));
  return response.data;
});

export const login = createAsyncThunk('user/login', async ({ email, password }) => {
  const response = await api.post('https://bamboo-shop-backend.onrender.com/api/users/login', { email, password});
  localStorage.setItem('userInformation', JSON.stringify(response.data));
  return response.data;
});

export const listUsers = createAsyncThunk('user/listUsers', async (_, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('https://bamboo-shop-backend.onrender.com/api/users', config);
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await api.delete(`https://bamboo-shop-backend.onrender.com/api/users/${id}`, config);
  return id;
});

export const getUserDetails = createAsyncThunk('user/getUserDetails', async (id, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.get(`https://bamboo-shop-backend.onrender.com/api/users/user/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

export const updateLanguage = createAsyncThunk('user/updateLanguage', async (language, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.patch('https://bamboo-shop-backend.onrender.com/api/user/language', { language }, config);
  return response.data;
});

export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (user, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.put('https://bamboo-shop-backend.onrender.com/api/users/updateUser', user, config);
  console.log(response)
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userLogin:{
      loading:false, 
      error:null, 
      userInformation: localStorage.getItem('userInformation')
    ? JSON.parse(localStorage.getItem('userInformation'))
    : null
  },
    userRegister:{
    loading:false, 
    error:null
  },
    userDetails:{
    loading:false, 
    error:null, 
    user:{}
  },
    updateProfile:{
    loading:false, 
    error:null, 
    success:false
    },
    userUpdateLanguage:{ 
      loadingLanguage: false,
      successLanguage: false,
      errorLanguage: null,
      userInfoLanguage: null
    },
    userList:{
    loading: false,
    users: [],
    error: null
    },
    userDelete:{  
      loading:false,
      success:false,
      error:null,
      users:[]
    },
  },
  reducers: {
    logout: (state) => {
      state.userLogin.userInformation = null;
      localStorage.removeItem('userInformation');
    },
    userRegisterClear: (state) => {
      state.userRegister.error = null;
      state.userLogin.userInformation=null;
      localStorage.removeItem('userInformation');
    },
    userLoginClear: (state) => {
      state.userLogin.error = null;
      state.userLogin.userInformation = null;
      localStorage.removeItem('userInformation');
    },
    userDetailsReset: (state) => {
      state.userDetails.user = {};
    },
    userUpdateProfileReset: (state) => {
      state.updateProfile.error = null;
      state.updateProfile.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.userRegister.loading = true;
        state.userRegister.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.userRegister.loading = false;
        state.userRegister.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.userRegister.loading = false;
        state.userRegister.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.userLogin.loading = true;
        state.userLogin.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userLogin.loading = false;
        state.userLogin.userInformation = action.payload;
        state.userLogin.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.userLogin.loading = false;
        state.userLogin.error = action.error.message;
      })
      .addCase(listUsers.pending, (state) => {
        state.userList.loading = true;
        state.userList.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.userList.loading = false;
        state.userList.users = action.payload;
        state.userList.error = null;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.userList.loading = false;
        state.userList.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.userDelete.loading = true;
        state.userDelete.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userDelete.loading = false;
        state.userDelete.users = state.users.filter((user) => user._id !== action.payload);
        state.userDelete.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.userDelete.loading = false;
        state.userDelete.error = action.error.message;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.userDetails.loading = true;
        state.userDetails.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails.loading = false;
        state.userDetails.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.userDetails.loading = false;
        state.userDetails.error = action.error.message;
      })
      .addCase(updateLanguage.pending, (state) => {
        state.userUpdateLanguage.loadingLanguage = true;
        state.userUpdateLanguage.successLanguage = false;
        state.userUpdateLanguage.errorLanguage = null;
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.userUpdateLanguage.loadingLanguage = false;
        state.userUpdateLanguage.successLanguage = true;
        state.userUpdateLanguage.userInfoLanguage = action.payload;
        state.userUpdateLanguage.errorLanguage = null;
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.userUpdateLanguage.loadingLanguage = false;
        state.userUpdateLanguage.errorLanguage = action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateProfile.loading = true;
        state.updateProfile.success = false;
        state.updateProfile.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateProfile.loading = false;
        state.updateProfile.success = true;
        state.userLogin.userInformation = action.payload;
        state.updateProfile.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateProfile.loading = false;
        state.updateProfile.error = action.error.message;
      });
  },
});

export const {
  logout,
  userRegisterClear,
  userLoginClear,
  userDetailsReset,
  userUpdateProfileReset,
} = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;

