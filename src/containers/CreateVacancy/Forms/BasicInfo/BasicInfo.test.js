import BasicInfo from './BasicInfo';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';
import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';
import { mockIntialValues, mockVacancyOptionsResponse } from './BasicInfoMockData';
import { render } from '@testing-library/react';

jest.mock('../../../../hooks/useAuth');
jest.mock('axios');
const { result } = jest.mock('antd', () => {
    return {
        ...mockAntd,
        mockForm: {
            ...mockForm,
            useForm: () => [
                {
                    ...mockResult.current[0],
                    mockGetFieldError: jest.fn(),
                    mockGetFieldInstace: jest.fn(),
                    mockGetFieldValue: jest.fn(),
                    mockGetFieldWarning: jest.fn(),
                    mockGetFieldsError: jest.fn(),
                    mockGetFieldsVlaue: jest.fn(),
                    mockGetInternalHooks: jest.fn(),
                    mockIsFieldTouched: jest.fn(),
                    mockIsFieldValidating: jest.fn(),
                    mockIsFieldsTouched: jest.fn(),
                    mockIsFieldsValidating: jest.fn(),
                    mockResetFields: jest.fn(),
                    mockScrollToField: jest.fn(),
                    mockSetFieldValue: jest.fn(),
                    mockSetFields: jest.fn(),
                    mockSetFieldsValue: jest.fn(),
                    mockSubmit: jest.fn(),
                    mockValidateFields: jest.fn(),
                    __INTERNAL__: {
                        mockItemRef: jest.fn(),
                        name: 'BasicInfo',
                    },
                    _init: true,
                },
            ],
        },
    };
});

describe('BasicInfo', () => {
	let mockReadOnly; //undfined
	let mockIsNew; //true or false
	let mockPocDefined; //true or false

	beforeEach(() => {});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should render BasicInfo component for new Vacancy', async () => {
		mockReadOnly = undefined;
		mockIsNew = true;
		mockPocDefined = true;

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
            } }
		});

        render(
            <BasicInfo
                initialValues={mockIntialValues}
                formInstance={result}
                readOnly={mockReadOnly}
                isNew={mockIsNew}
                pocDefined={mockPocDefined}
            />
        )

        axios.get.mockImplementationOnce(() => Promise.resolve(mockVacancyOptionsResponse));
        const vacancyOptions = await axios.get(GET_VACANCY_OPTIONS);

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(vacancyOptions).toEqual(mockVacancyOptionsResponse);

	});

});
