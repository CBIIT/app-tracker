import { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';

const protectedRoute = ({
	component: Component,
	isUserLoggedIn,
	iTrustGlideSsoId,
	oktaGlideSsoId,
	useOktaAuth,
	...rest
}) => {
	const routeLocation = useLocation();
	const redirectAfterLoginUrl = encodeURIComponent(
		'/nci-scss.do#' + routeLocation.pathname
	);

	useEffect(() => {
		if (!isUserLoggedIn) {
			let pushUrl =
				'/nav_to.do?uri=' + redirectAfterLoginUrl + '&glide_sso_id=';

			useOktaAuth
				? (pushUrl = pushUrl.concat(oktaGlideSsoId))
				: (pushUrl = pushUrl.concat(iTrustGlideSsoId));

			location.href = pushUrl;
		}
	}, []);

	return isUserLoggedIn ? (
		<Route {...rest} render={(props) => <Component {...rest} {...props} />} />
	) : (
		<> </>
	);
};

export default protectedRoute;
