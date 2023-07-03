import React, { useEffect } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../reducers/productReducers';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import { footer } from '../Utils/translateLibrary/footer';

const Home = () => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const { language } = settings;

  const productList = useSelector((state) => state.product.productList);
  const { loading, products, error } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div className=''>
      <ImageCarousel />
      {loading ? (
        <Loading />
      ) : (
        <div className='container'>
          <p className='top-picks'>{footer.allproducts[language]}</p>
          <div className='shopping-items'>
            {products &&
              products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
