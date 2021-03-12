import { PlusOutlined } from '@ant-design/icons';
import { Form, Button } from 'antd';

import InputWithCheckbox from '../../../../../components/UI/InputWithCheckbox/InputWithCheckbox';

const requiredDocsList = (props) => {
	return (
		<Form.List name={props.name}>
			{(fields, { add, remove }) => {
				return (
					<div>
						{fields.map((field, index) => (
							<div key={field.key}>
<<<<<<< HEAD
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
=======
								<Form.Item name={[index, 'name']} rules={[{ required: true }]}>
									<InputWithCheckbox
										name={[index, 'document']}
										checkboxName={[index, 'isDocumentOptional']}
										rules={[{ required: true }]}
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
										onInnerButtonClick={() => remove(field.name)}
									/>
								</Form.Item>
							</div>
						))}
<<<<<<< HEAD
						<Button type='secondary' onClick={() => add()}>
							<PlusOutlined /> add more
						</Button>
=======
						<Form.Item>
							<Button type='secondary' onClick={() => add()}>
								<PlusOutlined /> add more
							</Button>
						</Form.Item>
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
					</div>
				);
			}}
		</Form.List>
	);
};

export default requiredDocsList;
