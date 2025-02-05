import { render } from '@testing-library/react';
import Apply from './Apply';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import checkAuth from '../../constants/checkAuth';
import { useParams, MemoryRouter } from 'react-router-dom';
import { mockUseAuth } from './SubmitModal/SubmitModalMockData';
import { convertDataFromBackend } from '../Profile/Util/ConvertDataFromBackend';
import { 
    mockDefaultFormData,
    mockProfileData, 
    mockVacancyResponse, 
    mockProfileResponse 
} from '../Profile/Util/ConvertDataFromBackendMockData';

jest.mock('../../hooks/useAuth');
jest.mock('../../constants/checkAuth');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));
jest.mock('../Profile/Util/ConvertDataFromBackend');


describe('Apply component', () => {

    beforeEach(() => {
        const mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should render new application form', async () => {
        useParams.mockReturnValue({ id: '' });

        axios.get.mockImplementationOnce(() => Promise.resolve(mockProfileData));
        axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });
        axios.get.mockResolvedValueOnce(mockProfileResponse);

        axios.get.mockImplementationOnce(() => Promise.resolve(mockVacancyResponse));
        axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });
        axios.get.mockResolvedValueOnce(mockVacancyResponse);

        convertDataFromBackend.mockReturnValue(mockProfileData);

        render(
            <MemoryRouter initialEntries={['/apply']}>
                <Apply
                    initialValues={mockDefaultFormData}
                />
            </MemoryRouter>
        );

    });

});