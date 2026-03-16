import React from 'react';
import { expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DemographicsStepForm from './DemographicsStepForm';
import FormContext from '../../../Context';
import { Form } from 'antd';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

const mockSetCurrentFormInstance = jest.fn();

const renderComponent = (formData = {}) => {
    const contextValue = {
        formData,
        setCurrentFormInstance: mockSetCurrentFormInstance,
    };

    return render(
        <FormContext.Provider value={contextValue}>
            <DemographicsStepForm />
        </FormContext.Provider>
    );
};

describe('DemographicsStepForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form with initial values', () => {
        renderComponent({ questions: { share: '0' } });

        expect(screen.getByText('Your privacy is protected.')).toBeInTheDocument();
        expect(screen.getByText('I want to share my demographic details and help improve the hiring process.')).toBeInTheDocument();
        expect(screen.getByText('I do not want to answer the demographic questions.')).toBeInTheDocument();
    });

    it('calls setCurrentFormInstance on mount', () => {
        renderComponent();

        expect(mockSetCurrentFormInstance).toHaveBeenCalled();
    });

    it('shows additional questions when "I want to share my demographic details" is selected', () => {
        renderComponent();

        fireEvent.click(screen.getByLabelText('I want to share my demographic details and help improve the hiring process.'));

        expect(screen.getByText('Sex')).toBeInTheDocument();
        expect(screen.getByText('Ethnicity')).toBeInTheDocument();
        expect(screen.getByText('Race')).toBeInTheDocument();
        expect(screen.getByText('Disability/Serious Health Condition')).toBeInTheDocument();
    });

    it('hides additional questions when "I do not want to answer the demographic questions" is selected', () => {
        renderComponent({ questions: { share: '1' } });

        fireEvent.click(screen.getByLabelText('I do not want to answer the demographic questions.'));

        expect(screen.queryByLabelText('Sex')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Ethnicity')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Race')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Disability/Serious Health Condition')).not.toBeInTheDocument();
    });
});