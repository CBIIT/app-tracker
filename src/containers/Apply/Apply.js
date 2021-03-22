import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Steps, Button, Result, message } from 'antd';
import axios from 'axios';

import HeaderWithLink from '../../components/UI/HeaderWithLink/HeaderWithLink';
import { VACANCY_DETAILS_FOR_APPLICANTS } from '../../constants/ApiEndpoints';

import FormContext, { defaultFormData } from './Context';
import ApplicantBasicInfo from './Forms/BasicInfo/ApplicantBasicInfo.js';
import ApplicantAddress from './Forms/Address/ApplicantAddress.js';
import ApplicantReferences from './Forms/References/ApplicantReferences.js';
import ApplicantDocuments from './Forms/Applicant Documents/ApplicantDocuments'
import './Apply.css';

const { Step } = Steps;

// const uploadApplicationForm = (data) => {
// axios
// 	.post('/api/x_entg_poc/react_app_api/submit', data)
// 	.then(function (response) {
// 		console.log(
// 			'>> response from ServiceNow on submitting a form data:',
// 			response
// 		);
// 		const { sys_id } = response.data.result;
// 		return sys_id;
// 	})
// 	.catch(function (error) {
// 		console.log('>> error:', error);
// 	});
// };

// const uploadAttachments = (recordSysId, attachmentGroups) => {
// 	console.log('>> Starting upoading attachments...');
// 	const requests = [];

// 	for (let group in attachmentGroups) {
// 		for (let file of attachmentGroups[group].fileList) {
// 			const actualFile = file.originFileObj;

// 			const options = {
// 				params: {
// 					file_name: file.name,
// 					table_name: 'x_entg_poc_application',
// 					table_sys_id: recordSysId,
// 				},
// 				headers: {
// 					'Content-Type': file.type,
// 				},
// 			};
// 			requests.push(
// 				axios.post('/api/now/attachment/file', actualFile, options)
// 			);
// 		}
// 	}

// 	return Promise.all(requests);
// };

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
		description: 'Mailing and business address',
	},
	{
		key: 'references',
		title: 'References',
		// content: <ApplicantReferences name='applicantReferences' />,
		content: null,
		description: 'References to support the application',
	},
	{
		key: 'applicantDocuments',
		title: 'Applicant Documents',
		content: <ApplicantDocuments/>,
		description: 'CV, cover letter, and statement of research interests',
	},
	{
		key: 'additionalQuestions',
		title: 'Additional Questions',
		content: null,
		description: 'Additional questions supplementary to application',
	},
	{
		key: 'review',
		title: 'Review',
		content: null,
		description: 'Review info before submission',
	},
];

const updateFormData = (currentForm, newValues, step) => {
	const updatedForm = { ...currentForm };
	switch (step) {
		case 'basicInfo':
			// (basic information) save to applicant
			updatedForm.basicInfo = { ...currentForm.applicant, ...newValues };
			return updatedForm;
		case 'address':
			// (address) save to applicant
			updatedForm.address = { ...currentForm.applicant, ...newValues };
			return updatedForm;
		case 'references':
			// (references) save to references
			updatedForm.references = newValues.references;
			return updatedForm;
		case 'applicantDocuments':
			// (documents) handle attachments
			updatedForm.documents = newValues;
			return updatedForm;
		case 'additionalQuestions':
			// (last-content) save to questions
			updatedForm.questions = newValues;
			return updatedForm;
		default:
			break;
	}
};

const Apply = () => {
	const [formData, setFormData] = useState(defaultFormData);
	const [currentFormInstance, setCurrentFormInstance] = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	// const [isUploading, setIsUploading] = useState(false);
	const [vacancyTitle, setVacancyTitle] = useState();

	const history = useHistory();
	const { sysId } = useParams();

	const formContext = { formData, currentFormInstance, setCurrentFormInstance };

	useEffect(() => {
		(async () => {
			const response = await axios.get(VACANCY_DETAILS_FOR_APPLICANTS + sysId);
			setVacancyTitle(response.data.result.basic_info.vacancy_title.value);
		})();
	}, []);

	const saveCurrentForm = async (result) => {
		console.log('>> current-form data: ', result);
		console.log('>> form before update: ', formData);
		const updatedForm = updateFormData(formData, result, currentStepObj.key);
		console.log('>> updatedForm: ', JSON.stringify(updatedForm, null, 2));
		setFormData(updatedForm);
		return updatedForm;
	};

	const next = async () => {
		try {
			const validationResult = await currentFormInstance.validateFields();
			await saveCurrentForm(validationResult);
			setCurrentStep(currentStep + 1);
		} catch (error) {
			message.error('Please fill out all required fields.');
			console.log('>> error: ', error);
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

	// const submit = () => {
	// 	currentFormInstance
	// 		.validateFields()
	// 		.then((validationResult) => saveCurrentForm(validationResult))
	// 		.then((form) => {
	// 			const payload = { ...form };
	// 			delete payload.documents; // attachments are uploaded separately
	// 			setIsUploading(true);
	// 			uploadApplicationForm(payload).then((recordSysId) => {
	// 				console.log('>> created record sys_id: ' + recordSysId);
	// 				uploadAttachments(recordSysId, form.documents)
	// 					.then((res) => {
	// 						console.log(
	// 							'>> attachments uploaded successfully, ServiceNow response: ',
	// 							res
	// 						);
	// 						setCurrentStep(currentStep + 1);
	// 					})
	// 					.catch((error) => {
	// 						console.log('>> error while uploading attachments: ', error);
	// 					})
	// 					.finally(() => {
	// 						setIsUploading(false);
	// 					});
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			message.error('Oops, something went wrong.');
	// 			console.log('>> error: ', error);
	// 		});
	// };

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
								{currentStepObj.content}
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
		</>
	);
};

export default Apply;
