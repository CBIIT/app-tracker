import './EditableDropDown.css';
import { Form, Select, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const editableDropDown = (props) => (
	<Form.Item
		label={props.label}
		name={props.name}
		rules={[{ required: props.required, message: 'Please make a selection' }]}
	>
		{props.loading ? (
			<Space block='true' style={{display: 'flex', justifyContent: 'center'}}>
				<LoadingOutlined style={{fontSize: '2rem'}}/>
			</Space>
		) : (
			<Select
				disabled={props?.disabled}
				showSearch={props?.showSearch}
				options={props.menu?.map((option) => ({
					label: option.label,
					value: option.value,
				}))}
				filterOption={props.filterOption}
				filterSort={props.filterSort}
			/>
		)}
	</Form.Item>
);

export default editableDropDown;
