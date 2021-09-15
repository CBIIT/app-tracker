import SwitchFormItem from '../SwitchFormItem/SwitchFormItem';
import { Form } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './SwitchFormItemEditor.css';
import { useState } from 'react';

const switchFormItemEditor = (props) => {
	const readOnly = props.readOnly;
	const [showEditor, setShowEditor] = useState(
		props.showEditor
			? props.showEditor
			: props.formInstance.getFieldValue(props.name)
	);

	const onChangeHandler = (value) => {
		setShowEditor(value);
		props.onToggle ? props.onToggle() : null;
	};

	return (
		<div className='SwitchFormItemEditor'>
			<SwitchFormItem
				name={props.name}
				label={props.label}
				onChangeHandler={onChangeHandler}
				rules={props.rules}
				readOnly={readOnly}
			/>
			<Form.Item
				name={props.textName ? props.textName : props.name + 'Text'}
				style={showEditor || props.showEditor ? {} : { display: 'none' }}
				rules={props.rules}
			>
				<ReactQuill
					className='SwitchFormItemTextEditor'
					onBlur={props.onBlur}
					readOnly={readOnly}
				/>
			</Form.Item>
		</div>
	);
};

export default switchFormItemEditor;
