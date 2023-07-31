import './EditableField.css';
import { Input, Form } from 'antd';

const editableField = (props) =>
	props.name == 'email' ? (
		<Form.Item
			label={props.label}
			name={props.name}
			rules={[
				{ required: props.required, message: 'Please provide an email.' },
				{
					type: 'string',
					pattern: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
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
