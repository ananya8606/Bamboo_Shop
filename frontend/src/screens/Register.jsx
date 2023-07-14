import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, userRegisterClear } from '../reducers/userReducers';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { Link} from 'react-router-dom';
import { r } from "../Utils/translateLibrary/register";
import { fetchSettings } from "../reducers/settingsReducers";

const Register = () => {
  const settings = useSelector((state) => state.settings);
    const { language } = settings;
    const [message, setMessage] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordagain, setPasswordagain] = useState('')
    const [username, setUsername] = useState('')
  
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  
    const handleSubmit = (e) => {
      e.preventDefault()
      setMessage(null)
      if (password !== passwordagain) {
        setMessage('Passwords do not match')
      } else {
        setMessage('User Registered Successfully!')
        dispatch(register({name:username,email:email,password:password,funcNumber:'formfillup'}))
      }
    }
    const dispatch = useDispatch()
    const userRegister = useSelector((state) => state.user.userRegister)
    const { loading,error } = userRegister
    useEffect(() => {
      if (error) {
        dispatch(userRegisterClear())
      }
    }, [error])
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
          <Link to={`/login`}>{r.login[language]}</Link>
        </div>
      </div>
    )
  }
  
  export default Register
