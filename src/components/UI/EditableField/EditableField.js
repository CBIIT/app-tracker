import './EditableField.css';
import { Button, Input, Form } from 'antd';

const editableField = (props) => (

	<Form.Item
		label={props.label}
		name="username"
		rules={[{ required: false, message: 'Please input your username!' }]}
	>
	<Input />
	</Form.Item>


	// <Form.Item
	// 	// name={props.label}
	// 	name="hello !"
	// 	label={"yo this is ma label"}
	// 	// labelCol={{ span: 24 }}
	// 	//rules={props.rules}
	// 	rules={[{ required: true, message: 'Please input your username!' }]}
	// 	className='Input'
	// 	noStyle
	// >
	// 	<Input
	// 	// label="here is a label"
	// 	// className='Input'
	// 	// disabled={false}
	// 	// labelCol={{ span: 24 }}
	// 	/>
	// </Form.Item>
	// <div className='EditableFieldContainer' style={props.containerStyle}>
	// 	<input type="text" style={props.valueStyle} value={props.value} size={props.size} onChange={props.callback}/>
	// </div>
);

export default editableField;
