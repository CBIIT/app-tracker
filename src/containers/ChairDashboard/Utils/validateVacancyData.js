export const validateVacancyData = (data) => {
    return {
        list: Array.isArray(data?.list)
            ? data.list
            : []
    };
};