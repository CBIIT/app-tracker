import './EditableField.css';
import { Button, Input, Form } from 'antd';

const editableField = (props) => (
	<Form.Item
		label={props.label}
		name="username"
		rules={[{ required: false, message: 'please provide an answer' }]}
	>
		<Input />
	</Form.Item>
);

export default editableField;
