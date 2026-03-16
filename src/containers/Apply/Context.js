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
};

const FormContext = createContext({
	currentFormInstance: null,
	setCurrentFormInstance: () => {},
});

export { defaultFormData };

export default FormContext;
