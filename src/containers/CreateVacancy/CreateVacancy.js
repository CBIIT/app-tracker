import { useState } from 'react';
import { useHistory } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { Steps, Button, Form, message, Tooltip } from 'antd';
import ConfirmSubmitModal from './ConfirmSubmitModal/ConfirmSubmitModal';
import BasicInfo from './Forms/BasicInfo/BasicInfo';
import MandatoryStatements from './Forms/MandatoryStatements/MandatoryStatements';
import VacancyCommittee from './Forms/VacancyCommittee/VacancyCommittee';
import EmailTemplates from './Forms/EmailTemplates/EmailTemplates';
import FinalizeVacancy from './Forms/FinalizeVacancy/FinalizeVacancy';
import { initialValues } from './Forms/FormsInitialValues';
import { EDIT_VACANCY, SAVE_VACANCY_DRAFT } from '../../constants/ApiEndpoints';
import './CreateVacancy.css';
import axios from 'axios';
import { transformJsonToBackend } from './Util/TransformJsonToBackend';

const createVacancy = (props) => {
	const { auth: { user } } = useAuth();
	const newValues = {
		...initialValues,
		basicInfo: {
			...initialValues.basicInfo,
			appointmentPackageIndicator: user.uid,
			vacancyPoc: user.uid
		},
	};
	const { Step } = Steps;
	const history = useHistory();
	const [errorSections, setErrorSections] = useState([]);
	const [allForms, setAllForms] = useState(
		props.initialValues ? props.initialValues : newValues
	);
	const [submitModalVisible, setSubmitModalVisible] = useState(false);
	const [draftSysId, setDraftSysId] = useState(props.draftSysId);
	const isNew = props.initialValues ? false : true;
	const pocDefined = allForms.basicInfo.vacancyPoc === undefined ? false : true;

	const showSubmitModal = () => {
		setSubmitModalVisible(true);
	};

	const handleSubmitModalCancel = () => {
		setSubmitModalVisible(false);
	};

	const updateCommitteeMembers = (committeeMembers) => {
		setAllForms({ ...allForms, vacancyCommittee: committeeMembers });
	};

	const updateBasicInfo = () => {
		const newFormData = {
			...allForms,
			basicInfo: basicInfoForm.getFieldsValue(),
		};
		setAllForms(newFormData);
		return newFormData;
	};

	const [basicInfoForm] = Form.useForm();
	const [mandatoryStatementsForm] = Form.useForm();
	const [vacancyCommitteeForm] = Form.useForm();
	const [emailTemplatesForm] = Form.useForm();

	const restrictedEditMode = props.restrictedEditMode;
	const readOnlyUser = props.readOnlyMember;

	const validateAllFormsAndDisplayModal = async () => {
		const errorForms = [];
		try {
			await basicInfoForm.validateFields()
		} catch (error) {
			errorForms.push('Basic Vacancy Information');
		}

		try {
			await mandatoryStatementsForm.validateFields();
		} catch (error) {
			errorForms.push('Mandatory Statements');
		}

		try {
			await vacancyCommitteeForm.validateFields();
		} catch (error) {
			errorForms.push('Vacancy Committee');
		}

		try {
			await emailTemplatesForm.validateFields();
		} catch (error) {
			errorForms.push('Email Templates');
		}

		setErrorSections(errorForms);

		if (errorForms.length === 0) showSubmitModal();
		if (errorForms.length > 0) window.scrollTo(0, 0);
	};

	const getVacancyCommittee = () => {
		return allForms.vacancyCommittee;
	};

	const steps = [
		{
			step: 0,
			key: 'basicInfo',
			title: 'Basic Vacancy Information',
			description: 'Fill in vacancy information',
			content: (
				<BasicInfo
					initialValues={allForms.basicInfo}
					formInstance={basicInfoForm}
					readOnly={restrictedEditMode}
					readOnlyMember={readOnlyUser}
					isNew={isNew}
					pocDefined={pocDefined}
				/>
			),
		},
		{
			step: 1,
			key: 'mandatoryStatements',
			title: 'Mandatory Statements',
			description:
				'Select pre-written mandatory statements to add to the posting',
			content: (
				<MandatoryStatements
					initialValues={allForms.mandatoryStatements}
					formInstance={mandatoryStatementsForm}
					readOnly={restrictedEditMode}
					readOnlyMember={readOnlyUser}
				/>
			),
		},
		{
			step: 2,
			key: 'vacancyCommittee',
			title: 'Vacancy Committee',
			description: 'Add and manage vacancy committee members',
			content: (
				<VacancyCommittee
					committeeMembers={allForms.vacancyCommittee}
					setCommitteeMembers={updateCommitteeMembers}
					formInstance={vacancyCommitteeForm}
					getCommitteeMembers={getVacancyCommittee}
				/>
			),
		},
		{
			step: 3,
			key: 'emailTemplates',
			title: 'Email Templates',
			description: 'Choose the emails to send applicants and manage email body',
			content: (
				<EmailTemplates
					initialValues={allForms.emailTemplates}
					formInstance={emailTemplatesForm}
				/>
			),
		},
	];

	const isEditingFinalizedVacancy = () => {
		if (props.editFinalizedVacancy) return true;
		else return false;
	};

	if (!isEditingFinalizedVacancy()) {
		steps.push({
			step: 4,
			key: 'reviewAndFinalize',
			title: 'Review and Finalize',
			description: '',
			content: (
				<FinalizeVacancy
					allForms={allForms}
					onEditButtonClick={(number) => stepClickHandler(number)}
					errorSections={errorSections}
				/>
			),
		});
	}

	const [currentStep, setCurrentStep] = useState(0);

	const saveFormData = (currentStep) => {
		switch (steps[currentStep].key) {
			case 'basicInfo':
				return updateBasicInfo();
			case 'mandatoryStatements':
				return saveMandatoryStatements();
			case 'emailTemplates':
				return saveEmailTemplates();
			default:
				return allForms;
		}
	};

	const validateFormData = async (currentStep) => {
		switch (steps[currentStep].key) {
			case 'basicInfo':
				await basicInfoForm.validateFields();
				break;
			case 'mandatoryStatements':
				await mandatoryStatementsForm.validateFields();
				break;
			case 'emailTemplates':
				await emailTemplatesForm.validateFields();
				break;
			case 'vacancyCommittee':
				await vacancyCommitteeForm.validateFields();
				break;
		}
	};

	const saveEmailTemplates = () => {
		const newFormValues = {
			...allForms,
			emailTemplates: emailTemplatesForm.getFieldsValue().emailTemplates,
		};
		setAllForms(newFormValues);
		return newFormValues;
	};

	const saveMandatoryStatements = () => {
		const newFormValues = {
			...allForms,
			mandatoryStatements: mandatoryStatementsForm.getFieldsValue(),
		};
		setAllForms(newFormValues);
		return newFormValues;
	};

	const save = async (data) => {
		if (!isCurrentStepEditable()) return true;

		if (!data.basicInfo.title || data.basicInfo.title == '') {
			message.error('A vacancy title is required.');
			return false;
		}
		if (!props.sysId) {
			message.loading({ duration: 0, content: 'Saving...' });
			try {
				let draft = {
					jsonobj: data,
				};

				if (draftSysId)
					draft = {
						sys_id: draftSysId,
						jsonobj: data,
					};

				const response = await axios.post(SAVE_VACANCY_DRAFT, draft);
				if (!draftSysId) setDraftSysId(response.data.result.draft_id);
				message.destroy();
				message.success('Saved.');
				return true;
			} catch (error) {
				message.destroy();
				message.error('Sorry!  There was an error saving.');
				return false;
			}
		} else {
			message.loading({ duration: 0, content: 'Saving...' });
			try {
				await validateFormData(currentStep);
				try {
					const transformedData = transformJsonToBackend(data);
					await axios.post(EDIT_VACANCY, transformedData);
					message.destroy();
					message.success('Saved.');
					return true;
				} catch (error) {
					message.destroy();
					message.error('Sorry!  There was an error saving.');
					return false;
				}
			} catch (error) {
				message.destroy();
				message.error('No changes saved.  Please fix validation errors.');
			}
		}
	};

	const isCurrentStepEditable = () => {
		if (restrictedEditMode) {
			return isEditableInRestrictedEditMode(steps[currentStep].key);
		} else return true;
	};

	const isCurrentStepFinalize = () =>
		steps[currentStep].key === 'reviewAndFinalize';

	const next = async () => {
		if (isCurrentStepFinalize()) {
			validateAllFormsAndDisplayModal();
		} else {
			const data = saveFormData(currentStep);
			if (
				(await save(data)) === true &&
				currentStep < steps.length - 1 &&
				!isEditingFinalizedVacancy()
			) {
				setCurrentStep(currentStep + 1);
			}
		}
	};

	const prev = async () => {
		if (currentStep === 0) history.goBack();
		else {
			const data = saveFormData(currentStep);
			if ((await save(data)) === true) {
				setCurrentStep(currentStep - 1);
			}
		}
	};

	const isEditableInRestrictedEditMode = (stepKey) => {
		return (
			stepKey === 'basicInfo' ||
			stepKey === 'emailTemplates' ||
			stepKey === 'vacancyCommittee'
		);
	};

	const currentStepObject = steps[currentStep] || {};

	const stepClickHandler = async (current) => {
		const data = saveFormData(currentStep);
		if ((await save(data)) === true) setCurrentStep(current);
	};

	const wizardFormChangeHandler = (name, forms) => {
		if (name === 'EmailTemplates') {
			const { EmailTemplates } = forms;
			if (EmailTemplates) {
				const newEmailTemplates = EmailTemplates.getFieldsValue();
				setAllForms({
					...allForms,
					emailTemplates: newEmailTemplates.emailTemplates,
				});
			}
		}
	};

	return (
		<>
			<Form.Provider
				onFormChange={(name, { forms, changedFields }) => {
					wizardFormChangeHandler(name, forms, changedFields);
				}}
			>
				<div className='CreateVacancyContainer'>
					<div className='StepNavigation'>
						<Steps
							current={currentStep}
							direction='vertical'
							onChange={stepClickHandler}
						>
							{steps.map((item) => (
								<Step
									key={item.title}
									title={item.title}
									description={item.description}
								/>
							))}
						</Steps>
					</div>
					<div
							className='ErrorPanel'
							style={
								errorSections.length === 0 || currentStep < steps.length - 1
									? { display: 'none' }
									: null
							}
						>
							<p style={{maxWidth: '75vw', marginLeft: 30}}>
								{
									"Sorry, we can't submit just yet.  The sections below in red have fields that require a different selection or a selection must be made."
								}
								<br />
								{
									" We've highlighted those fields in red.  Please return to those sections and address the highlights, then return here and click 'Save and Finalize' again."
								}
							</p>
							{/* <ul>
								{errorSections.map((section, index) => (
									<li key={index}>{section}</li>
								))}
							</ul> */}
						</div>
					<div className='StepContentContainer'>
						<div className='StepContent'>
							<h3>{currentStepObject.title}</h3>
							<p>{currentStepObject.description}</p>
							{steps.map((item) => (
								<div
									key={item.step}
									className={`${item.step !== currentStep && 'Hidden'}`}
								>
									{item.content}
								</div>
							))}
						</div>
						<div
							className='steps-action'
							style={
								isEditingFinalizedVacancy()
									? { justifyContent: 'flex-end' }
									: null
							}
						>
							<Button
								onClick={prev}
								type='primary'
								ghost
								className='wider-button'
								style={isEditingFinalizedVacancy() ? { display: 'none' } : null}
							>
								{currentStep === 0 ? 'Cancel' : 'Back'}
							</Button>

							<Tooltip
								placement='top'
								title={
									!isCurrentStepEditable()
										? 'Cannot save or edit this section for closed vacancy.'
										: ''
								}
							>
								<Button
									type='primary'
									onClick={next}
									className='wider-button'
									disabled={!isCurrentStepEditable()}
								>
									{isCurrentStepFinalize() ? 'Save and Finalize' : 'Save'}
								</Button>
							</Tooltip>
						</div>
					</div>
				</div>
			</Form.Provider>
			<ConfirmSubmitModal
				visible={submitModalVisible}
				onCancel={handleSubmitModalCancel}
				data={draftSysId ? { ...allForms, draftId: draftSysId } : allForms}
			/>
		</>
	);
};

export default createVacancy;
