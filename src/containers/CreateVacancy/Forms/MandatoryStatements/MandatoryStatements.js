import { Form } from 'antd';
import 'react-quill/dist/quill.snow.css';

import '../../CreateVacancy.css';
import './MandatoryStatements.css';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const mandatoryStatements = (props) => {
	const formInstance = props.formInstance;
	const initialValues = props.initialValues;
	const readOnly = props.readOnly;

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
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				readOnly={true}
			/>
			<SwitchFormItemEditor
				name='standardsOfConduct'
				label='Standards of Conduct/Financial Disclosure'
				formInstance={formInstance}
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				readOnly={readOnly}
			/>
			<SwitchFormItemEditor
				name='foreignEducation'
				label='Foreign Education'
				formInstance={formInstance}
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				readOnly={readOnly}
			/>
			<SwitchFormItemEditor
				name='reasonableAccomodation'
				label='Reasonable Accommodation'
				formInstance={formInstance}
				onToggle={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				onBlur={() => {
					formInstance.validateFields(['mandatoryStatements']);
				}}
				readOnly={readOnly}
			/>
			<Form.Item
				name='mandatoryStatements'
				rules={[{ validator: validateMandatoryStatements }]}
			>
				{/* Supress antd warning about using name */}
				<input style={{ display: 'none' }} />
			</Form.Item>
		</Form>
	);
};

export default mandatoryStatements;
