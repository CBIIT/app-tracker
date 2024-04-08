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
			text: "<p>Dear Dr. #REF_LAST_NAME#,</p><p>Dr. #APP_FIRST_NAME# #APP_LAST_NAME# has applied for #POSITION# at the #IC#, National Institutes of Health and has provided your name as one of their references. We would be grateful if you could submit a letter in support of Dr. #APP_LAST_NAME#'s application.</p><p>You may upload your letter by responding to this email with your reference letter added as an attachment. Word and PDF files are accepted.</p><p>Your letter should address the candidate's strengths and weaknesses, the potential for success in this position, and any other information you feel the Search Committee would find helpful in considering this application. A link to the position listing follows below, for your information. All comments in your letter will be held confidential.</p><p>Application Vacancy: #VACANCY_URL#</p><p>The deadline for submitting letters is <strong>#REF_COLLECTION_DATE#</strong>.</p><p>Please use this email system to upload your letter of recommendation. This will assure that your letter immediately becomes part of the applicant's package, as well as provide an acknowledgment to the applicant that your letter has been received.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,</p><p>#VACANCY_POC#<br />#VACANCY_POC_EMAIL#<br /></p><br /><p>OMB No. 0925-0761</p><p>Expiration Date: 07/31/2025</p><p>Collection of this information is authorized by The Public Health Service Act, Section 411 (42 USC 285a). Rights of participants are protected by The Privacy Act of 1974 under&nbsp;<a title='Follow link' href='http://www.opm.gov/information-management/privacy-policy/sorn/opm-sorn-govt-5-recruiting-examining-and-placement-records.pdf' target='_blank' rel='nofollow noopener'>OPM GOVT-5</a>. Participation is voluntary, and there are no penalties for not participating or withdrawing at any time. Refusal to participate will not affect your benefits in any way. The information collected will be kept private to the extent provided by law. Names and other identifiers will not appear in any report. Information provided will be combined for all participants and reported as summaries. You are being contacted on-line to complete this instrument so that NIH can evaluate its advertisement strategies and make necessary improvements to the application website.</p><p>Public reporting burden for this collection of information is estimated to average 30 minutes per response, including the time for reviewing instructions, searching existing data sources, gathering and maintaining the data needed, and completing and reviewing the collection of information. An agency may not conduct or sponsor, and a person is not required to respond to, a collection of information unless it displays a currently valid OMB control number. Send comments regarding this burden estimate or any other aspect of this collection of information, including suggestions for reducing this burden to: NIH, Project Clearance Branch, 6705 Rockledge Drive, MSC 7974, Bethesda, MD 20892-7974, ATTN: PRA (0925-0761). Do not return the completed form to this address</p>",
		},
		{
			type: 'Applicant Reference Received',
			active: true,
			text: "<p>Dear Dr. #REF_LAST_NAME#,</p><p>Thank you for providing a letter of reference in support of Dr. #APP_LAST_NAME#'s application for #POSITION# at the #IC#, National Institutes of Health.</p><p>We realize that providing a letter for someone being considered for this type of position takes a significant amount of time, so we are quite thankful for your willingness to provide us your insights regarding the candidate. All comments in your letter will be held confidential.</p><p>On behalf of the Search Committee, we thank you for your support.</p><p>Regards,<br />#VACANCY_POC#<br />#VACANCY_POC_EMAIL#</p><p>OMB No. 0925-0761</p><p>Expiration Date: 07/31/2025</p><p>Collection of this information is authorized by The Public Health Service Act, Section 411 (42 USC 285a). Rights of participants are protected by The Privacy Act of 1974 under&nbsp;<a title='Follow link' href='http://www.opm.gov/information-management/privacy-policy/sorn/opm-sorn-govt-5-recruiting-examining-and-placement-records.pdf' target='_blank' rel='nofollow noopener'>OPM GOVT-5</a>. Participation is voluntary, and there are no penalties for not participating or withdrawing at any time. Refusal to participate will not affect your benefits in any way. The information collected will be kept private to the extent provided by law. Names and other identifiers will not appear in any report. Information provided will be combined for all participants and reported as summaries. You are being contacted on-line to complete this instrument so that NIH can evaluate its advertisement strategies and make necessary improvements to the application website.</p><p>Public reporting burden for this collection of information is estimated to average 30 minutes per response, including the time for reviewing instructions, searching existing data sources, gathering and maintaining the data needed, and completing and reviewing the collection of information. An agency may not conduct or sponsor, and a person is not required to respond to, a collection of information unless it displays a currently valid OMB control number. Send comments regarding this burden estimate or any other aspect of this collection of information, including suggestions for reducing this burden to: NIH, Project Clearance Branch, 6705 Rockledge Drive, MSC 7974, Bethesda, MD 20892-7974, ATTN: PRA (0925-0761). Do not return the completed form to this address</p>",
		},
		{
			type: 'Applicant Reference Received - Applicant',
			active: true,
			text: "<p>Dear Dr. #APPLICANT_LAST_NAME#,</p><p>This email is to notify you that we have received a letter from Dr. #REF_LAST_NAME# in support of your application for #POSITION# at the #IC#, National Institutes of Health.</p><p>Regards,<br />#EXECUTIVE_SECRETARY#<br />#EXECUTIVE_SECRETARY_EMAIL#</p>"
		}
	];

	useEffect(() => {
		if (basicInfo.referenceCollection === true && initialValues.emailTemplates.length === 2) {
			initialValues = initialValues.emailTemplates.concat(referenceEmailTemplates);
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
