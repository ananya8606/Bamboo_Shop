import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { logout } from './userReducers';

export const listProducts = createAsyncThunk(
  'product/listProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('https://bamboo-shop-backend-53cf.onrender.com/api/products');

      // Sort the products based on stockSold quantity
      const sortedProducts = data.sort((a, b) => b.stockSold - a.stockSold);

      return sortedProducts;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createProduct = createAsyncThunk('products/createProduct', async (productData,{ getState,rejectWithValue }) => {
  try {
    const userInformation = getState().user.userLogin.userInformation;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInformation.token}`,
      },
    };
  const { data } = await api.post('https://bamboo-shop-backend-53cf.onrender.com/api/products/productCreate', productData,config);
  console.log(data)
  return data;
} catch (error) {
  return rejectWithValue(
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message
  );
}
});

export const listProductDetails = createAsyncThunk(
  'product/listProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`https://bamboo-shop-backend-53cf.onrender.com/api/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const listCategoryDetails = createAsyncThunk(
  'product/listCategoryDetails',
  async ({ categoryName, cost }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `https://bamboo-shop-backend-53cf.onrender.com/api/products/category/${categoryName}/${cost}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const listSubCategoryDetails = createAsyncThunk(
  'product/listSubCategoryDetails',
  async ({ subcategoryName, cost }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `https://bamboo-shop-backend-53cf.onrender.com/api/products/subcategory/${subcategoryName}/${cost}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const productsSearch = createAsyncThunk(
  'product/productsSearch',
  async (productName, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`https://bamboo-shop-backend-53cf.onrender.com/api/products/search/${productName}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createProductReview = createAsyncThunk(
  'product/createProductReview',
  async ({ productId, review }, { getState, rejectWithValue }) => {
    try {
      const userInformation = getState().user.userLogin.userInformation;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInformation.token}`,
        },
      };

      await api.post(`https://bamboo-shop-backend-53cf.onrender.com/api/products/${productId}/reviews`, review, config);

      return;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === 'Not authorized, token failed') {
        logout();
      }
      return rejectWithValue(message);
    }
  }
);

export const editProduct = createAsyncThunk(
  'product/editProduct',
  async (
    {
      brandName,
      image,
      brand,
      category,
      subCategory,
      description,
      discount,
      cost,
      quantity,
      id,
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const userInformation = getState().user.userLogin.userInformation;
      const config = {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInformation.token}`,
          },
      };

      const { data } = await api.put(
          `https://bamboo-shop-backend-53cf.onrender.com/api/products/product/${id}`,
          {
              brandName,
              image,
              brand,
              category,
              subCategory,
              description,
              discount,
              cost,
              quantity,
          },
          config
      );
      return data;
  } catch (error) {
      const message =
          error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
      return rejectWithValue(message);
  }
});

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { getState, rejectWithValue }) => {
      try {
        const userInformation = getState().user.userLogin.userInformation;
          const config = {
              headers: {
                  Authorization: `Bearer ${userInformation.token}`,
              },
          };

          await api.delete(`https://bamboo-shop-backend-53cf.onrender.com/api/products/product/${id}`, config);

          return;
      } catch (error) {
          const message =
              error.response && error.response.data.message
                  ? error.response.data.message
                  : error.message;
          return rejectWithValue(message);
      }
  }
);

export const uploadImage = createAsyncThunk(
  'product/uploadImage',
  async (formData, { getState,rejectWithValue }) => {
    try {
      const userInformation = getState().user.userLogin.userInformation;
          const config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${userInformation.token}`,
              },
          };
      const { data } = await api.post('https://bamboo-shop-backend-53cf.onrender.com/api/products/uploadImage', formData,config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);


export const uploadFile =  createAsyncThunk(
  'product/uploadFile',async (file,{ getState,rejectWithValue }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const userInformation = getState().user.userLogin.userInformation;
    const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInformation.token}`,
        },
    };
    const response = await api.post('https://bamboo-shop-backend-53cf.onrender.com/api/products/uploadCSV', formData,config );
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
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
        error: null,
        success: false,
        file:null
      }
      },
  reducers: {
      productDetailsClear: (state) => {
          state.productDetails = {};
      },
      productCategoryDetailsClear: (state) => {
        state.productCategory = {};
    },
    productSubCategoryDetailsClear: (state) => {
      state.productsubCategory = {};
  },
  productSearchClear: (state) => {
    state.productSearch = {};
},
productCreateReviewReset: (state) => {
  state.productReviewCreate = {};
},
productCreateReset: (state) => {
  state.productCreate = {};
},
productEditReset: (state) => {
  state.productEdit = {};
},
      productListClear: (state) => {
        state.productList.products = {};
    },
  },
  extraReducers: (builder) => {
      builder
          .addCase(listProducts.pending, (state) => {
              state.productList.loading = true;
              state.productList.error = null;
          })
          .addCase(listProducts.fulfilled, (state, action) => {
              state.productList.loading = false;
              state.productList.products = action.payload;
          })
          .addCase(listProducts.rejected, (state, action) => {
              state.productList.loading = false;
              state.productList.error = action.payload;
          })
          .addCase(listProductDetails.pending, (state) => {
              state.productDetails.loading = true;
              state.productDetails.error = null;
              state.productDetails.product = null;
          })
          .addCase(listProductDetails.fulfilled, (state, action) => {
              state.productDetails.loading = false;
              state.productDetails.product = action.payload;
              state.productDetails.error = null;
          })
          .addCase(listProductDetails.rejected, (state, action) => {
              state.productDetails.loading = false;
              state.productDetails.error = action.payload;
              state.productDetails.product = null;
          })
          .addCase(listCategoryDetails.pending, (state) => {
              state.productCategory.loading = true;
              state.productCategory.error = null;
          })
          .addCase(listCategoryDetails.fulfilled, (state, action) => {
              state.productCategory.loading = false;
              state.productCategory.products = action.payload;
          })
          .addCase(listCategoryDetails.rejected, (state, action) => {
              state.productCategory.loading = false;
              state.productCategory.error = action.payload;
          })
          .addCase(listSubCategoryDetails.pending, (state) => {
              state.productsubCategory.loading = true;
              state.productsubCategory.error = null;
          })
          .addCase(listSubCategoryDetails.fulfilled, (state, action) => {
              state.productsubCategory.loading = false;
              state.productsubCategory.products = action.payload;
          })
          .addCase(listSubCategoryDetails.rejected, (state, action) => {
              state.productsubCategory.loading = false;
              state.productsubCategory.error = action.payload;
          })
          .addCase(productsSearch.pending, (state) => {
            state.productSearch.loading = true;
            state.productSearch.products = [];
            state.productSearch.error = null;
          })
          .addCase(productsSearch.fulfilled, (state, action) => {
            state.productSearch.loading = false;
            state.productSearch.products = action.payload;
            state.productSearch.error = null;
          })
          .addCase(productsSearch.rejected, (state, action) => {
            state.productSearch.loading = false;
            state.productSearch.products = [];
            state.productSearch.error = action.payload;
          })
          .addCase(createProduct.pending, (state) => {
              state.productCreate.loading = true;
              state.productCreate.error = null;
          })
          .addCase(createProduct.fulfilled, (state, action) => {
              state.productCreate.loading = false;
              state.productList.products.push(action.payload);
          })
          .addCase(createProduct.rejected, (state, action) => {
              state.productCreate.loading = false;
              state.productCreate.error = action.payload;
          })
          .addCase(editProduct.pending, (state) => {
              state.productEdit.loading = true;
              state.productEdit.error = null;
          })
          .addCase(editProduct.fulfilled, (state, action) => {
              state.productEdit.loading = false;
              const updatedProduct=action.payload;
              state.productEdit.product =updatedProduct;
              state.productList.products = state.productList.products.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
             );
          })
          .addCase(editProduct.rejected, (state, action) => {
              state.productEdit.loading = false;
              state.productEdit.error = action.payload;
          })
          .addCase(deleteProduct.pending, (state) => {
              state.productDelete.loading = true;
              state.productDelete.error = null;
          })
          .addCase(deleteProduct.fulfilled, (state, action) => {
              state.productDelete.loading = false;
              const deletedProductId = action.payload;
              state.productList.products = state.productList.products.filter(
                  (product) => product._id !== deletedProductId
              );
              state.productDelete.product = {};
          })
          .addCase(deleteProduct.rejected, (state, action) => {
              state.productDelete.loading = false;
              state.productDelete.error = action.payload;
          })
          .addCase(uploadImage.pending, (state) => {
            state.uploadImage.loading = true;
            state.uploadImage.image = null;
            state.uploadImage.error = null;
          })
          .addCase(uploadImage.fulfilled, (state, action) => {
            state.uploadImage.loading = false;
            state.uploadImage.image = action.payload;
            state.uploadImage.error = null;
          })
          .addCase(uploadImage.rejected, (state, action) => {
            state.uploadImage.loading = false;
            state.uploadImage.image = null;
            state.uploadImage.error = action.payload;
          })
          .addCase(createProductReview.pending, (state) => {
            state.productReviewCreate.loading = true;
          })
          .addCase(createProductReview.fulfilled, (state, action) => {
            state.productReviewCreate.loading = false;
            state.productReviewCreate.product = action.payload;
          })
          .addCase(createProductReview.rejected, (state, action) => {
            state.productReviewCreate.loading = false;
            state.productReviewCreate.error = action.error.message;
          })
          .addCase(uploadFile.pending, (state) => {
            state.uploadFile.loading = true;
            state.uploadFile.success = false;
            state.uploadFile.error = null;
            state.uploadFile.file = null;
          })
          .addCase(uploadFile.fulfilled, (state, action) => {
            state.uploadFile.loading = false;
            state.uploadFile.success = true;
            state.uploadFile.error = null;
            state.uploadFile.file = action.payload;
          })
          .addCase(uploadFile.rejected, (state, action) => {
            state.uploadFile.loading = false;
            state.uploadFile.file = null;
            state.uploadFile.error = action.payload;
          });
        },
      });      

export const {productDetailsClear,productCategoryDetailsClear,productSubCategoryDetailsClear,productSearchClear,productCreateReviewReset,productCreateReset,productEditReset,productListClear}=productSlice.actions;
export const productReducer = productSlice.reducer;
export default productReducer;

