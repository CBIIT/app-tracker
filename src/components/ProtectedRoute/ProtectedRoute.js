import { useLocation, Navigate, Route } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRouteElement = ({ Component, useOktaAuth, ...rest }) => {
	const routeLocation = useLocation();
	const redirectAfterLoginUrl = encodeURIComponent(
		'/nci-scss.do#' + routeLocation.pathname
	);
	const {
		auth: { isUserLoggedIn, iTrustGlideSsoId, oktaGlideSsoId },
	} = useAuth();

	if (!isUserLoggedIn) {
		let pushUrl = '/nav_to.do?uri=' + redirectAfterLoginUrl + '&glide_sso_id=';

		useOktaAuth
			? (pushUrl = pushUrl.concat(oktaGlideSsoId))
			: (pushUrl = pushUrl.concat(iTrustGlideSsoId));

		location.href = pushUrl;
	}

	return isUserLoggedIn ? <Component {...rest} /> : <Navigate to='/' />;
};

const ProtectedRoute = ({ component: Component, path, useOktaAuth, exact, ...rest }) => {
	return (
		<Route
			path={path}
			element={<ProtectedRouteElement Component={Component} useOktaAuth={useOktaAuth} {...rest} />}
		/>
	);
};

export default ProtectedRoute;
