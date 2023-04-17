import './EditableRadio.css';
import React, { useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { Input, Radio, Space, Form } from 'antd';

const editableRadio = (props) => {

	//const [value, setValue] = useState(1);

	const onChange = (e) => {
		console.log('radio checked', e.target.value);
	  };

	  return(

	<Form.Item
		label={props.label}
		name={props.label + "Radio"}
		rules={[{ required: false, message: 'please provide an answer' }]}
	>
    <Radio.Group onChange={onChange}
	// value={value}
	>
      <Space direction="vertical">
	   	{props.options.split(',').map((option) => (
	 		// <div key={option}>
	 		// 	<input type="radio" id={option + "Id"} name={option + "Radio"} value={option} readOnly={true}/>
	 		// 	<label htmlFor={option + "Id"} readOnly={true}>{option}</label><br/>
	 		// </div>
			 <Radio key={option} value={option}>{option}</Radio>
	 	))}
        {/* <Radio value={1}>Option A</Radio>
        <Radio value={2}>Option B</Radio> */}
      </Space>
    </Radio.Group>

	</Form.Item>

	// <div className='EditableRadioContainer' style={props.containerStyle}>
	// 	<span style={props.labelStyle}>{props.label}</span><br/>
	// 	{props.options.split(',').map((option) => (
	// 		<div key={option}>
	// 			{/* once you start connecting this, remove the read only props */}
	// 			<input type="radio" id={option + "Id"} name={option + "Radio"} value={option} readOnly={true}/>
	// 			<label htmlFor={option + "Id"} readOnly={true}>{option}</label><br/>
	// 		</div>
	// 	))}
	// </div>
	  );
};

export default editableRadio;
