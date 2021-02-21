import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';

import './InputWithCheckbox.css';
import InputWithButton from '../InputWithButton/InputWithButton';

const inputWithCheckbox = (props) => {
	return (
		<div className='InputWithCheckboxContainer'>
			<InputWithButton
				name={props.name}
				rules={props.rules}
				onInnerButtonClick={props.onInnerButtonClick}
				className='InputField'
				buttonIcon={<DeleteOutlined />}
			/>
			<div className='Checkbox'>
				<Checkbox>optional</Checkbox>
			</div>
		</div>
	);
};

export default inputWithCheckbox;
