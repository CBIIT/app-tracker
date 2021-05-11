import { useEffect, useState } from 'react';

import { Tabs, Button, Tooltip, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useParams, useHistory } from 'react-router-dom';

import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
import VacancyStatus from '../../components/UI/VacancyStatus/VacancyStatus.js';
import NextStepModal from './NextStepModal/NextStepModal';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend.js';
import {
	ADVANCE_VACANCY_TO_NEXT_STEP,
	CHECK_AUTH,
	GET_VACANCY_MANAGER_VIEW,
} from '../../constants/ApiEndpoints';
import { OWM_TRIAGE, CHAIR_TRIAGE } from '../../constants/VacancyStates';
import './ManageDashboard.css';
import { OWM_TEAM, COMMITTEE_CHAIR } from '../../constants/Roles';

const getNextStepButtonLabel = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
			return 'Request Chair Triage';
		case CHAIR_TRIAGE:
			return 'Request Individual Scoring';
		default:
			return 'Advance to next stage';
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
		default:
			'The vacancy will be advanced to the next stage and notifications will be sent out.';
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
		default:
			break;
	}
	steps.push({ title: 'Confirmed' });

	return steps;
};

const manageDashboard = () => {
	const { sysId, tab } = useParams();
	const [currentTab, setCurrentTab] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [applicants, setApplicants] = useState([]);
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
		(async () => {
			const responses = await Promise.all([
				axios.get(GET_VACANCY_MANAGER_VIEW + sysId),
				axios.get(
					'/api/x_g_nci_app_tracke/vacancy/get_applicant_list/' + sysId
				),
				axios.get(CHECK_AUTH),
			]);
			setUserCommitteeRole(
				responses[0].data.result.user.committee_role_of_current_vacancy
			);
			const vacancy = transformJsonFromBackend(responses[0].data.result);

			const responseApplicantList = responses[1];

			setNextStep(responses[0].data.result.basic_info.next_step.value);
			setVacancyTitle(vacancy.basicInfo.title);
			setVacancy(vacancy);
			setState(responses[0].data.result.basic_info.state.label);
			setNextButtonLabel(
				getNextStepButtonLabel(responses[0].data.result.basic_info.state.value)
			);
			setApplicants(responseApplicantList.data.result);
			setCurrentTab(tab);
			setUserRoles(responses[2].data.result.user.roles);

			setIsLoading(false);
		})();
	}, []);

	const handleButtonClick = () => {
		setModalVisible(true);
	};

	const closeModal = async () => {
		setModalVisible(false);
		const response = await axios.get(GET_VACANCY_MANAGER_VIEW + sysId);
		const vacancy = transformJsonFromBackend(response.data.result);
		const state = response.data.result.basic_info.state.value;
		const nextStep = response.data.result.basic_info.next_step.value;
		setVacancy(vacancy);
		setState(response.data.result.basic_info.state.label);
		setNextStep(nextStep);
		setNextButtonLabel(getNextStepButtonLabel(state));
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
							!nextStep
								? 'Not all applications have been triaged or vacancy is still open.'
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
				) : null}
				<Tabs
					activeKey={currentTab}
					defaultActiveKey='details'
					onChange={onChangeTabHandler}
				>
					<Tabs.TabPane tab='Vacancy Details' key='details'>
						<ViewVacancyDetails allForms={vacancy} />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Applicants' key='applicants'>
						<ApplicantList applicants={applicants} />
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
