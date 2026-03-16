import { useLocation } from 'react-router-dom';

import { routeTitles } from '../RouteTitles';
import {
	EDIT_VACANCY,
	EDIT_DRAFT,
	VACANCY_DASHBOARD,
} from '../../../constants/Routes';
const contentTitle = () => {
	const location = useLocation();

	const getRouteTitle = () => {
		const title = routeTitles[location.pathname];
		return title ? title : getRouteTitleWithParams();
	};

	const getRouteTitleWithParams = () => {
		if (location.pathname.includes(EDIT_DRAFT)) return 'Edit Draft Vacancy';
		else if (location.pathname.includes(EDIT_VACANCY)) return 'Edit Vacancy';
		else if (location.pathname.includes(VACANCY_DASHBOARD))
			return 'Vacancy Dashboard';
	};

	return (
		<div
			className='HeaderTitle'
			style={getRouteTitle() ? null : { display: 'none' }}
		>
			<h1>{getRouteTitle()}</h1>
		</div>
	);
};

export default contentTitle;
