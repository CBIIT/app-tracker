import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { message, notification } from 'antd';
import Apply from './Apply';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import useTimeout from '../../hooks/useTimeout';
import { checkAuth } from '../../constants/checkAuth.js';
import { convertDataFromBackend } from '../Profile/Util/ConvertDataFromBackend';
import { useParams, MemoryRouter } from 'react-router-dom';
import { mockUseAuth } from './SubmitModal/SubmitModalMockData';
import {
	mockProfileData,
	mockVacancyResponse,
	mockProfileResponse,
} from './ApplyMockData';
import {
	VACANCY_DETAILS_FOR_APPLICANTS,
	SAVE_APP_DRAFT,
	GET_PROFILE,
} from '../../constants/ApiEndpoints';
import { APPLICANT_DASHBOARD } from '../../constants/Routes';

const mockPush = jest.fn();
const mockGoBack = jest.fn();
let mockModalTimeout = 10;
let mockCurrentFormInstance = {
	validateFields: jest.fn().mockResolvedValue({
		firstName: 'John',
		lastName: 'Smith',
		email: 'john@example.com',
		references: [{ firstName: 'Ref' }],
		applicantDocuments: [],
		focusArea: [],
	}),
	getFieldsValue: jest.fn().mockReturnValue({
		firstName: 'John',
		lastName: 'Smith',
		email: 'john@example.com',
		references: [{ firstName: 'Ref' }],
		applicantDocuments: [],
		focusArea: [],
	}),
};

jest.mock('axios');
jest.mock('../../hooks/useAuth', () => jest.fn());
jest.mock('../../hooks/useTimeout', () => jest.fn());
jest.mock('../../constants/checkAuth.js', () => ({
	checkAuth: jest.fn(),
}));
jest.mock('../Profile/Util/ConvertDataFromBackend', () => ({
	convertDataFromBackend: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
	useHistory: () => ({
		push: mockPush,
		goBack: mockGoBack,
	}),
}));

jest.mock('../../components/UI/HeaderWithLink/HeaderWithLink', () => {
	return function MockHeaderWithLink({ title }) {
		return <div data-testid='header-with-link'>{title}</div>;
	};
});

jest.mock('./Forms/ApplicantDocuments/ApplicantDocuments', () => {
	const React = require('react');
	const FormContext = require('./Context').default;
	return function MockApplicantDocuments() {
		const { setCurrentFormInstance } = React.useContext(FormContext);
		React.useEffect(() => {
			setCurrentFormInstance(mockCurrentFormInstance);
		}, [setCurrentFormInstance]);
		return <div data-testid='applicant-documents-form'>Applicant Documents</div>;
	};
});

jest.mock('./Forms/References/ApplicantReferences.js', () => {
	const React = require('react');
	const FormContext = require('./Context').default;
	return function MockApplicantReferences() {
		const { setCurrentFormInstance } = React.useContext(FormContext);
		React.useEffect(() => {
			setCurrentFormInstance(mockCurrentFormInstance);
		}, [setCurrentFormInstance]);
		return <div data-testid='applicant-references-form'>Applicant References</div>;
	};
});

jest.mock('./Forms/Review/Review', () => {
	return function MockReview({ onEditButtonClick }) {
		return (
			<div>
				<div data-testid='review-form'>Review</div>
				<button
					type='button'
					data-testid='edit-references-button'
					onClick={() => onEditButtonClick('references')}
				>
					Edit References
				</button>
			</div>
		);
	};
});

jest.mock('./SubmitModal/SubmitModal', () => {
	return function MockSubmitModal({ visible, onCancel, returnToDocuments }) {
		return (
			<div data-testid='submit-modal'>
				{visible ? <span data-testid='submit-modal-open'>open</span> : null}
				<button type='button' data-testid='submit-modal-cancel' onClick={onCancel}>
					Cancel
				</button>
				<button
					type='button'
					data-testid='submit-modal-return-to-documents'
					onClick={returnToDocuments}
				>
					Return
				</button>
			</div>
		);
	};
});

describe('Apply component', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
		window.scrollTo = jest.fn();
	});

	beforeEach(() => {
		useAuth.mockReturnValue(mockUseAuth);
		useTimeout.mockImplementation(() => ({ modalTimeout: mockModalTimeout }));
		convertDataFromBackend.mockReturnValue(mockProfileData);
		useParams.mockReturnValue({ vacancySysId: '222', appSysId: '333' });

		mockCurrentFormInstance = {
			validateFields: jest.fn().mockResolvedValue({
				firstName: 'John',
				lastName: 'Smith',
				email: 'john@example.com',
				references: [{ firstName: 'Ref' }],
				applicantDocuments: [],
				focusArea: [],
			}),
			getFieldsValue: jest.fn().mockReturnValue({
				firstName: 'John',
				lastName: 'Smith',
				email: 'john@example.com',
				references: [{ firstName: 'Ref' }],
				applicantDocuments: [],
				focusArea: [],
			}),
		};

		jest.spyOn(message, 'error').mockImplementation(jest.fn());
		jest.spyOn(message, 'info').mockImplementation(jest.fn());
		jest.spyOn(message, 'destroy').mockImplementation(jest.fn());
		jest.spyOn(notification, 'error').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should render new application form', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: '444' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith(
				VACANCY_DETAILS_FOR_APPLICANTS + '222'
			);
			expect(axios.get).toHaveBeenCalledWith(GET_PROFILE + mockUseAuth.auth.user.uid);
			expect(axios.post).toHaveBeenCalledTimes(1);
			expect(screen.getByTestId('back-button')).toBeInTheDocument();
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
		});
	});

	test('should render edit submitted banner and hide save button', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);

		const initialValues = {
			sysId: '222',
			applicantDocuments: [
				{
					title: { label: 'Test Document' },
					file: { fileList: [{ uid: '1' }] },
					uploadedDocument: {
						fileName: 'test.pdf',
						attachSysId: 'attach-1',
						downloadLink: 'http://example.com',
						markedToDelete: false,
					},
				},
			],
		};

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply initialValues={initialValues} editSubmitted={true} />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(
				screen.getByText('You are editing a submitted application.')
			).toBeInTheDocument();
			expect(screen.queryByTestId('save-application-button')).not.toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('back-button'));
		await waitFor(() => {
			expect(mockGoBack).toHaveBeenCalled();
		});
	});

	test('should show validation error when next button validation fails', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: '444' } } });
		mockCurrentFormInstance.validateFields.mockRejectedValueOnce(
			new Error('validation failed')
		);

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('next-button'));

		await waitFor(() => {
			expect(message.error).toHaveBeenCalledWith(
				'Please fill out all required fields.'
			);
		});
	});

	test('should show required fields error on save when profile is missing basic info', async () => {
		const incompleteProfileResponse = {
			data: {
				result: {
					response: {
						basic_info: {
							first_name: '',
							middle_name: '',
							last_name: '',
							email: '',
							phone: '+1234567890',
							business_phone: '+1234567890',
							highest_level_of_education: 'PhD',
							us_citizen: '1',
							address: '123 Main St',
							address_2: 'Apt 1',
							city: 'City',
							state_province: 'ST',
							zip_code: '12345',
							country: 'USA',
						},
					},
				},
			},
		};

		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(incompleteProfileResponse);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: '444' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('save-application-button'));

		await waitFor(() => {
			expect(message.error).toHaveBeenCalledWith(
				expect.objectContaining({
					content:
						'First Name, Last Name, and Email are required to save. Please fill out required fields.',
				})
			);
			expect(mockCurrentFormInstance.validateFields).toHaveBeenCalledWith(['firstName']);
			expect(mockCurrentFormInstance.validateFields).toHaveBeenCalledWith(['lastName']);
			expect(mockCurrentFormInstance.validateFields).toHaveBeenCalledWith(['email']);
		});
	});

	test('should save successfully and call checkAuth', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce(null);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: 'new-draft' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('save-application-button'));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledTimes(2);
			expect(message.info).toHaveBeenCalled();
			expect(checkAuth).toHaveBeenCalled();
		});
	});

	test('should show notification and call checkAuth when save fails', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce(null);
		axios.post.mockRejectedValueOnce(new Error('save failed'));

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('save-application-button'));

		await waitFor(() => {
			expect(notification.error).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Sorry! There was an error saving your application.',
				})
			);
			expect(checkAuth).toHaveBeenCalled();
		});
	});

	test('should show save failed notification when initial draft creation fails', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockRejectedValueOnce(new Error('draft save failed'));

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(notification.error).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Save Failed' })
			);
			expect(mockGoBack).toHaveBeenCalled();
		});
	});

	test('should include sys_id when saving an existing draft', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: 'existing-draft' } } });
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: 'existing-draft' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('save-application-button'));

		await waitFor(() => {
			expect(axios.post).toHaveBeenNthCalledWith(
				2,
				SAVE_APP_DRAFT,
				expect.objectContaining({ sys_id: 'existing-draft' })
			);
		});
	});

	test('should show error when back navigation save fails', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: '444' } } });
		mockCurrentFormInstance.getFieldsValue.mockImplementationOnce(() => {
			throw new Error('back save failure');
		});

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('back-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('back-button'));

		await waitFor(() => {
			expect(message.error).toHaveBeenCalledWith(
				'Oops, there was an error while saving the form.'
			);
		});
	});

	test('should trigger save message actions for navigation and dismiss', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce(null);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: 'new-draft' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('save-application-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('save-application-button'));

		await waitFor(() => {
			expect(message.info).toHaveBeenCalled();
		});

		const saveMessageConfig = message.info.mock.calls[0][0];
		saveMessageConfig.content[1].props.onClick();
		saveMessageConfig.content[2].props.onClick();

		expect(mockPush).toHaveBeenCalledWith(APPLICANT_DASHBOARD);
		expect(message.destroy).toHaveBeenCalled();
	});

	test('should handle rehydrated legacy document shapes for edit submitted', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);

		const initialValues = {
			sysId: '222',
			applicantDocuments: [
				{
					documentName: 'Legacy Document',
					file: { fileList: [] },
				},
			],
		};

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply initialValues={initialValues} editSubmitted={true} />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
			expect(screen.getByText('You are editing a submitted application.')).toBeInTheDocument();
		});
	});

	test('should navigate back to references when clicking edit from review', async () => {
		axios.get.mockResolvedValueOnce(mockVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValueOnce({ data: { result: { draft_id: '444' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('next-button'));
		fireEvent.click(screen.getByTestId('next-button'));

		await waitFor(() => {
			expect(screen.getByTestId('review-form')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('edit-references-button'));

		await waitFor(() => {
			expect(screen.getByTestId('applicant-references-form')).toBeInTheDocument();
		});
	});

	test('should open submit modal on final step and handle modal actions', async () => {
		const reviewOnlyVacancyResponse = {
			...mockVacancyResponse,
			data: {
				...mockVacancyResponse.data,
				result: {
					...mockVacancyResponse.data.result,
					json: {
						...mockVacancyResponse.data.result.json,
						vacancy_documents: [],
						basic_info: {
							...mockVacancyResponse.data.result.json.basic_info,
							number_of_recommendation: { label: '0', value: '0' },
						},
					},
				},
			},
		};

		axios.get.mockResolvedValueOnce(reviewOnlyVacancyResponse);
		axios.get.mockResolvedValueOnce(mockProfileResponse);
		axios.post.mockResolvedValue({ data: { result: { draft_id: '444' } } });

		render(
			<MemoryRouter initialEntries={['/apply']}>
				<Apply />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('next-button')).toBeInTheDocument();
			expect(screen.getByTestId('next-button')).toHaveTextContent('Submit Application');
		});

		fireEvent.click(screen.getByTestId('next-button'));
		await waitFor(() => {
			expect(screen.getByTestId('submit-modal-open')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('submit-modal-cancel'));
		await waitFor(() => {
			expect(screen.queryByTestId('submit-modal-open')).not.toBeInTheDocument();
		});

		fireEvent.click(screen.getByTestId('submit-modal-return-to-documents'));
		await waitFor(() => {
			expect(screen.getByTestId('next-button')).toHaveTextContent('Submit Application');
		});
	});
});