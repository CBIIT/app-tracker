import './EditableFocusArea.css';
import { Form, Select } from 'antd';

const editableFocusArea = (props) => (
	<Form.Item
		label='Focus Area'
		name='focusArea'
		rules={[
			{
				required: true,
				message: 'Please make a selection',
			},
			{
				max: 2,
				message: 'Please only select a maximum of 2 focus areas',
				type: 'array',
			},
		]}
	>
		<Select
			mode={props.mode}
			options={props.focusAreaChoices}
		/>
	</Form.Item>
);

export default editableFocusArea;
