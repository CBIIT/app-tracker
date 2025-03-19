import MandatoryStatements from './MandatoryStatements';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockMandatoryStatements } from './MandatoryStatementsMockData';
import { Form } from 'antd';

jest.mock('../../../../components/UI/SwitchFormItem/SwitchFormItem', () => {
	return function DummySwitchFormItem({ onChangeHandler }) {
		return (
			<input
				type='checkbox'
				data-testid='SwitchFormItemEditorSwitch'
				name='testName'
				label='Test Label'
				readOnly={false}
				onChange={(e) => onChangeHandler(e.target.checked)}
			/>
		);
	};
});

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};

describe('MandatoryStatements', () => {
	let mockRestrictedEditMode;
	beforeEach(() => {
		mockRestrictedEditMode = undefined;
		window.document.getSelection = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const FormWrapper = () => {
		const [form] = Form.useForm();

		return (
			<MandatoryStatements
				initialValues={mockMandatoryStatements}
				formInstance={form}
				readOnly={mockRestrictedEditMode}
			/>
		);
	};
	
	test('Should render all mandatory statements', () => {
		render(<FormWrapper />);

		waitFor(() => {
			const equalOpportunityEmployerHeader = screen.getByText(
				'Equal Employment Opportunity Policy'
			);
			const equalOpportunityEmployer = screen.getByText(
				'<p>The United States government does not discriminate in employment on the basis of race, color, religion, sex, pregnancy, national origin, political affiliation, sexual orientation, marital status, disability, genetic information, age, membership in an employee organization, retaliation, parental status, military service or other non-merit factor.</p><br/><p>To learn more, please visit the <a href="https://www.eeoc.gov/federal-sector/federal-employees-job-applicants">U.S. Equal Employment Opportunity Commission</a>.</p>'
			);
			const standardsOfConductHeader = screen.getByText(
				'Standards of Conduct/Financial Disclosure'
			);
			const standardsOfConduct = screen.getByText(
				'<p>The National Institutes of Health inspires public confidence in our science by maintaining high ethical principles. NIH employees are subject to Federal government-wide regulations and statutes as well as agency-specific regulations described at the NIH Ethics Website. We encourage you to review this information. The position is subject to a background investigation and requires the incumbent to complete a public financial disclosure report prior to the effective date of the appointment.</p>'
			);
			const foreignEducationHeader = screen.getByText('Foreign Education');
			const foreignEducation = screen.getByText(
				'<p>Applicants who have completed part or all of their education outside of the U.S. must have their foreign education evaluated by an accredited organization to ensure that the foreign education is equivalent to education received in accredited educational institutions in the United States. We will only accept the completed foreign education evaluation. For more information on foreign education verification, visit the https://www.naces.org website. Verification must be received prior to the effective date of the appointment.</p>'
			);
			const reasonableAccommodationHeader = screen.getByText(
				'Reasonable Accommodation'
			);
			const reasonableAccommodation = screen.getByText(
				'<p>NIH provides reasonable accommodations to applicants with disabilities. If you require reasonable accommodation during any part of the application and hiring process, please notify us. The decision on granting reasonable accommodation will be made on a case-by-case basis.</p>'
			);

			expect(equalOpportunityEmployerHeader).toBeInTheDocument();
			expect(equalOpportunityEmployer).toBeInTheDocument();
			expect(standardsOfConductHeader).toBeInTheDocument();
			expect(standardsOfConduct).toBeInTheDocument();
			expect(foreignEducationHeader).toBeInTheDocument();
			expect(foreignEducation).toBeInTheDocument();
			expect(reasonableAccommodationHeader).toBeInTheDocument();
			expect(reasonableAccommodation).toBeInTheDocument();
		});
	});
});
