import './EditableRadio.css';
import React from 'react';
import { Radio, Space, Form } from 'antd';

const editableRadio = (props) => {

	const onChange = (e) => {
		console.log('radio checked', e.target.value);
	  };

	  return(

	<Form.Item
		label={props.label}
		name={props.label + "Radio"}
		rules={[{ required: false, message: 'please provide an answer' }]}
	>
    <Radio.Group onChange={onChange}>
      
	   	{props.options.map((option) => (
			<Space direction="horizontal" key={option.value + "Space"}>
				<Radio key={option.value} value={option.value}>{option.label}</Radio>
			</Space>
	 	))}
      
    </Radio.Group>

	</Form.Item>

	  );
};

export default editableRadio;
