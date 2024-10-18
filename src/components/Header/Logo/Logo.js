import React from 'react';

import './Logo.css';
import nihLogo from '../../../assets/images/nih-logo.png';

const logo = () => (
	<div className='Logo' data-testid='logo'>
		<a href='https://www.nih.gov'>
			<img src={nihLogo} alt='NIH' />
		</a>
	</div>
);

export default logo;
