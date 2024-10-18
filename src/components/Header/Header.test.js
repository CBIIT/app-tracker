import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';
import Logo from './Logo/Logo';
import Login from './Login/Login';

jest.mock('../../hooks/useAuth', () => jest.fn().mockImplementation(() => {
    return {
        auth: {
            iTrustGlideSsoId: 'mockId',
            iTrustUrl: 'mockUrl',
            isUserLoggedIn: true,
            user: { name: 'Mock User' },
            oktaLoginAndRedirectUrl: 'mockRedirectUrl',
        },
    };
}));
// Functionality of Imported Components will be tested in their respective test files
describe('Header Component', () => {
    it('should render without crashing', () => {

        const { container } = render(<Header />);
        expect(container).toBeTruthy();
    });

    it('should render the Logo component', () => {
        const { getByTestId } = render(<Logo />);
        expect(getByTestId('logo')).toBeInTheDocument();
    });

    it('should render the Login component', () => {
        const { container } = render(<Login />);
        expect(container.firstChild).toHaveClass('Login');
    });
});