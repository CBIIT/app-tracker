import React from 'react';
import { useLocation } from 'react-router-dom';

import './Layout.css';
import { routeTitles } from './RouteTitles';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar.js';
import Footer from '../../components/Footer/Footer';

const layout = (props) => {
	const location = useLocation();

	return (
		<>
			<Header />
			<NavBar />
			<div className='OuterContainer'>
				<div className='ContentContainer'>
					<div
						className='HeaderTitle'
						style={routeTitles[location.pathname] ? null : { display: 'none' }}
					>
						<h1>{routeTitles[location.pathname]}</h1>
					</div>
					<div className='RouteContent'>{props.children}</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default layout;
