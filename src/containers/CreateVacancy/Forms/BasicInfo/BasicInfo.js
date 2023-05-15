import { Form, Input, Slider, DatePicker, Tooltip, Checkbox } from 'antd';

import React, { useEffect, useState } from "react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RequiredDocsList from './RequiredDocsList/RequiredDocsList';
import EditableFocusArea from '../../../../components/UI/EditableFocusArea/EditableFocusArea';

import './BasicInfo.css';
import '../../CreateVacancy.css';
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const basicInformation = (props) => {

	const [ displayFocusArea, setDisplayFocusArea ] = useState(false);

	const formInstance = props.formInstance;
	const initialValues = props.initialValues;
	const readOnly = props.readOnly;

	const sliderMarks = {
		0: '0',
		1: '1',
		2: '2',
		3: '3',
	};

	console.log(formInstance.getFieldValue('openDate'));	// undefined !!
	console.log(formInstance);

	const disabledDate = (currentDate) => {
		return currentDate <= new Date().setHours(0, 0, 0, 0);
	};

	const setFocusArea = (info) => {
		setDisplayFocusArea(info.target.checked);
	}

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

	const validateDescription = async (_, description) => {
		if (isRichTextEditorEmpty(description)) {
			throw new Error('Please enter a description.');
		}

		formInstance.setFields([{ name: 'description', errors: '' }]);
	};

	return (
		<Form
			layout='vertical'
			requiredMark={false}
			name='BasicInfo'
			form={formInstance}
			initialValues={initialValues}
			className='BasicInfo'
		>
			<div className='BasicInfoFlexWrap'>
				<div style={{ flex: '3 1 480px' }}>
					<Form.Item
						label='Vacancy Title'
						name='title'
						rules={[{ required: true, message: 'Please enter a title' }]}
					>
						<Input placeholder='Please enter' disabled={readOnly} />
					</Form.Item>
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flex: '1 0 240px',
					}}
				>
					<Tooltip title='Checking this box allows HR Specialist(s) assigned to this vacancy to perform vacancy manager triage'>
						<Form.Item
							name='allowHrSpecialistTriage'
							valuePropName='checked'
							style={{ margin: '0px', paddingLeft: '10px' }}
						>
							<Checkbox>Allow HR Specialist to Triage</Checkbox>
						</Form.Item>
					</Tooltip>
				</div>
			</div>

			<Form.Item
				label='Focus Area Selection'
				name='focusAreaEnabled'
			>
				<Checkbox onChange={(info) => setFocusArea(info)}>Enable focus area</Checkbox>
			</Form.Item>

			{displayFocusArea
					? <Form.Item
						label=''
						name='focusArea'
					>
						<EditableFocusArea mode="single" directions="select a focus area"/>
					  </Form.Item>
					: null
			}

			<Form.Item
				label='Vacancy Description'
				className='VacancyDescription'
				name='description'
				rules={[{ validator: validateDescription }]}
			>
				<ReactQuill className='QuillEditor' readOnly={readOnly} />
			</Form.Item>

			<div className='DatePickerContainer'>
				<div className='DatePicker'>
					<Form.Item
						label='Open Date'
						name='openDate'
						rules={[
							{ required: true, message: 'Please select an open date' },
							{ validator: validateDates },
						]}
					>
						<DatePicker
							disabledDate={disabledDate}
							format='MM/DD/YYYY'
							disabled={readOnly}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</div>
				<div className='DatePicker'>
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
						<DatePicker
							className='DatePickerInput'
							disabledDate={disabledDate}
							format='MM/DD/YYYY'
							disabled={readOnly}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</div>
			</div>

			<div className='DatePickerContainer'>
				<div className='DatePicker'>
					<Form.Item label='Scoring Due By Date' name='scoringDueByDate'>
						<DatePicker format='MM/DD/YYYY' style={{ width: '100%' }} />
					</Form.Item>
				</div>
			</div>

			<Form.Item label='Application Documents' name='applicationDocuments'>
				<RequiredDocsList name='applicationDocuments' readOnly={readOnly} />
			</Form.Item>

			<Form.Item label='Letters of Recommendation'>
				<p className='SmallText'>
					How many recommendations does this vacancy require?
				</p>

				<Form.Item name='numberOfRecommendations'>
					<Slider
						className='Slider'
						min={0}
						max={3}
						dots
						marks={sliderMarks}
						disabled={readOnly}
					/>
				</Form.Item>
			</Form.Item>
		</Form>
	);
};

export default basicInformation;
