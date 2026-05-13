import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from './NavBar';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

jest.mock('../../hooks/useAuth');
jest.mock('axios');

describe('NavBar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({
            data: {
                result: {
                    list: [{ status: 'open' }],
                },
            },
        });
    });

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

    it('renders Your Vacancies link for chair', async () => {
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

        await waitFor(() => {
            expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
        });
    });

    it('does not render Chair in Your Vacancies when all chair vacancies are live or final', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                result: {
                    list: [{ status: 'live' }, { status: 'final' }],
                },
            },
        });

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
                        value: 'f24965fc1b9c11106daea681f54bcb04',
                        label: 'tenant 1',
                        roles: [
                            'x_g_nci_app_tracke.vacancy_manager',
                            'x_g_nci_app_tracke.committee_member'
                        ],
                        is_exec_sec: false,
                        is_read_only_user: false,
                        is_chair: true,
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

        await waitFor(() => {
            expect(screen.queryByText('Your Vacancies')).not.toBeInTheDocument();
            expect(screen.queryByText('Chair')).not.toBeInTheDocument();
        });
    });

    it('renders Chair in Your Vacancies when at least one vacancy is not live or final', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                result: {
                    list: [{ status: 'live' }, { status: 'open' }],
                },
            },
        });

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
                        value: 'f24965fc1b9c11106daea681f54bcb04',
                        label: 'tenant 1',
                        roles: [
                            'x_g_nci_app_tracke.vacancy_manager',
                            'x_g_nci_app_tracke.committee_member'
                        ],
                        is_exec_sec: false,
                        is_read_only_user: false,
                        is_chair: true,
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

        await waitFor(() => {
            expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
        });
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

    it('opens NIH jobs page when The NIH Hiring Experience is clicked', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: false,
                user: {}
            }
        });

        const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('The NIH Hiring Experience'));

        expect(windowOpenSpy).toHaveBeenCalledWith('https://hr.nih.gov/jobs', '_blank');
        windowOpenSpy.mockRestore();
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