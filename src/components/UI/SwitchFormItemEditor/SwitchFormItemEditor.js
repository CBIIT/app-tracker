import SwitchFormItem from '../SwitchFormItem/SwitchFormItem';
import { Form } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './SwitchFormItemEditor.css';
import { useState } from 'react';

const switchFormItemEditor = (props) => {
	const [showEditor, setShowEditor] = useState(
<<<<<<< HEAD
		props.showEditor
			? props.showEditor
			: props.formInstance.getFieldValue(props.name)
=======
		props.formInstance.getFieldValue(props.name)
>>>>>>> origin/dev
	);

	const onChangeHandler = (value) => {
		setShowEditor(value);
<<<<<<< HEAD
		props.onToggle ? props.onToggle() : null;
	};

	return (
		<div>
=======
	};

	return (
		<>
>>>>>>> origin/dev
			<SwitchFormItem
				name={props.name}
				label={props.label}
				onChangeHandler={onChangeHandler}
<<<<<<< HEAD
				rules={props.rules}
			/>
			<Form.Item
				name={props.textName ? props.textName : props.name + 'Text'}
				style={showEditor || props.showEditor ? {} : { display: 'none' }}
				rules={props.rules}
			>
				<ReactQuill
					className='SwitchFormItemTextEditor'
					onBlur={props.onBlur}
				/>
			</Form.Item>
		</div>
=======
			/>
			<Form.Item
				name={props.name + 'Text'}
				style={showEditor ? {} : { display: 'none' }}
			>
				<ReactQuill className='SwitchFormItemTextEditor' />
			</Form.Item>
		</>
>>>>>>> origin/dev
	);
};

export default switchFormItemEditor;
