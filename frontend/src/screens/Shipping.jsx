import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../reducers/cartReducers';
import { sh } from "../Utils/translateLibrary/shipping";
import { fetchCartItems } from '../reducers/cartReducers';
import { fetchSettings } from "../reducers/settingsReducers";

const Shipping = () => {
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Set default values if shippingAddress is null
  const initialAddress = shippingAddress ? shippingAddress.address: '';
  const initialCity = shippingAddress ? shippingAddress.city : '';
  const initialPostalCode = shippingAddress ? shippingAddress.postalCode : '';
  const initialCountry = shippingAddress ? shippingAddress.country : '';
  const initialPhoneNumber = shippingAddress ? shippingAddress.phoneNumber : '';

  const [address, setAddress] = useState(initialAddress);
  const [city, setCity] = useState(initialCity);
  const [postalCode, setPostalCode] = useState(initialPostalCode);
  const [country, setCountry] = useState(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;
  const dispatch = useDispatch();
  const history = useNavigate();
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({
      address,
      city,
      postalCode,
      country,
      phoneNumber,
    }));
    history('/payment')
  };

  useEffect(() => {
    !userInfo && history('/');
  }, [userInfo]);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  return (
    <div className='shipping-outer'>
      <CheckoutSteps step1 step2 />
      <div className='form-outer'>
        <div className='form-outermost'>
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={sh.eyd[language]}
                required
              />
            </div>
            <div className='form-control'>
              <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={sh.eyc[language]}
                required
              />
            </div>

            <div className='form-control'>
              <input
                type='Tole'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder={sh.tn[language]}
                required
              />
            </div>
            <div className='form-control'>
              <input
                type='text'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={sh.contact[language]}
                required
              />
            </div>
            <div className='form-control'>
              <input
                type='text'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={sh.lk[language]}
                required
              />
            </div>

            <button type='submit'>{sh.continue[language]}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
