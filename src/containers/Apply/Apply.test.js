import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Apply from './Apply';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import checkAuth from '../../constants/checkAuth';
import { useParams, MemoryRouter } from 'react-router-dom';
import {
	mockUseAuth,
	mockSaveAppDraftResponse,
} from './SubmitModal/SubmitModalMockData';
import {
	mockDefaultFormData,
	mockProfileData,
	mockVacancyResponse,
	mockProfileResponse,
	mockFormData,
} from './ApplyMockData';
import {
	VACANCY_DETAILS_FOR_APPLICANTS,
	SAVE_APP_DRAFT,
	GET_PROFILE,
} from '../../constants/ApiEndpoints';


jest.mock('../../hooks/useAuth', () => jest.fn().mockImplementation(() => {
	return {
		auth: {
			iTrustGlideSsoId: 'mockId',
			iTrustUrl: 'mockUrl',
			isUserLoggedIn: true,
			user: { name: 'Mock User' },
			oktaLoginAndRedirectUrl: 'mockRedirectUrl',
		},
	}
}));
jest.mock('../../constants/checkAuth');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));
jest.mock('../Profile/Util/ConvertDataFromBackend');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Link: jest.fn(),
	useLocation: jest.fn().mockImplementation(() => {
		return {
			pathname: '/apply',
		}
	})
}));

describe('Apply component', () => {
	let mockVacancyId;
	let mockDraftId;
	beforeAll(() => {
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
	beforeEach(() => {
		useAuth.mockReturnValue(mockUseAuth);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	test('Should render new application form', async () => {
		mockVacancyId = '222';
		mockDraftId = '333';
		useParams.mockReturnValue({ id: '' });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockProfileResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockSaveAppDraftResponse)
		);
		await waitFor(() => {
			render(
				<MemoryRouter initialEntries={['/apply']}>
					<Apply />
				</MemoryRouter>
			);
		});
		const vacancy = await axios.get(1, VACANCY_DETAILS_FOR_APPLICANTS + mockVacancyId);
		const profile = await axios.get(2, GET_PROFILE + mockUseAuth.auth.user.uid);
		const saveDraft = await axios.post(1, SAVE_APP_DRAFT, {
			jsonobj: JSON.stringify(mockFormData),
			draft_id: mockDraftId,
		});

		expect(axios.get).toHaveBeenCalledTimes(5);
		expect(axios.post).toHaveBeenCalledTimes(2);
		expect(screen.getByTestId('back-button')).toBeInTheDocument();
		expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		expect(screen.getByTestId('next-button')).toBeInTheDocument();

		// expect(vacancy).toEqual(mockVacancyResponse);
		// expect(profile).toEqual(mockProfileResponse);
		// expect(saveDraft).toEqual(mockSaveAppDraftResponse);
	});

	test('should handle error on save app functionality', async () => {
		mockVacancyId = '222';
		mockDraftId = '333';
		useParams.mockReturnValue({ id: '' });
		const mockEmptyData = {};

		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockProfileResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockSaveAppDraftResponse)
		);

		await waitFor(() => {
			render(
				<MemoryRouter initialEntries={['/apply']}>
					<Apply />
				</MemoryRouter>
			);
		});

		fireEvent.click(screen.getByTestId('save-application-button'));

		waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				1,
				SAVE_APP_DRAFT,
				expect.objectContaining({
					jsonobj: JSON.stringify(mockEmptyData),
					draft_id: mockDraftId,
				})
			);
			expect(screen.getByText('Sorry! There was an error saving your application. Please try again. If the issue persists, contact the Help Desk by emailing NCIAppSupport@mail.nih.gov')).toBeInTheDocument();
		});
	});

	test('should move to next page on click of next button', async () => {
		mockVacancyId = '222';
		mockDraftId = '333';
		useParams.mockReturnValue({ id: '' });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockProfileResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockSaveAppDraftResponse)
		);

		await waitFor(() => {
			render(
				<MemoryRouter initialEntries={['/apply']}>
					<Apply />
				</MemoryRouter>
			);
		});

		fireEvent.click(screen.getByTestId('next-button'));

		waitFor(() => {
			expect(screen.getByTestId('back-button')).toBeInTheDocument();
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
		})

		fireEvent.click(screen.getByTestId('next-button'));

		waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				1,
				SAVE_APP_DRAFT,
				expect.objectContaining({
					jsonobj: JSON.stringify(mockFormData),
					draft_id: mockDraftId,
				})
			);
			expect(screen.getByText('Application successfully saved ')).toBeInTheDocument();
		});

	});
});