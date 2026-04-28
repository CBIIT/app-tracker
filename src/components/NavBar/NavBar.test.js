import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';
import useAuth from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('NavBar', () => {
    it('renders Home link', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: false,
                user: {}
            }
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders Vacancy Dashboard link for managers', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: true,
                    isExecSec: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        value: 'f24965fc1b9c11106daea681f54bcb04',
                        label: 'tenant 1',
                        roles: [
                            'x_g_nci_app_tracke.vacancy_manager',
                            'x_g_nci_app_tracke.committee_member'
                        ],
                        is_exec_sec: false,
                        is_read_only_user: false,
                        is_chair: false,
                        is_hr: false,
                    }
                ],
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Vacancy Dashboard')).toBeInTheDocument();
    });

    it('renders Your Vacancies link for exec sec', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: true,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        "value": "f24965fc1b9c11106daea681f54bcb04",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": true,
                        "is_read_only_user": true,
                        "is_chair": true,
                        "is_hr": false,
                    }
                ],
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    });

    it('renders Your Vacancies link for chair', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        "value": "f24965fc1b9c11106daea681f54bcb04",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": true,
                        "is_read_only_user": true,
                        "is_chair": true,
                        "is_hr": false,
                    }
                ],
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    });

    it('renders Vacancy dashboard and Your Vacancies link for manager as well as chair', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: true,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        "value": "f24965fc1b9c11106daea681f54bcb04",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": true,
                        "is_read_only_user": true,
                        "is_chair": true,
                        "is_hr": false,
                    }
                ],
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Vacancy Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    });

    it('renders Your Vacancies link for HR Specialist', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        "value": "f24965fc1b9c11106daea681f54bcb04",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": false,
                        "is_read_only_user": false,
                        "is_chair": false,
                        "is_hr": true,
                    }
                ],
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });

         render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    });

    it('renders Your Applications link for applicants', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: false,
                    isChair: false,
                    roles: [],
                    hasApplications: true,
                    uid: '123'
                }
            }
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Your Applications')).toBeInTheDocument();
    });

    it('renders The NIH Hiring Experience link for logged out users', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: false,
                user: {}
            }
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('The NIH Hiring Experience')).toBeInTheDocument();
    });

    it('does not render Vacancy Dashboard when manager has no selected tenant', () => {
         useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: true,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        "value": "f24965fc1b9c11106daea681f54bcb04",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": true,
                        "is_read_only_user": true,
                        "is_chair": true,
                        "is_hr": false,
                    }
                ],
            },
            currentTenant: '',
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.queryByText('Vacancy Dashboard')).not.toBeInTheDocument();
    });

    // leave as a comment for future use when we can figure out how to cover lines 46-57 in NvaBar
    
    // it('renders message to select a tenant when clicking Your Vacancies', () => {
    //     useAuth.mockReturnValue({
    //         auth: {
    //             isUserLoggedIn: true,
    //             user: {
    //                 isManager: true,
    //                 roles: [
    //                      "x_g_nci_app_tracke.vacancy_manager",
    //                      "x_g_nci_app_tracke.committee_member"
    //                ],
    //                 hasApplications: false,
    //                 uid: '123'
    //             },
    //             tenants: [
    //                 {
    //                     "value": "f24965fc1b9c11106daea681f54bcb04",
    //                     "label": "tenant 1",
    //                     "roles": [
    //                         "x_g_nci_app_tracke.vacancy_manager",
    //                         "x_g_nci_app_tracke.committee_member"
    //                     ],
    //                     "is_exec_sec": true,
    //                     "is_read_only_user": true,
    //                     "is_chair": true,
    //                     "is_hr": false,
    //                 }
    //             ],
    //         },
    //         currentTenant: '123',
    //     });

    //     render(
    //         <MemoryRouter>
    //             <NavBar />
    //         </MemoryRouter>
    //     );

    //     expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    //     fireEvent.click(screen.getByText('Your Vacancies'));

    //     waitFor(() => {
    //         expect(screen.getByText('Please select a tenant to see Your Vacancies.')).toBeInTheDocument();
    //     });
    // });
});