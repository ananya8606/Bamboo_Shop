import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'

const initialState = {
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
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, { getState }) => {
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
      console.log(order)
      const { data } = await api.post(`https://bamboo-shop-backend-53cf.onrender.com/api/orders`, order, config);

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

export const payOrder = createAsyncThunk(
  'order/payOrder',
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

      const { data } = await api.put(`https://bamboo-shop-backend-53cf.onrender.com/api/orders/admin/pay/${id}`, {}, config);

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

export const deliverOrder = createAsyncThunk(
  'order/deliverOrder',
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
        `https://bamboo-shop-backend-53cf.onrender.com/api/orders/admin/delivery/${id}`,
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

export const listMyOrders = createAsyncThunk(
  'order/listMyOrders',
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

      const { data } = await api.get(`https://bamboo-shop-backend-53cf.onrender.com/api/orders/myorders`, config);

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

export const listOrders = createAsyncThunk(
  'order/listOrders',
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
      const { data } = await api.get(`https://bamboo-shop-backend-53cf.onrender.com/api/orders/admin/allorders`, config);
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



const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {orderCreateReset : (state) => {
    state.orderCreate={};
  },orderPayReset : (state) => {
    state.orderPay={};
  },orderDeliverReset : (state) => {
    state.orderDeliver={};
  } ,orderListMyReset : (state) => {
  state.orderListMy.orders=[];
}},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderCreate.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderCreate.loading = false;
        state.orderCreate.success = true;
        state.orderCreate.order = action.payload;
        state.orderCreate.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderCreate.loading = false;
        state.orderCreate.success = false;
        state.orderCreate.order = {};
        state.orderCreate.error = action.error.message;
      })
      .addCase(payOrder.pending, (state) => {
        state.orderPay.loading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.orderPay.loading = false;
        state.orderPay.success = true;
        state.orderPay.error = null;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.orderPay.loading = false;
        state.orderPay.success = false;
        state.orderPay.error = action.error.message;
      })
      .addCase(deliverOrder.pending, (state) => {
        state.orderDeliver.loading = true;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.orderDeliver.loading = false;
        state.orderDeliver.success = true;
        state.orderDeliver.error = null;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.orderDeliver.loading = false;
        state.orderDeliver.success = false;
        state.orderDeliver.error = action.error.message;
      })
      .addCase(listMyOrders.pending, (state) => {
        state.orderListMy.loading = true;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.orderListMy.loading = false;
        state.orderListMy.orders = action.payload;
        state.orderListMy.error = null;
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.orderListMy.loading = false;
        state.orderListMy.orders = [];
        state.orderListMy.error = action.error.message;
      })
      .addCase(listOrders.pending, (state) => {
        state.orderList.loading = true;
        state.orderList.error = null;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.orderList.loading = false;
        state.orderList.orders = action.payload;
        state.orderList.error = null;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.orderList.loading = false;
        state.orderList.error = action.error.message;
      });
  },
});

export const {orderCreateReset,orderPayReset,orderListMyReset}=orderSlice.actions;
const orderReducer = orderSlice.reducer;
export default orderReducer;
