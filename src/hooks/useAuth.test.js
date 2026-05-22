import { renderHook } from '@testing-library/react-hooks';
import useAuth from './useAuth';
import AuthContext from '../context/AuthContext';
import React from 'react';
import { expect } from '@jest/globals';

describe('useAuth', () => {
    it('should use AuthContext', () => {
        const mockAuthContextValue = { user: 'testUser' };
        const wrapper = ({ children }) => (
            <AuthContext.Provider value={mockAuthContextValue}>
                {children}
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current).toBe(mockAuthContextValue);
    });
});