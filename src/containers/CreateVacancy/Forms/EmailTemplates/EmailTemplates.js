import { useEffect } from 'react';
import { Form } from 'antd';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const emailTemplates = (props) => {
	const formInstance = props.formInstance;
	const basicInfo = props.basicInfo;

	let initialValues = { emailTemplates: props.initialValues };

	const referenceEmailTemplates = [
		{
			type: 'Applicant Reference Request',
			active: true,
			text: "<p>Dear Dr. #REF_LAST_NAME#,</p><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME# has applied for #POSITION# at the #IC#, National Institutes of Health and has provided your name as one of their references. We would be grateful if you could submit a letter in support of Dr. #APP_LAST_NAME#'s application.</p><p>You may upload your letter by responding to this email with your reference letter added as an attachment. Word and PDF files are accepted. The email address used to send this request to you can only accept the file submission. It cannot accept email text. If you need to communicate with the Executive Secretary about the reference request, please find their email address at the bottom of this message or on the vacancy page and contact them directly.</p><p>Your letter should address the candidate's strengths and weaknesses, the potential for success in this position, and any other information you feel the Search Committee would find helpful in considering this application. A link to the position listing follows below, for your information. All comments in your letter will be held confidential.</p><p>Application Vacancy: #VACANCY_URL#</p><p>The deadline for submitting letters is <strong>#REF_COLLECTION_DATE#</strong>.</p><p>Please use this email system to upload your letter of recommendation. This will assure that your letter immediately becomes part of the applicant's package, as well as provide an acknowledgment to the applicant that your letter has been received.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,</p><p>#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p>",
		},
		{
			type: 'Applicant Reference Received',
			active: true,
			text: "<p>Dear Dr. #REF_LAST_NAME#,</p><p>Thank you for providing a letter of reference in support of Dr. #APP_LAST_NAME#'s application for #POSITION# at the #IC#, National Institutes of Health.</p><p>We realize that providing a letter for someone being considered for this type of position takes a significant amount of time, so we are quite thankful for your willingness to provide us your insights regarding the candidate. All comments in your letter will be held confidential.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,<br />#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p>",
		},
		{
			type: 'Applicant Reference Received - Applicant',
			active: true,
			text: "<p>Dear Dr. #APPLICANT_LAST_NAME#,</p><p>This email is to notify you that we have received a letter from Dr. #REF_LAST_NAME# in support of your application for #POSITION# at the #IC#, National Institutes of Health.</p><p>Regards,<br />#EXECUTIVE_SECRETARY#<br />#EXECUTIVE_SECRETARY_EMAIL#</p>"
		},
		{
			type: 'Applicant Reference Request - Applicant',
			active: true,
			text: "<p>Dear Dr. #REF_FIRST_NAME# #REF_LAST_NAME#,</p><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME has applied to the Stadtman Investigator Program for a tenure-track investigator position (equivalent to assistant professor) in the Intramural Research Program at the National Institutes of Health and has provided your name as a reference. We would be grateful if you could submit a letter in support of the candidate’s application.</p><p>In your letter, please address the candidate's strengths and weaknesses, the potential for success in this position, and any other information you feel the search committee would find helpful in considering this application. All comments in your letter will be held confidential.</p><p><strong>The deadline for letter submission is #VACANCY_CLOSE_DATE# (11:59 pm EDT).<strong> Please upload your letter (either Word or PDF format) to our application system here. Once your letter has been uploaded, the candidate will be able to see that it has become part of their application package.</p><p>Information about the Stadtman Investigator Program can be found here.</p><p>Please contact us at stadtman@nih.gov if you have any questions or encounter any problems.</p><p>On behalf of the Intramural Research Program at the National Institutes of Health, thank you for your time and support.</p><p>Regards,</p><p>The Stadtman Investigator Program</p>",
		},
	];

	useEffect(() => {
		if (basicInfo.referenceCollection === true && initialValues.emailTemplates.length === 4) {
			initialValues = initialValues.emailTemplates.concat(referenceEmailTemplates);
			formInstance.setFieldValue('emailTemplates', initialValues);
		} else if (basicInfo.referenceCollection === false && initialValues.emailTemplates.length > 4) {
			initialValues = initialValues.emailTemplates.filter(template => !referenceEmailTemplates.find(email => email.type === template.type))
			formInstance.setFieldValue('emailTemplates', initialValues);
		}
	}, [basicInfo.referenceCollection])

	const validateEmailTemplates = async () => {
		const validEmailTemplates = formInstance
			.getFieldValue('emailTemplates')
			.filter(
				(template) =>
					template.active === true && !isRichTextEditorEmpty(template.text)
			);

		if (validEmailTemplates.length < 1)
			throw new Error(
				'At least one email template must be active and have content.'
			);
	};

	return (
		<Form
			name='EmailTemplates'
			layout='horizontal'
			requiredMark={false}
			form={formInstance}
			initialValues={initialValues}
			colon={false}
		>
			<Form.List name='emailTemplates'>
				{(fields) =>
					fields.map((field, index) => {
						return (
							<div key={field.key}>
								<SwitchFormItemEditor
									label={
										Object.keys(formInstance.getFieldsValue()).length !== 0
											? formInstance.getFieldsValue().emailTemplates[index].type
											: ''
									}
									showEditor={
										Object.keys(formInstance.getFieldsValue()).length !== 0
											? formInstance.getFieldsValue().emailTemplates[index]
													.active
											: false
									}
									name={[index, 'active']}
									textName={[index, 'text']}
									formInstance={formInstance}
									onToggle={() =>
										formInstance.validateFields(['emailTemplatesValidator'])
									}
									onBlur={() =>
										formInstance.validateFields(['emailTemplatesValidator'])
									}
								/>
							</div>
						);
					})
				}
			</Form.List>
			<Form.Item
				name='emailTemplatesValidator'
				rules={[{ validator: validateEmailTemplates }]}
			>
				{/* Supress antd warning about using name */}
				<input style={{ display: 'none' }} />
			</Form.Item>
		</Form>
	);
};

export default emailTemplates;
