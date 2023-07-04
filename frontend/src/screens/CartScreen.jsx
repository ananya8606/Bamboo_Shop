// CartScreen.js
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../reducers/cartReducers';
import { c } from "../Utils/translateLibrary/cart";
import { useParams, useNavigate } from 'react-router-dom';

const CartScreen = () => {
  const { id: productId } = useParams();
  const settings = useSelector((state) => state.settings);
  const { language, currency } = settings;
  const location = useLocation();
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const history = useNavigate();
  const checkoutHandler = () => {
    if(userInfo)
    history('/shipping');
    else
    history('/login');
  };

  useEffect(() => {
    if (productId!='cartItems') {
      dispatch(addToCart({id:productId, qty:qty}));
    }
  }, [dispatch, productId, qty]);

  return (
    <div className='cartScreen-outer'>
      <button
        style={{ marginBottom: '10px', background: 'rgb(97,63,153)' }}
        onClick={() => window.history.back()}
      >
        {c.goBack[language]}
      </button>
      <div className='cartScreen-inner'>
        <div className='cartScreen-left'>
          <span style={{ fontSize: '20px', textTransform: 'uppercase' }}>
            {c.shoppingCart[language]}
          </span>
          <br />
          <br />
          {cartItems.length < 1 ? (
            <span>{c.emptyCart[language]}</span>
          ) : (
            cartItems.map((item) => (
              <>
                <div className='cart-controller' key={item.product}>
                  <Link
                    to={`/category/${item.category}/${item.subCategory}/${item.product}`}
                  >
                    <img src={item.image} alt='' />
                  </Link>
                  <span>{item.name}</span>
                  <span>Rs. {item.price}</span>
                  <div className="quantity-controller">
                    <button
                      onClick={() => dispatch(addToCart({ id: item.product, qty:(item.qty>0?item.qty - 1:0) }))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => dispatch(addToCart({ id: item.product, qty: item.qty + 1 }))}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <i
                    onClick={() => removeFromCartHandler(item.product)}
                    className='fas fa-trash'
                  ></i>
                </div>
                <div
                  style={{ marginLeft: '10px', width: '70%' }}
                  className='underline'
                ></div>
              </>
            ))
          )}
        </div>
        <div className='cartScreen-right'>
          <span>
            {c.subTotal[language]} ({cartItems.reduce(
              (acc, item) => acc + item.qty,
              0
            )}{' '}
            {c.items[language]})
          </span>
          <span>
            Rs.{' '}
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}{' '}
          </span>
          <button
            className='checkout-btn'
            onClick={checkoutHandler}
            disabled={cartItems.length === 0}
          >
            {c.proceed[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;

