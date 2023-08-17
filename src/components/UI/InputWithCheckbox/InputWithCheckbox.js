import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Form, Checkbox } from 'antd';

import './InputWithCheckbox.css';
import InputWithButton from '../InputWithButton/InputWithButton';

const inputWithCheckbox = (props) => {
	const readOnly = props.readOnly;
	return (
		<div className='InputWithCheckboxContainer'>
			<InputWithButton
				name={props.name}
				rules={props.rules}
				onInnerButtonClick={props.onInnerButtonClick}
				className='InputField'
				buttonIcon={<DeleteOutlined />}
				readOnly={readOnly}
			/>
			<div className='Checkbox'>
				<Form.Item name={props.checkboxName} noStyle valuePropName='checked'>
					<Checkbox disabled={readOnly}>Optional</Checkbox> 
				</Form.Item>
			</div>
		</div>
	);
};

export default inputWithCheckbox;
