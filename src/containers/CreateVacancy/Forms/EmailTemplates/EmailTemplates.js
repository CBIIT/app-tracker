import { Form } from 'antd';
import SwitchFormItemEditor from '../../../../components/UI/SwitchFormItemEditor/SwitchFormItemEditor';
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const emailTemplates = (props) => {
	const formInstance = props.formInstance;

	const initialValues = { emailTemplates: props.initialValues };

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
