import { Form } from 'antd';
import 'react-quill/dist/quill.snow.css';

import '../../CreateVacancy.css';
import './MandatoryStatements.css';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';
<<<<<<< HEAD
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const mandatoryStatements = (props) => {
	const formInstance = props.formInstance;
	const initialValues = props.initialValues;

	const validateMandatoryStatements = async () => {
		if (
			(formInstance.getFieldValue('equalOpportunityEmployer') === false ||
				isRichTextEditorEmpty(
					formInstance.getFieldValue('equalOpportunityEmployerText')
				)) &&
			(formInstance.getFieldValue('standardsOfConduct') === false ||
				isRichTextEditorEmpty(
					formInstance.getFieldValue('standardsOfConductText')
				)) &&
			(formInstance.getFieldValue('foreignEducation') === false ||
				isRichTextEditorEmpty(
					formInstance.getFieldValue('foreignEducationText')
				)) &&
			(formInstance.getFieldValue('reasonableAccomodation') === false ||
				isRichTextEditorEmpty(
					formInstance.getFieldValue('reasonableAccomodationText')
				))
		)
			throw new Error(
				'One active mandatory statement with content is required.'
			);
		// else
		// 	formInstance.setFields([
		// 		{
		// 			name: 'mandatoryStatements',
		// 			errors: '',
		// 		},
		// 	]);
=======

const mandatoryStatements = () => {
	const [formInstance] = Form.useForm();

	const initialValues = {
		equalOpportunityEmployer: true,
		equalOpportunityEmployerText:
			'<p>Selection for this position will be based solely on merit, with no discrimination for non-merit reasons such as race, color, religion, gender, sexual orientation, national origin, political affiliation, marital status, disability, age, or membership or non-membership in an employee organization.&nbsp;The NIH encourages the application and nomination of qualified women, minorities, and individuals with disabilities.</p>',
		standardsOfConduct: true,
		standardsOfConductText:
			'<p>The National Institutes of Health inspires public confidence in our science by maintaining high ethical principles. NIH employees are subject to Federal government-wide regulations and statutes as well as agency-specific regulations described at the NIH Ethics Website. We encourage you to review this information. The position is subject to a background investigation and requires the incumbent to complete a public financial disclosure report prior to the effective date of the appointment.</p>',
		foreignEducation: true,
		foreignEducationText:
			'<p>Applicants who have completed part or all of their education outside of the U.S. must have their foreign education evaluated by an accredited organization to ensure that the foreign education is equivalent to education received in accredited educational institutions in the United States. We will only accept the completed foreign education evaluation. For more information on foreign education verification, visit the https://www.naces.org website. Verification must be received prior to the effective date of the appointment.</p>',
		reasonableAccomodation: true,
		reasonableAccomodationText:
			'<p>NIH provides reasonable accommodations to applicants with disabilities. If you require reasonable accommodation during any part of the application and hiring process, please notify us. The decision on granting reasonable accommodation will be made on a case-by-case basis.</p>',
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
	};

	return (
		<Form
			name='MandatoryStatements'
			layout='horizontal'
			requiredMark={false}
			form={formInstance}
			initialValues={initialValues}
			colon={false}
		>
			<Form.Item label='Mandatory Statements / Job Posting Statements'></Form.Item>
			<p className='SmallText'>
				What mandatory job statements would you like to include with the
				posting?
			</p>
			<SwitchFormItemEditor
				name='equalOpportunityEmployer'
				label='Equal Opportunity Employer'
				formInstance={formInstance}
<<<<<<< HEAD
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
=======
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
			/>

			<SwitchFormItemEditor
				name='standardsOfConduct'
				label='Standards of Conduct/Financial Disclosure'
				formInstance={formInstance}
<<<<<<< HEAD
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
=======
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
			/>

			<SwitchFormItemEditor
				name='foreignEducation'
				label='Foreign Education'
				formInstance={formInstance}
<<<<<<< HEAD
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
=======
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
			/>

			<SwitchFormItemEditor
				name='reasonableAccomodation'
				label='Reasonable Accommodation'
				formInstance={formInstance}
<<<<<<< HEAD
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
			/>
			<Form.Item
				name='mandatoryStatements'
				rules={[{ validator: validateMandatoryStatements }]}
			></Form.Item>
=======
			/>
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		</Form>
	);
};

export default mandatoryStatements;
