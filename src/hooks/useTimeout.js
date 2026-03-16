import { useContext } from 'react';
import TimeoutContext from '../context/TimeoutContext';

const useTimeout = () => {
	return useContext(TimeoutContext);
};

export default useTimeout;