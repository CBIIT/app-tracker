import EmailTemplates from './EmailTemplates';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
	mockEmailTemplates,
	mockBasicInfo,
	mockBasicInfoWithReferenceCollection,
} from '../MandatoryStatements/MandatoryStatementsMockData';
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
				basicInfo={mockBasicInfo.referenceCollection}
			/>
		);
	};

	const FormWrapperWithReferenceCollection = () => {
		const [form] = Form.useForm();

		return (
			<EmailTemplates
				initialValues={mockEmailTemplates}
				formInstance={form}
				basicInfo={mockBasicInfoWithReferenceCollection.referenceCollection}
			/>
		);
	};

	test('Should render all non-reference collection email templates', () => {
		render(<FormWrapper />);

		waitFor(() => {
			const applicationSavedHeader = screen.getByText('Application saved');
			const applicationSavedText = screen.getByText(
				'<p>Dear Dr. #APP_LAST_NAME#,<br><br></p><p>Thank you for your application for the position of #POSITION# at the #IC#, National Institutes of Health. Your application has been saved and is available at #APP_URL#.<br><br></p><p>Please ensure that all application materials are submitted by the review date/application deadline. Incomplete applications will not be considered. You may view the status of your application materials. If you should have any questions, please contact #VACANCY_POC_NAME#.<br><br></p><p>Thank you for your interest in the National Institutes of Health.<br></p>'
			);
			expect(applicationSavedHeader).toBeInTheDocument();
			expect(applicationSavedText).toBeInTheDocument();

			const applicationSubmittedHeader = screen.getByText(
				'Application submitted confirmation'
			);
			const applicationSubmittedText = screen.getByText(
				'<p>Dear Dr. #APP_LAST_NAME#, <br><br></p><p>Good news! Your application for the position of #POSITION# at the #IC#, National Institutes of Health <b>has been submitted.</b></p><p>You may view the status of your application at any time by following #APP_URL#.</p><p>If you should have any questions, please contact #VACANCY_POC_NAME#.  </p><p>Thank you for your interest in the National Institutes of Health.</p>'
			);
			expect(applicationSubmittedHeader).toBeInTheDocument();
			expect(applicationSubmittedText).toBeInTheDocument();

			const referenceRequestFromApplicantHeader = screen.getByText(
				'Applicant Reference Request - Applicant'
			);
			const referenceRequestFromApplicantText = screen.getByText(
				"<p>Dear Dr. #REF_LAST_NAME#,</p><br><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME# has applied for #VACANCY_TITLE# at the National Institutes of Health and has provided your name as one of their references. We would be grateful if you could submit a letter in support of the candidate’s application.</p><br><p>In your letter, please address the candidate's strengths and weaknesses, the potential for success in this position, and any other information you feel the search committee would find helpful in considering this application. All comments in your letter will be held confidential.</p><br><p><strong>The deadline for letter submission is #VACANCY_CLOSE_DATE#.</strong> Please use this email system to upload your letter of recommendation. This will assure that your letter immediately becomes part of the applicant's package, as well as provide an acknowledgment to the applicant that your letter has been received. Once your letter has been uploaded, the candidate will be able to see that it has become part of their application package.</p><br><p>On behalf of the Intramural Research Program at the National Institutes of Health, thank you for your time and support.</p><br><p>Regards,</p><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME#</p>"
			);
			expect(referenceRequestFromApplicantHeader).toBeInTheDocument();
			expect(referenceRequestFromApplicantText).toBeInTheDocument();

			const candidatesWhoDidNotInterviewHeader = screen.getByText(
				'Candidates Who Did Not Interview'
			);
			const candidatesWhoDidNotInterviewText = screen.getByText(
				'<p>Dear Dr. #Candidate_First_Name# #Candidate_Last_Name#,</p><br><p>We have received the application you submitted for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We wanted to let you know how much we appreciated the opportunity to review your application.  While we will no longer be considering you for this position, we encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Best wishes in your future career endeavors.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>'
			);
			expect(candidatesWhoDidNotInterviewHeader).toBeInTheDocument();
			expect(candidatesWhoDidNotInterviewText).toBeInTheDocument();

			const candidatesWhoDidInterviewHeader = screen.getByText(
				'Candidates Who Did Interview'
			);
			const candidatesWhoDidInterviewText = screen.getByText(
				'<p>Dear Dr. #Candidate_First_Name# #Candidate_Last_Name#,</p><br><p>Thank you for interviewing for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We enjoyed the opportunity to interview you and hear your views regarding the #Position Title# position. After a much difficult discussion, we are no longer considering you for this position. We encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Thank you again for your interest in this position.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>'
			);
			expect(candidatesWhoDidInterviewHeader).toBeInTheDocument();
			expect(candidatesWhoDidInterviewText).toBeInTheDocument();
		});
	});

	test('Should render all reference collection email templates', () => {
		render(<FormWrapperWithReferenceCollection />);

		waitFor(() => {
			const applicantReferenceRequestHeader = screen.getByText(
				'Applicant Reference Request'
			);
			const applicantReferenceRequestText = screen.getByText(
				"<p>Dear Dr. #REF_LAST_NAME#,</p><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME# has applied for #POSITION# at the #IC#, National Institutes of Health and has provided your name as one of their references. We would be grateful if you could submit a letter in support of Dr. #APP_LAST_NAME#'s application.</p><p>You may upload your letter by responding to this email with your reference letter added as an attachment. Word and PDF files are accepted. The email address used to send this request to you can only accept the file submission. It cannot accept email text. If you need to communicate with the Executive Secretary about the reference request, please find their email address at the bottom of this message or on the vacancy page and contact them directly.</p><p>Your letter should address the candidate's strengths and weaknesses, the potential for success in this position, and any other information you feel the Search Committee would find helpful in considering this application. A link to the position listing follows below, for your information. All comments in your letter will be held confidential.</p><p>Application Vacancy: #VACANCY_URL#</p><p>The deadline for submitting letters is <strong>#REF_COLLECTION_DATE#</strong>.</p><p>Please use this email system to upload your letter of recommendation. This will assure that your letter immediately becomes part of the applicant's package, as well as provide an acknowledgment to the applicant that your letter has been received.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,</p><p>#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p>"
			);
			expect(applicantReferenceRequestHeader).toBeInTheDocument();
			expect(applicantReferenceRequestText).toBeInTheDocument();

			const applicantReferenceReceivedHeader = screen.getByText(
				'Applicant Reference Received'
			);
			const applicantReferenceReceivedText = screen.getByText(
				"<p>Dear Dr. #REF_LAST_NAME#,</p><p>Thank you for providing a letter of reference in support of Dr. #APP_LAST_NAME#'s application for #POSITION# at the #IC#, National Institutes of Health.</p><p>We realize that providing a letter for someone being considered for this type of position takes a significant amount of time, so we are quite thankful for your willingness to provide us your insights regarding the candidate. All comments in your letter will be held confidential.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,<br />#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p>"
			);
			expect(applicantReferenceReceivedHeader).toBeInTheDocument();
			expect(applicantReferenceReceivedText).toBeInTheDocument();

			const applicantReferenceReceivedApplicantHeader = screen.getByText(
				'Applicant Reference Received - Applicant'
			);
			const applicantReferenceReceivedApplicantText = screen.getByText(
				"<p>Dear Dr. #APPLICANT_LAST_NAME#,</p><p>This email is to notify you that we have received a letter from Dr. #REF_LAST_NAME# in support of your application for #POSITION# at the #IC#, National Institutes of Health.</p><p>Regards,<br />#EXECUTIVE_SECRETARY#<br />#EXECUTIVE_SECRETARY_EMAIL#</p>"
			);
			expect(applicantReferenceReceivedApplicantHeader).toBeInTheDocument();
			expect(applicantReferenceReceivedApplicantText).toBeInTheDocument();
		});
	});

	test('Should remove reference collection templates when referenceCollection becomes false', () => {
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

		waitFor(() => {
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
