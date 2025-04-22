import { createContext, useState, useRef } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const previousTenant = useRef('');
	const [currentTenant, setCurrentTenant] = useState();
	const [step, setStep] = useState();

	return (
		<AuthContext.Provider value={{ auth, setAuth, currentTenant, setCurrentTenant, previousTenant, step, setStep }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
