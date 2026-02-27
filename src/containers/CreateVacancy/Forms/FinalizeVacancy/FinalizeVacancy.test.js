import FinalizeVacancy from './FinalizeVacancy';
import { rtRender } from '../../../test-utils';
import React, { useState as usestateMock } from 'react';
import { initialValues } from '../../Forms/FormsInitialValues';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';
import { screen, waitFor } from '@testing-library/react';

jest.mock('../../../../hooks/useAuth');
jest.mock('axios');

const mockEditButtonClick = jest.fn();

window.matchMedia =
    window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: function () { },
            removeListener: function () { },
        };
    };


describe('FinalizeVacancy component tests', () => {
    let data;

    beforeEach(() => {
        document.getSelection = () => {
            return {
                removeAllRanges: () => { },
                addRange: () => { },
                getRangeAt: () => { },
            }
        }
        axios.get.mockResolvedValue({
            data: {
                result: {
                    package_initiators: [
                        {
                            sys_id: 'user-uid',
                            name: 'Jane Smith',
                            email: 'jane.smith@example.com',
                        },
                        {
                            sys_id: 'other-uid',
                            name: 'Other Person',
                            email: 'other.person@example.com',
                        },
                    ],
                },
            },
        });
        axios.post.mockResolvedValue({ data: {} });

        data = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
            },
            currentTenant: 'current-Tenant',
        };

        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                iTrustGlideSsoId: 'itrust123',
                oktaGlideSsoId: 'okta123',
                user: {
                    isManager: true,
                    isExecSec: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                }
            }
        });

    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    test('<FinalizeVacancy /> crash test', async () => {

        rtRender(<FinalizeVacancy
            allForms={jest.fn().mockImplementationOnce(() => data)}
            onEditButtonClick={mockEditButtonClick}
            errorSections={[]}
        />)

        await waitFor(() => {
            expect(true).toBe(true);
        });
    });

    test('renders FinalizeVacancy with vacancyPoc type as Both', async () => {
        const bothData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocEmail: 'team-distribution@example.com',
                vacancyPocType: ['Both'],
                isUserPoc: 'no',
            },
            currentTenant: 'current-Tenant',
        };

        rtRender(
            <FinalizeVacancy
                allForms={bothData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        // wait for Jane Smith (from package_initiators) to render
        await waitFor(() => {
            expect(screen.getByText((content, element) => {
                return element && /Name:\s+Jane Smith,\s+Email:\s+jane\.smith@example\.com/i.test(content);
            })).toBeInTheDocument();
        }, { timeout: 3000 });

        // assert email distribution list is also displayed
        expect(screen.getByText(/team-distribution@example.com/i)).toBeInTheDocument();
    });

    test('renders FinalizeVacancy with vacancyPoc type as Email Distribution List', async () => {
        const emailDistListData = {
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: undefined,
                vacancyPocEmail: 'team-distribution@example.com',
                vacancyPocType: ['Email Distribution List'],
                isUserPoc: 'no',
            },
            mandatoryStatements: initialValues.mandatoryStatements || {},
            vacancyCommittee: initialValues.vacancyCommittee || {},
            emailTemplates: initialValues.emailTemplates || {},
        };

        rtRender(
            <FinalizeVacancy
                allForms={emailDistListData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        // wait for email distribution list to render
        await waitFor(() => {
            expect(screen.getByText(/team-distribution@example\.com/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        const pocHeading = screen.getByRole('heading', {
            name: /Vacancy Point of Contact Information/i,
        });
        expect(pocHeading.textContent).toBe('Vacancy Point of Contact Information');

    });

    test('renders FinalizeVacancy with vacancyPoc type as User', async () => {
        const userPOCData = {
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocEmail: undefined,
                vacancyPocType: ['User'],
                isUserPoc: 'yes',
            },
            mandatoryStatements: initialValues.mandatoryStatements || {},
            vacancyCommittee: initialValues.vacancyCommittee || {},
            emailTemplates: initialValues.emailTemplates || {},
        };

        const { getByTestId } = rtRender(
            <FinalizeVacancy
                allForms={userPOCData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(getByTestId('vacancy-poc-display')).toBeInTheDocument();
        }, { timeout: 3000 });

    });

    test('shows exclamation in POC heading when Email Distribution List is missing email value', async () => {
        const missingEmailDistListData = {
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: undefined,
                vacancyPocEmail: undefined,
                vacancyPocType: ['Email Distribution List'],
                isUserPoc: 'no',
            },
            mandatoryStatements: initialValues.mandatoryStatements || {},
            vacancyCommittee: initialValues.vacancyCommittee || {},
            emailTemplates: initialValues.emailTemplates || {},
        };

        rtRender(
            <FinalizeVacancy
                allForms={missingEmailDistListData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            const pocHeading = screen.getByText(/Vacancy Point of Contact Information/i, {
                selector: 'h2',
            });
            expect(pocHeading.textContent).toBe('! Vacancy Point of Contact Information');
        }, { timeout: 3000 });
        
    });
});