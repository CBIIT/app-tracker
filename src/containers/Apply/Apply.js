import { useState } from 'react';
import { Steps, Button, Result, message } from 'antd';

import FormContext, { defaulfFormData } from './Context';
import axios from 'axios';

import ApplicantBasicInfo from './Forms/BasicInfo/ApplicantBasicInfo.js';
import ApplicantAddress from './Forms/Address/ApplicantAddress.js';
import ApplicantReferences from './Forms/References/ApplicantReferences.js';

import './Apply.css';

const { Step } = Steps;

const uploadApplicationForm = (data) => {
	return null;
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
};

const uploadAttachments = (recordSysId, attachmentGroups) => {
	console.log('>> Starting upoading attachments...');
	const requests = [];

	for (let group in attachmentGroups) {
		for (let file of attachmentGroups[group].fileList) {
			const actualFile = file.originFileObj;

			const options = {
				params: {
					file_name: file.name,
					table_name: 'x_entg_poc_application',
					table_sys_id: recordSysId,
				},
				headers: {
					'Content-Type': file.type,
				},
			};
			requests.push(
				axios.post('/api/now/attachment/file', actualFile, options)
			);
		}
	}

	return Promise.all(requests);
};

const steps = [
	{
		title: 'Basic Information',
		content: <ApplicantBasicInfo />,
		description: 'Personal information about applicant',
	},
	{
		title: 'Address',
		content: <ApplicantAddress />,
		description: 'Mailing and business address',
	},
	{
		title: 'References',
		content: <ApplicantReferences name='applicantReferences' />,
		description: 'References to support the application',
	},
	{
		title: 'Applicant Documents',
		content: null,
		description: 'CV, Cover letter and Statement of research interests',
	},
	{
		title: 'Additional Questions',
		content: null,
		description: 'Additional questions and final submission',
	},
	{
		title: 'Review',
		content: null,
		description: 'Review info before submission',
	},
];

function updateFormData(currentForm, newValues, step) {
	const updatedForm = { ...currentForm };
	switch (step) {
		case 0:
			// (basic information) save to applicant
			updatedForm.applicant = { ...currentForm.applicant, ...newValues };
			return updatedForm;
		case 1:
			// (address) save to applicant
			updatedForm.applicant = { ...currentForm.applicant, ...newValues };
			return updatedForm;
		case 2:
			// (references) save to references
			updatedForm.references = newValues.references;
			return updatedForm;
		case 3:
			// (documents) handle attachments
			updatedForm.documents = newValues;
			return updatedForm;
		case 4:
			// (last-content) save to questions
			updatedForm.questions = newValues;
			return updatedForm;
		default:
			break;
	}
}

const Apply = () => {
	const [formData, setFormData] = useState(defaulfFormData);
	const [currentFormInstance, setCurrentFormInstance] = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const formContext = { formData, currentFormInstance, setCurrentFormInstance };

	const saveCurrentForm = async (result) => {
		console.log('>> current-form data: ', result);
		console.log('>> form before update: ', formData);
		const updatedForm = updateFormData(formData, result, currentStep);
		console.log('>> updatedForm: ', updatedForm);
		setFormData(updatedForm);
		return updatedForm;
	};

	const next = async () => {
		// currentFormInstance
		// 	.validateFields()
		// 	.then((validationResult) => saveCurrentForm(validationResult))
		// 	.then(() => setCurrentStep(currentStep + 1))
		// 	.catch((error) => {
		// 		message.error('Please fill out all required fields.');
		// 		console.log('>> error: ', error);
		// 	});
		setCurrentStep(currentStep + 1);
	};

	const prev = () => {
		// const fieldsValues = currentFormInstance.getFieldsValue();
		// saveCurrentForm(fieldsValues)
		// 	.then(() => setCurrentStep(currentStep - 1))
		// 	.catch((error) => {
		// 		message.error('Oops, there was an error while saving the form.');
		// 		console.log(error);
		// 	});
		setCurrentStep(currentStep - 1);
	};

	const submit = () => {
		currentFormInstance
			.validateFields()
			.then((validationResult) => saveCurrentForm(validationResult))
			.then((form) => {
				const payload = { ...form };
				delete payload.documents; // attachments are uploaded separately
				setIsUploading(true);
				uploadApplicationForm(payload).then((recordSysId) => {
					console.log('>> created record sys_id: ' + recordSysId);
					uploadAttachments(recordSysId, form.documents)
						.then((res) => {
							console.log(
								'>> attachments uploaded successfully, ServiceNow response: ',
								res
							);
							setCurrentStep(currentStep + 1);
						})
						.catch((error) => {
							console.log('>> error while uploading attachments: ', error);
						})
						.finally(() => {
							setIsUploading(false);
						});
				});
			})
			.catch((error) => {
				message.error('Oops, something went wrong.');
				console.log('>> error: ', error);
			});
	};

	const currentStepObj = steps[currentStep] || {};
	const formIsFinished = currentStep > steps.length - 1;

	return (
		<FormContext.Provider value={formContext}>
			<div className='ApplyContainer'>
				<div className='StepNavigation'>
					<div style={{ paddingTop: '20px' }}>
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
				</div>
				<div className='StepContentContainer'>
					<div className='StepContent'>
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
								{currentStep == steps.length - 1 ? 'Save and Finalize' : 'next'}
							</Button>
						</div>
					)}
				</div>
			</div>
		</FormContext.Provider>
	);
};

export default Apply;
