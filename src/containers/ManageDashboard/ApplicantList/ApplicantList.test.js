import ApplicantList from './ApplicantList';
import { render, screen } from '@testing-library/react';

describe('ApplicantList', () => {
    let mockVacancy;
    let mockUser;
    let mockUserCommitteeRole;
    let mockLoadLatestVacancyInfo;

    beforeEach(() => {
        mockLoadLatestVacancyInfo = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
})