import { useEffect } from 'react';
import { Route } from 'react-router-dom';

const protectedRoute = ({
	component: Component,
	isUserLoggedIn,
	iTrustGlideSsoId,
	...rest
}) => {
	const redirectAfterLoginUrl = encodeURIComponent(window.location.href);

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
