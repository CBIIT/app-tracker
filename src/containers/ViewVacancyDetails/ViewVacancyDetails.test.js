import ViewVacancydetails from './ViewVacancyDetails';
import { render, screen } from '@testing-library/react';
import { HashRouter, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { extractAndTransformMandatoryStatements } from '../../components/Util/Vacancy/Vacancy';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';

jest.mock('axios');

describe('ViewVacancyDetails', () => {

    beforeEach(() => {
        useParams.mockReturnValue({ sysId: '123' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    
});