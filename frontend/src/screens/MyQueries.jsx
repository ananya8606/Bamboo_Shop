import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from '../reducers/userReducers'
import Message from '../components/Message'
import Loading from '../components/Loading'
import { useParams,useNavigate } from 'react-router-dom';
import { mq } from '../Utils/translateLibrary/myqueries';
import { fetchSettings } from "../reducers/settingsReducers";

const MyQueries = () => {
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin
  const userDetails = useSelector((state) => state.user.userDetails);
  const { loading, error, user } = userDetails;
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  
  useEffect(() => {
    !userInfo && history('/')
    dispatch(getUserDetails(id))
  }, [userInfo, history])
  return (
    <div className='myOrders-outermost'>
      {loading ? (
        <Loading />
      ) : (
        <div className='myOrders-inner'>
          <span className='my-text'>{mq.my[language]}</span>
          {console.log(user)}
          {user.queries && user.queries.length < 1 && (
            <Message
              message={mq.y[language]}
              color='black'
            />
          )}
          {user.queries &&
            user.queries.map((query) => (
              <div key={query.query} className='orderset'>
                <div className='orderManage'>
                  <span>{mq.q[language]} = {query.type}</span>
                  <span style={{ padding: 0 }}>
                  {mq.qu[language]} = {query.query}
                  </span>
                  <span>
                    {mq.qs[language]} :
                    {query.active ? (
                      <span> {mq.a[language]} <i className='fas fa-check'></i></span>
                    ) : (
                      <span> {mq.c[language]} <i className='far fa-times-circle'></i></span>
                    )}
                  </span>
                        <div
                          style={{ marginLeft: '10px', width: '100%' }}
                          className='underline'
                        ></div>
                        </div>
                        </div>
                ))}
                </div>
            )}
        </div>
  )
}

export default MyQueries
