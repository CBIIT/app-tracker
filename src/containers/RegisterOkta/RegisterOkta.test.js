import RegisterOkta from "./RegisterOkta";
import { MemoryRouter } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import { REGISTER_OKTA } from "../../constants/Routes";
import { render } from '@testing-library/react'

jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
	default: jest.fn(),
}));

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

    test('Should render Register Okta page', () => {
        render(
            <MemoryRouter initialEntries={[REGISTER_OKTA]} >
                <RegisterOkta />
            </MemoryRouter>
        );

    })
})