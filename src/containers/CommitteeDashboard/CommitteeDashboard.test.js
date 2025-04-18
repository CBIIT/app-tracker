import CommitteeDashboard from './CommitteeDashboard';
import { rtRender } from '../test-utils';


// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('CommitteeDashboard component tests' , () => {

    afterEach(() => {
		jest.clearAllMocks();
	});

    test('<CommitteeDashboard /> crash test', async () => {       
        rtRender(<CommitteeDashboard  />)
    });

    test('<CommitteeDashboard /> crash test when currentTenant changes', async () => {    
        jest.mock('../../hooks/useAuth', () => jest.fn().mockImplementation(() => {
            return {
                auth: {
                    iTrustGlideSsoId: 'testSsoId',
                        iTrustUrl: 'https://test.itrust.com',
                        isUserLoggedIn: false,
                        user: { firstName: 'John', lastInitial: 'D' },
                        oktaLoginAndRedirectUrl: 'https://test.okta.com',
                        currentTenant: 'tenant 1',
                },
            };
        }));

        rtRender(<CommitteeDashboard  />)
    });
});