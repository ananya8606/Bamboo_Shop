import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loading from '../components/Loading'
import axios from 'axios'
import { s } from "../Utils/translateLibrary/orderSummary";
import { useParams,useNavigate } from 'react-router-dom';
import api from '../api'
import { fetchSettings } from "../reducers/settingsReducers";

const OrderDetails = () => {
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const [orderdetails, setOrderdetails] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin
  const {id}=useParams();
  const history = useNavigate();
  
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  
  useEffect(() => {
    !userInfo && history('/')
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const loadData = async () => {
      setLoading(true)
      const { data } = await api.get(
        `https://bamboo-shop-backend-53cf.onrender.com/api/orders/admin/order/${id}`,
        config
      )
      setOrderdetails(data)
      setLoading(false)
      console.log('order is', orderdetails)
    }
    loadData()
  }, [userInfo, history])
  return (
    <div className='orderscreen-outer'>
      {console.log('order is', orderdetails)}
      {loading ? (
        <Loading />
      ) : (
        <div className='orderscreen-outermost'>
          {orderdetails && (
            <>
              <div className='orderscreen-inner-left'>
                <div className='orderscreen-controller'>
                  <span>{s.shippingaddress[language]}</span>
                  <span>
                    {orderdetails.shippingAddress.address},
                    {orderdetails.shippingAddress.city},
                    {orderdetails.shippingAddress.postalCode} near{' '}
                    {orderdetails.shippingAddress.country}
                  </span>
                  <span>
                    <i style={{ color: 'green' }} className='fas fa-phone'></i>{' '}
                    {orderdetails.shippingAddress.phoneNumber}
                  </span>
                </div>
                <div className='underline'></div>
                <div className='orderscreen-controller'>
                  <span>{s.paymentmethod[language]}</span>
                  <span className='gd'>{orderdetails.paymentMethod}</span>
                  {orderdetails.paymentInfo && orderdetails.paymentInfo.cardholderName && (
                 <>
                   <span className='gd'>{s.chn[language]}:{orderdetails.paymentInfo.cardholderName} </span>
                  <span className='gd'>{s.cn[language]}:{orderdetails.paymentInfo.cardNumber} </span>
                  <span className='gd'>{s.ed[language]}:{orderdetails.paymentInfo.expiry} </span>
                  <span className='gd'>{s.pa[language]}:{orderdetails.paymentInfo.paidAmount} </span>
                </>
              )}
                </div>
                <div className='underline'></div>
                <div className='orderscreen-controller'>
                  <span>{s.orderitems[language]}</span>
                  <br />
                  {orderdetails.orderItems.map((item) => (
                    <>
                      <div
                        className='data-controller'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}
                        key={item._id}
                      >
                        <img
                          style={{ width: '50px', height: '50px' }}
                          src={item.image}
                          alt=''
                        />

                        <span>{item.name}</span>
                        <span>
                          {item.qty}x{item.price} = Rs. {item.price * item.qty}
                        </span>
                      </div>
                      <div
                        style={{ marginLeft: '10px', width: '70%' }}
                        className='underline'
                      ></div>
                    </>
                  ))}
                </div>
              </div>
              <div className='orderscreen-inner-right'>
                <span className='ordersum'>{s.title[language]}</span>
                {/* <div className='orderscreen-controller-right'>
                  <span>Items</span>
                  <span>Rs. {orderdetails.itemsPrice}</span>
                </div> */}
                <div className='underline'></div>
                <div className='orderscreen-controller-right'>
                  <span>{s.shipping[language]}</span>
                  <span>Rs. {orderdetails.shippingPrice}</span>
                </div>
                <div className='underline'></div>
                <div className='orderscreen-controller-right'>
                  <span>{s.tax[language]}</span>
                  <span>Rs. {orderdetails.taxPrice}</span>
                </div>
                <div className='underline'></div>
                <div className='orderscreen-controller-right'>
                  <span>{s.total[language]}</span>
                  <span>Rs. {orderdetails.totalPrice}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderDetails
