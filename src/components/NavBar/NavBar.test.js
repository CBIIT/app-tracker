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
                }
            }
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
                    isExecSec: true,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                }
            }
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
                    isChair: true,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                }
            }
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

    it('renders Profile link for logged in users', () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: false,
                    isChair: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                }
            }
        });

        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );

        expect(screen.getByText('Profile')).toBeInTheDocument();
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
});