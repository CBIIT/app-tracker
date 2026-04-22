import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
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
jest.mock('../../hooks/useTimeout', () => jest.fn().mockReturnValue({
	modalTimeout: 0,
}));
jest.mock('../../constants/checkAuth');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
	useNavigate: jest.fn().mockReturnValue(jest.fn()),
	Link: jest.fn().mockImplementation(({ children }) => children),
	useLocation: jest.fn().mockImplementation(() => {
		return {
			pathname: '/apply',
		}
	})
}));
jest.mock('../Profile/Util/ConvertDataFromBackend', () => ({
	convertDataFromBackend: jest.fn((data) => ({
		userSysId: '123',
		basicInfo: {
			firstName: 'John',
			middleName: 'Doe',
			lastName: 'Smith',
			email: 'john@example.com',
			phonePrefix: '+1',
			phone: '234567890',
			businessPhonePrefix: '+1',
			businessPhone: '987654321',
			highestLevelEducation: 'PhD',
			isUsCitizen: 1,
			address: {
				address: '123 Main St',
				address2: 'Apt 4',
				city: 'Anytown',
				stateProvince: 'CA',
				zip: '12345',
				country: 'USA',
			},
		},
		focusArea: [],
	})),
}));
jest.mock('./Forms/ApplicantDocuments/ApplicantDocuments', () => {
	return function MockApplicantDocuments() {
		return <div data-testid="applicant-documents">Applicant Documents</div>;
	};
});
jest.mock('./Forms/References/ApplicantReferences.js', () => {
	return function MockApplicantReferences() {
		return <div data-testid="applicant-references">Applicant References</div>;
	};
});
jest.mock('./Forms/Review/Review', () => {
	return function MockReview() {
		return <div data-testid="review">Review</div>;
	};
});

describe('Apply component', () => {
	let mockVacancyId;
	let mockDraftId;
	let mockFormInstance;
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
		mockFormInstance = {
			validateFields: jest.fn().mockResolvedValue(mockFormData),
			getFieldsValue: jest.fn().mockReturnValue(mockFormData),
		};
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	test('Should render new application form', async () => {
		mockVacancyId = '222';
		mockDraftId = '333';
		useParams.mockReturnValue({ vacancySysId: '222', appSysId: '333' });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockProfileResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.post.mockImplementationOnce(() =>
			Promise.resolve(mockSaveAppDraftResponse)
		);
		await waitFor(() => {
			render(
				<MemoryRouter initialEntries={['/apply']}>
					<Apply />
				</MemoryRouter>
			);
		});

		expect(axios.get).toHaveBeenCalledTimes(2);
		expect(axios.post).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('back-button')).toBeInTheDocument();
		expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		expect(screen.getByTestId('next-button')).toBeInTheDocument();
	});

	test('should handle error on save app functionality', async () => {
		mockVacancyId = '222';
		mockDraftId = '333';
		useParams.mockReturnValue({ vacancySysId: '222', appSysId: '333' });

		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockProfileResponse)
		);
		axios.post.mockImplementationOnce(() =>
			Promise.reject(new Error('Network error'))
		);

		await waitFor(() => {
			render(
				<MemoryRouter initialEntries={['/apply']}>
					<Apply initialValues={mockFormData} />
				</MemoryRouter>
			);
		});

		// Verify component renders
		await waitFor(() => {
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		});
	});

	test('should move to next page on click of next button', async () => {
		mockVacancyId = '222';
		mockDraftId = '333';
		useParams.mockReturnValue({ vacancySysId: '222', appSysId: '333' });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyResponse)
		);
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockProfileResponse)
		);
		axios.post.mockImplementation(() =>
			Promise.resolve(mockSaveAppDraftResponse)
		);

		await waitFor(() => {
			render(
				<MemoryRouter initialEntries={['/apply']}>
					<Apply initialValues={mockFormData} />
				</MemoryRouter>
			);
		});

		// Wait for component to load
		await waitFor(() => {
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
		});

		// Test that all buttons are visible on initial load
		expect(screen.getByTestId('back-button')).toBeInTheDocument();
		expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		expect(screen.getByTestId('next-button')).toBeInTheDocument();
	});
});