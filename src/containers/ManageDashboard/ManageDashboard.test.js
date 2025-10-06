import ManageDashboard from './ManageDashboard';
import useAuth from '../../hooks/useAuth';
import * as transformJsonFromBackend from './Util/TransformJsonFromBackend';
import { render, waitFor, screen } from '@testing-library/react';
import { useParams, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { 
    mockStadtmanAuth,
    mockStadtmanVacancy, 
    mockStadtmanVacancyTransformed 
} from './ManageDashboardMockData';

jest.mock('axios');
jest.mock('../../constants/checkAuth');
jest.mock('../../hooks/useAuth');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
    Link: jest.fn(),
    useLocation: jest.fn().mockImplementation(() => {
		return {
			pathname: '/manage/application/',
		}
	})
}));
jest.mock('./Util/TransformJsonFromBackend');

describe('ManageDashboard component', () => {
    beforeEach(() => {
        document.getSelection = jest.fn(() => null);
    });

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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

    test ('Should render ManageDashboard component', async () => {
        useParams.mockReturnValue({ sysId: '123', tab: 'details' });
        useAuth.mockReturnValue(mockStadtmanAuth);

        axios.get.mockResolvedValueOnce(mockStadtmanVacancy);
        transformJsonFromBackend.transformJsonFromBackend.mockReturnValue(mockStadtmanVacancyTransformed);

        await waitFor(() => {
            render(
                <MemoryRouter initialEntries={['/manage/application']}>
                    <ManageDashboard />
                </MemoryRouter>
            );
        });
        
    });

});