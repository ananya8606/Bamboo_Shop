import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { savePaymentInfo } from '../reducers/cartReducers';
import { paymentgateway } from '../Utils/translateLibrary/paymentgateway';
import Message from './Message';
import { fetchSettings } from "../reducers/settingsReducers";

const PaytmPaymentGateway = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const { language, currency } = settings;
 
   const [cardholderName, setCardholderName] = useState('');
   const [cardNumber, setCardNumber] = useState('');
   const [expiry, setExpiry] = useState('');
   const [cvv, setCvv] = useState('');
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
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

  useEffect(() => {
    const simulateRedirection = () => {
      console.log('Redirecting to Paytm payment gateway...');
    };
  
    simulateRedirection();
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
      const paymentInfo = {
        cardholderName: cardholderName,
        cardNumber: cardNumber,
        expiry:expiry,
        paidAmount:totalPrice,
      };  
      dispatch(savePaymentInfo(paymentInfo));
      history('/placeorder');
  };

  return (
    <div className="paytm-payment-gateway">
      <h2 className="paytmTitle">{paymentgateway.pg[language]}</h2>
      <div className="payment-form">
      <form onSubmit={handleSubmit}>
      <div className='form-control'>
        <label htmlFor="cardholderName">
        {paymentgateway.chn[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
        </div>
       <div className='form-control'>
        <label htmlFor="cardNumber">
        {paymentgateway.cn[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
       </div>
       <div className='form-control'>
        <label htmlFor="expiry">
        {paymentgateway.ed[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          required
        />
       </div>
       <div className='form-control'>
        <label htmlFor="cvv">
          CVV<span className="required">*</span>:
        </label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
       </div>
       <div className='form-control'>
        <label htmlFor="transactionAmount">
        {paymentgateway.ta[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          value={totalPrice}
          readOnly
        />
       </div>
        <button
          type="submit"
          className='payment-form button'
        >
          {paymentgateway.mp[language]}
        </button>
        </form>
      </div>
      </div>
  );
};

export default PaytmPaymentGateway;
