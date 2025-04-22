import React from 'react';
import { render } from '@testing-library/react';
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

        const profileLinks = getAllByText('Profile');
        expect(profileLinks.length).toBeGreaterThan(0);
        const profileLink = profileLinks.find(link => link.getAttribute('href') === '/profile/Skywalker');
        expect(profileLink).toBeInTheDocument();

        const yourApplicationsLinks = getAllByText('Your Applications');
        expect(yourApplicationsLinks.length).toBeGreaterThan(0);
        const yourApplicationsLink = yourApplicationsLinks.find(link => link.getAttribute('href') === '/applicant-dashboard/');
        expect(yourApplicationsLink).toBeInTheDocument();
    });

    it('renders Header, NavBar, ContentTitle, Footer and children correctly when a manager is logged in', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    uid: 'Skywalker',
                    isManager: true,
                    isExecSec: true,
                    isChair: false,
                    roles: [],
                    hasApplications: false
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

        const vacancyDashboardLinks = getAllByText('Vacancy Dashboard');
        expect(vacancyDashboardLinks.length).toBeGreaterThan(0);
        const vacancyDashboardLink = vacancyDashboardLinks.find(link => link.getAttribute('href') === '/vacancy-dashboard');
        expect(vacancyDashboardLink).toBeInTheDocument();

        const yourVacanciesLinks = getAllByText('Your Vacancies');
        expect(yourVacanciesLinks.length).toBeGreaterThan(0);
        const yourVacanciesLink = yourVacanciesLinks.find(link => link.getAttribute('href') === '/committee-dashboard/');
        expect(yourVacanciesLink).toBeInTheDocument();

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

        const yourVacanciesLinks = getAllByText('Your Vacancies');
        expect(yourVacanciesLinks.length).toBeGreaterThan(0);
        const yourVacanciesLink = yourVacanciesLinks.find(link => link.getAttribute('href') === '/committee-dashboard/');
        expect(yourVacanciesLink).toBeInTheDocument();
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

        const yourVacanciesLinks = getAllByText('Your Vacancies');
        expect(yourVacanciesLinks.length).toBeGreaterThan(0);
        const yourVacanciesLink = yourVacanciesLinks.find(link => link.getAttribute('href') === '/chair-dashboard/');
        expect(yourVacanciesLink).toBeInTheDocument();
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
});