import ApplicantDashboard from './ApplicantDashboard';
import { render } from '@testing-library/react';
import { Link, useHistory } from 'react-router-dom';
import { 
    GET_USER_APPLICATIONS, 
    REMOVE_USER_APPLICATION_DRAFT, 
    WITHDRAW_USER_APPLICATION 
} from '../../constants/ApiEndpoints';
import { 
    EDIT_APPLICATION, 
    VIEW_APPLICATION 
} from '../../constants/Routes';
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { checkAuth } from '../../constants/checkAuth';
import { MemoryRouter } from 'react-router-dom/cjs/react-router-dom.min';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));
jest.mock('axios');


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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render ApplicantDashboard with no applications', () => {
        render(
            <MemoryRouter initialEntries={['/applicant-dashboard/']}>
                <ApplicantDashboard />
            </MemoryRouter>
        )
    })
});