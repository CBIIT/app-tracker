import { Form, Input, Slider, DatePicker } from 'antd';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
		description: '',
		applicationDocuments: [
			{
				document: 'Curriculum Vitae (CV)',
			},
			{
				document: 'Cover Letter',
				isDocumentOptional: true,
			},
			{
				document: 'Vision Statement',
			},
			{
				document: 'Qualification Statement',
				isDocumentOptional: true,
			},
		],
	};

	const disabledDate = (currentDate) => {
		return currentDate <= new Date().setHours(0, 0, 0, 0);
	};

	const validateDates = async (formItem) => {
		const openDate = new Date(formInstance.getFieldValue('openDate')).setHours(
			0,
			0,
			0,
			0
		);

		const closeDate = new Date(
			formInstance.getFieldValue('closeDate')
		).setHours(0, 0, 0, 0);

		if (formItem.field == 'openDate' && closeDate && openDate >= closeDate) {
			throw new Error(
				'Please pick an open date that is before the close date.'
			);
		}

		if (formItem.field == 'closeDate' && openDate && closeDate <= openDate) {
			throw new Error('Please pick a close date that is after the open date.');
		}

		formInstance.setFields([
			{
				name: 'closeDate',
				errors: '',
			},
			{
				name: 'openDate',
				errors: '',
			},
		]);
	};

	const onFormChangeHandler = () => {
		// console.log('Form Data: ' + JSON.stringify(formInstance.getFieldsValue()));
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
				<ReactQuill className='QuillEditor' />
			</Form.Item>

			<div className='DatePickerContainer'>
				<Form.Item
					label='Open Date'
					name='openDate'
					rules={[
						{ required: true, message: 'Please select an open date' },
						{ validator: validateDates },
					]}
				>
					<DatePicker className='DatePicker' disabledDate={disabledDate} />
				</Form.Item>

				<Form.Item
					label='Close Date'
					name='closeDate'
					rules={[
						{
							required: true,
							message: 'Please select a close date',
						},
						{ validator: validateDates },
					]}
				>
					<DatePicker className='DatePicker' disabledDate={disabledDate} />
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
