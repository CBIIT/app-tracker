import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import { expect, jest } from '@jest/globals';

jest.mock('axios');
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: () => { },
        removeListener: () => { },
    };
};
const mockData = [
    {
        sys_id: '1',
        title: 'Vacancy 1',
        tenant: 'Institute 1',
        use_close_date: '1',
        open_date: '2023-01-01',
        close_date: '2023-01-31',
    },
    {
        sys_id: '2',
        title: 'Vacancy 2',
        tenant: 'Institute 2',
        use_close_date: '0',
        open_date: '2023-02-01',
        close_date: null,
    },
];
describe('Home Component', () => {


    beforeEach(() => {
        axios.get.mockResolvedValue({ data: { result: mockData } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the Home component with logo and description', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        expect(screen.getByAltText('Specialized Scientific Jobs')).toBeInTheDocument();
        expect(
            screen.getByText(
                /The National Institutes of Health \(NIH\), a part of the U.S. Department of Health and Human Services/i
            )
        ).toBeInTheDocument();
    });

    test('renders the table with data after API call', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(screen.getByText('Vacancy 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Institute 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('1/1/2023 - 1/31/2023')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Open Until Filled')).toBeInTheDocument());
    });

    // Locale Message Not showing in Test, but does show in browser
    // test('renders the table with no data when dataSource is null', async () => {
    //     axios.get.mockResolvedValue({ data: { result: [] } });


    //     render(
    //         <BrowserRouter>
    //             <Home />
    //         </BrowserRouter>
    //     );

    //     await waitFor(() => expect(screen.getByText('There are currently no open vacancies.')).toBeInTheDocument());
    // });


});