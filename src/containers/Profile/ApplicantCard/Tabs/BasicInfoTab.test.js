import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BasicInfoTab from './BasicInfoTab';
import ProfileContext from '../../Util/FormContext';

// Mock EditableBasicInfo
jest.mock('../../Forms/EditableBasicInfo/EditableBasicInfo', () => ({ setBasicOpen }) => (
    <div data-testid="editable-basic-info">EditableBasicInfo</div>
));

const mockProfile = {
    basicInfo: {
        address: {
            address: '123 Main St',
            address2: 'Apt 4',
            city: 'Bethesda',
            stateProvince: 'MD',
            zip: '20892',
            country: 'USA',
        },
        email: 'test@example.com',
        phonePrefix: '+1',
        phone: '3015551234',
        businessPhonePrefix: '+1',
        businessPhone: '3015555678',
        highestLevelEducation: 'PhD',
        isUsCitizen: '1',
    },
};

const renderWithContext = (contextValue) =>
    render(
        <ProfileContext.Provider value={contextValue}>
            <BasicInfoTab />
        </ProfileContext.Provider>
    );

describe('BasicInfoTab', () => {

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

    it('renders info when hasProfile is true', () => {
        renderWithContext({ profile: mockProfile, hasProfile: true });

        expect(screen.getByText(/Your user profile stores key details/i)).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Address')).toBeInTheDocument();
        expect(screen.getByText(/123 Main St Apt 4/)).toBeInTheDocument();
        expect(screen.getByText(/Bethesda, MD 20892/)).toBeInTheDocument();
        const country = screen.getByText(/USA/i);
        expect(country).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Phone')).toBeInTheDocument();
        expect(screen.getByText('+1 (301) 555 - 1234')).toBeInTheDocument();
        expect(screen.getByText('Business Phone')).toBeInTheDocument();
        expect(screen.getByText('+1 (301) 555 - 5678')).toBeInTheDocument();
        expect(screen.getByText('Highest Level of Education')).toBeInTheDocument();
        expect(screen.getByText('PhD')).toBeInTheDocument();
        expect(screen.getByText('US Citizenship')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('shows EditableBasicInfo when hasProfile is false', () => {
        renderWithContext({ profile: mockProfile, hasProfile: false });
        expect(screen.getByTestId('editable-basic-info')).toBeInTheDocument();
    });

    it('shows EditableBasicInfo after clicking Edit', () => {
        renderWithContext({ profile: mockProfile, hasProfile: true });
        fireEvent.click(screen.getByText('Edit'));
        expect(screen.getByTestId('editable-basic-info')).toBeInTheDocument();
    });

    it('shows "No" for US Citizenship when isUsCitizen is not "1"', () => {
        const profile = {
            ...mockProfile,
            basicInfo: { ...mockProfile.basicInfo, isUsCitizen: '0' },
        };
        renderWithContext({ profile, hasProfile: true });
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('does not render Business Phone section if businessPhone is missing', () => {
        const profile = {
            ...mockProfile,
            basicInfo: { ...mockProfile.basicInfo, businessPhone: '' },
        };
        renderWithContext({ profile, hasProfile: true });
        expect(screen.queryByText('Business Phone')).not.toBeInTheDocument();
    });

    it('renders address without address2 if not present', () => {
        const profile = {
            ...mockProfile,
            basicInfo: {
                ...mockProfile.basicInfo,
                address: {
                    ...mockProfile.basicInfo.address,
                    address2: '',
                },
            },
        };
        renderWithContext({ profile, hasProfile: true });
        const address = screen.getByText(/123 Main St/);
        expect(address).toBeInTheDocument();
    });
});