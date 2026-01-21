import { act, render, screen } from '@testing-library/react';
import ApplicationApplicationView from './ApplicantApplicationView';
import * as transformJsonFromBackend from './Util/TransformJsonFromBackend';
import { useParams, MemoryRouter } from 'react-router-dom';
import {
	mockProps,
	mockResponse,
	mockStadtmanResponse,
	mockStadtmanApplication,
	mockApplication,
} from './MockData';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('./Util/TransformJsonFromBackend', () => ({
	transformJsonFromBackend: jest.fn(),
}));
jest.mock(
	'../../components/UI/InfoCard/InfoCard',
	() =>
		({ title, children }) =>
			(
				<div data-testid='InfoCard'>
					<div>{title}</div>
					{children}
				</div>
			)
);
jest.mock(
	'../../components/UI/LabelValuePair/LabelValuePair',
	() =>
		({ label, value }) =>
			(
				<div>
					{label && <span>{label}</span>}
					{value && <span>{value}</span>}
				</div>
			)
);
jest.mock('../../components/Loading/Loading', () => () => (
	<div>Loading...</div>
));
jest.mock('../Application/Address/Address', () => () => (
	<div>AddressComponent</div>
));
jest.mock('antd', () => ({
	Button: ({ children, ...mockProps }) => (
		<button {...mockProps}>{children}</button>
	),
	message: { error: jest.fn() },
}));

describe('ApplicantApplicationView component', () => {
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
		// provide a minimal useAuth mock to satisfy component destructuring
		const useAuth = require('../../hooks/useAuth');
		useAuth.default.mockReturnValue({ auth: { tenants: [] }, setAuth: jest.fn() });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});


	test('shows Request Reference button for Stadtman tenant', async () => {
		const useAuth = require('../../hooks/useAuth');

		// mock tenant with maxApplicantReferenceRequests property
 		useAuth.default.mockReturnValue({ auth: { tenants: [
 			{ value: 'stadtman', properties: [ { name: 'maxApplicantReferenceRequests', value: 3 } ] }
 		] }, setAuth: jest.fn() });

 		axios.get.mockResolvedValueOnce(mockStadtmanResponse);
 		useParams.mockReturnValue({ appSysId: '12345' });

 		// ensure returned application has tenant set to 'stadtman'
 		const appWithTenant = { ...mockStadtmanApplication, tenant: 'stadtman' };
 		transformJsonFromBackend.transformJsonFromBackend.mockReturnValue(appWithTenant);


 		await act(async () => {
 			render(
 				<MemoryRouter initialEntries={['/apply/view/']}>
 					<ApplicationApplicationView {...mockProps} />
 				</MemoryRouter>
 			);
 		});

 		// Request Reference button should be rendered for each reference when tenant allows requests
 		expect(screen.getByText(/Request Reference/i)).toBeInTheDocument();

 	});

	test('should render ApplicantApplicationView component for Stadtman application', async () => {
		axios.get.mockResolvedValueOnce(mockStadtmanResponse);
		useParams.mockReturnValue({ appSysId: '12345' });
		transformJsonFromBackend.transformJsonFromBackend.mockReturnValue(
			mockStadtmanApplication
		);

		await act(async () => {
			render(
				<MemoryRouter initialEntries={['/apply/view/']}>
					<ApplicationApplicationView {...mockProps} />
				</MemoryRouter>
			);
		});

		expect(screen.getByRole('button', { name: /Print/i })).toBeInTheDocument();
		expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Name/i).length).toBeGreaterThanOrEqual(1);
		// expect(screen.getAllByText(/Middle Name/i).length).toBeGreaterThanOrEqual(1);
		// expect(screen.getAllByText(/Last Name/i).length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText(/Email Address/i).length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText(/Phone/i).length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText(/Business Phone/i)).toBeInTheDocument();
		expect(screen.getByText(/Highest Level of Education/i)).toBeInTheDocument();
		expect(screen.getByText(/US Citizen/i)).toBeInTheDocument();
		expect(screen.getByText(/Focus Area/i)).toBeInTheDocument();
		expect(screen.getByText(/AddressComponent/i)).toBeInTheDocument();
		expect(screen.getByText(/References/i)).toBeInTheDocument();
		expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
		expect(screen.getByText(/Position Title/i)).toBeInTheDocument();
		expect(screen.getByText(/Reference Received/i)).toBeInTheDocument();
		expect(screen.getByText(/Relationship/i)).toBeInTheDocument();
		expect(screen.getByText(/Is it okay for the Hiring Team to contact the reference directly?/i)).toBeInTheDocument();
		expect(screen.getByText(/Documents/i)).toBeInTheDocument();
	});

	test('should render ApplicantApplicationView component for non-Stadtman application', async () => {
		axios.get.mockResolvedValueOnce(mockResponse);
		useParams.mockReturnValue({ appSysId: '12345' });
		transformJsonFromBackend.transformJsonFromBackend.mockReturnValue(
			mockApplication
		);

		await act(async () => {
			render(
				<MemoryRouter initialEntries={['/apply/view/']}>
					<ApplicationApplicationView {...mockProps} />
				</MemoryRouter>
			);
		});

		expect(screen.queryByText(/Focus Area/i)).not.toBeInTheDocument();
	});
});
