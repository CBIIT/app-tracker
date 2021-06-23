import { useEffect, useState } from 'react';

import { Tabs, Button, Tooltip, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useParams, useHistory } from 'react-router-dom';

import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
import VacancyStatus from '../../components/UI/VacancyStatus/VacancyStatus.js';
import NextStepModal from './NextStepModal/NextStepModal';
import FileUploadAndDisplay from '../../components/UI/FileUploadAndDisplay/FileUploadAndDisplay';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend.js';
import {
	ADVANCE_VACANCY_TO_NEXT_STEP,
	CHECK_AUTH,
	GET_VACANCY_MANAGER_VIEW,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
} from '../../constants/ApiEndpoints';
import {
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	OWM_TEAM,
	COMMITTEE_CHAIR,
} from '../../constants/Roles';
import {
	OWM_TRIAGE,
	CHAIR_TRIAGE,
	INDIVIDUAL_SCORING_IN_PROGRESS,
	COMMITTEE_REVIEW_IN_PROGRESS,
} from '../../constants/VacancyStates';
import './ManageDashboard.css';

const getNextStepButtonLabel = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
			return 'Request Chair Triage';
		case CHAIR_TRIAGE:
			return 'Request Individual Scoring';
		case INDIVIDUAL_SCORING_IN_PROGRESS:
			return 'Advance to Committee Scoring';
		case COMMITTEE_REVIEW_IN_PROGRESS:
			return 'Mark Voting Complete';
		default:
			return 'Advance to Next Stage';
	}
};

const getNextStepModalConfirmTitle = () => {
	return 'Confirm Request?';
};

const getNextStepModalSubmittedTitle = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
			return 'Requested Committee Chair Triage';
		case CHAIR_TRIAGE:
			return 'Requested Individual Scoring';
		case INDIVIDUAL_SCORING_IN_PROGRESS:
			return 'Advanced to Committee Scoring';
		case COMMITTEE_REVIEW_IN_PROGRESS:
			return 'Vacancy advanced to Voting Complete';
		default:
			return 'Request sent';
	}
};

const getNextStepModalConfirmDescription = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
			return 'The vacancy will be advanced to the committee chair triage stage and the chair will receive a notification.';
		case CHAIR_TRIAGE:
			return 'The vacancy will be advanced to the individual scoring stage and the vacancy manager will receive a notification.';
		case INDIVIDUAL_SCORING_IN_PROGRESS:
			return 'The vacancy will be advanced to the committee scoring stage.';
		case COMMITTEE_REVIEW_IN_PROGRESS:
			return 'The vacancy will be advanced to the voting complete stage.';
		default:
			return 'The vacancy will be advanced to the next stage and notifications will be sent out.';
	}
};

const getNextStepCannotAdvanceTooltip = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
		case CHAIR_TRIAGE:
			return 'Not all applications have been triaged or vacancy is still open.';
		case INDIVIDUAL_SCORING_IN_PROGRESS:
			return 'Not all applicants have been scored by all committee members.';
		case COMMITTEE_REVIEW_IN_PROGRESS:
			return 'Not all applicants have had a final committee vote selected.';
		default:
			return 'Not all advancing conditions have been met yet.';
	}
};

const getNextStepModalSteps = (currentStep) => {
	const steps = [];
	switch (currentStep) {
		case OWM_TRIAGE:
			steps.push({ title: 'Request Chair Triage?' });
			break;
		case CHAIR_TRIAGE:
			steps.push({ title: 'Request Individual Scoring?' });
			break;
		case INDIVIDUAL_SCORING_IN_PROGRESS:
			steps.push({ title: 'Advance to Committee Scoring?' });
			break;
		case COMMITTEE_REVIEW_IN_PROGRESS:
			steps.push({ title: 'Mark Voting Complete' });
			break;
		default:
			break;
	}
	steps.push({ title: 'Confirmed' });

	return steps;
};

const ratingPlanTable = 'x_g_nci_app_tracke_vacancy';

const manageDashboard = () => {
	const { sysId, tab } = useParams();
	const [currentTab, setCurrentTab] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [vacancy, setVacancy] = useState([]);
	const [vacancyTitle, setVacancyTitle] = useState([]);
	const [nextStep, setNextStep] = useState();
	const [isNextButtonLoading, setIsNextButtonLoading] = useState(false);
	const [state, setState] = useState([]);
	const [nextButtonLabel, setNextButtonLabel] = useState();
	const [userRoles, setUserRoles] = useState([]);
	const [userCommitteeRole, setUserCommitteeRole] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const history = useHistory();

	useEffect(() => {
		loadLatestVacancyInfo();
	}, []);

	const handleButtonClick = () => {
		setModalVisible(true);
	};

	const isUserAllowedToScore = () => {
		return (
			userCommitteeRole === COMMITTEE_MEMBER_VOTING ||
			userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING
		);
	};

	const isUserChair = () => {
		return userCommitteeRole === COMMITTEE_CHAIR;
	};

	const loadLatestVacancyInfo = async () => {
		const [vacancyResponse, checkAuthResponse] = await Promise.all([
			axios.get(GET_VACANCY_MANAGER_VIEW + sysId),
			axios.get(CHECK_AUTH),
		]);

		setUserCommitteeRole(
			vacancyResponse.data.result.user.committee_role_of_current_vacancy
		);

		const vacancy = transformJsonFromBackend(vacancyResponse.data.result);

		setNextStep(vacancyResponse.data.result.basic_info.next_step.value);
		setVacancyTitle(vacancy.basicInfo.title);
		setVacancy(vacancy);
		setState(vacancyResponse.data.result.basic_info.state.label);
		setNextButtonLabel(
			getNextStepButtonLabel(vacancyResponse.data.result.basic_info.state.value)
		);
		setCurrentTab(tab);
		setUserRoles(checkAuthResponse.data.result.user.roles);

		setIsLoading(false);
	};

	const closeModal = async () => {
		setModalVisible(false);
		loadLatestVacancyInfo();
	};

	const handleNextStepModalConfirm = async (sysId) => {
		setIsNextButtonLoading(true);
		try {
			await axios.post(ADVANCE_VACANCY_TO_NEXT_STEP + sysId);

			message.success('Request sent!');
		} catch (error) {
			message.error('Sorry!  There was an error processing the request.');
		}
		setIsNextButtonLoading(false);
	};

	const onChangeTabHandler = (key) => {
		setCurrentTab(key);
	};

	const displayNextButton = (vacancyState) => {
		if (
			userRoles.includes(OWM_TEAM) ||
			(userCommitteeRole === COMMITTEE_CHAIR && vacancyState === CHAIR_TRIAGE)
		)
			return true;
		else return false;
	};

	return isLoading ? (
		<> </>
	) : (
		<>
			<div className='ManageHeader'>
				<div className='HeaderTitle'>
					<h1>{vacancyTitle}</h1>
				</div>
				<div className='HeaderLink'>
					<Button
						type='link'
						onClick={() => {
							history.push('/vacancy-dashboard');
						}}
					>
						Return to Dashboard
					</Button>
				</div>
			</div>
			<VacancyStatus state={state} />
			<div className='manage-tabs'>
				{displayNextButton(vacancy.state) ? (
					<Tooltip
						placement='top'
						title={
							!nextStep ? getNextStepCannotAdvanceTooltip(vacancy.state) : ''
						}
					>
						<Button
							type='primary'
							ghost
							className='AdvanceButton'
							disabled={!nextStep}
							onClick={handleButtonClick}
							loading={isNextButtonLoading}
						>
							{nextButtonLabel} <DoubleRightOutlined />
						</Button>
					</Tooltip>
				) : null}
				<Tabs
					activeKey={currentTab}
					defaultActiveKey='details'
					onChange={onChangeTabHandler}
				>
					<Tabs.TabPane tab='Vacancy Details' key='details'>
						<>
							{isUserChair() ? (
								<ViewVacancyDetails allForms={vacancy} hideEmails={true} />
							) : isUserAllowedToScore() ? (
								<ViewVacancyDetails
									allForms={vacancy}
									hideCommitteeSection={true}
								/>
							) : (
								<ViewVacancyDetails allForms={vacancy} />
							)}

							{userRoles.includes(OWM_TEAM) ? (
								<div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
									<h2>Rating Plan</h2>
									<FileUploadAndDisplay
										buttonText='Upload Rating Plan'
										sysId={vacancy.sysId}
										url={SERVICE_NOW_FILE_ATTACHMENT}
										table={ratingPlanTable}
										afterUploadSuccess={loadLatestVacancyInfo}
										downloadLink={vacancy.ratingPlan.downloadLink}
										fileName={vacancy.ratingPlan.fileName}
										fileSysId={vacancy.ratingPlan.sysId}
										deleteUrl={
											SERVICE_NOW_ATTACHMENT + vacancy.ratingPlan.sysId
										}
										onDeleteSuccess={loadLatestVacancyInfo}
										deleteConfirmTitle='Delete the attached rating plan?'
										deleteConfirmText='This action cannot be undone, but you will be able to upload a new rating plan afterwards.'
										uploadSuccessMessage={'Rating plan updated.'}
										deleteSuccessMessage={'Rating plan deleted.'}
									/>
								</div>
							) : null}
						</>
					</Tabs.TabPane>
					<Tabs.TabPane tab='Applicants' key='applicants'>
						<ApplicantList
							vacancyState={vacancy.state}
							userRoles={userRoles}
							userCommitteeRole={userCommitteeRole}
							reloadVacancy={loadLatestVacancyInfo}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab='Review Summaries'
						key='review'
						disabled
					></Tabs.TabPane>
				</Tabs>
			</div>
			<NextStepModal
				visible={modalVisible}
				confirmTitle={getNextStepModalConfirmTitle()}
				confirmDescription={getNextStepModalConfirmDescription(vacancy.state)}
				handleCloseModal={closeModal}
				handleOk={() => handleNextStepModalConfirm(sysId)}
				submittedTitle={getNextStepModalSubmittedTitle(vacancy.state)}
				steps={getNextStepModalSteps(vacancy.state)}
			/>
		</>
	);
};

export default manageDashboard;
