import { PlusOutlined } from '@ant-design/icons';
import { Form, Button } from 'antd';

import InputWithCheckbox from '../../../../../components/UI/InputWithCheckbox/InputWithCheckbox';

const requiredDocsList = (props) => {
	const readOnly = props.readOnly;

	return (
		<Form.List name={props.name}>
			{(fields, { add, remove }) => {
				return (
					<div>
						{fields.map((field, index) => (
							<div key={field.key}>
								<Form.Item name={[index, 'name']}>
									<InputWithCheckbox
										key={field.key}
										name={[index, 'document']}
										checkboxName={[index, 'isDocumentOptional']}
										rules={[
											{
												required: true,
												message: 'Please enter a document type name',
											},
										]}
										onInnerButtonClick={() => remove(field.name)}
										readOnly={readOnly}
									/>
								</Form.Item>
							</div>
						))}
						{!readOnly ? (
							<Button type='secondary' onClick={() => add()}>
								<PlusOutlined /> Add More
							</Button>
						) : null}
					</div>
				);
			}}
		</Form.List>
	);
};

export default requiredDocsList;
