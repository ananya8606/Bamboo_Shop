import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDispatch, useSelector } from 'react-redux'
import { listSubCategoryDetails } from '../reducers/productReducers'
import Loading from '../components/Loading'
import { useParams } from 'react-router-dom';
import { y } from "../Utils/translateLibrary/category";
import PaginationComponent from '../components/PaginationComponentCategory';
import { fetchSettings } from "../reducers/settingsReducers";

const CategoryDetails = () => {
  const  { id: productId } = useParams();
  const settings = useSelector((state) => state.settings);
    const { language, currency } = settings;
  const dispatch = useDispatch()
  const productsubCategory = useSelector((state) => state.product.productsubCategory)
  const { loading, products, error } = productsubCategory

  const [value, setValue] = useState(10000)
  const [minValue, setMinValue] = useState(100)
  const categoryId = useParams().subcategoryName;
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  const handleChange = (value) => {
    setValue(value)
  }

  useEffect(() => {
    dispatch(listSubCategoryDetails({subcategoryName:categoryId,cost:value}))
  }, [categoryId, value])

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

              <input
                type='number'
                value={value}
                onChange={(e) => {
                  setValue(value)
                }}
              />
            </span>
          </div>
          <br />
        </div>
        {loading && <Loading />}
       {products.length > 0 && <PaginationComponent data={products} />}
      </div>
    </div>
  )
}

export default CategoryDetails
