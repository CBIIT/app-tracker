import MandatoryStatements from './MandatoryStatements';
import { render, screen } from '@testing-library/react';
import {
	mockBasicInfo,
	mockEmailTemplates,
	mockMandatoryStatements,
	mockVacancyCommittee,
} from './MandatoryStatementsMockData';
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

jest.mock('../../../../components/UI/SwitchFormItem/SwitchFormItem', () => {
	return function DummySwitchFormItem({ onChangeHandler }) {
        return <input type="checkbox" data-testid="SwitchFormItemEditorSwitch" name="testName" label="Test Label" readOnly={false} onChange={(e) => onChangeHandler(e.target.checked)} />;
    };
});

window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('MandatoryStatements', () => {
	let mockRestrictedEditMode;

	const formInstance = {
        getFieldValue: jest.fn().mockReturnValue(true),
		name: 'mockMandatoryStatements',
    };

    const defaultProps = {
        formInstance: formInstance,
        rules: [],
        readOnly: false,
        onToggle: jest.fn(),
        onBlur: jest.fn(),
    };

	beforeEach(() => {
		mockRestrictedEditMode = undefined;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should render all mandatory statements', () => {

		render(
			<HashRouter>
				<MandatoryStatements
					initialValues={mockMandatoryStatements}
					formInstance={result}
					readOnly={mockRestrictedEditMode}
				/>
				<Form>
					<SwitchFormItemEditor {...defaultProps} />
				</Form>
			</HashRouter>
		);
	});
});
