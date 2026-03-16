import React from 'react';
import { Button, Input, Form } from 'antd';

import './InputWithButton.css';

const inputWithButton = (props) => {
	const readOnly = props.readOnly;
	return (
		<div className='InputWithButtonContainer ant-input'>
			<Form.Item
				name={props.name}
				rules={props.rules}
				className='Input'
				noStyle
			>
				<Input className='Input' disabled={readOnly} />
			</Form.Item>
			{!readOnly ? (
				<Button
					className='BorderlessButton'
					type='Link'
					icon={props.buttonIcon}
					onClick={props.onInnerButtonClick}
				/>
			) : null}
		</div>
	);
};

export default inputWithButton;
