import { createContext } from 'react';
const defaultFormData = {
	applicant: {},
	references: [],
	documents: {},
	questions: {},
};

const FormContext = createContext({
	currentFormInstance: null,
	setCurrentFormInstance: () => {},
});

export { defaultFormData };

export default FormContext;
