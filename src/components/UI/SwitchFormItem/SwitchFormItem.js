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
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
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
