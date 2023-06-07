import { Form, Input, Slider, DatePicker, Tooltip, Checkbox } from 'antd';
import useAuth from '../../../../hooks/useAuth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RequiredDocsList from './RequiredDocsList/RequiredDocsList';
import EditableDropDown from '../../../../components/UI/EditableDropDown/EditableDropDown';

import './BasicInfo.css';
import '../../CreateVacancy.css';
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

const basicInformation = (props) => {

	const formInstance = props.formInstance;
	const initialValues = props.initialValues;
	const readOnly = props.readOnly;

	const { auth } = useAuth();
	const { user } = auth;

	const sliderMarks = {
		0: '0',
		1: '1',
		2: '2',
		3: '3',
	};

	// TODO: get from new API endpoint
	const appInitiatorMenu = [];	

	const positionClassificationMenu = [
		{ label: 'Senior Investigator', value: 'Senior Investigator' },
		{ label: 'Senior Investigator (HS)', value: 'Senior Investigator (HS)' },
		{ label: 'Investigator 2', value: 'Investigator 2' },
		{ label: 'Investigator (HS)', value: 'Investigator (HS)' },
		{ label: 'Senior Clinician', value: 'Senior Clinician' },
		{ label: 'Senior Clinician (HS)', value: 'Senior Clinician (HS)' },
		{ label: 'Senior Scientist', value: 'Senior Scientist' },
		{ label: 'Assistant Clinical Investigator 2', value: 'Assistant Clinical Investigator 2' },
		{ label: 'Assistant Clinical Investigator (HS)', value: 'Assistant Clinical Investigator (HS)' },
		{ label: 'Staff Clinician 2', value: 'Staff Clinician 2' },
		{ label: 'Staff Clinician (HS)', value: 'Staff Clinician (HS)' },
		{ label: 'Staff Scientist 2', value: 'Staff Scientist 2' },
		{ label: 'Staff Scientist 2 (Clinical)', value: 'Staff Scientist 2 (Clinical)' },
		{ label: 'Staff Scientist 2 (Facility Head)', value: 'Staff Scientist 2 (Facility Head)' },
		{ label: 'Scientific Executive', value: 'Scientific Executive' },
		{ label: 'Senior Scientific Officer', value: 'Senior Scientific Officer' },
		{ label: 'Scientific Policy or Program Leader – Tier 2', value: 'Scientific Policy or Program Leader – Tier 2' },
		{ label: 'Scientific Director', value: 'Scientific Director' },
		{ label: 'Clinical Director', value: 'Clinical Director' },
		{ label: 'IC Deputy Director', value: 'IC Deputy Director' },
		{ label: 'IC Director', value: 'IC Director' },
		{ label: 'NIH Deputy Director', value: 'NIH Deputy Director' },
		{ label: 'SBRBPAS', value: 'SBRBPAS' },
		{ label: 'N/A', value: 'N/A' },
	];

	// TODO: get from new API endpoint
	const orgCodeMenu = [];

	console.log(formInstance.getFieldValue('openDate'));
	console.log(formInstance);

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

			{ (user?.tenant.trim().toLowerCase() === "stadtman") ?	// TODO: replace "true" with an auth / user indicator that is true if the vacancy manager is stadman
				<Form.Item
					label='Focus Area Selection'
					name='requireFocusArea'
					valuePropName='checked'
					style={{ margin: '0px', paddingLeft: '10px', paddingBottom: '10px' }}
				>
					<Checkbox>Enable focus area</Checkbox>
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

			{/* TODO: are these three drop downs required ? */}

			<div className='DatePickerContainer'>				
				<div className='DatePicker'>
					{/* TODO: Needs API call */}
					<EditableDropDown
						label='Appointment Package Indicator'
						name='appointmentPackageIndicator'
						required={true}
						menu={appInitiatorMenu}
					/>
				</div>

				<div className='DatePicker'>
					<EditableDropDown
						label='Position Classification'
						name='positionClassification'
						required={true}
						menu={positionClassificationMenu}
					/>	
				</div>
			</div>

			{/* TODO: Needs API call */}
			<div className='DatePicker'>
				<EditableDropDown
					label='Organization Code'
					name='orgCode'
					required={true}
					menu={orgCodeMenu}
				/>	
			</div>

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
