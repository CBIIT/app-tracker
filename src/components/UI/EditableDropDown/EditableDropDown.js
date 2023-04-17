import './EditableDropDown.css';
// import Select from 'react-select'
import { Button, Menu, Dropdown, Space, Icon, Form, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const editableDropDown = (props) => (
	<Form.Item label={props.label} >
		<Select
			defaultValue={props.menu[0]}
			style={{ width: 120 }}
			// onChange={handleProvinceChange}
			options={props.menu.map((option) => ({ label: option, value: option }))}
		/>
		{/* <span style={props.labelStyle}>{props.label}</span><br/> */}
		{/* <Dropdown overlay={props.menu} trigger={['click']} >
			<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
				Click me
				<DownOutlined />
			</a>
		</Dropdown> */}
	</Form.Item>
);

export default editableDropDown;
