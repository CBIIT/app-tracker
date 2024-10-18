import React from 'react';

import Logo from './Logo/Logo';
import Login from './Login/Login';
// import NavigationItems from './NavigationItems/NavigationItems';

import './Header.css';

const header = () => (
	<header className='Header'>
		<div className='Content HeaderContent'>
			{/* <Logo /> */}
			{/* <Login />	 */}
			<Logo data-testid="logo" />
			<Login data-testid="login" />
		</div>
	</header>
);

export default header;
