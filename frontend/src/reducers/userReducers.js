import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const register = createAsyncThunk('user/register', async ({ name, email, password, funcNumber }) => {
  const response = await api.post(`https://bamboo-shop-backend-53cf.onrender.com/api/users/register/${funcNumber}`, { name, email, password });
  if(funcNumber == 'googlesignin')
  localStorage.setItem('userInformation', JSON.stringify(response.data));
  return response.data;
});

export const login = createAsyncThunk('user/login', async ({ email, password }) => {
  const response = await api.post('https://bamboo-shop-backend-53cf.onrender.com/api/users/login', { email, password});
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

  const response = await api.get('https://bamboo-shop-backend-53cf.onrender.com/api/users', config);
  return response.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await api.delete(`https://bamboo-shop-backend-53cf.onrender.com/api/users/${id}`, config);
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
    const response = await api.get(`https://bamboo-shop-backend-53cf.onrender.com/api/users/user/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});



export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (user, { getState }) => {
  const { token } = getState().user.userLogin.userInformation;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.put('https://bamboo-shop-backend-53cf.onrender.com/api/users/updateUser', user, config);
  console.log(response)
  return response.data;
});

export const createQuery = createAsyncThunk(
  'user/createQuery',
  async ({type,query}, { getState }) => {
    try {
      const {
        user:{userLogin: { userInformation },
      }} = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInformation.token}`,
        },
      };
      const { data } = await api.post(`https://bamboo-shop-backend-53cf.onrender.com/api/users/query`,{type,query}, config);

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      throw new Error(message);
    }
  }
);

export const listQueries = createAsyncThunk(
  'user/listQueries',
  async (id, { getState }) => {
     try{ 
      const {
        user:{userLogin: { userInformation },
      }} = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInformation.token}`,
        },
      };
      const { data } = await api.get(`https://bamboo-shop-backend-53cf.onrender.com/api/users/admin/allqueries`, config);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      throw new Error(message);
    }
  }
);


export const changeQueryStatus = createAsyncThunk(
  'user/changeQueryStatus',
  async (id, { getState }) => {
    try {
      const {
        user:{userLogin: { userInformation },
      }} = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInformation.token}`,
        },
      };

      const { data } = await api.put(
        `https://bamboo-shop-backend-53cf.onrender.com/api/users/admin/changequerystatus/${id}`,
        {},
        config
      );

      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      throw new Error(message);
    }
  }
);

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
    createQuery:{
      success:false, 
      error:null,
      loading:false
    },
    queryList:{
      loading: false,
      queries:[],
      error: null
    },
    changeQueryStatus:{
      loading:false,
      success:false,
      error:null
    },
  },
  reducers: {
    logout: (state) => {
      state.userLogin.userInformation = null;
      localStorage.removeItem('userInformation');
      localStorage.removeItem('paymentMethod');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('cartItems');
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
      })
     .addCase(createQuery.pending, (state) => {
        state.createQuery.loading = true;
      })
      .addCase(createQuery.fulfilled, (state, action) => {
        state.createQuery.loading = false;
        state.createQuery.success = true;
        state.createQuery.error = null;
      })
      .addCase(createQuery.rejected, (state, action) => {
        state.createQuery.loading = false;
        state.createQuery.success = false;
        state.createQuery.error = action.error.message;
      })
      .addCase(listQueries.pending, (state) => {
        state.queryList.loading = true;
        state.queryList.error = null;
      })
      .addCase(listQueries.fulfilled, (state, action) => {
        state.queryList.loading = false;
        state.queryList.queries = action.payload;
        state.queryList.error = null;
      })
      .addCase(listQueries.rejected, (state, action) => {
        state.queryList.loading = false;
        state.queryList.error = action.error.message;
      })
      .addCase(changeQueryStatus.pending, (state) => {
        state.changeQueryStatus.loading = true;
      })
      .addCase(changeQueryStatus.fulfilled, (state, action) => {
        state.changeQueryStatus.loading = false;
        state.changeQueryStatus.success = true;
        state.changeQueryStatus.error = null;
      })
      .addCase(changeQueryStatus.rejected, (state, action) => {
        state.changeQueryStatus.loading = false;
        state.changeQueryStatus.success = false;
        state.changeQueryStatus.error = action.error.message;
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

