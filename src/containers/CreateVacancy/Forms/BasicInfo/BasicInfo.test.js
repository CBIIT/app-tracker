import BasicInfo from './BasicInfo';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';
import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';

jest.mock('../../../../hooks/useAuth');
jest.mock('axios');

describe('BasicInfo', () => {
    
    beforeEach(() => {

    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
});
