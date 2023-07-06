// cartReducers.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty }, { getState }) => {
    const { data } = await api.get(`https://bamboo-shop-backend.onrender.com/api/products/${id}`);
    const product = {
      product: data._id,
      name: data.brandName,
      image: data.image,
      price: data.discountedCost,
      countInStock: data.quantity,
      qty,
      category: data.category,
      subCategory: data.subCategory,
    };
    const state = getState();

    const existItem = state.cart.cartItems.find((x) => x.product === product.product);

    let updatedCartItems;
    if (existItem) {
      updatedCartItems = state.cart.cartItems.map((x) =>
        x.product === product.product ? product : x
      );
    } else {
      updatedCartItems = [...state.cart.cartItems, product];
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    return updatedCartItems;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { getState }) => {
    const state = getState();
    const updatedCartItems = state.cart.cartItems.filter(
      (item) => item.product !== id
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    return updatedCartItems;
  }
);

export const saveShippingAddress = createAsyncThunk(
  'cart/saveShippingAddress',
  async (data, { getState }) => {
    const state = getState();
    const updatedShippingAddress = data;
    localStorage.setItem('shippingAddress', JSON.stringify(data))
    return updatedShippingAddress;
  }
);


export const savePaymentMethod = createAsyncThunk(
  'cart/savePaymentMethod',
  async (paymentMethod, { getState }) => {
    const state = getState();
    const updatedPaymentMethod = paymentMethod;
    localStorage.setItem('paymentMethod', JSON.stringify(updatedPaymentMethod));
    return updatedPaymentMethod;
  }
);

export const savePaymentInfo = createAsyncThunk(
  'cart/savePaymentInfo',
  async (paymentInfo, { getState }) => {
    const state = getState();
    const updatedPaymentInfo = paymentInfo;
    localStorage.setItem('paymentMethod', JSON.stringify(paymentInfo));
    return updatedPaymentInfo;
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
      });
  },
});

export const { cartClearItems } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;
