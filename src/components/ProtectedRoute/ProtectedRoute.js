import { Route, Redirect } from 'react-router-dom';

const protectedRoute = ({ component: Component, isUserLoggedIn, ...rest }) => {
	isUserLoggedIn ? (
		<Route {...rest} render={(props) => <Component {...rest} {...props} />} />
	) : (
		<Redirect />
	);
};

export default protectedRoute;
