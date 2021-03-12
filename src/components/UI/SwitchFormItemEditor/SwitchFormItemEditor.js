import SwitchFormItem from '../SwitchFormItem/SwitchFormItem';
import { Form } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './SwitchFormItemEditor.css';
import { useState } from 'react';

const switchFormItemEditor = (props) => {
	const [showEditor, setShowEditor] = useState(
		props.formInstance.getFieldValue(props.name)
	);

	const onChangeHandler = (value) => {
		setShowEditor(value);
	};

	return (
		<>
			<SwitchFormItem
				name={props.name}
				label={props.label}
				onChangeHandler={onChangeHandler}
			/>
			<Form.Item
				name={props.name + 'Text'}
				style={showEditor ? {} : { display: 'none' }}
			>
				<ReactQuill className='SwitchFormItemTextEditor' />
			</Form.Item>
		</>
	);
};

export default switchFormItemEditor;
