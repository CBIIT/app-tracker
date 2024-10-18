import React, { useState } from 'react';
import ApplicantProfile from './ApplicantProfile';
import { render } from '@testing-library/react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { getProfileInfo } from './getProfileInfo';


// Mocking axios
jest.mock('axios');

// Mocking useAuth hook
jest.mock('../../hooks/useAuth');

describe('ApplicantProfile', () => {
    let useStateMock;
    let setHasProfileMock = jest.fn();

    beforeEach(() => {
        useStateMock = jest.spyOn(React, 'useState');
        useStateMock.mockImplementation((hasProfile) => [hasProfile, setHasProfileMock]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls getProfileInfo', async () => {
        const mockData = {
            firstName: 'Luke',
            hasApplications: true,
            hasProfile: true,
            lastinitial: 'S',
            roles: ['x_g_nci_app_tracker', 'snc_internal'],
            tenant: null,
            uid: 'db3ceb081bbec21089b9ece0f54bcbb3',
        };

        const mockProfileData = {
            result: {
                response: {
                    basic_info: {
                        address: '123 test',
                        address_2: null,
                        business_phone: '+1',
                        city: 'tes',
                        country: 'United States',
                        email: 'luke.skywalker@TheForce.com',
                        first_name: 'Luke',
                        highest_level_of_education: 'Doctorate',
                        last_name: 'Skywalker',
                        middle_name: null,
                        number: 'USR0001755',
                        phone: '+11234567890',
                        state_province: 'MD',
                        sys_id: 'f905f9e21b01da10c5c40e1ce54bbcb65',
                        us_citizen: '1',
                        zip_code: '20855'
                    },
                },
            },
        };

        // Mock the useAuth hook call
        useAuth.mockReturnValue({ auth: { mockData } });
        // const user = { mockData};
        // useStateMock.mockImplementation(() => [true, setHasProfileMock]);
        jest.spyOn(ApplicantProfile).mockImplementation(ApplicantProfile, 'getProfileInfo');

        // Mock call from GET_PROFILE
        axios.get.mockResolvedValue(mockProfileData);


        const getProfileInfoSpy = jest.spyOn(getProfileInfo());
        setIsLoading = jest.fn();

        render(<ApplicantProfile />);

    });

    afterAll(() => {
        useStateMock.mockRestore();
    });

    // it('should fetch and set profile if it exists', async () => {

    //     const mockData = {
    //         firstName: 'Luke',
    //         hasApplications: true,
    //         hasProfile: true,
    //         lastinitial: 'S',
    //         roles: ['x_g_nci_app_tracker', 'snc_internal'],
    //         tenant: null,
    //         uid: 'db3ceb081bbec21089b9ece0f54bcbb3',
    //     };

    //     const mockProfileResponse = {
    //         result: {
    //             exists: true,
    //             message: 'User has profile',
    //         },
    //     };

    //     const mockProfileData = {
    //         result: {
    //             response: {
    //                 basic_info: {
    //                     address: '123 test',
    //                     address_2: null,
    //                     business_phone: '+1',
    //                     city: 'tes',
    //                     country: 'United States',
    //                     email: 'luke.skywalker@TheForce.com',
    //                     first_name: 'Luke',
    //                     highest_level_of_education: 'Doctorate',
    //                     last_name: 'Skywalker',
    //                     middle_name: null,
    //                     number: 'USR0001755',
    //                     phone: '+11234567890',
    //                     state_province: 'MD',
    //                     sys_id: 'f905f9e21b01da10c5c40e1ce54bbcb65',
    //                     us_citizen: '1',
    //                     zip_code: '20855'
    //                 },
    //             },
    //         },
    //     };

    //     // Mock the useAuth hook call
    //     useAuth.mockReturnValue({ auth: { mockData } });
    //     jest.spyOn(React, 'useState').mockImplementation((setIsLoading) => [setIsLoading, jest.fn()]);

    //     // Mock CHECK_PROFILE
    //     axios.get.mockResolvedValue(mockProfileResponse);
        
    //     // Mock GET_PROFILE
    //     axios.get.mockResolvedValue(mockProfileData);

    //     render(<BasicInfoTab />);

    // });
});
