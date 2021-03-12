import { useState } from 'react';
import { useHistory } from 'react-router';
import { Steps, Button, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import ConfirmSubmitModal from './ConfirmSubmitModal/ConfirmSubmitModal';
import BasicInfo from './Forms/BasicInfo/BasicInfo';
import MandatoryStatements from './Forms/MandatoryStatements/MandatoryStatements';
<<<<<<< HEAD
import VacancyCommittee from './Forms/VacancyCommittee/VacancyCommittee';
import EmailTemplates from './Forms/EmailTemplates/EmailTemplates';
import FinalizeVacancy from './Forms/FinalizeVacancy/FinalizeVacancy';
import { initialValues } from './Forms/FormsInitialValues';
=======
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
import './CreateVacancy.css';

const createVacancy = () => {
	const { Step } = Steps;
	const history = useHistory();
<<<<<<< HEAD
	const [errorSections, setErrorSections] = useState([]);
	const [allForms, setAllForms] = useState(initialValues);
	const [submitModalVisible, setSubmitModalVisible] = useState(false);

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
		setAllForms({ ...allForms, basicInfo: basicInfoForm.getFieldsValue() });
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
=======
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3

	const steps = [
		{
			step: 1,
			title: 'Basic Vacancy Information',
			description: 'Fill in vacancy information',
<<<<<<< HEAD
			content: (
				<BasicInfo
					initialValues={allForms.basicInfo}
					formInstance={basicInfoForm}
				/>
			),
=======
			content: <BasicInfo />,
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		},
		{
			step: 2,
			title: 'Mandatory Statements',
			description:
				'Select pre-written mandatory statements to add to the posting',
<<<<<<< HEAD
			content: (
				<MandatoryStatements
					initialValues={allForms.mandatoryStatements}
					formInstance={mandatoryStatementsForm}
				/>
			),
=======
			content: <MandatoryStatements />,
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		},
		{
			step: 3,
			title: 'Vacancy Committee',
			description: 'Add and manage vacancy committee members',
<<<<<<< HEAD
			content: (
				<VacancyCommittee
					committeeMembers={allForms.committeeMembers}
					setCommitteeMembers={updateCommitteeMembers}
					formInstance={vacancyCommitteeForm}
				/>
			),
=======
			content: <></>,
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		},
		{
			step: 4,
			title: 'Email Templates',
			description: 'Choose the emails to send applicants and manage email body',
<<<<<<< HEAD
			content: (
				<EmailTemplates
					initialValues={allForms.emailTemplates}
					formInstance={emailTemplatesForm}
				/>
			),
=======
			content: <></>,
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		},
		{
			step: 5,
			title: 'Review and Finalize',
			description: '',
<<<<<<< HEAD
			content: (
				<FinalizeVacancy
					allForms={allForms}
					onEditButtonClick={(number) => stepClickHandler(number)}
				/>
			),
=======
			content: <></>,
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		},
	];

	const [currentStep, setCurrentStep] = useState(0);

<<<<<<< HEAD
	const saveFormData = (currentStep) => {
		updateBasicInfo();
		switch (currentStep) {
			case 1:
				updateBasicInfo();
				break;
			default:
				return;
		}
	};

	const next = () => {
		if (currentStep < steps.length - 1) {
			saveFormData(currentStep);
			setCurrentStep(currentStep + 1);
		} else {
			validateAllFormsAndDisplayModal();
		}
	};

	const prev = () => {
		saveFormData(currentStep);
=======
	const next = () => {
		setCurrentStep(currentStep + 1);
	};

	const prev = () => {
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		currentStep === 0 ? history.goBack() : setCurrentStep(currentStep - 1);
	};

	const currentStepObject = steps[currentStep] || {};

	const stepClickHandler = (current) => {
<<<<<<< HEAD
		saveFormData(currentStep);
=======
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		setCurrentStep(current);
	};

	const wizardFormChangeHandler = (name, forms) => {
<<<<<<< HEAD
		if (name === 'MandatoryStatements') {
			const { MandatoryStatements } = forms;
			const newMandatoryStatements = MandatoryStatements.getFieldsValue();
			setAllForms({
				...allForms,
				mandatoryStatements: newMandatoryStatements,
			});
		}

		// For some currently unknown reason, EmailTemplates is firing off the onChange handler on render
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
=======
		const { BasicInfo, MandatoryStatements } = forms;
		if (name === 'BasicInfo')
			console.log(
				'[CreateVacancy]: Form name: ' +
					name +
					' values: ' +
					JSON.stringify(BasicInfo.getFieldsValue(), null, 2)
			);

		if (name === 'MandatoryStatements')
			console.log(
				'[CreateVacancy]: Form name: ' +
					name +
					' values: ' +
					JSON.stringify(MandatoryStatements.getFieldsValue(), null, 2)
			);
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
	};

	return (
		<>
<<<<<<< HEAD
			<Form.Provider
				// TODO: Refactor this to call appropriate saves and validates on next, prev, or step change vs. onFormChange
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
=======
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
						<Form.Provider
							onFormChange={(name, { forms, changedFields }) => {
								wizardFormChangeHandler(name, forms, changedFields);
							}}
						>
							{steps.map((item) => (
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
								<div
									key={item.step}
									className={`${item.step !== currentStep + 1 && 'Hidden'}`}
								>
									{item.content}
								</div>
							))}
<<<<<<< HEAD
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
				setVisible={setSubmitModalVisible}
				data={allForms}
			/>
=======
						</Form.Provider>
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
						<Button type='text' disabled icon={<ReloadOutlined />}>
							Clear Form
						</Button>
						<Button type='primary' onClick={next} className='wider-button'>
							{currentStep == steps.length - 1 ? 'Save and Finalize' : 'save'}
						</Button>
					</div>
				</div>
			</div>
>>>>>>> a27f91f3a5826c01e95f19cfbcf8219ecfe9b1f3
		</>
	);
};

export default createVacancy;
