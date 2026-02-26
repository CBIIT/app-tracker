import { APPLY } from "../../constants/Routes";

export const LogLevel = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

export const ComponentName = {
    VIEW_VACANCY_DETAILS: 'ViewVacancyDetails',
    SSJ_HOME_PAGE: 'SSJHomePage',
    APPLY: 'Apply',
    APPLICATION_REFERENCES: 'Apply.ApplicationReferences',
    REVIEW: 'Apply.Review',
    SUBMIT_MODAL: 'Apply.SubmitModal',
    SUBMIT_NEW_APP: 'Apply.SubmitNewApp',
};

export const SENSITIVE_FIELDS = [
    'password',
    'token',
    'apiKey',
    'secret',
    'authorization',
    'creditCard',
    'ssn',
    'pin',
    'privateKey',
    'accessToken',
    'refreshToken',
    'bearerToken',
];

export default {
    LogLevel,
    SENSITIVE_FIELDS,
    ApplicationName: ComponentName,
};
