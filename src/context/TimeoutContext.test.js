import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeoutContext, { TimeoutProvider } from './TimeoutContext';
import { expect } from '@jest/globals';


describe('TimeoutContext', () => {
    it('provides default values', () => {
        render(
            <TimeoutProvider>
                <TimeoutContext.Consumer>
                    {({ modalTimeout, setModalTimeout }) => (
                        <>
                            <div data-testid="modalTimeout">{JSON.stringify(modalTimeout)}</div>
                            <div data-testid="setModalTimeout">{typeof setModalTimeout}</div>
                        </>
                    )}
                </TimeoutContext.Consumer>
            </TimeoutProvider>
        );

        expect(screen.getByTestId('modalTimeout')).toHaveTextContent('{}');
        expect(screen.getByTestId('setModalTimeout')).toHaveTextContent('function');
    });
});