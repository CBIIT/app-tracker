import BasicInfo from './BasicInfo';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';
import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';
import {
	mockIntialValues,
	mockVacancyOptionsResponse,
} from './BasicInfoMockData';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Form } from 'antd';

jest.mock('../../../../hooks/useAuth');
jest.mock('axios');
const { result } = jest.mock('antd', () => {
	return {
		...mockAntd,
		mockForm: {
			...mockForm,
			useForm: () => [
				{
					...mockResult.current[0],
					mockGetFieldError: jest.fn(),
					mockGetFieldInstace: jest.fn(),
					mockGetFieldValue: jest.fn(),
					mockGetFieldWarning: jest.fn(),
					mockGetFieldsError: jest.fn(),
					mockGetFieldsVlaue: jest.fn(),
					mockGetInternalHooks: jest.fn(),
					mockIsFieldTouched: jest.fn(),
					mockIsFieldValidating: jest.fn(),
					mockIsFieldsTouched: jest.fn(),
					mockIsFieldsValidating: jest.fn(),
					mockResetFields: jest.fn(),
					mockScrollToField: jest.fn(),
					mockSetFieldValue: jest.fn(),
					mockSetFields: jest.fn(),
					mockSetFieldsValue: jest.fn(),
					mockSubmit: jest.fn(),
					mockValidateFields: jest.fn(),
					__INTERNAL__: {
						mockItemRef: jest.fn(),
						name: 'BasicInfo',
					},
					_init: true,
				},
			],
		},
	};
});

describe('BasicInfo', () => {
	let mockReadOnly; //undfined
	let mockIsNew; //true or false
	let mockPocDefined; //true or false

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
		document.getSelection = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const FormWrapper = () => {
		const [inputForm] = Form.useForm();
		const mockIntialValuesWithLocation = {
			...mockIntialValues,
			location: 'Bethesda, MD',
		};
		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
			},
			currentTenant: 'tenant1',
		});

		return (
			<BasicInfo
				initialValues={mockIntialValuesWithLocation}
				formInstance={inputForm}
				readOnly={false}
				isNew={false}
				pocDefined={false}
				isDefined={false}
			/>
		);
	};

	it('should render BasicInfo component for new Vacancy', async () => {
		mockReadOnly = false;
		mockIsNew = true;
		mockPocDefined = true;

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
			},
		});

		render(
			<BasicInfo
				initialValues={mockIntialValues}
				formInstance={result}
				readOnly={mockReadOnly}
				isNew={mockIsNew}
				pocDefined={mockPocDefined}
				isDefined={true}
			/>
		);

		await axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancyOptionsResponse)
		);
		const vacancyOptions = await axios.get(GET_VACANCY_OPTIONS);
		expect(axios.get).toHaveBeenCalledTimes(2);
		expect(vacancyOptions).toEqual(mockVacancyOptionsResponse);

		waitFor(() => {
			const PATSClarification = screen.getByText(
				/The selections made in the fields below will be included in the package sent to PATS upon selecting a candidate./i
			);
			expect(PATSClarification).toBeInTheDocument();
		});
	});

	test('<BasicInfo /> crash test', async () => {
		const data = {};
		render(
			<BasicInfo
				initialValues={data}
				formInstance={result}
				readOnly={true}
				isNew={false}
				pocDefined={false}
				isDefined={false}
			/>
		);
	});

	test('should render BasicInfo component with Focus Area with checkbox checked and disabled', async () => {
		mockReadOnly = false;
		mockIsNew = true;
		mockPocDefined = true;

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [
					{
						value: 'tenant1',
						label: 'Tenant 1',
						properties: [{ name: 'enableFocusArea', value: 'true' }],
					},
				],
			},
			currentTenant: 'tenant1',
		});

		render(
			<BasicInfo
				initialValues={mockIntialValues}
				formInstance={result}
				readOnly={mockReadOnly}
				isNew={mockIsNew}
				pocDefined={mockPocDefined}
				isDefined={true}
			/>
		);

		expect(screen.getByText(/Enable Focus Area/i)).toBeInTheDocument();
		const checkbox = screen.getByRole('checkbox', {
			name: /Enable Focus Area/i,
		});
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toBeChecked();
		expect(checkbox).toBeDisabled();
	});

	test('should render BasicInfo component without Focus Area checkbox', async () => {
		mockReadOnly = false;
		mockIsNew = true;
		mockPocDefined = true;

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
			},
			currentTenant: 'tenant1',
		});

		render(
			<BasicInfo
				initialValues={mockIntialValues}
				formInstance={result}
				readOnly={mockReadOnly}
				isNew={mockIsNew}
				pocDefined={mockPocDefined}
				isDefined={true}
			/>
		);
		expect(
			screen.queryByRole('checkbox', { name: /Enable Focus Area/i })
		).toBeNull();
	});

	test('should render BasicInfo component with a location placeholder value', async () => {
		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
			},
			currentTenant: 'tenant1',
		});

		render(
			<BasicInfo
				initialValues={mockIntialValues}
				formInstance={result}
				readOnly={false}
				isNew={true}
				pocDefined={false}
				isDefined={false}
			/>
		);
		const locationSelect = screen.getByTestId('location-select');
		await expect(locationSelect).toBeInTheDocument();
		expect(screen.getByText('Select a location')).toBeInTheDocument();
	});

	test('should render BasicInfo component with a specific location value', async () => {
		render(<FormWrapper />);
		const locationSelect = screen.getByTestId('location-select');
		await expect(locationSelect).toBeInTheDocument();
		expect(screen.getByText('Bethesda, MD')).toBeInTheDocument();
	});

	test('should render BasicInfo component with vacancy POC type User', async () => {
		const mockInitialValuesWithPOCType = {
			...mockIntialValues,
			vacancyPocType: ['User'],
			isUserPoc: 'yes',
			vacancyPoc: {
				value: '123',
				label: 'John Doe',
				email: 'john.doe@example.com',
			},
		};

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
			},
			currentTenant: 'tenant1',
		});

		const POCTestWrapper = () => {
			const [formInstance] = Form.useForm();
			return (
				<BasicInfo
					initialValues={mockInitialValuesWithPOCType}
					formInstance={formInstance}
					readOnly={false}
					isNew={false}
					pocDefined={true}
					isDefined={true}
				/>
			);
		};

		render(<POCTestWrapper />);
		expect(
			screen.getByText(
				'Please select the type of point of contact information to be used for this vacancy.'
			)
		).toBeInTheDocument();

		const userCheckbox = screen.getByRole('checkbox', { name: /User/i });
		expect(userCheckbox).toBeInTheDocument();
		expect(userCheckbox).toBeChecked();
		const pocLabel = await screen.findByText('John Doe');
		expect(pocLabel).toBeInTheDocument();
	});

	test('should render BasicInfo component with vacancy POC type Email Distribution List', async () => {
		const mockInitialValuesWithEmailPOCType = {
			...mockIntialValues,
			vacancyPocType: ['Email Distribution List'],
			vacancyPocEmail: 'team-distribution@example.com',
		};

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
			},
			currentTenant: 'tenant1',
		});

		const EmailPOCTestWrapper = () => {
			const [formInstance] = Form.useForm();
			return (
				<BasicInfo
					initialValues={mockInitialValuesWithEmailPOCType}
					formInstance={formInstance}
					readOnly={false}
					isNew={false}
					pocDefined={true}
					isDefined={true}
				/>
			);
		};

		render(<EmailPOCTestWrapper />);

		expect(
			screen.getByText(
				'Please select the type of point of contact information to be used for this vacancy.'
			)
		).toBeInTheDocument();

		const emailCheckbox = screen.getByRole('checkbox', {
			name: /Email Distribution List/i,
		});
		expect(emailCheckbox).toBeInTheDocument();
		expect(emailCheckbox).toBeChecked();
		const emailInput = await screen.findByDisplayValue(
			'team-distribution@example.com'
		);
		expect(emailInput).toBeInTheDocument();
	});

	test('should render BasicInfo component with both POC types (User and Email Distribution List)', async () => {
		const mockInitialValuesWithBothPOCType = {
			...mockIntialValues,
			vacancyPocType: ['User', 'Email Distribution List', 'Both'],
			isUserPoc: 'no',
			vacancyPoc: {
				value: '123',
				label: 'Jane Smith',
				email: 'jane.smith@example.com',
			},
			vacancyPocEmail: 'team-distribution@example.com',
		};

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				iTrustGlideSsoId: 'itrust123',
				oktaGlideSsoId: 'okta123',
				user: {
					isManager: true,
					isExecSec: false,
					roles: [],
					hasApplications: false,
					uid: '123',
				},
				tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
			},
			currentTenant: 'tenant1',
		});

		const BothPOCTestWrapper = () => {
			const [formInstance] = Form.useForm();
			return (
				<BasicInfo
					initialValues={mockInitialValuesWithBothPOCType}
					formInstance={formInstance}
					readOnly={false}
					isNew={false}
					pocDefined={true}
					isDefined={true}
				/>
			);
		};

		render(<BothPOCTestWrapper />);

		expect(
			screen.getByText(
				'Please select the type of point of contact information to be used for this vacancy.'
			)
		).toBeInTheDocument();

		const userCheckbox = screen.getByRole('checkbox', { name: /User/i });
		expect(userCheckbox).toBeInTheDocument();
		expect(userCheckbox).toBeChecked();

		const emailCheckbox = screen.getByRole('checkbox', {
			name: /Email Distribution List/i,
		});
		expect(emailCheckbox).toBeInTheDocument();
		expect(emailCheckbox).toBeChecked();

		const pocLabel = await screen.findByText('Jane Smith');
		expect(pocLabel).toBeInTheDocument();

		const emailInput = await screen.findByDisplayValue(
			'team-distribution@example.com'
		);
		expect(emailInput).toBeInTheDocument();
	});

	test('should disable dates that are in the past for open date is useCloseDate is false', async () => {
		const mockValuesWithCloseDate = {
			...mockIntialValues,
			useCloseDate: false,
		}

		const FormWrapperForDateTest = () => {
			const [inputForm] = Form.useForm();
			useAuth.mockReturnValue({
				auth: {
					isUserLoggedIn: true,
					iTrustGlideSsoId: 'itrust123',
					oktaGlideSsoId: 'okta123',
					user: {
						isManager: true,
						isExecSec: false,
						roles: [],
						hasApplications: false,
						uid: '123',
					},
					tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
				},
				currentTenant: 'tenant1',
			});

			return (
				<BasicInfo
					initialValues={mockValuesWithCloseDate}
					formInstance={inputForm}
					readOnly={false}
					isNew={false}
					pocDefined={false}
					isDefined={false}
				/>
			);
		};

		render(<FormWrapperForDateTest />);

		const openDatePicker = screen.getByLabelText(/Open Date/i);
		expect(openDatePicker).toBeInTheDocument();

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		const today = new Date();

		const disabledDate = (currentDate) => {
			return currentDate <= new Date().setHours(0, 0, 0, 0);
		};

		expect(disabledDate(yesterday)).toBe(true);
		expect(disabledDate(today)).toBe(false);
	});

	test('should validate that open date is before close date when useCloseDate is true', async () => {
		const mockInitialValuesWithDates = {
			...mockIntialValues,
			useCloseDate: true,
		};

		const DateValidationWrapper = () => {
			const [formInstance] = Form.useForm();
			useAuth.mockReturnValue({
				auth: {
					isUserLoggedIn: true,
					iTrustGlideSsoId: 'itrust123',
					oktaGlideSsoId: 'okta123',
					user: {
						isManager: true,
						isExecSec: false,
						roles: [],
						hasApplications: false,
						uid: '123',
					},
					tenants: [{ value: 'tenant1', label: 'Tenant 1', properties: [] }],
				},
				currentTenant: 'tenant1',
			});

			return (
				<BasicInfo
					initialValues={mockInitialValuesWithDates}
					formInstance={formInstance}
					readOnly={false}
					isNew={false}
					pocDefined={false}
					isDefined={false}
				/>
			);
		};

		render(<DateValidationWrapper />);

        const openDateInput = screen.getByLabelText(/Open Date/i);
		const closeDateInput = screen.getByTestId('closeDate');

		await waitFor(() => {
			expect(openDateInput).toBeInTheDocument();
			expect(closeDateInput).toBeInTheDocument();
		});

        fireEvent.mouseDown(openDateInput);
	});
});
