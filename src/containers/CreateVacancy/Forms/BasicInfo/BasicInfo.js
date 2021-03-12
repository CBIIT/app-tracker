import { Form, Input, Slider, DatePicker } from 'antd';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RequiredDocsList from './RequiredDocsList/RequiredDocsList';

import './BasicInfo.css';
import '../../CreateVacancy.css';
<<<<<<< HEAD
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const basicInformation = (props) => {
	const formInstance = props.formInstance;
	const initialValues = props.initialValues;

=======

const BasicInformation = () => {
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
	const sliderMarks = {
		1: '1',
		2: '2',
		3: '3',
	};

<<<<<<< HEAD
=======
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

>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
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

<<<<<<< HEAD
	const validateDescription = async (_, description) => {
		if (isRichTextEditorEmpty(description)) {
			throw new Error('Please enter a description.');
		}

		formInstance.setFields([{ name: 'description', errors: '' }]);
=======
	const onFormChangeHandler = () => {
		// console.log('Form Data: ' + JSON.stringify(formInstance.getFieldsValue()));
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
	};

	return (
		<Form
			layout='vertical'
			requiredMark={false}
			name='BasicInfo'
			form={formInstance}
			initialValues={initialValues}
<<<<<<< HEAD
		>
			<Form.Item
				label='Vacancy Title'
				name='title'
				rules={[{ required: true, message: 'Please enter a title' }]}
=======
			onFieldsChange={onFormChangeHandler}
		>
			<Form.Item
				label='Position Title'
				name='positionTitle'
				rules={[{ required: true, message: 'Please enter' }]}
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
			>
				<Input placeholder='Please enter' />
			</Form.Item>

<<<<<<< HEAD
			<Form.Item
				label='Vacancy Description'
				name='description'
				rules={[{ validator: validateDescription }]}
			>
=======
			<Form.Item label='Position Description' name='description'>
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
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

<<<<<<< HEAD
export default basicInformation;
=======
export default BasicInformation;
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
