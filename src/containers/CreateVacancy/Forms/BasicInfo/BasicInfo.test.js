import BasicInfo from './BasicInfo';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';
import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';
import { mockIntialValues } from './BasicInfoMockData';
import { render } from '@testing-library/react';

jest.mock('../../../../hooks/useAuth');
jest.mock('axios');
jest.mock('antd', () => {
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

	it('should render BasicInfo component for new Vacancy', () => {
		mockReadOnly = undefined;
		mockIsNew = true;
		mockPocDefined = true;

		useAuth.mockReturnValue({
			user: {
				id: '12345',
				name: 'John Doe',
				email: '',
			},
		});

        render(
            <BasicInfo
                initialValues={mockIntialValues}
                formInstance={mockForm}
                readOnly={mockReadOnly}
                isNew={mockIsNew}
                pocDefined={mockPocDefined}
            />
        )

	});

});
