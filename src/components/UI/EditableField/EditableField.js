import './EditableField.css';
import { Input, Form } from 'antd';

const editableField = (props) =>
	props.name == 'email' ? (
		<Form.Item
			label={props.label}
			name={props.name}
			rules={[
				{ required: props.required, message: 'Please provide an answer.' },
				{
					type: 'string',
					pattern: new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
					message: 'Please provide a valid email address.',
				}
			]}
		>
			<Input />
		</Form.Item>
	) : (
		<Form.Item
			label={props.label}
			name={props.name}
			rules={[
				{ required: props.required, message: 'Please provide an answer.' },
			]}
		>
			<Input />
		</Form.Item>
	);

export default editableField;
