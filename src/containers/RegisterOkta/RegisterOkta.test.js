import RegisterOkta from "./RegisterOkta";
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { REGISTER_OKTA } from "../../constants/Routes";
import { CREATE_OKTA_USER } from "../../constants/ApiEndpoints";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
	default: jest.fn(),
}));
jest.mock('axios');

describe('RegisterOkta Component', () => {
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
        useAuth.mockReturnValue({
			auth: {
				iTrustGlideSsoId: 'id12345',
                oktaLoginAndRedirectUrl: 'https://redirecturl'
			},
		});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should submit valid form and shows success result', async () => {
		axios.post.mockResolvedValue({
			data: {
				result: 'User account created, please check your email for a message from Okta to activate your account',
			},
		});

        render(
            <MemoryRouter initialEntries={[REGISTER_OKTA]} >
                <RegisterOkta />
            </MemoryRouter>
        );

		const nameInputs = screen.getAllByPlaceholderText('Please enter');
		fireEvent.change(nameInputs[0], { target: { value: 'Jane' } });
		fireEvent.change(nameInputs[1], { target: { value: 'Doe' } });

		const emailInputs = screen.getAllByPlaceholderText('example@email.com');
		fireEvent.change(emailInputs[0], { target: { value: 'jane@example.com' } });
		fireEvent.change(emailInputs[1], { target: { value: 'jane@example.com' } });

		fireEvent.change(screen.getByPlaceholderText('(123) 456-7890'), {
			target: { value: '301-555-1212' },
		});

		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(CREATE_OKTA_USER, {
				firstname: 'Jane',
				lastname: 'Doe',
				email: 'jane@example.com',
        		confirmEmail: 'jane@example.com',
        		phone: '301-555-1212',
			});
			expect(screen.getByText(/User account created, please check your email for a message from Okta/i)).toBeInTheDocument();
		});

    });
})