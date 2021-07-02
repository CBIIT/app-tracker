import { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';

const protectedRoute = ({
	component: Component,
	isUserLoggedIn,
	iTrustGlideSsoId,
	...rest
}) => {
	const routeLocation = useLocation();
	const redirectAfterLoginUrl = encodeURIComponent(
		'/nci-scss.do#' + routeLocation.pathname
	);

	useEffect(() => {
		const pushUrl =
			'/nav_to.do?uri=' +
			redirectAfterLoginUrl +
			'&glide_sso_id=' +
			iTrustGlideSsoId;

		if (!isUserLoggedIn) location.href = pushUrl;
	}, []);

	return isUserLoggedIn ? (
		<Route {...rest} render={(props) => <Component {...rest} {...props} />} />
	) : (
		<> </>
	);
};

export default protectedRoute;
