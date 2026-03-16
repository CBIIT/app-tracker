import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import useAuth from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('ProtectedRoute', () => {
    const TestComponent = () => <div>Test Component</div>;

    it('renders the component when the user is logged in', () => {
        useAuth.mockReturnValue({
            auth: { isUserLoggedIn: true, iTrustGlideSsoId: 'itrust123', oktaGlideSsoId: 'okta123' },
        });

        const { getByText } = render(
            <MemoryRouter initialEntries={['/protected']}>
                <ProtectedRoute component={TestComponent} useOktaAuth={false} />
            </MemoryRouter>
        );

        expect(getByText('Test Component')).toBeInTheDocument();
    });

    it('redirects to login when the user is not logged in', () => {
        useAuth.mockReturnValue({
            auth: { isUserLoggedIn: false, iTrustGlideSsoId: 'itrust123', oktaGlideSsoId: 'okta123' },
        });

        delete window.location;
        window.location = { href: '' };

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <ProtectedRoute component={TestComponent} useOktaAuth={false} />
            </MemoryRouter>
        );

        expect(window.location.href).toContain('/nav_to.do?uri=%2Fnci-scss.do%23%2Fprotected&glide_sso_id=itrust123');
    });

    it('redirects to login with Okta SSO when the user is not logged in and useOktaAuth is true', () => {
        useAuth.mockReturnValue({
            auth: { isUserLoggedIn: false, iTrustGlideSsoId: 'itrust123', oktaGlideSsoId: 'okta123' },
        });

        delete window.location;
        window.location = { href: '' };

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <ProtectedRoute component={TestComponent} useOktaAuth={true} />
            </MemoryRouter>
        );

        expect(window.location.href).toContain('/nav_to.do?uri=%2Fnci-scss.do%23%2Fprotected&glide_sso_id=okta123');
    });
});