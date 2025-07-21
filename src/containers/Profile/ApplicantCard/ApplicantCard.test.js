import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ApplicantCard from './ApplicantCard';
import ProfileContext from '../Util/FormContext';

// Mock the child tabs
jest.mock('./Tabs/BasicInfoTab', () => () => <div>Basic Info Tab Content</div>);
jest.mock('./Tabs/DemographicTab', () => () => <div>Demographic Tab Content</div>);

const mockProfile = {
    profile: {
        basicInfo: {
            firstName: 'John',
            lastName: 'Doe',
        },
    },
};

const renderWithContext = (profile = mockProfile) => {
    return render(
        <ProfileContext.Provider value={profile}>
            <ApplicantCard />
        </ProfileContext.Provider>
    );
};

describe('ApplicantCard', () => {

         // Mock window.matchMedia
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
        });
    });

    afterEach(() => {
		jest.clearAllMocks();
	});

    it('renders the applicant name and initials in the avatar', () => {
        renderWithContext();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        // Initials should be "JD"
        expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows Basic Info Tab content by default', () => {
        renderWithContext();
        expect(screen.getByText('Basic Info Tab Content')).toBeInTheDocument();
    });

    // Not sure if Demographics is coming back so left this out to be safe
    // it('switches to Demographics tab when clicked', () => {
    //     renderWithContext();
    //     // Find the Demographics tab button
    //     const demographicsTab = screen.getByRole('tab', { name: /Demographics/i });
    //     fireEvent.click(demographicsTab);
    //     expect(screen.getByText('Demographic Tab Content')).toBeInTheDocument();
    // });

    it('renders with different applicant names', () => {
        const customProfile = {
            profile: {
                basicInfo: {
                    firstName: 'Alice',
                    lastName: 'Smith',
                },
            },
        };
        renderWithContext(customProfile);
        expect(screen.getByText('Alice Smith')).toBeInTheDocument();
        expect(screen.getByText('AS')).toBeInTheDocument();
    });
});