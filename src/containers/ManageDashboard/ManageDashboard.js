import { Tabs } from 'antd';
import ApplicantList from './ApplicantList/ApplicantList';
import ViewVacancyDetails from './ViewVacancyDetails/ViewVacancyDetails';
import './ManageDashboard.css';

const manageDashboard = () => {
	return (
		<>
			<div className='manage-tabs'>
				<Tabs>
					<Tabs.TabPane tab='Vacancy Details' key='details'>
						{/* <ViewVacancyDetails /> */}
					</Tabs.TabPane>
					<Tabs.TabPane tab='Applicants' key='applicants'>
						<ApplicantList />
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
