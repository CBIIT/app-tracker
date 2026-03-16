import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
	Steps,
	Button,
	Result,
	Space,
	Alert,
	message,
	notification,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import useTimeout from '../../hooks/useTimeout';

import { APPLICANT_DASHBOARD } from '../../constants/Routes';

import HeaderWithLink from '../../components/UI/HeaderWithLink/HeaderWithLink';
import {
	VACANCY_DETAILS_FOR_APPLICANTS,
	SAVE_APP_DRAFT,
	GET_PROFILE,
} from '../../constants/ApiEndpoints';

import FormContext, { defaultFormData } from './Context';
import ApplicantDocuments from './Forms/ApplicantDocuments/ApplicantDocuments';
import ApplicantReferences from './Forms/References/ApplicantReferences.js';
import Review from './Forms/Review/Review';
import SubmitModal from './SubmitModal/SubmitModal';
import { convertDataFromBackend } from '../Profile/Util/ConvertDataFromBackend';

import './Apply.css';
import { checkAuth } from '../../constants/checkAuth.js';

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
			updatedForm.focusArea = newValues.focusArea;
			return updatedForm;
		default:
			return updatedForm;
	}
};

const Apply = ({ initialValues, editSubmitted }) => {
	const [formData, setFormData] = useState(
		initialValues ? initialValues : defaultFormData
	);
	const [currentFormInstance, setCurrentFormInstance] = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [vacancyTitle, setVacancyTitle] = useState();
	const [submitModalVisible, setSubmitModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [draftId, setDraftId] = useState();
	const [vacancyTenantType, setVacancyTenantType] = useState();
	const [vacancyDocuments] = useState([]);
	const [lastModalTimeout, setLastModalTimeout] = useState();
	const [focusArea, setFocusArea] = useState([]);

	const history = useHistory();
	const { vacancySysId, appSysId } = useParams();
	const vacancyId = initialValues?.sysId || vacancySysId;

	const checkTimeDuration = 1000;

	const formContext = { formData, currentFormInstance, setCurrentFormInstance };

	const { modalTimeout } = useTimeout();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			if (initialValues) {
				await loadExistingApplication();
			} else {
				await instantiateNewApplication();
			}
			setIsLoading(false);
		})();
	}, []);

	setTimeout(async () => {
		// checking to see if user is about to get logged out
		// NB: this drops right to zero
		if (
			lastModalTimeout > 0.01 &&
			Math.abs(lastModalTimeout - modalTimeout) > 0.1
		) {
			console.log('Saving ...');
			// it changed, since it only changes when time runs out, save now
			setLastModalTimeout(modalTimeout);
			save();
		}
		setLastModalTimeout(modalTimeout);
	}, checkTimeDuration);

	const loadExistingApplication = async () => {
		const response = await axios.get(
			VACANCY_DETAILS_FOR_APPLICANTS + vacancyId
		);

		var focusAreaOptions = [];
		response.data.result.focus_area.forEach((focusArea) => {
			focusAreaOptions.push({ label: focusArea, value: focusArea });
		});
		setFocusArea(focusAreaOptions);
		
		const profileResponse = await axios
			.get(GET_PROFILE + user.uid)
			.catch(function () {
				notification.error({
					message: 'Sorry! There was an error retrieving your profile.',
					description: (
						<>
							<p>
								Please verify if the vacancy has closed. If not, please log out
								and re-login to resubmit your application. If the issue
								continues, contact the Help Desk by emailing{' '}
								<a href='mailto:NCIAppSupport@mail.nih.gov'>
									NCIAppSupport@mail.nih.gov
								</a>
							</p>
						</>
					),
					duration: 30,
					style: {
						height: '225px',
						display: 'flex',
						alignItems: 'center',
					},
				});
				history.goBack();
			});

		const profileData = convertDataFromBackend(
			profileResponse.data.result.response
		);
		const { basicInfo } = profileData;
		const address = basicInfo?.address;

		setVacancyTitle(response.data.result.basic_info.vacancy_title.value);
		setVacancyTenantType(response.data.result.basic_info.tenant.label);
		if (!editSubmitted) setDraftId(appSysId);

		let applicantDocuments = {};

		response.data.result.vacancy_documents.forEach((document) => {
			applicantDocuments[document.title.value] = document.file
				? document
				: { ...document, file: { fileList: [] } };
		});

		if (
			editSubmitted &&
			initialValues.applicantDocuments &&
			initialValues.applicantDocuments.length > 0
		) {
			initialValues.applicantDocuments.forEach((applicantDocument) => {
				if (
					applicantDocument &&
					applicantDocument.title &&
					applicantDocument.title.label
				) {
					applicantDocuments[applicantDocument.title.label] = {
						...applicantDocuments[applicantDocument.title.label],
						...applicantDocument,
					};
					var initialFiles = initialValues.applicantDocuments.filter(
						(iv) => iv.title.label === applicantDocument.title.label
					);
					if (initialFiles != null && initialFiles.length > 0) {
						applicantDocuments[applicantDocument.title.label].file =
							initialFiles[0].file;
						if (initialFiles[0].file.fileList.length > 0) {
							if (initialFiles[0] && initialFiles[0].uploadedDocument) {
								applicantDocuments[
									applicantDocument.title.label
								].uploadedDocument = {
									fileName: initialFiles[0]?.uploadedDocument?.fileName,
									attachSysId: initialFiles[0]?.uploadedDocument?.attachSysId,
									downloadLink: initialFiles[0]?.uploadedDocument?.downloadLink,
									markedToDelete:
										initialFiles[0]?.uploadedDocument?.markedToDelete,
								};
							} else {
								// its missing because this is getting rehydrated ... clear it out
								applicantDocuments[
									applicantDocument.title.label
								].uploadedDocument = {};
								applicantDocuments[applicantDocument.title.label].file = {
									fileList: [],
								};
							}
						}
					}
				} else {
					applicantDocuments[applicantDocument.documentName] = {
						...applicantDocuments[applicantDocument.documentName],
						...applicantDocument,
					};
				}
			});
		}

		const formData = {
			...initialValues,
			applicantDocuments: Object.values(applicantDocuments),
			basicInfo: basicInfo,
			address: address,
		};
		setFormData(formData);
	};

	const {
		auth: { user },
		setAuth,
	} = useAuth();

	const instantiateNewApplication = async () => {
		const response = await axios.get(
			VACANCY_DETAILS_FOR_APPLICANTS + vacancySysId
		);

		var focusAreaOptions = [];
		response.data.result.focus_area.forEach((focusArea) => {
			focusAreaOptions.push({ label: focusArea, value: focusArea });
		});
		setFocusArea(focusAreaOptions);
		

		const profileResponse = await axios
			.get(GET_PROFILE + user.uid)
			.catch(function () {
				notification.error({
					message: 'Sorry! There was an error retrieving your profile.',
					description: (
						<>
							<p>
								Please verify if the vacancy has closed. If not, please log out
								and re-login to resubmit your application. If the issue
								continues, contact the Help Desk by emailing{' '}
								<a href='mailto:NCIAppSupport@mail.nih.gov'>
									NCIAppSupport@mail.nih.gov
								</a>
							</p>
						</>
					),
					duration: 30,
					style: {
						height: '225px',
						display: 'flex',
						alignItems: 'center',
					},
				});
				history.goBack();
			});

		// commented for Jest testing. Do not remove.
		// const profileData = convertDataFromBackend(profileResponse.data.result.response)
		// const {basicInfo, demographics} = profileData;
		// const address = basicInfo?.address;

		const profileData = profileResponse.data.result.response;
		const basicInfo = {
			firstName: profileData.basic_info?.first_name,
			middleName: profileData.basic_info?.middle_name
				? profileData.basic_info?.middle_name
				: null,
			lastName: profileData.basic_info?.last_name,
			email: profileData.basic_info?.email,
			phonePrefix: profileData.basic_info?.phone.slice(0, 2),
			phone: profileData.basic_info?.phone.slice(2),
			businessPhonePrefix: profileData.basic_info?.business_phone
				? profileData.basic_info.business_phone?.slice(0, 2)
				: '+1',
			businessPhone: profileData.basic_info?.business_phone
				? profileData.basic_info.business_phone.slice(2)
				: null,
			highestLevelEducation: profileData.basic_info?.highest_level_of_education,
			isUsCitizen: parseInt(profileData.basic_info?.us_citizen),
			address: {
				address: profileData.basic_info?.address,
				address2: profileData.basic_info?.address_2,
				city: profileData.basic_info?.city,
				stateProvince: profileData.basic_info?.state_province,
				zip: profileData.basic_info?.zip_code,
				country: profileData.basic_info?.country,
			},
		};
		const address = basicInfo?.address;

		setVacancyTitle(response.data.result.basic_info.vacancy_title.value);
		setVacancyTenantType(response.data.result.basic_info.tenant.label);
		vacancyDocuments.push(response.data.result.vacancy_documents);

		const references = [];

		for (
			let i = 0;
			i <
			parseInt(response.data.result.basic_info.number_of_recommendation.value);
			i++
		) {
			references.push({});
		}

		const newFormData = {
			...formData,
			sysId: vacancySysId,
			applicantDocuments: response.data.result.vacancy_documents.map(
				(document) =>
					document.file ? document : { ...document, file: { fileList: [] } }
			),
			references: references,
			address: address,
			basicInfo: basicInfo,
		};
		setFormData(newFormData);

		const newData = {
			...newFormData,
			vacancyDocuments: vacancyDocuments,
		};

		let data = {
			jsonobj: JSON.stringify(newData),
		};

		if (draftId) {
			data['sys_id'] = draftId;
		}

		try{ 
			const saveDraftResponse = await axios.post(SAVE_APP_DRAFT, data);
			if (saveDraftResponse) {
			setDraftId(saveDraftResponse.data.result.draft_id);
			}
		} catch (e) {
			notification.error({
				message: 'Save Failed',
				description: (
					<>
						<p>
							Please verify if the vacancy has closed. If not, please log out
							and re-login to resubmit your application. If the issue continues,
							contact the Help Desk by emailing{' '}
							<a href='mailto:NCIAppSupport@mail.nih.gov'>
								NCIAppSupport@mail.nih.gov
							</a>
						</p>
					</>
				),
				duration: 30,
				style: {
					height: '225px',
					display: 'flex',
					alignItems: 'center',
				},
			});
			history.goBack();
		}
	};

	let steps = [];

	if (formData.applicantDocuments?.length > 0)
		steps.splice(2, 0, {
			key: 'applicantDocuments',
			title: 'Application Documents',
			content: (
				<ApplicantDocuments
					vacancyId={initialValues ? initialValues.sysId : vacancyId}
					focusAreaChoices={focusArea}
				/>
			),
			description: 'CV, cover letter, and statement of research interests',
			longDescription:
				'Please upload the following documents. Each file cannot exceed 1 GB in size. We prefer that you submit documents in PDF (.pdf) format, but we can also accept Microsoft Word (.doc/.docx) format.',
			strongContent: 'Please ensure each of your documents are unique files.',
			dangerContent:
				'Application documents will not be saved unless your application is submitted/finalized on the Review section.',
		});

	if (formData.references?.length > 0)
		steps.splice(2, 0, {
			key: 'references',
			title: 'References',
			content: <ApplicantReferences vacancyTenantType={vacancyTenantType} />,
			description: 'References to support the application',
			longDescription: (
				<>
					<p>
						Please provide professional references that can submit a
						recommendation on your behalf. <br />{' '}
						<span
							style={{ color: 'red', fontWeight: 'bold', fontSize: '16px' }}
						>
							Any reference provided can be contacted at any point in the
							recruitment process.
						</span>
					</p>
				</>
			),
		});

	steps.push({
		key: 'review',
		title: 'Review',
		content: (
			<Review
				vacancyTenantType={vacancyTenantType}
				onEditButtonClick={(step) => onEditButtonClick(step)}
			/>
		),
		description: 'Review before submitting',
		longDescription: 'Please review key information entered in each section.',
	});

	const onEditButtonClick = (step) => {
		const index = steps.findIndex((item) => item.key === step);
		setCurrentStep(index);
		window.scrollTo(0, 0);
	};

	const saveCurrentForm = async (result) => {
		const updatedForm = updateFormData(formData, result, currentStepObj.key);
		setFormData(updatedForm);
		return updatedForm;
	};

	const next = async () => {
		if (currentStep < steps.length - 1) {
			try {
				const validationResult = await currentFormInstance.validateFields();
				await saveCurrentForm(validationResult);
				if (currentStep == 1 && !editSubmitted) {
					save();
				}
				setCurrentStep(currentStep + 1);
				window.scrollTo(0, 0);
			} catch (error) {
				message.error('Please fill out all required fields.');
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
			window.scrollTo(0, 0);
		} catch (error) {
			message.error('Oops, there was an error while saving the form.');
		}
	};

	const saveLink = (
		<Button
			key='saveLink'
			type='link'
			style={{ paddingLeft: '150px', paddingRight: '10px' }}
			onClick={() => history.push(APPLICANT_DASHBOARD)}
		>
			Back to Applications Home?
		</Button>
	);

	const save = async () => {
		const fieldsValues = currentFormInstance.getFieldsValue();
		const updatedFormData = await saveCurrentForm(fieldsValues);

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
			try {
				const newData = {
					...updatedFormData,
					vacancyDocuments: vacancyDocuments,
				};

				let data = {
					jsonobj: JSON.stringify(newData),
				};

				if (draftId) {
					data['sys_id'] = draftId;
				}

				const saveDraftResponse = await axios.post(SAVE_APP_DRAFT, data);

				message.info({
					successKey,
					content: [
						'Application successfully saved ',
						saveLink,
						<Button
							key='saveButton'
							className='save-X-button'
							onClick={() => message.destroy()}
						>
							x
						</Button>,
					],
					className: 'save-message',
					duration: 3,
				});

				if (!draftId && saveDraftResponse.data.result.draft_id) {
					setDraftId(saveDraftResponse.data.result.draft_id);
				}
			} catch (error) {
				notification.error({
					message: 'Sorry! There was an error saving your application.',
					description: (
						<>
							<p>
								Please try again. If the issue persists, contact the Help Desk
								by emailing{' '}
								<a href='mailto:NCIAppSupport@mail.nih.gov'>
									NCIAppSupport@mail.nih.gov
								</a>
							</p>
						</>
					),
					duration: 1000,
					style: {
						height: '225px',
						display: 'flex',
						alignItems: 'center',
					},
				});
			} finally {
				checkAuth(setIsLoading, setAuth);
			}
		}
	};

	const handleSubmitModalCancel = () => {
		setSubmitModalVisible(false);
	};

	const currentStepObj = steps[currentStep] || {};
	const formIsFinished = currentStep > steps.length - 1;

	const returnToDocuments = () => {
		// moving application back to documents step in case of error
		setCurrentStep(0);
	};

	return (
		<>
			{editSubmitted ? (
				<Space
					direction='vertical'
					style={{
						width: '100%',
					}}
				>
					<Alert
						type='error'
						message='You are editing a submitted application.'
						description='Changes are not saved until the application is submitted again.'
						banner
					/>
				</Space>
			) : null}

			<HeaderWithLink
				title={vacancyTitle}
				route={'/vacancy/' + vacancyId}
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
						<div className='StepContent' style={{ marginLeft: 15 }}>
							<h3>{currentStepObj.title}</h3>
							<p>{currentStepObj.longDescription}</p>
							<span style={{ marginBottom: '0px', whiteSpace: 'pre-wrap' }}>
								<strong>{currentStepObj.strongContent}</strong>
							</span>
							<br />
							<span
								style={{
									marginBottom: '0px',
									whiteSpace: 'pre-wrap',
									color: 'red',
								}}
							>
								<strong>{currentStepObj.dangerContent}</strong>
							</span>
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
								<div style={{ marginLeft: 15 }}>
									<Button
										onClick={prev}
										type='primary'
										ghost
										className='wider-button'
										data-testid='back-button'
									>
										{currentStep === 0 ? 'Cancel' : 'Back'}
									</Button>
								</div>
								{!editSubmitted ? (
									<div>
										<Button
											className='wider-button'
											style={{ border: 'none', color: '#015EA2' }}
											onClick={save}
											data-testid='save-application-button'
										>
											<SaveOutlined /> Save Application
										</Button>
									</div>
								) : null}
								<div>
									<Button
										type='primary'
										onClick={next}
										className='wider-button'
										data-testid='next-button'
									>
										{currentStep == steps.length - 1
											? 'Submit Application'
											: 'Next'}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</FormContext.Provider>
			<SubmitModal
				visible={submitModalVisible}
				onCancel={handleSubmitModalCancel}
				data={formData}
				draftId={draftId}
				editSubmitted={editSubmitted}
				submittedAppSysId={appSysId}
				returnToDocuments={returnToDocuments}
			/>
		</>
	);
};

export default Apply;
