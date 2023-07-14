import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { listOrders, deliverOrder, payOrder } from '../reducers/orderReducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ao } from '../Utils/translateLibrary/adminorders';
import { useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";
  
const AdminOrders = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin 
  const orderList = useSelector((state) => state.order.orderList)
  const { loading, orders,error } = orderList
  const orderDeliver = useSelector((state) => state.order.orderDeliver)
  const {loading: loadingDeliver,success: successDeliver,error: errorDeliver } = orderDeliver
  const orderPay = useSelector((state) => state.order.orderPay)
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay
  const settings = useSelector((state) => state.settings);
  const { language, currency } = settings;
  const history = useNavigate();

  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      history('/');
    } else {
      dispatch(listOrders());
    }
  }, [userInfo, history, dispatch]);

  const deliverHandler = (id) => {
    dispatch(deliverOrder(id));
  };

  const payHandler = (id) => {
    dispatch(payOrder(id));
  };

  const detailHandler = async (id) => {
    history(`/orderDetails/${id}`);
  };

  return (
    <div className='adminOrdersouter'>
      {loading ? (
        <Loading />
      ) : (
        <div className='adminOrder-inner'>
          {(loadingDeliver || loadingPay) && <Loading />}
          {errorDeliver || errorPay || error ? (
            <Message
              message={errorPay || errorDeliver || error}
              color='black'
            />
          ) : (
            orders && orders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>{ao.o[language]}</th>
                    <th>{ao.d[language]}</th>
                    <th>{ao.u[language]}</th>
                    <th>{ao.t[language]}</th>
                    <th>{ao.i[language]}</th>
                    <th>{ao.p[language]}</th>
                    <th style={{ textAlign: 'center' }}>
                      <i className='fas fa-info'></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.updatedAt}</td>
                      <td>{order.user}</td>
                      <td>Rs. {order.totalPrice}</td>
                      <td
                        style={{ textAlign: 'center' }}
                        onClick={() => deliverHandler(order._id)}
                      >
                        {order.isDelivered ? (
                          <i
                            className='fas fa-check'
                            style={{
                              color: 'green',
                              cursor: 'pointer',
                              fontSize: '20px',
                            }}
                          ></i>
                        ) : (
                          <FontAwesomeIcon icon={faTimes} style={{ color: 'red', cursor: 'pointer' }} />
                        )}
                      </td>
                      <td
                        style={{ textAlign: 'center' }}
                        onClick={() => payHandler(order._id)}
                      >
                        {order.isPaid ? (
                          <i
                            className='fas fa-check'
                            style={{
                              color: 'green',
                              cursor: 'pointer',
                              fontSize: '20px',
                            }}
                          ></i>
                        ) : (
                          <FontAwesomeIcon icon={faTimes} style={{ color: 'red', cursor: 'pointer' }} />
                        )}
                      </td>
                      <td
                        style={{ textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => detailHandler(order._id)}
                      >
                        Details
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Message message={error} color='red' />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
