import React, { useState, useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register,userLoginClear } from '../reducers/userReducers';
import Message from '../components/Message';
import Loading from '../components/Loading';
import 'firebase/auth'
import firebase from 'firebase/app';
import { l } from '../Utils/translateLibrary/login';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const redirect = location.search && location.search.split('=')[1];
  const userLogin = useSelector((state) => state.user.userLogin);
  const { loading, error, userInformation } = userLogin;

  const history = useNavigate();
  useEffect(() => {
    if (error) {
      dispatch(userLoginClear());
    }
    if (userInformation && (redirect || window.history.length <= 2)) {
      history(redirect || '/');
    } else if (userInformation) {
      window.history.back();
    }
  }, [dispatch, history, userInformation, error, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({email:email, password:password}));
  };

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID,
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var provider = new firebase.auth.GoogleAuthProvider();

  const signInGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        let credential = result.credential;
        let token = credential.accessToken;
        const user = result.user;
        dispatch(register({name:user.displayName,email: user.email,  password:'jpt', funcNumber:'googlesignin'}));
      })
       .then(() => {
          dispatch(login({ email: user.email, password: user.email + 'googlesignin' }));
        })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
        console.log(error);
      });
  };

  return (
    <div className='form-outer'>
      <div className='form-outermost'>
        <span>{l.si[language]}</span>
        {loading && <Loading />}
        {error && <Message message={error} color='red' />}
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={l.eye[language]}
            />
          </div>
          <div className='form-control'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={l.eyp[language]}
            />
          </div>
          <button type='submit'>{l.si[language]}</button>
        </form>
        <span>{l.ol[language]}</span>
        <button className='google-btn' onClick={signInGoogle}>
        <img src='Images/google1.jpg' alt='' />
          <span className='g-text'>{l.google[language]}</span>
        </button>
        <span>{l.nr[language]}</span>
        <Link to={`/register`}>{l.rg[language]}</Link>
      </div>
    </div>
  );
};

export default Login;
