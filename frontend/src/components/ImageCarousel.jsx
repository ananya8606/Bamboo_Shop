import React, { useEffect, useState } from 'react'
import { Slide } from 'react-slideshow-image'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import Loading from './Loading'
import 'react-slideshow-image/dist/styles.css'
const ImageCarousel = () => {
  const productList = useSelector((state) => state.product.productList)
  const { loading, products, error } = productList

  return (
    <div className='slide-container'>
      <Slide className='manageSlide'>
        {loading ? <Loading />:(products &&
          products.map((items) => (
            <div className='each-slide' key={items._id}>
              <Link
                to={`/category/${items.category}/${items.subCategory}/${items._id}`}
              >
                {' '}
                <img src={items.image} alt='' />
              </Link>
            </div>
          )))}
      </Slide>
      </div>
  )
}

export default ImageCarousel
