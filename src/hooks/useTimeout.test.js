import { renderHook } from '@testing-library/react';
import useTimeout from './useTimeout';
import TimeoutContext from '../context/TimeoutContext';
import React from 'react';
import { expect } from '@jest/globals';


describe('useTimeout', () => {
    it('should use the TimeoutContext', () => {
        const mockContextValue = { timeout: 1000 };
        const wrapper = ({ children }) => (
            <TimeoutContext.Provider value={mockContextValue}>
                {children}
            </TimeoutContext.Provider>
        );

        const { result } = renderHook(() => useTimeout(), { wrapper });

        expect(result.current).toBe(mockContextValue);
    });
});