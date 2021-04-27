import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Button, Tooltip, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import axios from 'axios';

import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
// import VacancyStatus from '../../components/UI/VacancyStatus/VacancyStatus.js';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend.js';
import { REQUEST_CHAIR_TRIAGE } from '../../constants/ApiEndpoints';
import './ManageDashboard.css';

const getNextStepButtonLabel = (currentStep) => {
	switch (currentStep) {
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
	// const [state, setState] = useState([]);

	const handleButtonClick = async (nextStep, sysId) => {
		setIsNextButtonLoading(true);
		switch (nextStep) {
			case 'chair_triage':
				try {
					await axios.post(REQUEST_CHAIR_TRIAGE + sysId);
					//TODO: Retrieve latest state of vacancy and update
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

			// setState(response.data.result.basic_info.state.label);
			console.log('[ManageDashboard] vacancy: ', responses[0]);
			setVacancyTitle(vacancy.basicInfo.title);
			setVacancy(vacancy);
			setApplicants(responseApplicantList.data.result);
			setCurrentTab(tab);
			setIsLoading(false);
		})();
	}, []);

	return isLoading ? (
		<> </>
	) : (
		<>
			<div className='HeaderTitle'>
				<h1>{vacancyTitle}</h1>
			</div>
			{/* <VacancyStatus state={state} /> */}
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
						{getNextStepButtonLabel(vacancy.state)} <DoubleRightOutlined />
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
