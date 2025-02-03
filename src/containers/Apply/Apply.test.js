import { render } from '@testing-library/react';
import Apply from './Apply';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import checkAuth from '../../constants/checkAuth';
import { SAVE_APP_DRAFT } from '../../constants/ApiEndpoints';
import { use } from 'react';

jest.mock('../../hooks/useAuth');
jest.mock('../../constants/checkAuth');
jest.mock('axios');

describe('Apply component', () => {

    beforeEach(() => {
        const mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

});