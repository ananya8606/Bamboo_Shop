import React, { useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import 'react-slideshow-image/dist/styles.css';

const ImageCarousel = () => {
  const productList = useSelector((state) => state.product.productList);
  const { loading, products, error } = productList;
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Check if all images are loaded
    const handleImageLoad = () => {
      setImagesLoaded(true);
    };

    const images = Array.from(document.querySelectorAll('.each-slide img'));
    let loadedCount = 0;

    images.forEach((image) => {
      if (image.complete) {
        loadedCount++;
      } else {
        image.addEventListener('load', handleImageLoad);
      }
    });

    if (loadedCount === images.length) {
      setImagesLoaded(true);
    }

    // Clean up event listeners
    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <div className='slide-container'>
      {loading && <Loading />}
      {imagesLoaded && (
        <Slide className='manageSlide'>
          {products &&
            products.map((item) => (
              <div className='each-slide' key={item._id}>
                <Link
                  to={`/category/${item.category}/${item.subCategory}/${item._id}`}
                >
                  <img src={item.image} alt='' />
                </Link>
              </div>
            ))}
        </Slide>
      )}
    </div>
  );
};

export default ImageCarousel;
