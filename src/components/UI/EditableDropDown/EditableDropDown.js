import './EditableDropDown.css';
import { Form, Select } from 'antd';

const editableDropDown = (props) => (
	<Form.Item label={props.label} >
		<Select
			defaultValue={props.menu[0]}
			style={{ width: 250 }}
			options={props.menu.map((option) => ({ label: option, value: option }))}
		/>
	</Form.Item>
);

export default editableDropDown;
