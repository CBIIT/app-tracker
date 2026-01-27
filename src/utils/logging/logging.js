

const LogLevel = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

const sensitiveFields = [
    'password',
    // 'username',
];


const sanitizeData = (data) => {
    if (!data) return data;
    if (typeof data === 'object') {
        const sanitized = Array.isArray(data) ? [...data] : { ...data };
        const cleanObjectTree = (obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const lowerKey = key.toLowerCase();
                    if (sensitiveFields.some(field => lowerKey.includes(field))) {
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

const formatLog = (level, message, data, userInfo, isLoggedIn, application, route, traceId) => {
    const timestamp = new Date().toISOString();
    const nodeEnv = process.env.NODE_ENV || 'unknown';
    const userStr = userInfo ? ` [User: ${userInfo}]` : '';
    const loggedInStr = ` [UserLoggedIn: ${isLoggedIn ? 'true' : 'false'}]`;
    const appStr = application ? ` [Application: ${application}]` : '';
    const traceStr = traceId ? ` [TraceId: ${traceId}]` : '';
    const sanitizedData = sanitizeData(data);
    const dataStr = sanitizedData ? ` | DATA: ${JSON.stringify(sanitizedData)}` : '';
    const routeStr = route ? ` [Route: ${route}]` : '';
    return `[Time: ${timestamp}] [Level: ${level}] [Env: ${nodeEnv}]${userStr}${loggedInStr}${appStr}${traceStr} MESSAGE: ${message}${dataStr}${routeStr}`;
};

export const logInfo = (message, data, application, auth, route, traceId) => {
    const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
    const isLoggedIn = auth?.auth?.isUserLoggedIn;
    const formattedMessage = formatLog(LogLevel.INFO, message, data, userInfo, isLoggedIn, application, route, traceId);
    console.log(formattedMessage);
};

export const logWarn = (message, data, application, auth, route, traceId) => {
    const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
    const isLoggedIn = auth?.auth?.isUserLoggedIn;
    const formattedMessage = formatLog(LogLevel.WARN, message, data, userInfo, isLoggedIn, application, route, traceId);
    console.warn(formattedMessage);
};


export const logError = (message, error, application, auth, route, traceId) => {
    const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
    const isLoggedIn = auth?.auth?.isUserLoggedIn;
    const formattedMessage = formatLog(LogLevel.ERROR, message, error, userInfo, isLoggedIn, application, route, traceId);
    console.error(formattedMessage);
};


export const logDebug = (message, data, application, auth, route, traceId) => {
    if (process.env.NODE_ENV === 'development') {
        const userInfo = auth?.auth?.user?.email
        || auth?.auth?.user?.uid
        || auth?.auth?.user?.userId;
        const isLoggedIn = auth?.auth?.isUserLoggedIn;
        const formattedMessage = formatLog(LogLevel.DEBUG, message, data, userInfo, isLoggedIn, application, route, traceId);
        console.debug(formattedMessage);
    }
};

export default {
    logInfo,
    logWarn,
    logError,
    logDebug,
};
