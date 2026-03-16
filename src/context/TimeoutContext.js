import { createContext, useState } from 'react';

const TimeoutContext = createContext({});

export const TimeoutProvider = ({ children }) => {
	const [modalTimeout, setModalTimeout] = useState({});

	return (
		<TimeoutContext.Provider value={{ modalTimeout, setModalTimeout }}>
			{children}
		</TimeoutContext.Provider>
	);
};

export default TimeoutContext;
