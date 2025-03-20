import { createContext, useState, useRef } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const previousTenant = useRef('');
	const [currentTenant, setCurrentTenant] = useState();

	return (
		<AuthContext.Provider value={{ auth, setAuth, currentTenant, setCurrentTenant, previousTenant }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
