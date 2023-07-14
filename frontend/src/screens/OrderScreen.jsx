import React, { useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder, orderCreateReset } from '../reducers/orderReducers';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { o } from '../Utils/translateLibrary/order';
import { useNavigate } from 'react-router-dom';
import { fetchCartItems } from '../reducers/cartReducers';
import { fetchSettings } from "../reducers/settingsReducers";

const OrderScreen = () => {
  const settings = useSelector((state) => state.settings);
  const { language, currency } = settings;
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  console.log(cart);
  
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  
  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100);
  const taxPrice = addDecimals(Number((0.13 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.order.orderCreate);
  const { order, success, error, loading } = orderCreate;

  
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress, cart.paymentMethod, navigate]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
    dispatch(orderCreateReset());
    if (success) {
      navigate(`/myorders/${userInfo._id}`);
    }
  }, [userInfo, success, navigate, dispatch]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentInfo: cart.paymentInfo,
      })
    );
  };

  return (
    <div className='orderscreen-outer'>
      <CheckoutSteps step1 step2 step3 step4 />
      {loading ? (
        <Loading />
      ) : (
        <div className='orderscreen-outermost'>
          <div className='orderscreen-inner-left'>
            <div className='orderscreen-controller'>
              <span>{o.title[language]}</span>
              <span>
              {cart.shippingAddress?.address}, {cart.shippingAddress?.city}, {cart.shippingAddress?.postalCode} near {cart.shippingAddress?.country}
        </span>
        <span>
          <i style={{ color: 'green' }} className='fas fa-phone'></i> {cart.shippingAddress?.phoneNumber}
        </span>
      </div>
      <div className='underline'></div>
      <div className='orderscreen-controller'>
        <span>{o.paymentMethod[language]}</span>
        <span className='gd'>{`${o.paymentMethod[language]}: ${cart.paymentMethod}`}</span>
        {cart.paymentInfo && cart.paymentInfo.cardholderName && (
          <>
            <span className='gd'>{`${o.chn[language]}: ${cart.paymentInfo.cardholderName}`}</span>
            <span className='gd'>{`${o.cn[language]}: ${cart.paymentInfo.cardNumber}`}</span>
            <span className='gd'>{`${o.ed[language]}: ${cart.paymentInfo.expiry}`}</span>
            <span className='gd'>{`${o.pa[language]}: ${cart.paymentInfo.paidAmount}`}</span>
          </>
        )}
            </div>
            <div className='underline'></div>
            <div className='orderscreen-controller'>
              <span>{o.orderitems[language]}</span>
              <br />
              {cart.cartItems.map((item) => (
                <React.Fragment key={item._id}>
                  <div className='cart-controller'>
                    <img src={item.image} alt='' />
                    <span>{item.name}</span>
                    <span>
                      {item.qty}x{item.price} = Rs. {item.price * item.qty}
                    </span>
                  </div>
                  <div
                    style={{ marginLeft: '10px', width: '70%' }}
                    className='underline'
                  ></div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='orderscreen-inner-right'>
            <span className='ordersum'>{o.ordersummary[language]}</span>
            <div className='orderscreen-controller-right'>
              <span>{o.items[language]}</span>
              <span>Rs. {itemsPrice}</span>
            </div>
            <div className='underline'></div>
            <div className='orderscreen-controller-right'>
              <span>{o.shipping[language]}</span>
              <span>Rs. {shippingPrice}</span>
            </div>
            <div className='underline'></div>
            <div className='orderscreen-controller-right'>
              <span>{o.tax[language]}</span>
              <span>Rs. {taxPrice}</span>
            </div>
            <div className='underline'></div>
            <div className='orderscreen-controller-right'>
              <span>{o.total[language]}</span>
              <span>Rs. {totalPrice}</span>
            </div>
            <button
              className='placeorder-btn'
              disabled={cart.cartItems === 0}
              onClick={placeOrderHandler}
            >
              {o.placeorder[language]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderScreen;
