import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import cartReducer from './reducers/cartReducers';
import settingsReducer from './reducers/settingsReducers';
import productReducer from './reducers/productReducers';
import orderReducer from './reducers/orderReducers';
import userReducer from './reducers/userReducers';

const rootReducer = combineReducers({
  cart:cartReducer,
  settings:settingsReducer,
  product:productReducer,
  order:orderReducer,
  user:userReducer,
});

const cartItemsFromStorage= localStorage.getItem('cartItems')
? JSON.parse(localStorage.getItem('cartItems'))
: null;

const paymentMethodFromStorage= localStorage.getItem('paymentMethod')
? JSON.parse(localStorage.getItem('paymentMethod'))
: null;

const userInfoFromStorage = localStorage.getItem('userInformation')
  ? JSON.parse(localStorage.getItem('userInformation'))
  : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : null;

 const settingsFromStorage = localStorage.getItem('settings')
  ? JSON.parse(localStorage.getItem('settings'))
  : { language: 'en', country: 'in', currency: 'inr' };

const preloadedState = {
  cart: {
    cartItems:cartItemsFromStorage,
    shippingAddress:shippingAddressFromStorage,
    paymentMethod:paymentMethodFromStorage,
    paymentInfo:null
  },
  settings: settingsFromStorage,
  user: {
    userLogin:{
      loading:false, 
      error:null, 
      userInformation: userInfoFromStorage 
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
  product: {
    productList:{
      loading:false,
      products:[], 
      error:null
    },
    productDetails:{
      loading:false, 
      error:null, 
      product:null
    },
    productCategory:{
      loading:false,
      products:[], 
      error:null
    },
    productsubCategory:{
      loading:false,
      products:[], 
      error:null
    },
    productSearch:{
      loading:false,
      products:[], 
      error:null
    },
    productReviewCreate:{
      success:false,
      loading:false, 
      error:null,
      product:null
    },
    productCreate:{
      loading:false, 
      error:null, 
      success:false
    },
    productEdit:{
      loading:false, 
      error:null, 
      success:false,
      product:null
    },
    productDelete:{
      loading: false,
      success: false,
      error: null,
      product:null
    },
    uploadImage:{
      loading:false, 
      error:null, 
      image:null
    },
      uploadFile:{
        loading: false,
        success: false,
        error: null,
        file:null
      }
    },
    order: {
      orderCreate:{
      order:{}, 
      success:false, 
      error:null,
      loading:false
    },
    orderListMy:{
      loading: false,
      orders:[],
      error: null
    },
    orderPay:{
      loading:false,
      success:false,
      error:null
    },
    orderList:{
      loading: false,
      orders:[],
      error: null
    },
    orderDeliver:{
      loading:false,
      success:false,
      error:null
    },
  },
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
