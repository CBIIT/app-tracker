import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthContext, { AuthProvider } from './AuthContext';

describe('AuthContext', () => {
    it('should provide auth and setAuth', () => {
        const TestComponent = () => {
            return (
                <AuthProvider>
                    <AuthContext.Consumer>
                        {({ auth, setAuth }) => (
                            <>
                                <div data-testid="auth">{JSON.stringify(auth)}</div>
                                <button onClick={() => setAuth({ user: 'test' })}>Set Auth</button>
                            </>
                        )}
                    </AuthContext.Consumer>
                </AuthProvider>
            );
        };

        render(<TestComponent />);

        expect(screen.getByTestId('auth').textContent).toBe('{}');

        fireEvent.click(screen.getByText('Set Auth'));

        expect(screen.getByTestId('auth').textContent).toBe('{"user":"test"}');
    });
});