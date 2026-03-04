import RegisterOkta from "./RegisterOkta";
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { REGISTER_OKTA } from "../../constants/Routes";
import { CREATE_OKTA_USER } from "../../constants/ApiEndpoints";
import { MemoryRouter, useHistory } from "react-router-dom";
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

jest.mock('axios');
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
	default: jest.fn(),
}));
jest.mock('react-router-dom', () => {
	const actual = jest.requireActual('react-router-dom');
	return {
		...actual,
		useHistory: jest.fn(),
	};
});

describe('RegisterOkta Component', () => {
	const mockGoBack = jest.fn();
	const originalLocation = window.location;

	const successMessage = 
		'User account created, please check your email for a message from Okta to activate your account';
	const errorMessage = 
		'An error occurred while trying to create your account.  Please try again later.  If the problem persists please contact NCIAppSupport@mail.nih.gov';

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

		delete window.location;
		window.location = { href: 'http://localhost/' };
    });

    afterAll(() => {
        window.location = originalLocation;
    });

	beforeEach(() => {
		jest.clearAllMocks();

		useAuth.mockReturnValue({
			auth: {
				iTrustGlideSsoId: 'id12345',
                oktaLoginAndRedirectUrl: 'https://redirecturl/'
			},
		});

		useHistory.mockReturnValue({
			goBack: mockGoBack,
		});
	});

	renderComponent = () => {
		return render(
        	<MemoryRouter initialEntries={[REGISTER_OKTA]} >
                <RegisterOkta />
            </MemoryRouter>
		);
	};

	const fillRequiredFields = ({
		firstname = 'Jane',
		lastname= 'Doe',
		email = 'jane@example.com',
        confirmEmail = 'jane@example.com',
        phone = '301-555-1212',
	} = {}) => {
		const nameInputs = screen.getAllByPlaceholderText('Please enter');
		fireEvent.change(nameInputs[0], { target: { value: firstname } });
		fireEvent.change(nameInputs[1], { target: { value: lastname } });

		const emailInputs = screen.getAllByPlaceholderText('example@email.com');
		fireEvent.change(emailInputs[0], { target: { value: email } });
		fireEvent.change(emailInputs[1], { target: { value: confirmEmail } });

		fireEvent.change(screen.getByPlaceholderText('(123) 456-7890'), {
			target: { value: phone },
		});
	};

	test('Should render default form', () => {
		renderComponent();

		expect(
			screen.getByRole('heading', { name: /create your nih account to access ssj/i })
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /cancel and back/i })).toBeInTheDocument();
	});

	test('Should redirect to okta url when login button is clicked', () => {
		renderComponent();

		fireEvent.click(screen.getByRole('button', { name: /login/i }));

		expect(window.location.href).toBe('https://redirecturl/');
	});

	test('Should call history.goBack when cancel button is clicked', () => {
		renderComponent();

		fireEvent.click(screen.getByRole('button', { name: /cancel and back/i }));

		expect(mockGoBack).toHaveBeenCalledTimes(1);
	});

	test('Should disable create account and show NIH notice for an nih.gov email', () => {
		renderComponent();

		const emailInput = screen.getAllByPlaceholderText('example@email.com')[0];
        fireEvent.change(emailInput, { target: { value: 'user@nih.gov' } });

        const createButton = screen.getByRole('button', { name: /create account/i });
        expect(createButton).toBeDisabled();

        expect(
            screen.getByText(/you have entered an nih email/i)
        ).toBeInTheDocument();
    });

	test('Should disable create account and show NIH notice for mail.nih.gov', () => {
		renderComponent();

		const emailInput = screen.getAllByPlaceholderText('example@email.com')[0];
		fireEvent.change(emailInput, { target: { value: 'user@mail.nih.gov' } });

		expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled();
	});

	test('Should re-enable create account button when non-nih email is used', () => {
		renderComponent();

		const emailInput = screen.getAllByPlaceholderText('example@email.com')[0];
		const createButton = screen.getByRole('button', { name: /create account/i });

		fireEvent.change(emailInput, { target: { value: 'user@nih.gov' } });
		expect(createButton).toBeDisabled();

		fireEvent.change(emailInput, { target: { value: 'user@gamil.com' } });
		expect(createButton).not.toBeDisabled();
	});

	test('Should show mismatch validation when emails do not match', async () => {
		renderComponent();

		fillRequiredFields({
			email: 'jane@example.com',
            confirmEmail: 'different@example.com',
		});

		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		expect(await screen.findByText('Emails do not match.')).toBeInTheDocument();
		expect(axios.post).not.toHaveBeenCalled();
	});

	test('Should remove mismatch for emails after it has been corrected', async () => {
		axios.post.mockResolvedValue({
            data: { result: successMessage },
        });

        renderComponent();

        fillRequiredFields({
            email: 'jane@example.com',
            confirmEmail: 'different@example.com',
        });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText('Emails do not match.')).toBeInTheDocument();

        const confirmInput = screen.getAllByPlaceholderText('example@email.com')[1];
        fireEvent.change(confirmInput, { target: { value: 'jane@example.com' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.queryByText('Emails do not match.')).not.toBeInTheDocument();
            expect(axios.post).toHaveBeenCalledWith(CREATE_OKTA_USER, {
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane@example.com',
                confirmEmail: 'jane@example.com',
                phone: '301-555-1212',
            });
			expect(screen.getByText(successMessage)).toBeInTheDocument();
        });
	});

	test('Should show phone validation error for invalid phone number', async () => {
		renderComponent();

		fillRequiredFields({ phone: '3'});

		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		expect(
			await screen.findByText('Please enter a valid phone number.')
		).toBeInTheDocument();
		expect(axios.post).not.toHaveBeenCalled();
	});

	test('Should submit valid form and show success result', async () => {
		axios.post.mockResolvedValue({
            data: { result: successMessage },
        });

        const { container } = renderComponent();

		fillRequiredFields();
		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				CREATE_OKTA_USER, {
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane@example.com',
                confirmEmail: 'jane@example.com',
                phone: '301-555-1212',
            });
			expect(screen.getByText(/user account created/i)).toBeInTheDocument();
            expect(container.querySelector('.ant-result-success')).toBeInTheDocument();
		});
	});

	test('shows already exists warning when api result includes existing user text', async () => {
        axios.post.mockResolvedValue({
            data: {
                result:
                    'Error creating user: login: An object with this field already exists in the current organization',
            },
        });

        const { container } = renderComponent();

        fillRequiredFields();
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/this account already exists\. please try logging in\./i)
            ).toBeInTheDocument();
            expect(container.querySelector('.ant-result-warning')).toBeInTheDocument();
        });
    });
})