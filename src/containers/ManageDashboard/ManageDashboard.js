import { useEffect, useState } from 'react';

import { Tabs, Button, Tooltip, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useParams, useHistory } from 'react-router-dom';

import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
import VacancyStatus from '../../components/UI/VacancyStatus/VacancyStatus.js';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend.js';
import { REQUEST_CHAIR_TRIAGE } from '../../constants/ApiEndpoints';
import { OWM_TRIAGE, CHAIR_TRIAGE } from '../../constants/VacancyStates';
import './ManageDashboard.css';

const getNextStepButtonLabel = (currentStep) => {
	switch (currentStep) {
		case OWM_TRIAGE:
			return 'Request Chair Triage';
		case CHAIR_TRIAGE:
			return 'Request Individual Scoring';
		default:
			return 'Request Chair Triage';
	}
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
	const history = useHistory();

	const handleButtonClick = async (nextStep, sysId) => {
		setIsNextButtonLoading(true);
		switch (nextStep) {
			case 'chair_triage':
				try {
					await axios.post(REQUEST_CHAIR_TRIAGE + sysId);
					const response = await axios.get(
						'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/' + sysId
					);
					const state = response.data.result.basic_info.state.value;
					const nextStep = response.data.result.basic_info.next_step.value;
					setState(response.data.result.basic_info.state.label);
					setNextStep(nextStep);
					setNextButtonLabel(getNextStepButtonLabel(state));
					message.success('Request sent!');
				} catch (error) {
					message.error('Sorry!  There was an error processing the request.');
				}
				break;
			default:
				break;
		}
		setIsNextButtonLoading(false);
	};

	const onChangeTabHandler = (key) => {
		setCurrentTab(key);
	};

	useEffect(() => {
		(async () => {
			const responses = await Promise.all([
				await axios.get(
					'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/' + sysId
				),
				await axios.get(
					'/api/x_g_nci_app_tracke/vacancy/get_applicant_list/' + sysId
				),
			]);
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
			setIsLoading(false);
		})();
	}, []);

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
				<Tooltip
					placement='top'
					title={!nextStep ? 'Not all applications have been triaged.' : ''}
				>
					<Button
						type='primary'
						ghost
						className='AdvanceButton'
						disabled={!nextStep}
						onClick={() => handleButtonClick(nextStep, sysId)}
						loading={isNextButtonLoading}
					>
						{nextButtonLabel} <DoubleRightOutlined />
					</Button>
				</Tooltip>
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
		</>
	);
};

export default manageDashboard;
