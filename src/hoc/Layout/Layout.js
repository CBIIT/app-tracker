import { useLocation } from 'react-router-dom';

import './Layout.css';
import { routeTitles } from './RouteTitles';
import { EDIT_VACANCY, EDIT_DRAFT } from '../../constants/Routes';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar.js';
import Footer from '../../components/Footer/Footer';

const layout = (props) => {
	const location = useLocation();

	const getRouteTitle = () => {
		const title = routeTitles[location.pathname];
		return title ? title : getRouteTitleWithParams();
	};

	const getRouteTitleWithParams = () => {
		if (location.pathname.includes(EDIT_DRAFT)) return 'Edit Draft Vacancy';
		else if (location.pathname.includes(EDIT_VACANCY)) return 'Edit Vacancy';
	};

	return (
		<>
			<Header />
			<NavBar />
			<div className='OuterContainer'>
				<div className='ContentContainer'>
					<div
						className='HeaderTitle'
						style={getRouteTitle() ? null : { display: 'none' }}
					>
						<h1>{getRouteTitle()}</h1>
					</div>
					<div className='RouteContent'>{props.children}</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default layout;
