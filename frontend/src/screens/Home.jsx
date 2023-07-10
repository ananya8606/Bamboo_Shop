import React, { useEffect } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../reducers/productReducers';
import Loading from '../components/Loading';
import { footer } from '../Utils/translateLibrary/footer';
import PaginationComponent from '../components/PaginationComponent';
import { fetchSettings } from "../reducers/settingsReducers";
import { fetchCartItems } from '../reducers/cartReducers';

const Home = () => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const { language } = settings;

  const productList = useSelector((state) => state.product.productList);
  const { loading, products, error } = productList;

 const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

   useEffect(() => {
    dispatch(fetchSettings());
    dispatch(listProducts(cartItems));
  }, [dispatch,cartItems]);
  
  return (
    <div className=''>
      <ImageCarousel />
      {loading ? (
        <Loading />
      ) : (
        <div className='container'>
          <p className='top-picks'>{footer.allproducts[language]}</p>
         
            <PaginationComponent data={products} itemsPerPage={10} />
          </div>
      )}
    </div>
  );
};

export default Home;
