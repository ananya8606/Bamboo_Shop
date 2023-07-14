import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { listUsers, deleteUser } from '../reducers/userReducers';
import { au } from '../Utils/translateLibrary/adminusers';
import { useNavigate } from 'react-router-dom';
import { fetchSettings } from "../reducers/settingsReducers";

const AdminUsers = () => {
  const settings = useSelector((state) => state.settings);
    const { language, currency } = settings;
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin
  const userList = useSelector((state) => state.user.userList)
  const { loading, users, error } = userList
  const userDelete = useSelector((state) => state.user.userDelete)
  const {
    laoding: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = userDelete
  const history = useNavigate();
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  
  useEffect(() => {
    !userInfo && history('/')
    dispatch(listUsers())
  }, [userInfo, history, successDelete])
  const DeleteHandler = (id) => {
    dispatch(deleteUser({id:id}))
  }
  return (
    <div className='adminOrdersouter'>
      {errorDelete && <Message message={errorDelete} color='black' />}
      {loading || loadingDelete ? (
        <Loading />
      ) : (
        <div className='adminOrder-inner'>
          {users && users.length > 0 ? (
            <table>
              <tr>
                <th>{au.ui[language]}</th>
                <th>{au.ac[language]}</th>
                <th>{au.un[language]}</th>

                <th>{au.e[language]}</th>

                <th>{au.d[language]}</th>
              </tr>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.createdAt?.substring(0, 10)}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                    onClick={() => DeleteHandler(user._id)}
                  >
                    <i class='fas fa-trash'></i>{' '}
                  </td>
                </tr>
              ))}
            </table>
          ) : (
            <Message message={error} color='red' />
          )}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
