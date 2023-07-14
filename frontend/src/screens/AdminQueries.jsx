import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { listQueries,changeQueryStatus } from '../reducers/userReducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { aq } from '../Utils/translateLibrary/adminqueries';
import { fetchSettings } from "../reducers/settingsReducers";

const AdminQueries = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;
  const queryList = useSelector((state) => state.user.queryList);
  const { loading, queries, error } = queryList;
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
      dispatch(listQueries());
    }
  }, [userInfo, history, dispatch]);

  const queryHandler = (id) => {
    dispatch(changeQueryStatus(id));
  };

  return (
    <div className='adminOrdersouter'>
      {loading ? (
        <Loading />
      ) : (
        <div className='adminOrder-inner'>
          {loading && <Loading />}
          {queries && queries.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>{aq.u[language]}</th>
                  <th>{aq.ue[language]}</th>
                  <th>{aq.uq[language]}</th>
                  <th>{aq.us[language]}</th>
                  <th>{aq.ac[language]}</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query._id}>
                    <td>{query.user}</td>
                    <td>{query.email}</td>
                    <td>{query.type}</td>
                    <td>{query.query}</td>
                    <td
                      style={{ textAlign: 'center' }}
                      onClick={() => queryHandler(query._id)}
                    >
                      {query.active ? (
                        <i
                          className='fas fa-check'
                          style={{
                            color: 'green',
                            cursor: 'pointer',
                            fontSize: '20px',
                          }}
                        ></i>
                      ) : (
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{ color: 'red', cursor: 'pointer' }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminQueries;
