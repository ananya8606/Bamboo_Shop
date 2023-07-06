import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { savePaymentInfo } from '../reducers/cartReducers';
import { paymentgateway } from '../Utils/translateLibrary/paymentgateway';
import Message from './Message';

const PaytmPaymentGateway = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const { language, currency } = settings;
  const [formValues, setFormValues] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry:'',
  });
  const [showErrorMessage, setShowErrorMessage] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.entries(formValues).every((value) => value !== '')) {
      const paymentInfo = {
        cardholderName: formValues.cardholderName,
        cardNumber: formValues.cardNumber,
        expiry: formValues.expiry,
        paidAmount:totalPrice,
      };  
      dispatch(savePaymentInfo(paymentInfo));
      history('/placeorder');
    } else {
      setShowErrorMessage(true);
    }
  };

  return (
    <div className="paytm-payment-gateway">
      <h2 className="paytmTitle">{paymentgateway.pg[language]}</h2>
      <div className="payment-form">
        <label htmlFor="cardholderName">
        {paymentgateway.chn[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          id="cardholderName"
          name="cardholderName"
          value={formValues.cardholderName}
          onChange={handleChange}
          required
        />

        <label htmlFor="cardNumber">
        {paymentgateway.cn[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formValues.cardNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="expiry">
        {paymentgateway.ed[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          id="expiry"
          name="expiry"
          value={formValues.expiry}
          onChange={handleChange}
          required
        />

        <label htmlFor="cvv">
          CVV<span className="required">*</span>:
        </label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          required
        />

        <label htmlFor="transactionAmount">
        {paymentgateway.ta[language]}<span className="required">*</span>:
        </label>
        <input
          type="text"
          id="transactionAmount"
          value={totalPrice}
          readOnly
        />

        {showErrorMessage && (
          <Message message={'Please fill all the details'} color='red'/>
        )}

        <button
          onClick={handleSubmit}
          className='payment-form button'
        >
          {paymentgateway.mp[language]}
        </button>
      </div>
    </div>
  );
};

export default PaytmPaymentGateway;
