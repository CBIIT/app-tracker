import MandatoryStatements from './MandatoryStatements';
import { render, screen } from '@testing-library/react';
import initialValues from '../FormsInitialValues';

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
						name: 'MandatoryStatements',
					},
					_init: true,
				},
			],
		},
	};
});

describe('MandatoryStatements', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
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

	beforeEach(() => {});

    afterEach(() => {
        jest.clearAllMocks();
    })
});
