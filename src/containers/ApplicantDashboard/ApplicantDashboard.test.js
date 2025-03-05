import ApplicantDashboard from './ApplicantDashboard';
import { Link, useHistory } from 'react-router-dom';
import { 
    GET_USER_APPLICATIONS, 
    REMOVE_USER_APPLICATION_DRAFT, 
    WITHDRAW_USER_APPLICATION 
} from '../../constants/ApiEndpoints';
import { 
    EDIT_APPLICATION, 
    VIEW_APPLICATION 
} from '../../constants/Routes';
import axios from 'axios';
import { useFetch } from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { checkAuth } from '../../constants/checkAuth';

jest.mock('react-router-dom', () => ({
    Link: 'Link',
    useHistory: 'useHistory'
}));
jest.mock('axios');


describe('ApplicantDashboard', () => {
    let mockUseAuth;
    let mockHistoryPush;

    beforeEach(() => {
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
        useHistory.mockReturnValue({ push: mockHistoryPush });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn(),
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
});