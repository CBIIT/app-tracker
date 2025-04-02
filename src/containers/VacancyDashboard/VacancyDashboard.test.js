import VacancyDashboard from './VacancyDashboard';
import { rtRender } from '../test-utils';
import axios from 'axios';

const mockCountTile = jest.fn();
jest.mock('./CountTile/CountTile', () => (props) => {
    mockCountTile(props);
    return <mock-CountTile />
});


jest.mock('axios', () => {
    return {
      CancelToken: {
        source: jest.fn(() => ({
          token: 'mockCancelToken',
          cancel: jest.fn(),
        })),
      },
      get: jest.fn(),
    };
});

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

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('VacancyDashboard component tests' , () => {

    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({data: {} }));
    });

    afterEach(() => {
		jest.clearAllMocks();
	});

    test('<VacancyDashboard /> crash test', async () => {       
        rtRender(<VacancyDashboard  />)
    });
});