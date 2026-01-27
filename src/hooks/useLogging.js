import useAuth from './useAuth';
import { useLocation } from 'react-router-dom';
import { logInfo, logWarn, logError, logDebug } from '../utils/logging/logging';

/**
 * Generates a unique trace ID for session tracking
 * @returns {string} Unique trace ID
 */
const generateTraceId = () => {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Gets or creates a trace ID for the current session
 * @returns {string} Trace ID
 */
const getSessionTraceId = () => {
	let traceId = sessionStorage.getItem('sessionTraceId');
	if (!traceId) {
		traceId = generateTraceId();
		sessionStorage.setItem('sessionTraceId', traceId);
	}
	return traceId;
};

export const useLogging = () => {
	const auth = useAuth();
	const location = useLocation();
	const route = location.pathname;
	const traceId = getSessionTraceId();

	return {

		logInfo: (message, data, application) =>
			logInfo(message, data, application, auth, route, traceId),


		logWarn: (message, data, application) =>
			logWarn(message, data, application, auth, route, traceId),


		logError: (message, error, application) =>
			logError(message, error, application, auth, route, traceId),


		logDebug: (message, data, application) =>
			logDebug(message, data, application, auth, route, traceId),
	};
};

export default useLogging;
