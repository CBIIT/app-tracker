import { Form, Input, Slider, DatePicker } from 'antd';

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import { Editor } from '@tinymce/tinymce-react';

import RequiredDocsList from './RequiredDocsList/RequiredDocsList';

import './BasicInfo.css';

const BasicInformation = () => {
	const sliderMarks = {
		1: '1',
		2: '2',
		3: '3',
	};

	const [formInstance] = Form.useForm();

	const initialValues = {
		numberOfRecommendations: 3,
	};

	const validateCloseDate = (openDate) => ({
		validator(_, value) {
			if (!value || !openDate || openDate <= value) {
				return Promise.resolve();
			}
			return Promise.reject(
				'Please pick a close date that is after the open date'
			);
		},
	});

	const validateCloseDate2 = async (openDate) => {
		if (!value || !openDate || openDate <= value) {
			return Promise.resolve();
		}
		return Promise.reject(
			'Please pick a close date that is after the open date'
		);
	};

	const validateOpenDate = async (_, value) => {
		if (value && value < new Date().setHours(0, 0, 0, 0)) {
			throw new Error('Please pick an open date that is not in the past');
		}

		const closeDate = formInstance.getFieldValue('closeDate');

		if (closeDate && value >= closeDate) {
			throw new Error('Please pick an open date that is before the close date');
		}
	};

	const onFormChangeHandler = (changedFields) => {
		console.log('[BasicInfo]:' + changedFields);
	};

	const descriptionChangeHandler = (content) => {
		formInstance.setFieldsValue({ description: content });
	};

	const openDateChangeHandler = (date) => {
		if (date < formInstance.getFieldsValue().closeDate) {
			formInstance.setFields([
				{
					name: 'closeDate',
					errors: '',
				},
			]);
		}
	};

	const closeDateChangeHandler = (date) => {
		if (date > formInstance.getFieldsValue().openDate) {
			formInstance.setFields([{ name: 'openDate', errors: '' }]);
		}
	};

	return (
		<Form
			layout='vertical'
			requiredMark={false}
			name='BasicInfo'
			form={formInstance}
			initialValues={initialValues}
			onFieldsChange={onFormChangeHandler}
		>
			<Form.Item
				label='Position Title'
				name='positionTitle'
				rules={[{ required: true, message: 'Please enter' }]}
			>
				<Input placeholder='Please enter' />
			</Form.Item>

			<Form.Item label='Position Description' name='description'>
				<Editor
					init={{
						skin: false,
						content_css: false,
						height: 500,
						menubar: false,
						branding: false,
						elementpath: false,
						statusbar: false,
						plugins: ['link image', 'table paste'],
						toolbar:
							'undo redo | formatselect | bold italic backcolor | \
	                        alignleft aligncenter alignright alignjustify | \
	                        bullist numlist outdent indent | removeformat | help',
					}}
					onEditorChange={descriptionChangeHandler}
				/>
			</Form.Item>

			<div className='DatePickerContainer'>
				<Form.Item
					label='Open Date'
					name='openDate'
					rules={[
						{ required: true, message: 'Please select an open date' },
						{ validator: validateOpenDate },
					]}
				>
					<DatePicker
						className='DatePicker'
						onChange={(date) => openDateChangeHandler(date)}
					/>
				</Form.Item>

				<Form.Item
					label='Close Date'
					name='closeDate'
					rules={[
						{
							required: true,
							message: 'Please select a close date',
						},
						{
							validator: ({ getFieldValue }) =>
								validateCloseDate2(getFieldValue('openDate')),
						},
						({ getFieldValue }) => validateCloseDate(getFieldValue('openDate')),
					]}
				>
					<DatePicker
						className='DatePicker'
						onChange={(date) => closeDateChangeHandler(date)}
					/>
				</Form.Item>
			</div>

			<Form.Item label='Application Documents' name='applicationDocuments'>
				<RequiredDocsList name='applicationDocuments' />
			</Form.Item>

			<Form.Item label='Letters of Recommendation'>
				<p className='SmallText'>
					How many recommendations does this vacancy require?
				</p>

				<Form.Item name='numberOfRecommendations'>
					<Slider className='Slider' min={1} max={3} dots marks={sliderMarks} />
				</Form.Item>
			</Form.Item>
		</Form>
	);
};

export default BasicInformation;
