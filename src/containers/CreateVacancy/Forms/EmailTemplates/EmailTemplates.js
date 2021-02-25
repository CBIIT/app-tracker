import Form from 'antd/lib/form/Form';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';

const emailTemplates = () => {
	const [formInstance] = Form.useForm();

	const initialValues = {
		applicationSaved: true,
		applicationSavedText:
			'<p>Dear Dr. #APP_LAST_NAME#,</p><p>Thank you for your application for the position of #POSITION# at the ***DOC*** National Cancer Institute (NCI).</p><p>Your application has been saved and is available at #APP_URL#.&nbsp;</p><p>Please ensure that all application materials are submitted by the review date/application deadline. Incomplete applications will not be considered. You may view the status of your application materials -- If you should have any questions, please contact ______. Thank you for your interest in the National Cancer Institute.</p>',
		applicationIsInactive: true,
		applicationIsInactiveText:
			"<p>Dear Dr. #APP_LAST_NAME#,</p><p>This is a courtesy notification regarding your saved application for the position of #POSITION# at the Center for Cancer Research (CCR), National Cancer Institute's (NCI).</p><p>Your application has not been updated within the past month and is scheduled for automatic removal on #POSITION_CLOSE_DATE#. If you are still interested in applying, please visit #APP_URL# to update your application.</p><p>If you are no longer interested in applying for #POSITION#, you may disregard this message.</p>",
		applicationSubmittedConfirmation: true,
		applicationSubmittedConfirmationText:
			"<p><span>Dear Dr. #APP_LAST_NAME#,</span></p><p><span>Good news! Your application for the position of #POSITION# at the ***DOC*** National Cancer Institute's (NCI) </span><strong>has been submitted.</strong></p><p><span>You may view the status of your application at any time by following #APP_URL#.</span></p><p><span>If you should have any questions, please contact ____. Thank you for your interest in the National Cancer Institute.</span></p>",
		notReferredToInterview: true,
		notReferredToInterviewText:
			'<p><span>Dear Dr. #APP_LAST_NAME#</span></p><p><span>Thank you for your interest in the position of #POSITION# at the ***DOC***, National Cancer Institute (NCI).&nbsp;</span></p><p><span>We wanted to let you know how much we appreciated the opportunity to review your application.&nbsp;While we will no longer be considering you for this position, we encourage you to continue to apply for other positions at the NIH in areas that you have interest.</span></p><p><span>&nbsp;</span></p><p><span>Best wishes in your future career endeavors.</span></p>',
		invitationToInterview: true,
		invitationToInterviewText:
			'<p><span>Dear Dr. #APP_LAST_NAME#</span></p><p><span>Thank you for your interest in the position of #POSITION# at the ***DOC***, National Cancer Institute (NCI).&nbsp;</span></p><p><span>We wanted to let you know how much we appreciated the opportunity to review your application and we invite you to interview with our search committee regarding the #POSITION# at the ***DOC***, National Cancer Institute (NCI).&nbsp;</span></p><p><span>***ENTER EXECUTIVE SECRETARY NAME HERE*** will be in touch to schedule the day and time with you.&nbsp;</span></p><p><span>We look forward to meeting with you.</span></p>',
	};

	return (
		<Form
			name='emailTemplates'
			layout='horizontal'
			requiredMark={false}
			form={formInstance}
			initialValues={initialValues}
			colon={false}
		>
			<SwitchFormItemEditor
				name='applicationSaved'
				label='Application Saved'
				formInstance={formInstance}
			/>
			<SwitchFormItemEditor
				name='applicationIsInactive'
				label='Application is inactive'
				formInstance={formInstance}
			/>
			<SwitchFormItemEditor
				name='applicationSubmittedConfirmation'
				label='Application submitted confirmation'
				formInstance={formInstance}
			/>
			<SwitchFormItemEditor
				name='notReferredToInterview'
				label='Not referred to interview'
				formInstance={formInstance}
			/>
			<SwitchFormItemEditor
				name='invitationToInterview'
				label='Invitation to interview'
				formInstance={formInstance}
			/>
		</Form>
	);
};

export default emailTemplates;
