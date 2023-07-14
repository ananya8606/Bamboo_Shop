import React, { useState, useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../reducers/cartReducers';
import { useDispatch, useSelector } from 'react-redux';
import { pay } from "../Utils/translateLibrary/paymentMethod";
import { useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const Payment = () => {
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [paymentMethod, setPaymentMethod] = useState(' ');
  const [check, setChecked] = useState(false);
  const [check1, setChecked1] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);

  const onChangeHandler = (e, id) => {
    console.log('value of id', id);
    if (id === 1) {
      setChecked(true);
      setChecked1(false);
      setPaymentMethod(e.target.value);
    } else {
      setChecked1(true);
      setChecked(false);
      setPaymentMethod(e.target.value);
    }
  };

  const history = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    if(check1)
    history('/paytm-payment-gateway'); 
    else
    history('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress ||!shippingAddress.address) {
      history('/shipping');
    }
  }, [shippingAddress, history]);

  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history('/');
    }
  }, [userInfo, history]);

  return (
    <div className='payment-outer'>
      <CheckoutSteps step1 step2 step3 />
      <div className='form-control-payment'>
        <span style={{ textAlign: 'center' }}>{pay.pa[language]}</span>
        <div className='pay'>
          <div className='pay-control'>
            <input
              type='checkbox'
              name='Pay on Delivery'
              value='Pay on Delivery'
              id='1'
              checked={check}
              onChange={(e) => onChangeHandler(e, 1)}
            />
            <span>{pay.can[language]}</span>
          </div>
          <div className='pay-control'>
            <input
              type='checkbox'
              name='Credit Card '
              value='Credit Card '
              id='2'
              checked={check1}
              onChange={(e) => onChangeHandler(e, 2)}
            />
            <span>{pay.cc[language]}</span>
          </div>
          {console.log(paymentMethod)}
        </div>
        <button onClick={submitHandler} className='payButton'>
          {pay.continue[language]}
        </button>
      </div>
    </div>
  );
};

export default Payment;
