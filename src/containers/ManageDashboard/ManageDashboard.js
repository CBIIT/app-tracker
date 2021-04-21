import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from 'antd';
import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
import VacancyStatus from '../../components/UI/VacancyStatus/VacancyStatus.js';
import { transformJsonFromBackend } from './Util/TransformJsonFromBackend.js';
import axios from 'axios';
import './ManageDashboard.css';

const manageDashboard = () => {
	const { sysId, tab } = useParams();
	const [currentTab, setCurrentTab] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [applicants, setApplicants] = useState([]);
	const [allForms, setAllForms] = useState([]);
	const [vacancyTitle, setVacancyTitle] = useState([]);
	const [state, setState] = useState([]);

	const onChangeTabHandler = (key) => {
		setCurrentTab(key);
	};

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/' + sysId
			);
			const application = transformJsonFromBackend(response.data.result);

			const responseApplicantList = await axios.get(
				'/api/x_g_nci_app_tracke/vacancy/get_applicant_list/' + sysId
			);

			setState(response.data.result.basic_info.state.label);
			setVacancyTitle(application.basicInfo.title);
			setAllForms(application);
			setApplicants(responseApplicantList.data.result);
			setCurrentTab(tab);
			setIsLoading(false);
		})();
	}, []);

	console.log;

	return isLoading ? (
		<> </>
	) : (
		<>
			<div className='HeaderTitle'>
				<h1>{vacancyTitle}</h1>
			</div>
			<VacancyStatus state={state} />
			<div className='manage-tabs'>
				<Tabs
					activeKey={currentTab}
					defaultActiveKey='details'
					onChange={onChangeTabHandler}
				>
					<Tabs.TabPane tab='Vacancy Details' key='details'>
						<ViewVacancyDetails allForms={allForms} />
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
