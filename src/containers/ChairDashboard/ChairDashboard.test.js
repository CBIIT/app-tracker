import ChairDashboard from './ChairDashboard';
import { message } from 'antd';
import { rtRender } from '../test-utils';

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    }
}));

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('ChairDashboard component tests' , () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('<ChairDashboard /> crash test', async () => {       
        rtRender(<ChairDashboard  />)
    });

    test('<ChairDashboard /> crash test when currentTenant changes', async () => {    
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

        rtRender(<ChairDashboard  />)
    });

});