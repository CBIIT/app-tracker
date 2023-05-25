import { createContext } from 'react';
const defaultFormData = {
	basicInfo: {
		phonePrefix: '+1',
		businessPhonePrefix: '+1'
	},
	focusArea: [],
	address: {},
	references: [],
	applicantDocuments: [],
	questions: {},
};

const FormContext = createContext({
	currentFormInstance: null,
	setCurrentFormInstance: () => {},
});

export { defaultFormData };

export default FormContext;
