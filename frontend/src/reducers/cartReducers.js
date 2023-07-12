import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({id,qty},{ getState }) => {
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
    const response = await api.post(`https://bamboo-shop-backend-53cf.onrender.com/api/cart/cartItems`, 
      {id,qty}
    ,config);
    console.log(response)
    localStorage.setItem('cartItems', JSON.stringify(response.data));
    return response.data;
  }
  catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    throw new Error(message);
  }
}
);


export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { getState }) => {
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
    const response = await api.post(`https://bamboo-shop-backend-53cf.onrender.com/api/cart/removeItem`, 
      {id}
    ,config);
    localStorage.setItem('cartItems', JSON.stringify(response.data));
    console.log(response)
    return response.data;
  }
  catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    throw new Error(message);
  }
}
);

export const saveShippingAddress = createAsyncThunk(
  'cart/saveShippingAddress',
  async (data, { getState }) =>  {   
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
  const response = await api.put(`https://bamboo-shop-backend-53cf.onrender.com/api/cart/saveShippingAddress`, 
    {data}
  ,config);
  localStorage.setItem('shippingAddress', JSON.stringify(response.data));
  console.log(response)
  return response.data;
}
catch (error) {
  const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;

  throw new Error(message);
}
}
);


export const savePaymentMethod = createAsyncThunk(
  'cart/savePaymentMethod',
  async (data, { getState }) =>  {   
    const {
      user:{userLogin: { userInformation },
    }} = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInformation.token}`,
      },
    };
  const response = await api.put(`https://bamboo-shop-backend-53cf.onrender.com/api/cart/savePaymentMethod`, 
    {data}
  ,config);
  localStorage.setItem('paymentMethod', JSON.stringify(response.data));
  console.log(response)
  return response.data;
}
);


export const savePaymentInfo = createAsyncThunk(
  'cart/savePaymentInfo',  async (paymentInfo, { getState }) => { 
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
  const response = await api.put(`https://bamboo-shop-backend-53cf.onrender.com/api/cart/savePaymentInfo`, 
    {paymentInfo}
  ,config);
  console.log(response)
  return response.data;
}
catch (error) {
  const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;

  throw new Error(message);
}
}
);

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { getState, rejectWithValue }) => {
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
      const response = await api.get('https://bamboo-shop-backend-53cf.onrender.com/api/cart/fetchCartItems',config);
      console.log('cart'+response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    shippingAddress:null,
    paymentMethod: null,
    paymentInfo:{
      cardholderName:null,
      cardNumber:null,
      expiry:null,
      paidAmount:null
      }
  },
  reducers: {
    cartClearItems: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(saveShippingAddress.fulfilled, (state, action) => {
        state.shippingAddress = action.payload;
      })
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethod = action.payload;
      })
     .addCase(savePaymentInfo.fulfilled, (state, action) => {
        state.paymentInfo = action.payload;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.shippingAddress=action.payload.shippingAddress;
        state.paymentMethod=action.payload.paymentMethod;
        state.paymentInfo=action.payload.paymentInfo;
      })
  },
});

export const { cartClearItems } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;
