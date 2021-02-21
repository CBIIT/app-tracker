import React from 'react';
import { Button, Input, Form } from 'antd';

import './InputWithButton.css';

const inputWithButton = (props) => {
	return (
		<div className='InputWithButtonContainer ant-input'>
			<Form.Item
				name={props.name}
				rules={props.rules}
				className='Input'
				noStyle
			>
				<Input className='Input' />
			</Form.Item>
			<Button
				className='BorderlessButton'
				type='Link'
				icon={props.buttonIcon}
				onClick={props.onInnerButtonClick}
			/>
		</div>
	);
};

export default inputWithButton;
