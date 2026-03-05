import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import ContentTitle from './ContentTitle/ContentTitle';
import Footer from '../../components/Footer/Footer';
import useAuth from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('Layout', () => {
    it('renders Header, NavBar, ContentTitle, Footer and children correctly when a user is logged in', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    uid: 'Skywalker',
                    isManager: false,
                    isChair: false,
                    roles: [],
                    hasApplications: true
                }
            }
        });

        const { getAllByText } = render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const homeLinks = getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);
        const homeLink = homeLinks.find(link => link.getAttribute('href') === '/');
        expect(homeLink).toBeInTheDocument();

        const yourApplicationsLinks = getAllByText('Your Applications');
        expect(yourApplicationsLinks.length).toBeGreaterThan(0);
        const yourApplicationsLink = yourApplicationsLinks.find(link => link.getAttribute('href') === '/applicant-dashboard/');
        expect(yourApplicationsLink).toBeInTheDocument();
    });

    it('renders Header, NavBar, ContentTitle, Footer and children correctly when a manager is logged in', () => {
        useAuth.mockReturnValue({
            currentTenant: 'tenant 1',
            auth: {
                isUserLoggedIn: true,
                user: {
                    uid: 'Skywalker',
                    isManager: true,
                    isExecSec: true,
                    isChair: false,
                    roles: [],
                    hasApplications: false
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
                    }
                ],
            }
        });

        const { getAllByText } = render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const homeLinks = getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);
        const homeLink = homeLinks.find(link => link.getAttribute('href') === '/');
        expect(homeLink).toBeInTheDocument();

        const vacancyDashboardLinks = getAllByText('Vacancy Dashboard');
        expect(vacancyDashboardLinks.length).toBeGreaterThan(0);
        const vacancyDashboardLink = vacancyDashboardLinks.find(link => link.getAttribute('href') === '/vacancy-dashboard');
        expect(vacancyDashboardLink).toBeInTheDocument();

        const reportsLinks = getAllByText('Reports');
        expect(reportsLinks.length).toBeGreaterThan(0);
        const reportsLink = reportsLinks.find(link => link.getAttribute('href') === '/nav_to.do?uri=%2F$pa_dashboard.do%3Fsysparm_dashboard%3D326711461bf2a910e541631ee54bcbec');
        expect(reportsLink).toBeInTheDocument();
    });

    it('renders Header, NavBar, ContentTitle, Footer and children correctly when a committee member is logged in', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    uid: 'Skywalker',
                    isManager: false,
                    isExecSec: false,
                    isChair: false,
                    roles: ['x_g_nci_app_tracke.committee_member'],
                    hasApplications: false
                },
                tenants: [
                    {
                        "value": "tenant 1",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": true,
                        "is_read_only_user": true,
                        "is_chair": true,
                    }
                ],

            },
            currentTenant: 'tenant 1',
        });

        const { getAllByText } = render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const homeLinks = getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);
        const homeLink = homeLinks.find(link => link.getAttribute('href') === '/');
        expect(homeLink).toBeInTheDocument();

        const yourVacanciesLinks = getAllByText('Your Vacancies');
        expect(yourVacanciesLinks.length).toBeGreaterThan(0);
        const yourVacanciesLink = yourVacanciesLinks.find(link => link.getAttribute('href') === '/committee-dashboard/');
        expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    });

    it('renders Header, NavBar, ContentTitle, Footer and children correctly when a chair is logged in', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    uid: 'Skywalker',
                    isManager: false,
                    isExecSec: false,
                    isChair: true,
                    roles: [],
                    hasApplications: false
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
                    }
                ],
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });

        const { getAllByText } = render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const homeLinks = getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);
        const homeLink = homeLinks.find(link => link.getAttribute('href') === '/');
        expect(homeLink).toBeInTheDocument();

        const yourVacanciesLinks = getAllByText('Your Vacancies');
        expect(yourVacanciesLinks.length).toBeGreaterThan(0);
        const yourVacanciesLink = yourVacanciesLinks.find(link => link.getAttribute('href') === '/chair-dashboard/');
        expect(screen.getByText('Your Vacancies')).toBeInTheDocument();
    });

    it('renders Header, NavBar, ContentTitle, Footer and children correctly when user is not logged in', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: false,
                user: {}
            }
        });

        const { getAllByText, getByText } = render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const homeLinks = getAllByText('Home');
        expect(homeLinks.length).toBeGreaterThan(0);
        const homeLink = homeLinks.find(link => link.getAttribute('href') === '/');
        expect(homeLink).toBeInTheDocument();

        const nihHiringExperience = getByText('The NIH Hiring Experience');
        expect(nihHiringExperience).toBeInTheDocument();
    });

    test('renders banner Alert when auth contains bannerMessage and description', () => {
        useAuth.mockReturnValue({
            auth: {
                bannerMessage: 'System maintenance planned',
                bannerDescription: 'The site will be down <strong>tonight</strong> from 11pm-1am.',
            },
        });

        render(
            <MemoryRouter>
                <Layout>ChildContent</Layout>
            </MemoryRouter>
        );

        // banner message is shown
        expect(screen.getByText('System maintenance planned')).toBeInTheDocument();
        expect(screen.getByText(/tonight/i)).toBeInTheDocument();
    });

    test('does not render banner Alert when auth has no bannerMessage', () => {
        useAuth.mockReturnValue({
            auth: {
                // no bannerMessage or bannerDescription provided
            }
        });

        render(
            <MemoryRouter>
                <Layout>ChildContent</Layout>
            </MemoryRouter>
        );

        // Antd Alert renders with role="alert" — ensure it's not present
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

});