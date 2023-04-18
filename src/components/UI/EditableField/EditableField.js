import './EditableField.css';
import { Button, Input, Form } from 'antd';

const editableField = (props) => (
	<Form.Item
		label={props.label}
		name={props.name}
		rules={[{ required: props.required, message: 'Please provide an answer.' }]}
	>
		<Input />
	</Form.Item>
);

export default editableField;
