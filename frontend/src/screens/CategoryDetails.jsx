import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listCategoryDetails } from '../reducers/productReducers';
import Loading from '../components/Loading';
import { y } from '../Utils/translateLibrary/category';
import PaginationComponent from '../components/PaginationComponentCategory';
import { fetchSettings } from "../reducers/settingsReducers";

const CategoryDetails = () => {
  const  { id: productId } = useParams();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const productCategory = useSelector((state) => state.product.productCategory)
  const { loading, products, error } = productCategory
  const [minValue, setMinValue] = useState(100);
  const [value, setValue] = useState(20000);
  const categoryId = useParams().categoryName;
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  const handleChange = (value) => {
    setValue(value);
  };

  useEffect(() => {
    dispatch(listCategoryDetails({ categoryName: categoryId, cost: value }));
  }, [dispatch,categoryId, value]);

  return (
    <div className='category-outermost'>
      <div className='category'>
        <div className='filter-options'>
          <span>{y.price[language]}</span>
          <div className='slider-filter'>
            <Slider
              className='manageslider'
              value={value}
              min={100}
              max={200000}
              orientation='horizontal'
              onChange={handleChange}
            />
          </div>
          <div className='rangeNumber'>
            <span>
              <span>{y.min[language]} Rs.</span>
              <input type='number' value={minValue} readOnly/>
            </span>
            <span>
              <span>{y.max[language]} Rs.</span>
              <input type='number' value={value} onChange={(e) => handleChange(parseInt(e.target.value))} />
            </span>
          </div>
          <br />
        </div>
        {loading && <Loading />}
          {products.length > 0 && <PaginationComponent data={products} />}
      </div>
    </div>
  );
};

export default CategoryDetails;
