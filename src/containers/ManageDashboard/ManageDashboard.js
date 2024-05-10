import { useEffect, useState, useRef } from 'react';

import { Tabs, Button, Tooltip, message } from 'antd';
import { DoubleRightOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useParams, useHistory } from 'react-router-dom';

import SearchContext from './Util/SearchContext';

import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
import VacancyStatus from '../../components/UI/VacancyStatus/VacancyStatus.js';
import NextStepModal from './NextStepModal/NextStepModal';
import StatusModal from './StatusModal/StatusModal.js';
import FileUploadAndDisplay from '../../components/UI/FileUploadAndDisplay/FileUploadAndDisplay';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend.js';
import {
	VACANCY_DASHBOARD,
	CHAIR_DASHBOARD,
	COMMITTEE_DASHBOARD,
	EDIT_VACANCY,
} from '../../constants/Routes';
import {
	ADVANCE_VACANCY_TO_NEXT_STEP,
	GET_VACANCY_MANAGER_VIEW,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
} from '../../constants/ApiEndpoints';
import {
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	OWM_TEAM,
	COMMITTEE_CHAIR,
	COMMITTEE_MEMBER_READ_ONLY,
} from '../../constants/Roles';
import {
	OWM_TRIAGE,
	CHAIR_TRIAGE,
	INDIVIDUAL_SCORING_IN_PROGRESS,
	COMMITTEE_REVIEW_IN_PROGRESS,
	VOTING_COMPLETE,
	LIVE,
	FINAL,
} from '../../constants/VacancyStates';
import Loading from '../../components/Loading/Loading';
import useAuth from '../../hooks/useAuth';

import './ManageDashboard.css';

const getNextStepButtonLabel = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
			return 'Request Chair Triage';
		case CHAIR_TRIAGE:
			return 'Request Individual Scoring';
		case INDIVIDUAL_SCORING_IN_PROGRESS:
			return 'Advance to Committee Review';
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
	const [userCommitteeRole, setUserCommitteeRole] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [statusModalOpen, setStatusModalOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [isReadOnlyMember, setisReadOnlyMember] = useState(false);

	const searchContext = {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput,
	};

	const history = useHistory();
	const {
		auth: { user },
	} = useAuth();

	useEffect(() => {
		loadLatestVacancyInfo();
	}, []);

	const handleButtonClick = () => {
		setModalVisible(true);
	};

	const handleStatusButtonClick = () => {
		setStatusModalOpen(true)
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
		const vacancyResponse = await axios.get(GET_VACANCY_MANAGER_VIEW + sysId);
		setUserCommitteeRole(
			vacancyResponse.data.result.user.committee_role_of_current_vacancy
		);
		const responseData = vacancyResponse.data.result;
		checkForReadOnly(responseData, user);
		const vacancy = transformJsonFromBackend(vacancyResponse.data.result);
		setNextStep(vacancyResponse.data.result.basic_info.next_step.value);
		setVacancyTitle(vacancy.basicInfo.title);
		setVacancy(vacancy);
		setState(vacancyResponse.data.result.basic_info.state.label);
		setNextButtonLabel(
			getNextStepButtonLabel(vacancyResponse.data.result.basic_info.state.value)
		);
		setCurrentTab(tab);

		setIsLoading(false);
	};

	const checkForReadOnly = (vacancyResponseObj, id) => {
		const committeeArray = vacancyResponseObj.committee;
		const currentUserRole =
			vacancyResponseObj.user.committee_role_of_current_vacancy;
		const currentUserId = id.uid;
		for (let i = 0; i < committeeArray.length; i++) {
			if (
				committeeArray[i].user.value === currentUserId &&
				currentUserRole === COMMITTEE_MEMBER_READ_ONLY
			) {
				setisReadOnlyMember(true);
			}
		}
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
			vacancyState === VOTING_COMPLETE ||
			vacancyState === LIVE ||
			vacancyState === FINAL
		)
			return false;
		if (
			user.roles.includes(OWM_TEAM) ||
			(userCommitteeRole === COMMITTEE_CHAIR && vacancyState === CHAIR_TRIAGE)
		)
			return true;
		else return false;
	};

	return isLoading ? (
		<Loading />
	) : (
		<>
			<SearchContext.Provider value={searchContext}>
				<div className='ManageHeader'>
					<div className='HeaderTitle'>
						<h1>{vacancyTitle}</h1>
					</div>
					<div className='HeaderLink'>
						<Button
							type='link'
							onClick={() => {
								if (user.isManager == true) {
									history.push(VACANCY_DASHBOARD);
								} else if (user.isChair == true) {
									history.push(CHAIR_DASHBOARD);
								} else {
									history.push(COMMITTEE_DASHBOARD);
								}
							}}
						>
							Return to Dashboard
						</Button>
					</div>
				</div>
				{vacancy.state != 'rolling_close' &&
				vacancy.basicInfo.useCloseDate != 'false' ? (
					<>
						<VacancyStatus state={state} />
						{displayNextButton(vacancy.state) ? (
							<div className='AdvanceButtonDiv'>
								<Tooltip
									placement='top'
									title={
										!nextStep
											? getNextStepCannotAdvanceTooltip(vacancy.state)
											: ''
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
							</div>
						) : null}
					</>
				) : (
					<>
						<div className='AdvanceButtonDiv'>
							<Tooltip
								placement='top'
								title={
									vacancy.status == 'open'
										? 'The vacancy will be closed and no other applicants may apply for the position.'
										: 'The vacancy will be opened and applicants may submit their applications.'
								}
							>
								<Button
									type='primary'
									ghost
									className='AdvanceButton'
									onClick={handleStatusButtonClick}
									//loading={isStatusButtonLoading}
								>
									{/* {nextButtonLabel} <DoubleRightOutlined /> */}
									{vacancy.status == 'open' ? (
										<>
											Close Vacancy{' '}
											<LockOutlined />
										</>
									) : (
										<>
											Open Vacancy{' '}
											<UnlockOutlined />
										</>
									)}
								</Button>
							</Tooltip>
						</div>
					</>
				)}
				<div className='manage-tabs'>
					<Tabs
						activeKey={currentTab}
						defaultActiveKey='details'
						onChange={onChangeTabHandler}
					>
						<Tabs.TabPane tab='Vacancy Details' key='details'>
							<>
								{user.roles.includes(OWM_TEAM) ? (
									<div className='ManageDashboardEditButton'>
										<Button
											type='primary'
											ghost
											onClick={() => history.push(EDIT_VACANCY + sysId)}
										>
											Edit
										</Button>
									</div>
								) : null}
								<ViewVacancyDetails
									isReadOnlyMember={isReadOnlyMember}
									allForms={vacancy}
									hideCommitteeSection={isUserAllowedToScore()}
									hideEmails={isUserChair() || isUserAllowedToScore()}
								/>

								{user.roles.includes(OWM_TEAM) ? (
									<div
										className='RatingPlanDiv'
										style={{
											paddingLeft: '16px',
											paddingBottom: '16px',
										}}
									>
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
								vacancyTenant={vacancy.basicInfo.tenant}
								referenceCollection={vacancy.basicInfo.referenceCollection}
								userRoles={user.roles}
								userCommitteeRole={userCommitteeRole}
								reloadVacancy={loadLatestVacancyInfo}
							/>
						</Tabs.TabPane>
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
				<StatusModal
					sysId={sysId}
					status={vacancy.status}
					openModal={statusModalOpen}
					setModal={setStatusModalOpen}
					loadVacancy={loadLatestVacancyInfo}
				/>
			</SearchContext.Provider>
		</>
	);
};

export default manageDashboard;
