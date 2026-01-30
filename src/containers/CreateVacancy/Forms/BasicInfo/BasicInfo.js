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
	const [positions, setPositions] = useState([]);
	const [sacCodes, setSacCodes] = useState([{ label: ' ', value: ' ' }]);
	const [isLoading, setIsLoading] = useState(false);
	const [showOtherLocationInput, setShowOtherLocationInput] = useState(false);
	const [otherLocationValue, setOtherLocationValue] = useState('');
	const [recommendations, setRecommendations] = useState([]);
	const [categories, setCategories] = useState([]);
	const [locationMenu, setLocationMenu] = useState([]);

	const formInstance = props.formInstance;
	const initialValues = props.initialValues;

	const readOnly = props.readOnly;
	const isNew = props.isNew;
	const isDefined = props.pocDefined;
	const isUserPoc = Form.useWatch('isUserPoc', formInstance);
	const useCloseDate = Form.useWatch('useCloseDate', formInstance);
	const location = Form.useWatch('location', formInstance);
	const referenceCollection = Form.useWatch('referenceCollection', formInstance);
	const vacancyPocType = Form.useWatch('vacancyPocType', formInstance);

	const { auth, currentTenant } = useAuth();
	const { user, tenants } = auth;
	const tname = tenants ? tenants.find((t) => t.value === currentTenant) : {};
	const focusAreaEnabled = tname.properties?.find((p) => p.name === 'enableFocusArea')?.value;

	const newValues = {
		...props.initialValues,
		vacancyPoc: user.uid,
	};

	const hrSpecialistTooltip =
		'Checking this box allows HR Specialist(s) assigned to this vacancy to perform vacancy manager triage.';

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			const vacancyOptionsResponse = await axios.get(GET_VACANCY_OPTIONS);

			const codes = [];
			var packageInitiators = [];
			var sliderMarks = [];
			var categoryMarks = [];
			var positionClassification = [];
			var locations = [];

			if (vacancyOptionsResponse && vacancyOptionsResponse.data && vacancyOptionsResponse.data.result) {
				vacancyOptionsResponse.data.result.sac_codes.forEach((code) => {
					codes.push({ label: code, value: code });
				});
				setSacCodes(codes);

				vacancyOptionsResponse.data.result.package_initiators.forEach((packageInitiator) => {
					var packageInitiatorOption = {
						label: packageInitiator.name,
						value: packageInitiator.sys_id,
						email: packageInitiator.email,
					};
					packageInitiators.push(packageInitiatorOption);
				});
				setAppInitiatorMenu(packageInitiators);

				vacancyOptionsResponse.data.result.number_of_recommendations.forEach((recommendation) => {
					sliderMarks.push({ label: recommendation.toString(), value: recommendation });
				});
				setRecommendations(sliderMarks);

				vacancyOptionsResponse.data.result.number_of_categories.forEach((category) => {
					if(category >= 1) {
						categoryMarks[category] = category.toString();
					}
				});
				setCategories(categoryMarks);

				vacancyOptionsResponse.data.result.title_42_position_classification.forEach((position) => {
					positionClassification.push({ label: position, value: position });
				});
				setPositions(positionClassification);

				vacancyOptionsResponse.data.result.locations.forEach((location) => {
					locations.push({ label: location.label, value: location.value });
				});
				setLocationMenu(locations);

			}
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

		if (useCloseDate == true) {
			if (formItem.field == 'openDate' && closeDate && openDate >= closeDate) {
				throw new Error(
					'Please pick an open date that is before the close date.'
				);
			}
		} else {
			if (formItem.field == 'openDate' && !openDate) {
				throw new Error('Please pick an open date.');
			}
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

	const handleSelectLocationChange = (value) => {
		if (value === 'Other') {
			setShowOtherLocationInput(true);
		} else {
			setShowOtherLocationInput(false);
			setOtherLocationValue(''); // Clear "Other" value if another option is selected
			formInstance.setFieldsValue({ location: value }); // Update form with selected value
		}
	};

	const handleOtherInputLocationChange = (e) => {
		setOtherLocationValue(e.target.value);
		formInstance.setFieldsValue({ location: e.target.value }); // Update form with "Other" input value
	};

	const onPocTypeChange = (checkedValues) => {
		if (checkedValues.length == 1 && checkedValues[0] == 'Email Distribution List') {
			formInstance.setFieldsValue({vacancyPoc: user.uid}) // vacancyPoc defaults to current user when email is used as POC
		}
	}

	const pocOptions = ['User', 'Email Distribution List', 'Both'];

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
					<Tooltip title='Selecting “Utilizing a Set Close Date” will provide the Vacancy Manager with the ability to select a set close date and extend only when the vacancy announcement is still live. If this option is not selected, the vacancy will use a rolling close date and the vacancy announcement will not close until a selection is made.'>
						<Form.Item
							name='useCloseDate'
							valuePropName='checked'
							style={{ margin: '0px', paddingLeft: '20px' }}
						>
							<Checkbox>Utilizing a Set Close Date</Checkbox>
						</Form.Item>
					</Tooltip>
					<Tooltip
						title={
							user.isManager
								? `${hrSpecialistTooltip} Please email the HR Specialist informing them to complete the vacancy triage.`
								: hrSpecialistTooltip
						}
					>
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

			<div>
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
			</div>

			<div>
				<Form.Item label="Vacancy Point of Contact Information">
					<p className='SmallText'>
						Please select the type of point of contact information to be used for this vacancy.
					</p>
					<Form.Item 
						name='vacancyPocType' 
						rules={[{ required: true, message: 'Please select a Point of Contact option'}]}
					>
						<Checkbox.Group
							options={pocOptions}
							onChange={onPocTypeChange}
						/>
					</Form.Item>
				</Form.Item>
				{vacancyPocType && (vacancyPocType.length == 1 && vacancyPocType[0] == 'User') &&
					<div>
						<Form.Item name='User Point of Contact Information'>
							{(!isDefined && !isNew) || (isDefined && isNew) || !isDefined ? (
								<Form.Item
									name='isUserPoc'
									label='Are you the point of contact for this vacancy?'
									rules={[{ required: true, message: 'Please confirm if you are the Point of Contact'}]}
								>
									<Select
										disabled={readOnly}
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
									rules={[{ required: true, message: 'Please select a point of contact.' }]}
								>
									<Select
										name='vacancyPoc'
										allowClear={true}
										disabled={readOnly || isUserPoc === 'yes'}
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
				}
				{vacancyPocType && (vacancyPocType.length == 1 && vacancyPocType[0] == 'Email Distribution List') &&
					<div>
						<Form.Item 
							name='Email Distribution List for Point of Contact'>
							<Form.Item
								label='Email Distribution List for Point of Contact'
								name='vacancyPocEmail'
								rules={[{ required: true, message: 'Please enter an email address'}]}
							>
								<Input
									placeholder='Please enter email distribution list'
									disabled={readOnly}
								/>
							</Form.Item>
						</Form.Item>
					</div>
				}
				{vacancyPocType && (vacancyPocType.length >= 2 || (vacancyPocType.length == 1 && vacancyPocType[0] == 'Both')) &&
					<div>
						<Form.Item name='User Point of Contact Information'>
							{(!isDefined && !isNew) || (isDefined && isNew) || !isDefined ? (
								<Form.Item
									name='isUserPoc'
									label='Are you the point of contact for this vacancy?'
									rules={[{ required: true, message: 'Please select a point of contact.' }]}
								>
									<Select
										disabled={readOnly}
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
									rules={[{ required: true, message: 'Please select a point of contact.' }]}
								>
									<Select
										name='vacancyPoc'
										allowClear={true}
										disabled={readOnly || isUserPoc === 'yes'}
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

						<Form.Item name='Email Distribution List for Point of Contact'>
							<Form.Item
								label='Email Distribution List for Point of Contact'
								name='vacancyPocEmail'
								rules={[{ required: true, message: 'Please enter an email address'}]}
							>
								<Input
									placeholder='Please enter email distribution list'
									disabled={readOnly}
								/>
							</Form.Item>
						</Form.Item>
					</div>
				}
			</div>
			<div className='DatePickerContainer'>
				<div className='DatePicker'>
					<Form.Item
						label='Open Date'
						name='openDate'
						rules={[{ validator: validateDates }]}
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
					{useCloseDate && (
						<Form.Item
							label='Close Date'
							name='closeDate'
							data-testid='closeDate'
							rules={[
								{
									required: useCloseDate,
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
					)}
				</div>
			</div>

			{useCloseDate && (
				<div className='DatePickerContainer'>
					<div className='DatePicker'>
						<Form.Item label='Scoring Due By Date' name='scoringDueByDate'>
							<DatePicker format='MM/DD/YYYY' style={{ width: '100%' }} />
						</Form.Item>
					</div>
				</div>
			)}

			<div>
				<Form.Item
					label='Location'
					name='location'
					valuePropName='location'
				>
					<Select
						data-testid="location-select"
						placeholder='Select a location'
						value={location}
						name='location'
						allowClear={true}
						disabled={readOnly}
						showSearch={true}
						optionLabelProp='label'
						onChange={handleSelectLocationChange}
						filterOption={(input, option) =>
							(option?.label ?? '')
								.toLowerCase()
								.includes(input.toLowerCase())
						}
					>
						{locationMenu.map((option, index) => (
							<Option key={index} value={option.value} label={option.label}>
								<div>
									<span>{option.label}</span>
								</div>
							</Option>
						))}
					</Select>
				</Form.Item>
				{showOtherLocationInput && (
					<Form.Item name="otherInputField" label="Specify Other Location">
						<Input value={otherLocationValue} onChange={handleOtherInputLocationChange} />
					</Form.Item>
				)}
			</div>

			{focusAreaEnabled && focusAreaEnabled === 'true' ? (
				<Form.Item
					label='Focus Area Selection'
					name='requireFocusArea'
					valuePropName='checked'
				>
					<div>
						<Checkbox checked={true} disabled>{<div style={{ color: "#333333", fontFamily: "Noto Sans", fontSize: "16px" }}>Enable Focus Area</div>}</Checkbox>
					</div>
				</Form.Item>

			) : null}

			<Form.Item label='Application Documents' name='applicationDocuments'>
				<RequiredDocsList name='applicationDocuments' readOnly={readOnly} />
			</Form.Item>

			<Form.Item label='Method of Reference Collection'>
				<Tooltip
					title='Check this box to enable reference collection through this system. Leave the box unchecked to manually collect references.'
					placement='topLeft'
				>
					<Form.Item name='referenceCollection' valuePropName='checked'>
						<Checkbox>Enable Reference Collection</Checkbox>
					</Form.Item>
				</Tooltip>
				{referenceCollection && (
					<Form.Item
						label='Reference Collection Date'
						name='referenceCollectionDate'
						rules={[
							{
								required: referenceCollection,
								message: 'Please select a reference collection date',
							},
							{ validator: validateDates },
						]}
					>
						<DatePicker
							format='MM/DD/YYYY'
							style={{ width: '40%' }}
							disabledDate={disabledDate}
						/>
					</Form.Item>
				)}

				<Form.Item label='Full Contact Details for References'>
					<p className='SmallText'>
						How many recommendations does this vacancy require?
					</p>
					<Form.Item name='numberOfRecommendations'>
						<Slider
							className='Slider'
							min={0}
							max={recommendations.length - 1}
							dots
							marks={recommendations}
							disabled={readOnly}
						/>
					</Form.Item>
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
						max={Object.keys(categories).length}
						dots
						marks={categories}
						disabled={readOnly}
					/>
				</Form.Item>
			</Form.Item>

			<Form.Item label='Personnel Action Tracking Solution (PATS): Appointment Information'>
				<div className='PATSContainer'>
					<div className='PATSClarification'>
						<p>
							The selections made in the fields below will be included in the
							package sent to{' '}
							<a target='_blank' rel='noopener noreferrer' href='https://ess.niaid.nih.gov/livelink/livelink.exe/Open/PATSDashboard'>
								PATS
							</a>{' '}
							upon selecting a candidate.
						</p>
					</div>
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
							menu={positions}
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
							(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
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
