import { Switch, Form } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './SwitchFormItem.css';

const switchFormItem = (props) => (
	<div className='SwitchFormItemContainer'>
<<<<<<< HEAD
		<Form.Item
			name={props.name}
			valuePropName='checked'
			rules={props.rules}
			noStyle
		>
=======
		<Form.Item name={props.name} valuePropName='checked' noStyle>
>>>>>>> origin/dev
			<Switch
				checkedChildren={<CheckOutlined />}
				unCheckedChildren={<CloseOutlined />}
				onChange={props.onChangeHandler}
			/>
		</Form.Item>
		<p>{props.label}</p>
	</div>
);

export default switchFormItem;
