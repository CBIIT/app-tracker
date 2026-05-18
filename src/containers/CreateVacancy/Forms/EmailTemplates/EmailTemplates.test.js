import EmailTemplates from './EmailTemplates';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
	mockEmailTemplates,
	mockBasicInfo,
	mockBasicInfoWithReferenceCollection,
} from '../MandatoryStatements/MandatoryStatementsMockData';
import { Form } from 'antd';

jest.mock(
	'../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor',
	() => {
		const { Form } = jest.requireActual('antd');
		return function DummySwitchFormItemEditor({ name, formInstance }) {
			const index = Array.isArray(name) ? name[0] : 0;
			const watched = Form.useWatch('emailTemplates', formInstance);
			const templates =
				watched ||
				(formInstance && formInstance.getFieldValue('emailTemplates')) ||
				[];
			const template = templates[index] || {};
			return (
				<div data-testid={`SwitchFormItemEditor-${index}`}>
					<span>{template.type || ''}</span>
					<span>{template.text || ''}</span>
				</div>
			);
		};
	}
);

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};

describe('EmailTemplates', () => {
	beforeEach(() => {
		window.document.getSelection = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const FormWrapper = () => {
		const [form] = Form.useForm();

		return (
			<EmailTemplates
				initialValues={mockEmailTemplates}
				formInstance={form}
				basicInfo={mockBasicInfo}
			/>
		);
	};

	const FormWrapperWithReferenceCollection = () => {
		const [form] = Form.useForm();

		return (
			<EmailTemplates
				initialValues={mockEmailTemplates}
				formInstance={form}
				basicInfo={mockBasicInfoWithReferenceCollection}
			/>
		);
	};

	test('Should render all non-reference collection email templates', async () => {
		render(<FormWrapper />);

		await waitFor(() => {
			expect(screen.getByText('Application saved')).toBeInTheDocument();
			expect(
				screen.getByText('Application submitted confirmation')
			).toBeInTheDocument();
			expect(
				screen.getByText('Candidates Who Did Not Interview')
			).toBeInTheDocument();
			expect(
				screen.getByText('Candidates Who Did Interview')
			).toBeInTheDocument();
		});
	});

	test('Should render all reference collection email templates', async () => {
		render(<FormWrapperWithReferenceCollection />);

		await waitFor(() => {
			expect(
				screen.getByText('Applicant Reference Request')
			).toBeInTheDocument();
			expect(
				screen.getByText('Applicant Reference Received')
			).toBeInTheDocument();
			expect(
				screen.getByText('Applicant Reference Received - Applicant')
			).toBeInTheDocument();
		});
	});

	test('Should remove reference collection templates when referenceCollection becomes false', async () => {
		const { rerender } = render(<FormWrapperWithReferenceCollection />);
		
		const mockEmailTemplatesWithReferences = [
			...mockEmailTemplates,
			{
				type: 'Applicant Reference Request',
				active: true,
				text: 'Reference request text',
			},
			{
				type: 'Applicant Reference Received',
				active: true,
				text: 'Reference received text',
			},
			{
				type: 'Applicant Reference Received - Applicant',
				active: true,
				text: 'Reference received applicant text',
			},
			{
				type: 'Applicant Reference Request - Applicant',
				active: true,
				text: 'Reference received applicant text',
			},
		];

		const FormWrapperToggle = ({ referenceCollection }) => {
			const [form] = Form.useForm();

			return (
				<EmailTemplates
					initialValues={mockEmailTemplatesWithReferences}
					formInstance={form}
					basicInfo={{ referenceCollection }}
				/>
			);
		};

		rerender(<FormWrapperToggle referenceCollection={false} />);

		await waitFor(() => {
			expect(screen.queryByText('Applicant Reference Request')).not.toBeInTheDocument();
		});
	});

	test('Should validate that at least one email template is active with content', async () => {
		const mockEmptyTemplates = mockEmailTemplates.map(template => ({
			...template,
			active: false,
			text: '',
		}));

		let formInstance;

		const TestWrapper = () => {
			const [form] = Form.useForm();
			formInstance = form;

			return (
				<EmailTemplates
					initialValues={mockEmptyTemplates}
					formInstance={form}
					basicInfo={mockBasicInfo.referenceCollection}
				/>
			);
		};

		render(<TestWrapper />);

		await waitFor(async () => {
			try {
				await formInstance.validateFields(['emailTemplatesValidator']);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error) {
				expect(error.errorFields[0].errors[0]).toBe(
					'At least one email template must be active and have content.'
				);
			}
		});
	});
});
