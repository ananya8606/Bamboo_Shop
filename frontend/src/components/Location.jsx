import React, { useEffect,useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { createQuery } from '../reducers/userReducers';
import { useDispatch,useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { lo } from '../Utils/translateLibrary/Location';
import { fetchSettings } from "../reducers/settingsReducers";

const LocationPage = () => {
  const latitude = 23.163022685504764; // Replace with the actual latitude
  const longitude = 85.58924617623831; // Replace with the actual longitude
  const userLogin = useSelector((state) => state.user.userLogin)
  const { userInformation: userInfo } = userLogin
  const settings = useSelector((state) => state.settings);
  const { language } = settings;
  const [type,setType] = useState('');
  const [query,setQuery] = useState('');
  const [updated , setUpdated ] = useState(false);
  const history = useNavigate();
  const dispatch = useDispatch();
useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbnlhaWlpdHIiLCJhIjoiY2xndWN3ajY1MjEybzNqbXRleG1pYWNuMCJ9.iNZtJqCNDVsABQubGPVvcA';
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ananyaiiitr/cljy7xapi004v01pe4mwogl9l',
      center: [longitude, latitude],
      zoom: 12,
    });

    const marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);

    marker.setOffset([longitude,-310]);
    return () => map.remove(); // Cleanup map instance on component unmount
  }, [latitude, longitude]);

  
  const handleSubmit = (e) => {
    e.preventDefault();  
    if(userInfo){
    setUpdated(true); 
    dispatch(createQuery({type,query}));
    }
    else{
      history('/login')
    }
  };

  return (
    <>
  <div className='container location-container' style={{marginBottom:'20px'}}>
    <div className="map-container" style={{margin:'15px'}}>
      <h2 style={{color:'limegreen'}}>{lo.lom[language]}</h2>
      <div id="map" style={{height: '300px',margin:'30px' }}></div>
     </div>
    <div className="paytm-payment-gateway query-container" style={{marginTop:'15px'}}>
      <div class="payment-form">
        <h2 style={{color:'limegreen',textAlign:'center',marginBottom:'15px'}}>{lo.s[language]}</h2>
        {updated ? 
        (<div className='message' style={{marginTop:'10%'}} >
        <span style={{ background: 'green' }}>{lo.y[language]}</span>
      </div>)  : null }
        <form onSubmit={handleSubmit}>
          <div class="form-control" style={{margin:'20px'}}>
            <label htmlFor="type">{lo.sq[language]}</label>
            <select  value={type}
          onChange={(e) => setType(e.target.value)}><option>{lo.tq[language]}</option>
            <option>{lo.or[language]}</option></select>
          </div>
          <div className="form-control" style={{margin:'20px'}}>
            <label htmlFor="message">{lo.ty[language]}</label>
            <textarea name="message" id="message" rows="5"  value={query}
          onChange={(e) => setQuery(e.target.value)} placeholder={lo.pw[language]} required></textarea>
          </div>
          <button type="submit" class="payment-form button">
            {lo.su[language]}
          </button>
        </form>
      </div>
      <div style={{bottomTop:'20px',fontSize:'15px'}}>
          <p>{lo.yo[language]} <FontAwesomeIcon icon={faPhone} /> +9134567890</p>
          </div>
    </div>
      </div>
    </>
  );
};

export default LocationPage;
