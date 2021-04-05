import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Steps, Button, Result, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

import HeaderWithLink from '../../components/UI/HeaderWithLink/HeaderWithLink';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';

import FormContext, { defaultFormData } from './Context';
import ApplicantBasicInfo from './Forms/BasicInfo/ApplicantBasicInfo.js';
import ApplicantAddress from './Forms/Address/ApplicantAddress.js';
import ApplicantDocuments from './Forms/ApplicantDocuments/ApplicantDocuments';
import ApplicantReferences from './Forms/References/ApplicantReferences.js';
import Review from './Forms/Review/Review';
import SubmitModal from './SubmitModal/SubmitModal';

import './Apply.css';

const { Step } = Steps;

const updateFormData = (currentForm, newValues, step) => {
	const updatedForm = { ...currentForm };
	switch (step) {
		case 'basicInfo':
			// (basic information) save to applicant
			updatedForm.basicInfo = { ...currentForm.basicInfo, ...newValues };
			return updatedForm;
		case 'address':
			// (address) save to applicant
			updatedForm.address = { ...currentForm.address, ...newValues };
			return updatedForm;
		case 'references':
			// (references) save to references
			updatedForm.references = newValues.references;
			return updatedForm;
		case 'applicantDocuments':
			// (documents) handle attachments
			updatedForm.applicantDocuments = newValues.applicantDocuments;
			return updatedForm;
		case 'additionalQuestions':
			// (last-content) save to questions
			updatedForm.questions = newValues;
			return updatedForm;
		default:
			return updatedForm;
	}
};

const Apply = () => {
	const [formData, setFormData] = useState(defaultFormData);
	const [currentFormInstance, setCurrentFormInstance] = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [vacancyTitle, setVacancyTitle] = useState();
	const [submitModalVisible, setSubmitModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const history = useHistory();
	const { sysId } = useParams();

	const formContext = { formData, currentFormInstance, setCurrentFormInstance };

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const response = await axios.get(VACANCY_DETAILS_FOR_APPLICANTS + sysId);
			setVacancyTitle(response.data.result.basic_info.vacancy_title.value);

			const references = [];

			for (
				let i = 0;
				i <
				parseInt(
					response.data.result.basic_info.number_of_recommendation.value
				);
				i++
			) {
				references.push({});
			}

			const newFormData = {
				...formData,
				sysId: sysId,
				applicantDocuments: response.data.result.vacancy_documents.map(
					(document) =>
						document.file ? document : { ...document, file: { fileList: [] } }
				),
				references: references,
			};

			setFormData(newFormData);
			setIsLoading(false);
		})();
	}, []);

	const steps = [
		{
			key: 'basicInfo',
			title: 'Basic Information',
			content: <ApplicantBasicInfo />,
			description: 'Personal information about applicant',
			longDescription:
				'Let’s start with some basic questions. You’ll have a chance to review everything before submitting.',
		},
		{
			key: 'address',
			title: 'Address',
			content: <ApplicantAddress />,
			description: 'Mailing address',
			longDescription: 'Please provide your mailing address.',
		},
		{
			key: 'references',
			title: 'References',
			content: <ApplicantReferences />,
			description: 'References to support the application',
			longDescription:
				'Please provide references that can submit a recommendation on your behalf.',
		},
		{
			key: 'applicantDocuments',
			title: 'Application Documents',
			content: <ApplicantDocuments />,
			description: 'CV, cover letter, and statement of research interests',
			longDescription:
				'Please upload the following documents. Each file cannot exceed 1 GB in size. We prefer that you submit documents in PDF (.pdf) format, but we can also accept Microsoft Word (.doc/.docx) format.',
		},
		{
			key: 'review',
			title: 'Review',
			content: <Review onEditButtonClick={(step) => onEditButtonClick(step)} />,
			description: 'Review before submitting',
			longDescription: 'Please review key information entered in each section.',
		},
	];

	const onEditButtonClick = (step) => {
		setCurrentStep(step);
	};

	const saveCurrentForm = async (result) => {
		console.log('>> current-form data: ', result);
		console.log('>> form before update: ', formData);
		const updatedForm = updateFormData(formData, result, currentStepObj.key);
		console.log('>> updatedForm: ', JSON.stringify(updatedForm, null, 2));
		setFormData(updatedForm);
		return updatedForm;
	};

	const next = async () => {
		if (currentStep < steps.length - 1) {
			try {
				const validationResult = await currentFormInstance.validateFields();
				await saveCurrentForm(validationResult);
				setCurrentStep(currentStep + 1);
			} catch (error) {
				message.error('Please fill out all required fields.');
				console.log('>> error: ', error);
			}
		} else {
			setSubmitModalVisible(true);
		}
	};

	const prev = async () => {
		try {
			const fieldsValues = currentFormInstance.getFieldsValue();
			await saveCurrentForm(fieldsValues);
			currentStep === 0 ? history.goBack() : setCurrentStep(currentStep - 1);
		} catch (error) {
			message.error('Oops, there was an error while saving the form.');
			console.log(error);
		}
	};


	const saveLink = (
		<Button
			key='saveLink'
			type='link'
			style={{ paddingLeft: '150px', paddingRight: '10px' }}
			onClick={() => history.push('/')}
		>
			Back to Applications Home?
		</Button>
	);

	const save = async () => {
		const fieldsValues = currentFormInstance.getFieldsValue();
		const updatedFormData = await saveCurrentForm(fieldsValues);

		let hide = () => {};
		const successKey = 'success';
		const errorKey = 'error';

		const requiredFields = [
			updatedFormData.basicInfo.firstName,
			updatedFormData.basicInfo.lastName,
			updatedFormData.basicInfo.email,
		];

		const requiredFieldNames = ['firstName', 'lastName', 'email'];

		let blankFields = [];
		requiredFields.map((field) => {
			if (field == undefined || field == '') {
				blankFields.push(field);
			}
		});

		if (blankFields.length > 0) {
			message.error({
				errorKey,
				content:
					'First Name, Last Name, and Email are required to save. Please fill out required fields.',
				className: 'save-error',
				duration: 3,
			});

			await requiredFieldNames.map((field) => {
				currentFormInstance.validateFields([field]);
			});
		} else {
			hide = message.info({
				successKey,
				content: [
					'Application successfully saved ',
					saveLink,
					<Button
						key='saveButton'
						className='save-X-button'
						onClick={() => hide()}
					>
						x
					</Button>,
				],
				className: 'save-message',
				duration: 3,
			});
			try {
				const saveRes = await axios.post(
					'/api/x_g_nci_app_tracke/application/save_app_draft',
					{ jsonobj: JSON.stringify(updatedFormData) }
				);
				console.log('[SAVING] success:', saveRes);
			} catch (error) {
				console.log('[ConfirmSave] error:' + error);
			}
		}


	const handleSubmitModalCancel = () => {
		setSubmitModalVisible(false);
	};

	const currentStepObj = steps[currentStep] || {};
	const formIsFinished = currentStep > steps.length - 1;

	return (
		<>
			<HeaderWithLink
				title={vacancyTitle}
				route={'/vacancy/' + sysId}
				routeTitle='View Vacancy Details↗'
			/>
			<FormContext.Provider value={formContext}>
				<div className='ApplyContainer'>
					<div className='StepNavigation'>
						<Steps current={currentStep} direction='vertical'>
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
							<h3>{currentStepObj.title}</h3>
							<p>{currentStepObj.longDescription}</p>
							<div>
								{!isLoading ? currentStepObj.content : null}
								{formIsFinished && (
									<Result
										style={{ marginTop: '6rem' }}
										status='success'
										title='Application submitted successfully!'
									/>
								)}
							</div>
						</div>

						{!formIsFinished && (
							<div className='steps-action'>
								<Button
									onClick={prev}
									type='primary'
									ghost
									className='wider-button'
								>
									{currentStep === 0 ? 'cancel' : 'back'}
								</Button>

								<Button
									className='wider-button'
									style={{ border: 'none', color: '#015EA2' }}
									onClick={save}
								>
									<SaveOutlined /> save application
								</Button>

								<Button type='primary' onClick={next} className='wider-button'>
									{currentStep == steps.length - 1
										? 'submit application'
										: 'next'}
								</Button>
							</div>
						)}
					</div>
				</div>
			</FormContext.Provider>
			<SubmitModal
				visible={submitModalVisible}
				onCancel={handleSubmitModalCancel}
				data={formData}
			/>
		</>
	);
};

export default Apply;
