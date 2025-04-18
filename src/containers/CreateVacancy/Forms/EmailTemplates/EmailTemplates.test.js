import EmailTemplates from './EmailTemplates';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockEmailTemplates, mockBasicInfo } from '../MandatoryStatements/MandatoryStatementsMockData';
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

    test('Should render all non-referemce collection email templates', () => {
        render(<FormWrapper />);

        waitFor(() => {
            const applicationSavedHeader = screen.getByText('Application saved');
            const applicationSavedText = screen.getByText("<p>Dear Dr. #APP_LAST_NAME#,<br><br></p><p>Thank you for your application for the position of #POSITION# at the #IC#, National Institutes of Health. Your application has been saved and is available at #APP_URL#.<br><br></p><p>Please ensure that all application materials are submitted by the review date/application deadline. Incomplete applications will not be considered. You may view the status of your application materials. If you should have any questions, please contact #VACANCY_POC_NAME#.<br><br></p><p>Thank you for your interest in the National Institutes of Health.<br></p>");
            expect(applicationSavedHeader).toBeInTheDocument();
            expect(applicationSavedText).toBeInTheDocument();

            const applicationSubmittedHeader = screen.getByText('Application submitted confirmation');
            const applicationSubmittedText = screen.getByText("<p>Dear Dr. #APP_LAST_NAME#, <br><br></p><p>Good news! Your application for the position of #POSITION# at the #IC#, National Institutes of Health <b>has been submitted.</b></p><p>You may view the status of your application at any time by following #APP_URL#.</p><p>If you should have any questions, please contact #VACANCY_POC_NAME#.  </p><p>Thank you for your interest in the National Institutes of Health.</p>");
            expect(applicationSubmittedHeader).toBeInTheDocument();
            expect(applicationSubmittedText).toBeInTheDocument();
            
            const candidatesWhoDidNotInterviewHeader = screen.getByText('Candidates Who Did Not Interview');
            const candidatesWhoDidNotInterviewText = screen.getByText("<p>Dear Dr. #Candidate First And Last Name#,</p><br><p>We have received the application you submitted for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We wanted to let you know how much we appreciated the opportunity to review your application.  While we will no longer be considering you for this position, we encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Best wishes in your future career endeavors.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>");
            expect(candidatesWhoDidNotInterviewHeader).toBeInTheDocument();
            expect(candidatesWhoDidNotInterviewText).toBeInTheDocument();


            const candidatesWhoDidInterviewHeader = screen.getByText('Candidates Who Did Interview');
            const candidatesWhoDidInterviewText = screen.getByText("<p>Dear Dr. #Candidate First And Last Name#,</p><br><p>Thank you for interviewing for the #Position Title# position with #IC#, National Institutes of Health.</p><p>We enjoyed the opportunity to interview you and hear your views regarding the #Position Title# position. After a much difficult discussion, we are no longer considering you for this position. We encourage you to continue to apply for other positions at the NIH in areas that you have interest.</p><p>Thank you again for your interest in this position.</p><br><p>Sincerely,</p><p>#IC#</p><p>National Institutes of Health</p>");
            expect(candidatesWhoDidInterviewHeader).toBeInTheDocument();
            expect(candidatesWhoDidInterviewText).toBeInTheDocument();
        });
    });
});