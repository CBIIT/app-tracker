import { useState } from 'react';
import { useHistory } from 'react-router';
import { Steps, Button, Form, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import ConfirmSubmitModal from './ConfirmSubmitModal/ConfirmSubmitModal';
import BasicInfo from './Forms/BasicInfo/BasicInfo';
import MandatoryStatements from './Forms/MandatoryStatements/MandatoryStatements';
import VacancyCommittee from './Forms/VacancyCommittee/VacancyCommittee';
import EmailTemplates from './Forms/EmailTemplates/EmailTemplates';
import FinalizeVacancy from './Forms/FinalizeVacancy/FinalizeVacancy';
import { initialValues } from './Forms/FormsInitialValues';
import { SAVE_VACANCY_DRAFT } from '../../constants/ApiEndpoints';
import './CreateVacancy.css';
import axios from 'axios';

const createVacancy = (props) => {
	const { Step } = Steps;
	const history = useHistory();
	const [errorSections, setErrorSections] = useState([]);
	const [allForms, setAllForms] = useState(
		props.initialValues ? props.initialValues : initialValues
	);
	const [submitModalVisible, setSubmitModalVisible] = useState(false);
	const [draftSysId, setDraftSysId] = useState();

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

	const validateAllFormsAndDisplayModal = async () => {
		const errorForms = [];
		try {
			await basicInfoForm.validateFields();
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
					committeeMembers={allForms.committeeMembers}
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
		{
			step: 4,
			key: 'reviewAndFinalize',
			title: 'Review and Finalize',
			description: '',
			content: (
				<FinalizeVacancy
					allForms={allForms}
					onEditButtonClick={(number) => stepClickHandler(number)}
				/>
			),
		},
	];

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

	const saveDraft = async (data) => {
		if (!data.basicInfo.title || data.basicInfo.title == '') {
			message.error('A vacancy title is required.');
			return false;
		}
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
			message.success('Changes saved.');
			return true;
		} catch (error) {
			message.error('Sorry!  There was an error saving.');
			return false;
		}
	};

	const next = async () => {
		if (currentStep < steps.length - 1) {
			const data = saveFormData(currentStep);
			if ((await saveDraft(data)) === true) {
				setCurrentStep(currentStep + 1);
			}
		} else {
			validateAllFormsAndDisplayModal();
		}
	};

	const prev = async () => {
		if (currentStep === 0) history.goBack();
		else {
			const data = saveFormData(currentStep);
			if ((await saveDraft(data)) === true) {
				setCurrentStep(currentStep - 1);
			}
		}
	};

	const currentStepObject = steps[currentStep] || {};

	const stepClickHandler = async (current) => {
		const data = saveFormData(currentStep);
		if ((await saveDraft(data)) === true) setCurrentStep(current);
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
						<div className='steps-action'>
							<Button
								onClick={prev}
								type='primary'
								ghost
								className='wider-button'
							>
								{currentStep === 0 ? 'cancel' : 'back'}
							</Button>
							{currentStep < steps.length - 1 ? (
								<Button type='text' disabled icon={<ReloadOutlined />}>
									Clear Form
								</Button>
							) : null}

							<Button type='primary' onClick={next} className='wider-button'>
								{currentStep == steps.length - 1 ? 'Save and Finalize' : 'save'}
							</Button>
						</div>
						<div
							className='ErrorPanel'
							style={
								errorSections.length === 0 || currentStep < steps.length - 1
									? { display: 'none' }
									: null
							}
						>
							<p>
								{
									"Sorry, we can't submit just yet.  The following sections have fields that need to change or have values: "
								}
							</p>
							<ul>
								{errorSections.map((section, index) => (
									<li key={index}>{section}</li>
								))}
							</ul>
							<p>
								{
									"We've highlighted those fields in red.  Please return to those sections and address the highlights, then return here and click 'Save and Finalize' again."
								}
							</p>
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
