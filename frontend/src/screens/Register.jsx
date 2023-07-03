import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, userRegisterClear } from '../reducers/userReducers';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import { r } from "../Utils/translateLibrary/register";

const Register = () => {
  const settings = useSelector((state) => state.settings);
    const { language } = settings;
    const [message, setMessage] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordagain, setPasswordagain] = useState('')
    const [username, setUsername] = useState('')
    const handleSubmit = (e) => {
      e.preventDefault()
      setMessage(null)
      if (password !== passwordagain) {
        setMessage('Passwords do not match')
      } else {
        dispatch(register({name:username,email:email,password:password,funcNumber:'formfillup'}))
      }
    }
    const dispatch = useDispatch()
    const userRegister = useSelector((state) => state.user.userRegister)
    const { loading, error, userInformation } = userRegister
    const userLogin = useSelector((state) => state.user.userLogin)
    const { userInformation: userInfo } = userLogin
    const location=useLocation();
    const redirect = location.search && location.search.split('=')[1]
   const history=useNavigate();
    useEffect(() => {
      if (error) {
        dispatch(userRegisterClear())
      }
      userInformation && redirect
        ? history(redirect)
        : userInformation && window.history.back()
    }, [history, userInformation])
  
    return (
      <div className='form-outer'>
        <div className='form-outermost'>
          <span>{r.signup[language]}</span>
          {loading && <Loading />}
          {message && <Message message={message} color='red' />}
          {error && <Message message={error} color='red' />}
  
          <form onSubmit={handleSubmit}>
            <div className='form-control'>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={r.eyn[language]}
              />
            </div>
            <div className='form-control'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={r.eye[language]}
              />
            </div>
  
            <div className='form-control'>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={r.eyp[language]}
              />
            </div>
            <div className='form-control'>
              <input
                type='password'
                value={passwordagain}
                onChange={(e) => setPasswordagain(e.target.value)}
                placeholder={r.eypa[language]}
              />
            </div>
            <button type='submit'>{r.su[language]}</button>
          </form>
          <span>{r.ahaa[language]}</span>
          <Link to={`/login?redirect=${redirect}`}>{r.login[language]}</Link>
        </div>
      </div>
    )
  }
  
  export default Register
  