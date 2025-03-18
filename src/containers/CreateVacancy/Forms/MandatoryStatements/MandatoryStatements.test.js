import MandatoryStatements from './MandatoryStatements';
import { render, screen } from '@testing-library/react';
import mockAllForms from './MandatoryStatementsMockData';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';
import { HashRouter } from 'react-router-dom';
import { Form } from 'antd';

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
	let mockRestrictedEditMode;
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

	beforeEach(() => {
		mockRestrictedEditMode = undefined;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should render all mandatory statements', () => {
		const formInstance = {
			getFieldValue: jest.fn().mockReturnValue(true),
			name: 'MandatoryStatements',
		};

		render(
			<HashRouter>
				<MandatoryStatements
					initialValues={mockAllForms}
					formInstance={result}
					readOnly={mockRestrictedEditMode}
				/>
				<Form>
					<SwitchFormItemEditor
						name='equalOpportunityEmployer'
						label='Equal Employment Opportunity Policy'
						formInstance={formInstance}
						onToggle={() => {
							formInstance.validateFields(['mandatoryStatements']);
						}}
						onBlur={() => {
							formInstance.validateFields(['mandatoryStatements']);
						}}
						readOnly={true}
					/>
				</Form>
			</HashRouter>
		);
	});
});
