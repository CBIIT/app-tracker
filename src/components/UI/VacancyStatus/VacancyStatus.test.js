import React from 'react';
import { render } from '@testing-library/react';
import VacancyStatus from './VacancyStatus';

// Mock window.matchMedia
beforeEach(() => {
    window.matchMedia = window.matchMedia || function () {
        return {
            matches: false,
            addListener: function () { },
            removeListener: function () { }
        };
    };
});

describe('VacancyStatus Component', () => {
    it('renders without crashing', () => {
        const { container } = render(<VacancyStatus state="Triage" />);
        expect(container).toBeInTheDocument();
    });

    it('displays the correct step for Triage', () => {
        const { getByText } = render(<VacancyStatus state="Triage" />);
        expect(getByText('Triage')).toBeInTheDocument();
    });

    it('displays the correct step for Individual Scoring in Progress', () => {
        const { getByText } = render(<VacancyStatus state="Individual Scoring in Progress" />);
        expect(getByText('Individual Scoring')).toBeInTheDocument();
    });

    it('displays the correct step for Committee Review in Progress', () => {
        const { getByText } = render(<VacancyStatus state="Committee Review in Progress" />);
        expect(getByText('Committee Review')).toBeInTheDocument();
    });

    it('displays the correct step for Voting Complete', () => {
        const { getByText } = render(<VacancyStatus state="Voting Complete" />);
        expect(getByText('Voting Complete')).toBeInTheDocument();
    });

    it('sets the correct current step for Triage', () => {
        const { container } = render(<VacancyStatus state="Triage" />);
        const steps = container.querySelectorAll('.ant-steps-item');
        expect(steps[0]).toHaveClass('ant-steps-item-active');
    });

    it('sets the correct current step for Individual Scoring in Progress', () => {
        const { container } = render(<VacancyStatus state="Individual Scoring in Progress" />);
        const steps = container.querySelectorAll('.ant-steps-item');
        expect(steps[1]).toHaveClass('ant-steps-item-active');
    });

    it('sets the correct current step for Committee Review in Progress', () => {
        const { container } = render(<VacancyStatus state="Committee Review in Progress" />);
        const steps = container.querySelectorAll('.ant-steps-item');
        expect(steps[2]).toHaveClass('ant-steps-item-active');
    });

    it('sets the correct current step for Voting Complete', () => {
        const { container } = render(<VacancyStatus state="Voting Complete" />);
        const steps = container.querySelectorAll('.ant-steps-item');
        expect(steps[3]).toHaveClass('ant-steps-item-active');
    });
});