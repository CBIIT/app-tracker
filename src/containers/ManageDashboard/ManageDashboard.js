import { Tabs } from 'antd';
// import {VacancyDetails} from
import ApplicantList from './ApplicantList/ApplicantList';

const manageDashboard = () => {
	return (
		<>
			<div>
				<Tabs>
					<Tabs.TabPane tab='Vacancy Details' key='details'>
						{/* <VacancyDetails /> */}
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
