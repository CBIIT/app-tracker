import ManageDashboard from './ManageDashboard';
import useAuth from '../../hooks/useAuth';
import * as transformJsonFromBackend from './Util/TransformJsonFromBackend';
import { render, waitFor, screen } from '@testing-library/react';
import { rtRender } from '../test-utils';
import { useParams, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { 
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
        useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				user: {
					isManager: true,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [
					{
						value: 'f24965fc1b9c11106daea681f54bcb04',
						label: 'tenant 1',
						roles: [
							'x_g_nci_app_tracke.vacancy_manager',
						],
						is_exec_sec: true,
						is_read_only_user: false,
						is_chair: true,
						is_hr: false,
						properties: [
                            {
								name: 'enableFocusArea',
								value: 'true',

							},
							{
								name: 'enableTop25Percent',
								value: 'true',
							},
                            {
                                name: 'enableEmailbutton',
                                value: 'true',
                            },
                        ],
					},
				],
			},
			currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
		});

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