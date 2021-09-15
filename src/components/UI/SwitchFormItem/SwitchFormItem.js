import { Switch, Form } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './SwitchFormItem.css';

const switchFormItem = (props) => {
	const readOnly = props.readOnly;
	return (
		<div className='SwitchFormItemContainer'>
			<Form.Item
				name={props.name}
				valuePropName='checked'
				rules={props.rules}
				noStyle
			>
				<Switch
					checkedChildren={<CheckOutlined />}
					unCheckedChildren={<CloseOutlined />}
					onChange={props.onChangeHandler}
					disabled={readOnly}
				/>
			</Form.Item>
			<p>{props.label}</p>
		</div>
	);
};

export default switchFormItem;
