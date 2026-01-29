

import { LogLevel, SENSITIVE_FIELDS } from './logConstants';

const sanitizeData = (data) => {
    if (!data) return data;
    if (typeof data === 'object') {
        const sanitized = Array.isArray(data) ? [...data] : { ...data };
        const cleanObjectTree = (obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const lowerKey = key.toLowerCase();
                    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
                        obj[key] = '[XXXXXX]';
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        cleanObjectTree(obj[key]);
                    }
                }
            }
        };

        cleanObjectTree(sanitized);
        return sanitized;
    }
    return data;
};

const formatLog = (level, message, data, userInfo, isLoggedIn, component, route, traceId) => {
    const timestamp = new Date().toISOString();
    const nodeEnv = process.env.NODE_ENV || 'unknown';

    const timeStr = `[Time: ${timestamp}] | `;
    const levelStr = `[Level: ${level}] | `;
    const envStr = `[Env: ${nodeEnv}] | `;
    const userStr = userInfo ? `[User: ${userInfo}] | ` : '';
    const loggedInStr = `[UserLoggedIn: ${isLoggedIn ? 'true' : 'false'}] | `;
    const appStr = component ? `[Component: ${component}] | ` : '';
    const traceStr = traceId ? `[TraceId: ${traceId}] | ` : '';
    const messageStr = ` MESSAGE: ${message} | `;
    const sanitizedData = sanitizeData(data);
    const dataStr = sanitizedData ? `DATA: ${JSON.stringify(sanitizedData)} | ` : '';
    const routeStr = route ? ` [Route: ${route}] | ` : '';

    return `${timeStr}${levelStr}${envStr}${userStr}${loggedInStr}${appStr}${traceStr}${messageStr}${dataStr}${routeStr}`;
};

export const logInfo = (message, data, component, auth, route, traceId) => {
    const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
    const isLoggedIn = auth?.auth?.isUserLoggedIn;
    const formattedMessage = formatLog(LogLevel.INFO, message, data, userInfo, isLoggedIn, component, route, traceId);
    console.log(formattedMessage);
};

export const logWarn = (message, data, component, auth, route, traceId) => {
    const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
    const isLoggedIn = auth?.auth?.isUserLoggedIn;
    const formattedMessage = formatLog(LogLevel.WARN, message, data, userInfo, isLoggedIn, component, route, traceId);
    console.warn(formattedMessage);
};


export const logError = (message, error, component, auth, route, traceId) => {
    const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
    const isLoggedIn = auth?.auth?.isUserLoggedIn;
    const formattedMessage = formatLog(LogLevel.ERROR, message, error, userInfo, isLoggedIn, application, route, traceId);
    console.error(formattedMessage);
};


export const logDebug = (message, data, component, auth, route, traceId) => {
    if (process.env.NODE_ENV === 'development') {
        const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
        const isLoggedIn = auth?.auth?.isUserLoggedIn;
        const formattedMessage = formatLog(LogLevel.DEBUG, message, data, userInfo, isLoggedIn, component, route, traceId);
        console.debug(formattedMessage);
    }
};

export default {
    logInfo,
    logWarn,
    logError,
    logDebug,
};
