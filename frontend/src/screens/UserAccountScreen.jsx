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

const UserAccountScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { id } = useParams();
  const userLogin = useSelector((state) => state.user.userLogin);
  const { userInformation: userInfo } = userLogin;

  const userDetails = useSelector((state) => state.user.userDetails);
  const { loading, error, user } = userDetails;

  const updateProfile = useSelector((state) => state.user.updateProfile);
  const { loading: loadingUpdate, error: errorUpdate, success } = updateProfile;

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
      <span className='head'>Your Account</span>
      {success && <Message message='Updated' color='green' />}
      <form onSubmit={submitHandler}>
        <div className='user-form'>
          <span>UserID</span>
          <span>{user._id}</span>
        </div>
        <div className='user-form'>
          <span>Account Created</span>
          <span>{user.createdAt?.substring(0, 10)}</span>
        </div>
        <div className='user-form'>
          <span>Username</span>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='user-form'>
          <span>Email</span>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='user-form'>
          <span>Password</span>
          <input
            type='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className='userUpdate' type='submit'>
          Update Info
        </button>
      </form>
    </div>
  );
};

export default UserAccountScreen;
