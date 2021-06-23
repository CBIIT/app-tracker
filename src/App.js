import { Route, Switch } from 'react-router-dom';

import './App.less';
import { hot } from 'react-hot-loader';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import {
	MANAGE_APPLICATION,
	MANAGE_VACANCY,
	COMMITTEE_DASHBOARD,
	CHAIR_DASHBOARD,
	VACANCY_DASHBOARD,
	APPLY,
	REGISTER_OKTA,
	APPLICANT_DASHBOARD,
	EDIT_DRAFT,
	EDIT_VACANCY,
	EDIT_APPLICATION,
	CREATE_VACANCY,
} from './constants/Routes';
import CreateVacancy from './containers/CreateVacancy/CreateVacancy';
import VacancyDashboard from './containers/VacancyDashboard/VacancyDashboard';
import ViewVacancyDetails from './containers/ViewVacancyDetails/ViewVacancyDetails';
import ManageDashboard from './containers/ManageDashboard/ManageDashboard';
import EditVacancy from './containers/CreateVacancy/EditVacancy';
import CommitteeDashboard from './containers/CommitteeDashboard/CommitteeDashboard';
import ChairDashboard from './containers/ChairDashboard/ChairDashboard';
import ApplicantDashboard from './containers/ApplicantDashboard/ApplicantDashboard';
import RegisterOkta from './containers/RegisterOkta/RegisterOkta';
import Apply from './containers/Apply/Apply';
import Application from './containers/Application/Application';
import EditDraft from './containers/CreateVacancy/EditDraft';
import EditApplication from './containers/Apply/EditApplication';

const app = () => {
	return (
		<>
			<Layout>
				<Switch>
					<Route path={MANAGE_APPLICATION + ':sysId'} component={Application} />

					<Route
						path={EDIT_APPLICATION + ':draft?/:appSysId'}
						component={EditApplication}
					/>
					<Route path={CHAIR_DASHBOARD} component={ChairDashboard} />
					<Route path={CREATE_VACANCY} component={CreateVacancy} />
					<Route path={APPLY + ':sysId'} component={Apply} />
					<Route path={VACANCY_DASHBOARD} exact component={VacancyDashboard} />
					<Route path='/vacancy/:sysId' component={ViewVacancyDetails} />
					<Route path={EDIT_VACANCY + ':sysId'} component={EditVacancy} exact />
					<Route
						path={MANAGE_VACANCY + ':sysId/:tab?'}
						component={ManageDashboard}
						exact
					/>
					<Route path={EDIT_DRAFT + ':sysId'} component={EditDraft} />
					<Route path={COMMITTEE_DASHBOARD} component={CommitteeDashboard} />

					<Route path={APPLICANT_DASHBOARD} component={ApplicantDashboard} />

					<Route path={REGISTER_OKTA} component={RegisterOkta} />

					<Route path='/' exact component={Home} />
				</Switch>
			</Layout>
		</>
	);
};

export default hot(module)(app);
