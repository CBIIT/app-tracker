import './EditableDropDown.css';
import { Form, Select } from 'antd';

const editableDropDown = (props) => (
	<Form.Item
		label={props.label}
		name={props.name}
		rules={[{ required: props.required, message: 'Please make a selection' }]}
	>
		<Select
			showSearch={props?.showSearch}
			options={props.menu?.map((option) => ({ label: option.label, value: option.value }))}
			filterOption={props.filterOption}
			filterSort={props.filterSort}
			defaultValue={props.defaultValue}
		/>
	</Form.Item>
);

export default editableDropDown;
