import ApplicantDashboard from './ApplicantDashboard';
import { render, screen } from '@testing-library/react';
import { useHistory, useLocation, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import { 
    GET_USER_APPLICATIONS, 
    REMOVE_USER_APPLICATION_DRAFT, 
    WITHDRAW_USER_APPLICATION 
} from '../../constants/ApiEndpoints';
import { 
    APPLICANT_DASHBOARD,
    EDIT_APPLICATION, 
    VIEW_APPLICATION 
} from '../../constants/Routes';
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { checkAuth } from '../../constants/checkAuth';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
    useLocation: jest.fn(),
}));
jest.mock('axios');
jest.mock('../../hooks/useAuth')


describe('ApplicantDashboard', () => {
    let mockUseAuth;
    let mockHistoryPush;

    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // deprecated
				removeListener: jest.fn(), // deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn(),
        }
        useAuth.mockReturnValue({
            auth: { isUserLoggedIn: true, iTrustGlideSsoId: 'itrust123', oktaGlideSsoId: 'okta123' },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render ApplicantDashboard with no applications', () => {
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <ProtectedRoute 
                    key='applicant-dashboard'
                    path={APPLICANT_DASHBOARD}
                    component={ApplicantDashboard}
                    useOktaAuth={true}
                />
            </MemoryRouter>
        );
    })
});