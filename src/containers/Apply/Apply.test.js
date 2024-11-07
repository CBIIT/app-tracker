import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { message } from 'antd';
import Apply from './Apply';
import ApplicantDocuments from './Forms/ApplicantDocuments/ApplicantDocuments';
import useAuth from '../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useHistory: jest.fn(),
}));
jest.mock('../../hooks/useAuth');
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    },
}));

const mockUseAuth = {
    auth: {
        iTrustGlideSsoId: 'testSsoId',
        iTrustUrl: 'https://test.itrust.com',
        isUserLoggedIn: false,
        user: { firstName: 'John', lastInitial: 'D' },
        oktaLoginAndRedirectUrl: 'https://test.okta.com',

    },
};

const mockUser = {
    data: {
        results: {
            response: {
                basic_info: {
                    address: '123 Main St',
                    address_2: null,
                    business_phone: '+1',
                    city: 'tes',
                    country: 'United States',
                    email: 'luke.skywalker@TheForce.com',
                    first_name: 'Luke',
                    highest_level_of_education: 'Doctorate',
                    last_name: 'Skywalker',
                    middle_name: null,
                    number: 'USR0000001',
                    phone: '+11234567890',
                    state_province: 'MD',
                    sys_id: '123',
                    us_citizen: 'Yes',
                    zip_code: '20855'
                }
            },
        },
    },
};

const mockVacancyProps = {
    closeDate: '',
    openDate: '2024-09-13',
    sysId: '456',
    title: 'Vacancy Title',
    vacancyPOC: {
        email: 'vacancy.poc@email.com',
        name: 'Vacancy POC',
        value: '789',
    },
    vacancyState: 'rolling_close',
    vacancyStatus: 'open',
};



describe('Apply', () => {
    let mockUseAuth;

    beforeEach(() => {
        mockUseAuth = {
            auth: { isUserLoggedIn: true, user: { hasProfile : true} },
        };

        useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn() 
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // New Application test cases
    // fetches Profile data
    // it('should fetch profile data', async () => {
    //     useParams.mockReturnValue({ sysId: '123' });

    //     axios.get.mockResolvedValue({ data: { results: { exists: true } } });
    //     axios.get.mockResolvedValue({ mockUser});

    //     render(<Apply {...mockUser} {...mockVacancyProps} {...mockUseAuth} />);

    // });

    it('handles error while fetching profile data', async () => {
        useParams.mockReturnValue({ sysId: '123' });

        axios.get.mockRejectedValue(new Error('profile not found'));
        
    });

    // render applicant documents page with optional and mandatory documents

    // renders reference section with number of references

    // renders Additional Questions section

    // renders Review Section



    // Edit Draft Application test cases






    // Edit Submitted Application test cases
    

});