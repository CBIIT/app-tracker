import React from 'react';
import {
	Form,
	Input,
	Slider,
	DatePicker,
	Tooltip,
	Checkbox,
	Select,
	Typography,
	Space,
} from 'antd';
const { Option } = Select;
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import ReactQuill from 'react-quill';
const Quill = ReactQuill.Quill;
const Font = Quill.import('formats/font');
Font.whitelist = ['Arial', 'Monaco', 'Montserrat', 'Optima', 'Georgia'];
Quill.register(Font, true);
import 'react-quill/dist/quill.snow.css';
import RequiredDocsList from './RequiredDocsList/RequiredDocsList';
import EditableDropDown from '../../../../components/UI/EditableDropDown/EditableDropDown';
import axios from 'axios';

import { GET_VACANCY_OPTIONS } from '../../../../constants/ApiEndpoints';
import './BasicInfo.css';
import '../../CreateVacancy.css';
import { isRichTextEditorEmpty } from '../../../../components/Util/RichTextValidator/RichTextValidator';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = { editorHtml: '', theme: 'snow' };
		this.handleChange = this.handleChange.bind(this);
	}
}

Editor.modules = {
	toolbar: [
		[{ header: '1' }, { header: '2' }, { font: Font.whitelist }],
		[{ size: [] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link'],
		//[{ script: "sub" }, { script: "super" }],
		['clean'],
	],
};

Editor.formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
];

const basicInformation = (props) => {
	const [appInitiatorMenu, setAppInitiatorMenu] = useState([
		{ label: ' ', value: ' ' },
	]);
	const [currentPositionMenu, setCurrentPositionMenu] = useState(
		positionClassificationMenu
	);
	const [sacCodes, setSacCodes] = useState([{ label: ' ', value: ' ' }]);
	const [isLoading, setIsLoading] = useState(false);

	const formInstance = props.formInstance;
	const initialValues = props.initialValues;

	const readOnly = props.readOnly;
	const isNew = props.isNew;
	const isDefined = props.pocDefined;
	const isUserPoc = Form.useWatch('isUserPoc', formInstance);

	const { auth } = useAuth();
	const { user } = auth;

	const newValues = {
		...props.initialValues,
		vacancyPoc: user.uid,
	};

	const sliderMarks = {
		0: '0',
		1: '1',
		2: '2',
		3: '3',
		4: '4',
		5: '5',
		6: '6',
		7: '7',
		8: '8',
		9: '9',
		10: '10',
		11: '11',
		12: '12',
		13: '13',
		14: '14',
		15: '15',
	};

	const categoryMarks = {
		1: '1',
		2: '2',
		3: '3',
		4: '4',
		5: '5',
		6: '6',
	};

	const positionClassificationMenu = [
		{ label: 'Research Fellow', value: 'Research Fellow' },
		{ label: 'Senior Research Fellow', value: 'Senior Research Fellow' },
		{ label: 'Staff Scientist 1', value: 'Staff Scientist 1' },
		{ label: 'Investigator 1', value: 'Investigator 1' },
		{ label: 'Clinical Fellow', value: 'Clinical Fellow' },
		{ label: 'Senior Clinical Fellow', value: 'Senior Clinical Fellow' },
		{
			label: 'Assistant Clinical Investigator 1',
			value: 'Assistant Clinical Investigator 1',
		},
		{ label: 'Staff Clinician 1', value: 'Staff Clinician 1' },
		{
			label: 'Science Policy Leader Tier 2',
			value: 'Science Policy Leader Tier 2',
		},
		{
			label: 'Science Program Leader Tier 2',
			value: 'Science Program Leader Tier 2',
		},
		{ label: 'Senior Investigator', value: 'Senior Investigator' },
		{ label: 'Senior Investigator (HS)', value: 'Senior Investigator (HS)' },
		{ label: 'Investigator 2', value: 'Investigator 2' },
		{ label: 'Investigator (HS)', value: 'Investigator (HS)' },
		{ label: 'Senior Clinician', value: 'Senior Clinician' },
		{ label: 'Senior Clinician (HS)', value: 'Senior Clinician (HS)' },
		{ label: 'Senior Scientist', value: 'Senior Scientist' },
		{
			label: 'Assistant Clinical Investigator 2',
			value: 'Assistant Clinical Investigator 2',
		},
		{
			label: 'Assistant Clinical Investigator (HS)',
			value: 'Assistant Clinical Investigator (HS)',
		},
		{ label: 'Staff Clinician 2', value: 'Staff Clinician 2' },
		{ label: 'Staff Clinician (HS)', value: 'Staff Clinician (HS)' },
		{ label: 'Staff Scientist 2', value: 'Staff Scientist 2' },
		{
			label: 'Staff Scientist 2 (Clinical)',
			value: 'Staff Scientist 2 (Clinical)',
		},
		{
			label: 'Staff Scientist 2 (Facility Head)',
			value: 'Staff Scientist 2 (Facility Head)',
		},
		{ label: 'Scientific Executive', value: 'Scientific Executive' },
		{ label: 'Senior Scientific Officer', value: 'Senior Scientific Officer' },
		{ label: 'SBRBPAS', value: 'SBRBPAS' },
		{ label: 'N/A', value: 'N/A' },
	];

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			const vacancyOptionsResponse = await axios.get(GET_VACANCY_OPTIONS);

			setCurrentPositionMenu(positionClassificationMenu);

			var packageInitiators = [];
			for (
				var i = 0;
				i < vacancyOptionsResponse.data.result.package_initiators.length;
				i++
			) {
				var packageInitiator =
					vacancyOptionsResponse.data.result.package_initiators[i];
				var packageInitiatorOption = {
					label: packageInitiator.name,
					value: packageInitiator.sys_id,
					email: packageInitiator.email,
				};
				packageInitiators.push(packageInitiatorOption);
			}
			setAppInitiatorMenu(packageInitiators);
			const codes = [];
			vacancyOptionsResponse.data.result.sac_codes.forEach((code) => {
				codes.push({ label: code, value: code });
			});
			setSacCodes(codes);
			setIsLoading(false);
		})();
	}, []);

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
			initialValues={!isNew && !isDefined ? newValues : initialValues}
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
						flexDirection: 'column',
						alignItems: 'start',
						justifyContent: 'center',
						flex: '1 0 240px',
					}}
				>
					<Tooltip title='Checking this box allows HR Specialist(s) assigned to this vacancy to perform vacancy manager triage'>
						<Form.Item
							name='allowHrSpecialistTriage'
							valuePropName='checked'
							style={{ margin: '0px', paddingLeft: '20px' }}
						>
							<Checkbox>Allow HR Specialist to Triage</Checkbox>
						</Form.Item>
					</Tooltip>
				</div>
			</div>

			<Form.Item
				label='Vacancy Description'
				className='VacancyDescription'
				name='description'
				rules={[{ validator: validateDescription }]}
			>
				<ReactQuill
					className='QuillEditor'
					readOnly={readOnly}
					modules={Editor.modules}
					formats={Editor.formats}
				/>
			</Form.Item>

			<div>
				<Form.Item label='Vacancy Point of Contact Information'>
					{(!isDefined && !isNew) || (isDefined && isNew) ? (
						<Form.Item
							name='isUserPoc'
							label='Are you the point of contact for this vacancy?'
						>
							<Select
								options={[
									{ value: 'yes', label: 'Yes' },
									{ value: 'no', label: 'No' },
								]}
							/>
						</Form.Item>
					) : (
						''
					)}
					{isLoading && isDefined ? (
						<Space
							block='true'
							style={{ display: 'flex', justifyContent: 'center' }}
						>
							<LoadingOutlined style={{ fontSize: '2rem' }} />
						</Space>
					) : (!isNew && isDefined) || isUserPoc ? (
						<Form.Item
							name='vacancyPoc'
							label={
								isUserPoc === 'no'
									? 'Who will be the point of contact for this vacancy?'
									: ''
							}
						>
							<Select
								name='vacancyPoc'
								rules={[
									{
										required: true,
										message: 'Please select a point of contact.',
									},
								]}
								allowClear={true}
								disabled={isUserPoc === 'yes' || readOnly}
								showSearch={true}
								optionLabelProp='label'
								filterOption={(input, option) =>
									(option?.label ?? '')
										.toLowerCase()
										.includes(input.toLowerCase())
								}
								filterSort={(optionA, optionB) =>
									(optionA?.label ?? '')
										.toLowerCase()
										.localeCompare((optionB?.label ?? '').toLowerCase())
								}
							>
								{appInitiatorMenu.map((option, index) => (
									<Option key={index} value={option.value} label={option.label}>
										<div>
											<span>{option.label}</span>
											<br />
											<span>{option.email}</span>
										</div>
									</Option>
								))}
							</Select>
						</Form.Item>
					) : (
						''
					)}
				</Form.Item>
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

			{user?.tenant?.trim().toLowerCase() === 'stadtman' ? (
				<Form.Item
					label='Focus Area Selection'
					name='requireFocusArea'
					valuePropName='checked'
				>
					<Checkbox>Enable Focus Area</Checkbox>
				</Form.Item>
			) : null}

			<Form.Item label='Application Documents' name='applicationDocuments'>
				<RequiredDocsList name='applicationDocuments' readOnly={readOnly} />
			</Form.Item>

			<Form.Item label='Full Contact Details for References'>
				<p className='SmallText'>
					How many recommendations does this vacancy require?
				</p>

				<Form.Item name='numberOfRecommendations'>
					<Slider
						className='Slider'
						min={0}
						max={15}
						dots
						marks={sliderMarks}
						disabled={readOnly}
					/>
				</Form.Item>
			</Form.Item>

			<Form.Item label='Number of Scoring Categories'>
				<p className='SmallText'>
					How many categories does this vacancy require for scoring?
				</p>
				<Form.Item name='numberOfCategories'>
					<Slider
						className='CategorySlider'
						min={1}
						max={6}
						dots
						marks={categoryMarks}
						disabled={readOnly}
					/>
				</Form.Item>
			</Form.Item>

			<Form.Item label='Personnel Action Tracking Solution (PATS): Appointment Information'>
				<div className='PATSContainer'>
					<div className='PATSPicker'>
						<EditableDropDown
							label={
								<>
									<Space>
										Position Classification
										<Tooltip
											title={
												<>
													Select the Intramural or Extramural Professional
													Designation for your vacancy. Select “N/A” for
													Stadtman positions.
												</>
											}
										>
											<Typography.Link>
												<InfoCircleOutlined style={{ fontSize: '1.25rem' }} />
											</Typography.Link>
										</Tooltip>
									</Space>
								</>
							}
							name='positionClassification'
							required={true}
							menu={currentPositionMenu}
							disabled={readOnly}
						/>
					</div>
					<div className='PATSPicker'>
						<EditableDropDown
							name='sacCode'
							required={true}
							disabled={readOnly}
							showSearch={true}
							menu={sacCodes}
							filterOption={(input, option) =>
								(option?.label ?? '')
									.toLowerCase()
									.includes(input.toLowerCase())
							}
							filterSort={(optionA, optionB) =>
								(optionA?.label ?? '')
									.toLowerCase()
									.localeCompare((optionB?.label ?? '').toLowerCase())
							}
							label={
								<>
									<Space>
										Organizational Code
										<Tooltip
											title={
												<>
													Provide SAC code for organization where the position
													will reside.
												</>
											}
										>
											<Typography.Link>
												<InfoCircleOutlined style={{ fontSize: '1.25rem' }} />
											</Typography.Link>
										</Tooltip>
									</Space>
								</>
							}
						/>
					</div>
				</div>
				<div className='PATSInitiator'>
					<EditableDropDown
						label={
							<>
								<Space>
									Personnel Action Tracking Solution (PATS) Initiator
									<Tooltip
										title={
											<>
												Populate the individual who will be assembling the
												appointment package within the Personnel Action Tracking
												Solution (PATS). Value defaults to the SSJ Vacancy
												Manager, but can be updated within the SSJ or later in
												PATS.
											</>
										}
									>
										<Typography.Link>
											<InfoCircleOutlined style={{ fontSize: '1.25rem' }} />
										</Typography.Link>
									</Tooltip>
								</Space>
							</>
						}
						name='appointmentPackageIndicator'
						required={true}
						showSearch={true}
						menu={appInitiatorMenu}
						filterOption={(input, option) =>
							(option?.label ?? '')
								.toLowerCase()
								.includes(input.toLowerCase())
						}
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? '')
								.toLowerCase()
								.localeCompare((optionB?.label ?? '').toLowerCase())
						}
						loading={isLoading}
						disabled={readOnly}
					/>
				</div>
			</Form.Item>
		</Form>
	);
};

export default basicInformation;
