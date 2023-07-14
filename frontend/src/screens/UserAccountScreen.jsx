import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loading from '../components/Loading';
import { useParams,useNavigate} from 'react-router-dom';
import {
  userUpdateProfileReset,
  userDetailsReset,
  getUserDetails,
  updateUserProfile,
} from '../reducers/userReducers';
import { uas } from '../Utils/translateLibrary/useraccount';
import { fetchSettings } from "../reducers/settingsReducers";

const UserAccountScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { id } = useParams();
  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const userDetails = useSelector((state) => state.user.userDetails);
  const { loading, error, user } = userDetails;

  const updateProfile = useSelector((state) => state.user.updateProfile);
  const { loading: loadingUpdate, error: errorUpdate, success } = updateProfile;
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  const submitHandler = (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      password
    };
    dispatch(updateUserProfile(user));
  }
  const history=useNavigate();
  useEffect(() => {
    if (!userInfo) {
      history('/');
    }

    if (success) {
      dispatch(userDetailsReset());
      dispatch(userUpdateProfileReset());
      history('/');
    }
    if (!user.name || id !== user._id) {
      dispatch(getUserDetails(id));
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [userInfo, history,id, user, success]);

  return (
    <div className='userScreen'>
      <span className='head'>{uas.ya[language]}</span>
      {success && <Message message='Updated' color='green' />}
      <form onSubmit={submitHandler}>
        <div className='user-form'>
          <span>{uas.us[language]}</span>
          <span>{user._id}</span>
        </div>
        <div className='user-form'>
          <span>{uas.ac[language]}</span>
          <span>{user.createdAt?.substring(0, 10)}</span>
        </div>
        <div className='user-form'>
          <span>{uas.u[language]}</span>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='user-form'>
          <span>{uas.e[language]}</span>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='user-form'>
          <span>{uas.p[language]}</span>
          <input
            type='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className='userUpdate' type='submit'>
          {uas.ui[language]}
        </button>
      </form>
    </div>
  );
};

export default UserAccountScreen;
