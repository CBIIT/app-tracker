import FinalizeVacancy from './FinalizeVacancy';
import { rtRender } from '../../../test-utils';
import React, { useState as usestateMock } from 'react';
import { initialValues } from '../../Forms/FormsInitialValues';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';
import { fireEvent, screen, waitFor } from '@testing-library/react';

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

    test('calls edit handlers for all visible section headers', async () => {
        const clickData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
            },
            vacancyCommittee: [],
            emailTemplates: initialValues.emailTemplates,
        };

        rtRender(
            <FinalizeVacancy
                allForms={clickData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getAllByRole('button', { name: /Edit Section/i }).length).toBe(4);
        });

        const editButtons = screen.getAllByRole('button', { name: /Edit Section/i });
        editButtons.forEach((button) => fireEvent.click(button));

        expect(mockEditButtonClick).toHaveBeenNthCalledWith(1, 0);
        expect(mockEditButtonClick).toHaveBeenNthCalledWith(2, 1);
        expect(mockEditButtonClick).toHaveBeenNthCalledWith(3, 2);
        expect(mockEditButtonClick).toHaveBeenNthCalledWith(4, 3);
    });

    test('renders date fallback branches for close date and scoring due by date', async () => {
        const dateBranchData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
                openDate: '2024-07-01T00:00:00.000Z',
                useCloseDate: true,
                closeDate: undefined,
            },
        };
        
        const scoringMissingData = {
            ...dateBranchData,
            basicInfo: {
                ...dateBranchData.basicInfo,
                closeDate: '2024-07-10T00:00:00.000Z',
                scoringDueByDate: '',
            },
        };

        rtRender(
            <FinalizeVacancy
                allForms={dateBranchData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('7/1/2024')).toBeInTheDocument();
            expect(screen.getByText('! Close Date')).toBeInTheDocument();
        });

        rtRender(
            <FinalizeVacancy
                allForms={scoringMissingData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/Scoring Due By Date/i)).toBeInTheDocument();
        });
    });

    test('renders location and stadtman focus area branch', async () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                tenants: [{ value: 'tenant-1', label: 'Stadtman' }],
                user: {
                    isManager: true,
                    isExecSec: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                }
            },
            currentTenant: 'tenant-1',
        });

        const stadtmanData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
                location: 'Bethesda, MD',
                requireFocusArea: true,
            },
        };

        rtRender(
            <FinalizeVacancy
                allForms={stadtmanData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Bethesda, MD')).toBeInTheDocument();
            expect(screen.getByText('Focus Area')).toBeInTheDocument();
            expect(screen.getByText('Visible')).toBeInTheDocument();
        });
    });

    test('renders reference collection date fallback when date is missing', async () => {
        const refData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
                referenceCollection: true,
                referenceCollectionDate: '',
            },
        };

        rtRender(
            <FinalizeVacancy
                allForms={refData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Reference Collection Date')).toBeInTheDocument();
        });
    });

    test('hides read-only and optional sections when flags are enabled', async () => {
        const hiddenData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
            },
        };

        rtRender(
            <FinalizeVacancy
                allForms={hiddenData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
                readOnlyMember={true}
                hideCommitteeSection={true}
                hideEmails={true}
            />
        );

        await waitFor(() => {
            expect(screen.queryByText('Number of Scoring Categories')).not.toBeInTheDocument();
            expect(screen.queryByText('Mandatory Statements')).not.toBeInTheDocument();
            expect(screen.queryByText('Vacancy Committee')).not.toBeInTheDocument();
            expect(screen.queryByText('Email Templates')).not.toBeInTheDocument();
        });
    });

    test('renders Not Visible when stadtman tenant has requireFocusArea set to false', async () => {
        useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                tenants: [{ value: 'tenant-1', label: 'Stadtman' }],
                user: {
                    isManager: true,
                    isExecSec: false,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
            },
            currentTenant: 'tenant-1',
        });

        const stadtmanDataFocusHidden = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
                location: '',
                requireFocusArea: false,
            },
        };

        rtRender(
            <FinalizeVacancy
                allForms={stadtmanDataFocusHidden}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Focus Area')).toBeInTheDocument();
            expect(screen.getByText('Not Visible')).toBeInTheDocument();
        });
    });

    test('covers location fallback branches by using a stateful location getter', async () => {
        const getterBranchData = {
            ...initialValues,
            basicInfo: {
                ...initialValues.basicInfo,
                appointmentPackageIndicator: 'user-uid',
                vacancyPoc: 'user-uid',
                vacancyPocType: ['User'],
            },
        };

        let locationReadCount = 0;
        Object.defineProperty(getterBranchData.basicInfo, 'location', {
            configurable: true,
            enumerable: true,
            get: () => {
                locationReadCount += 1;
                return locationReadCount % 3 === 1 ? 'Bethesda, MD' : '';
            },
        });

        rtRender(
            <FinalizeVacancy
                allForms={getterBranchData}
                onEditButtonClick={mockEditButtonClick}
                errorSections={[]}
            />
        );

        await waitFor(() => {
            const locationHeading = screen.getByRole('heading', { name: /Location/i });
            expect(locationHeading.textContent).toBe('! Location');
            expect(screen.queryByText('Bethesda, MD')).not.toBeInTheDocument();
        });
    });
});