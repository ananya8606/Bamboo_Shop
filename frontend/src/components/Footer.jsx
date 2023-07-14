import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch,useSelector} from 'react-redux';
import './footer.css';
import { footer } from "../Utils/translateLibrary/footer";
import { fetchSettings } from "../reducers/settingsReducers";

const Footer = () => {
const settings = useSelector((state) => state.settings);
const { language } = settings;
 const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchSettings());
}, [dispatch]);
	return (
		<Container>
			<footer className='footer-container'>
			     <p style={{fontWeight:'bold'}}>
				Follow us on
			    </p>
				<div className='footer-icons'>
					<a
						href='https://facebook.com/'
						aria-label='github account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-facebook footer-icon' />
					</a>
					<a
						href='https://www.instagram.com/'
						aria-label='linkedin account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-instagram footer-icon' />
					</a>
					<a
						href='https://twitter.com/'
						aria-label='twitter account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-twitter footer-icon' />
					</a>
					<a
						href='https://www.youtube.com/'
						aria-label='developer portfolio'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-youtube footer-icon' />
					</a>
				</div>
      <footer className="bg-dark text-center navbar-dark text-lg-start">
  <div className="text-center text-white p-3">
				<div className='footer-copyright'>
        {footer.copyright[language]}
        <a className="text-white p-3" href="https://mdbootstrap.com/">{footer.ecomm[language]}</a>
        </div>
      </div>
    </footer>
			</footer>
		</Container>
	);
};

export default Footer;
