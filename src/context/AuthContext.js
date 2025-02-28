import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const [currentTenant, setCurrentTenant] = useState();

	return (
		<AuthContext.Provider value={{ auth, setAuth, currentTenant, setCurrentTenant }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
