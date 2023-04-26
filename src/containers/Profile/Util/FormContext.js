import { createContext } from 'react';
const initialData = {
	basicInfo: {
		phonePrefix: '+1',
		businessPhonePrefix: '+1',
        address: {},
	},
	references: [],
	applicantDocuments: [],
	demographics: {},
};

const ProfileContext = createContext({
	currentProfileInstance: null,
	setCurrentProfileInstance: () => {},
});

export { initialData };

export default ProfileContext;
