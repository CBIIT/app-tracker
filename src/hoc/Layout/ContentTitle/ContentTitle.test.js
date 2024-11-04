import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ContentTitle from './ContentTitle';
import { routeTitles } from '../RouteTitles';
import { EDIT_VACANCY, EDIT_DRAFT, VACANCY_DASHBOARD } from '../../../constants/Routes';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

describe('ContentTitle', () => {
    const mockUseLocation = jest.requireMock('react-router-dom').useLocation;

    it('should render the correct title from routeTitles', () => {
        const testPath = '/test-path';
        routeTitles[testPath] = 'Test Title';
        mockUseLocation.mockReturnValue({ pathname: testPath });

        const { getByText } = render(
            <MemoryRouter initialEntries={[testPath]}>
                <ContentTitle />
            </MemoryRouter>
        );

        expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('should render "Edit Draft Vacancy" for EDIT_DRAFT path', () => {
        const testPath = `/some-path/${EDIT_DRAFT}`;
        mockUseLocation.mockReturnValue({ pathname: testPath });

        const { getByText } = render(
            <MemoryRouter initialEntries={[testPath]}>
                <ContentTitle />
            </MemoryRouter>
        );

        expect(getByText('Edit Draft Vacancy')).toBeInTheDocument();
    });

    it('should render "Edit Vacancy" for EDIT_VACANCY path', () => {
        const testPath = `/some-path/${EDIT_VACANCY}`;
        mockUseLocation.mockReturnValue({ pathname: testPath });

        const { getByText } = render(
            <MemoryRouter initialEntries={[testPath]}>
                <ContentTitle />
            </MemoryRouter>
        );

        expect(getByText('Edit Vacancy')).toBeInTheDocument();
    });

    it('should render "Vacancy Dashboard" for VACANCY_DASHBOARD path', () => {
        const testPath = `/some-path/${VACANCY_DASHBOARD}`;
        mockUseLocation.mockReturnValue({ pathname: testPath });

        const { getByText } = render(
            <MemoryRouter initialEntries={[testPath]}>
                <ContentTitle />
            </MemoryRouter>
        );

        expect(getByText('Vacancy Dashboard')).toBeInTheDocument();
    });

    it('should not render anything if no title is found', () => {
        const testPath = '/unknown-path';
        mockUseLocation.mockReturnValue({ pathname: testPath });

        const { container } = render(
            <MemoryRouter initialEntries={[testPath]}>
                <ContentTitle />
            </MemoryRouter>
        );

        expect(container.querySelector('h1').textContent).toBe('');
    });
});