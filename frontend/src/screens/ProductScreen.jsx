import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { p } from "../Utils/translateLibrary/productDetails";
import { addToCart } from '../reducers/cartReducers';
import {
  listProductDetails,
  createProductReview,
  productCreateReviewReset,
  productSearchClear
} from '../reducers/productReducers';
import { useParams,useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const ProductScreen = () => {
  const settings = useSelector((state) => state.settings);
    const { language} = settings;
  const dispatch = useDispatch()
  const productDetails = useSelector((state) => state.product.productDetails)
  const { loading, product, error } = productDetails
  const userLogin = useSelector((state) => state.user.userLogin)
  const {
    loading: loadingLogin,
    error: errorLogin,
    userInformation,
  } = userLogin
  const productReviewCreate = useSelector((state) => state.product.productReviewCreate)
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate
  const  { id: productId } = useParams();
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProductReview({productId:productId, review:{
        stars,
        description,
      }})
    )
  }
  const history=useNavigate();
  const [qty, setQty] = useState(1)

  const [stars, setStars] = useState(0)
  const [description, setDescription] = useState('')
  useEffect(() => {
    if (successProductReview) {
      setStars(0)
      setDescription('')
    }
    dispatch(productSearchClear())
    dispatch(listProductDetails(productId))

    if (product && product._id !== productId) {
      dispatch(productCreateReviewReset())
    }
  }, [productId, successProductReview, dispatch])
  const addToCartHandler = () => {
    dispatch(addToCart({id:productId,qty:qty}));
    history(`/cart/${productId}?qty=${qty}`)
  }
  return (
    <div className='product-screen-outermost'>
      {loading ? (
        <Loading />
      ) : (
        product && (
          <div className='product-screen'>
            <div className='product-screen-top'>
              <img src={product.image} alt={product.brandName} />
              <div className='description'>
                <h3>{product.brandName}</h3>
                <div className='underline'></div>
                {console.log(product.reviews)}
                <span className='star-section star-section1'>
                  {product.stars && (
                    <Rating className='star-edit' value={product.stars} />
                  )}
                  {product.reviews?.length > 0 ? product.reviews.length : 0}{' '}
                  {p.reviews}
                </span>
                <div className='underline'></div>

                <div className='price1'>
                  <span>
                    {product.discount
                      ? 'Rs.' +
                        Math.floor(
                          `${
                            product.cost -
                            (product.discount / 100) * product.cost
                          }`
                        )
                      : `Rs. ${product.cost}`}
                  </span>
                  {product.discount && (
                    <div className='discounted-section'>
                      <p className='previous-price'>{product.cost}</p>
                      <p className='dpercent'>-{product.discount}%</p>
                    </div>
                  )}
                </div>
                <div className='underline'></div>

                <span className='product-desc'>{product.description}</span>
              </div>
              <div className='cart-option'>
                <h3>{p.addtocart[language]}</h3>
                <div className='underline'></div>
                <div>
                  <div className='form-control'>
                    <span>{p.price[language]}</span>
                    <span>
                      {product.discount
                        ? 'Rs.' +
                          Math.floor(
                            `${
                              product.cost -
                              (product.discount / 100) * product.cost
                            }`
                          )
                        : `Rs. ${product.cost}`}
                    </span>
                  </div>
                  <div className='underline'></div>

                  <div className='form-control'>
                    <span>{p.status[language]}</span>
                    <span>
                      {product.quantity < 1 ? 'Out of Stock' : 'In Stock'}
                    </span>
                  </div>
                  <div className='underline'></div>

                  <div className='form-control'>
                    <span>{p.quantity[language]}</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {[...Array(product.quantity).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}{' '}
                    </select>
                  </div>
                  <div className='underline'></div>

                  <div className='form-control'>
                    <button
                      onClick={addToCartHandler}
                      disabled={product.quantity === 0}
                    >
                      {p.addtocart[language]}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='product-screen-bottom'>
              <div className='reviews'>
                <h3>{p.cr[language]}</h3>
                {product.reviews ? (
                  product.reviews.map((review) => (
                    <div className='reviews-inner' key={review._id}>
                      <span>{review.reviewedBy}</span>
                      <span className='star-section'>
                        <Rating value={review.stars} />
                      </span>
                      <span>
                        {review.createdAt && review.createdAt.substring(0, 10)}
                      </span>
                      <span>{review.description}</span>
                      <div className='underline'></div>
                    </div>
                  ))
                ) : (
                  <span>{p.br[language]}</span>
                )}
              </div>
              <div className='your-review'>
                <h3>{p.w[language]}</h3>
                {userInformation ? (
                  <>
                    {loadingProductReview && <Loading />}
                    {errorProductReview && (
                      <Message message={errorProductReview} color='red' />
                    )}
                    {successProductReview && (
                      <Message message='Successfully reviewed' color='green' />
                    )}
                    <select
                      name=''
                      id=''
                      value={stars}
                      onChange={(e) => setStars(e.target.value)}
                    >
                      <option value=''> {p.se[language]}</option>
                      <option value='1'>1 - {p.poor[language]}</option>
                      <option value='2'>2 - {p.f[language]}</option>
                      <option value='3'>3 - {p.g[language]}</option>
                      <option value='4'>4 -{p.vg[language]}</option>
                      <option value='5'>5 - {p.ex[language]}</option>
                    </select>
                    <textarea
                      name=''
                      id=''
                      cols='4'
                      rows='4'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>{' '}
                    <button onClick={submitHandler}>{p.u[language]}</button>
                  </>
                ) : (
                  <>
                    <span>
                      {p.y[language]}{' '}
                      <Link to='/login'>
                        <span style={{ color: 'green' }}>{p.log[language]}</span>
                      </Link>{' '}
                      {p.tc[language]}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default ProductScreen
