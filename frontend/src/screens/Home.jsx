import React, { useEffect } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../reducers/productReducers';
import Loading from '../components/Loading';
import { footer } from '../Utils/translateLibrary/footer';
import PaginationComponent from '../components/PaginationComponent';
import { fetchSettings } from "../reducers/settingsReducers";

const Home = () => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const { language } = settings;

  const productList = useSelector((state) => state.product.productList);
  const { loading, products, error } = productList;

  useEffect(() => {
    dispatch(listProducts());
    dispatch(fetchSettings());
  }, [dispatch]);
  
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
