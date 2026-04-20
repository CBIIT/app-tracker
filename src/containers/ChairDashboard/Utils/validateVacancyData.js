export const validateVacancyData = (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid vacancy data: payload must be an object');
    }

    if (!Array.isArray(data.list)) {
        throw new Error('Invalid vacancy data: list must be an array');
    }

    return {
        list: data.list
    };
};