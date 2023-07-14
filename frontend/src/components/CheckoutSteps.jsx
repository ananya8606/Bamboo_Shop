import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ch } from "../Utils/translateLibrary/checkout";
import { fetchSettings } from "../reducers/settingsReducers";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
const settings = useSelector((state) => state.settings);
const { language } = settings;
const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  return (
    <div className='checkoutContainer'>
      <div className='checkout-inner'>
        {step1 ? (
          <Link to='/login' className='enabledCursor'>
            {ch.si[language]} {' '}
          </Link>
        ) : (
          <Link
            to='/login'
            onClick={(event) => event.preventDefault()}
            className='disabledCursor'
          >
          {ch.si[language]}
          </Link>
        )}
      </div>
      <div className='checkout-inner'>
        {step2 ? (
          <Link to='/shipping' className='enabledCursor'>
            {ch.sa[language]}
          </Link>
        ) : (
          <Link
            to='/shipping'
            onClick={(event) => event.preventDefault()}
            className='disabledCursor'
          >
          {ch.sa[language]}
          </Link>
        )}
      </div>{' '}
      <div className='checkout-inner'>
        {step3 ? (
          <Link to='/payment' className='enabledCursor'>
            {ch.pay[language]}
          </Link>
        ) : (
          <Link
            to='/payment'
            onClick={(event) => event.preventDefault()}
            className='disabledCursor'
          >
            {ch.pay[language]}
          </Link>
        )}
      </div>{' '}
      <div className='checkout-inner'>
        {step4 ? (
          <Link to='/placeorder' className='enabledCursor'>
          {ch.po[language]}
          </Link>
        ) : (
          <Link
            to='/placeorder'
            onClick={(event) => event.preventDefault()}
            className='disabledCursor'
          >
            {ch.po[language]}
          </Link>
        )}
      </div>
    </div>
  )
}

export default CheckoutSteps
