import { createContext } from 'react';
const defaulfFormData = {
	applicant: {},
	references: [],
	documents: {},
	questions: {},
};

const FormContext = createContext({
	currentFormInstance: null,
	setCurrentFormInstance: () => {},
});

export { defaulfFormData };

export default FormContext;
