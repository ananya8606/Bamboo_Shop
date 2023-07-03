
import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import './footer.css';
import { footer } from "../Utils/translateLibrary/footer";
const Footer = () => {
const settings = useSelector((state) => state.settings);
  const { language } = settings;
	return (
		<Container>
			<footer className='footer-container'>
				<div className='footer-icons'>
					<a
						href='https://github.com/ananya8606'
						aria-label='github account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-github footer-icon' />
					</a>
					<a
						href='https://www.linkedin.com/in/ananyaiiitr/'
						aria-label='linkedin account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-linkedin-in footer-icon' />
					</a>
					<a
						href='https://twitter.com/AnanyaG33442335'
						aria-label='twitter account'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fab fa-twitter footer-icon' />
					</a>
					<a
						href='mailto:ananyaiiitr@gmail.com'
						aria-label='developer portfolio'
						target='_blank'
						rel='noopener noreferrer'>
						<i className='fas fa-envelope footer-icon' />
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
