export const validateVacancyData = (data) => {
	return {
		basic_info: data?.basic_info || {},
		vacancy_documents: Array.isArray(data?.vacancy_documents)
			? data.vacancy_documents
			: [],
	};
};
