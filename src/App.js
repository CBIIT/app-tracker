import { Redirect, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.less';
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
	VIEW_VACANCY,
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
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Loading from './components/Loading/Loading';
import { CHECK_AUTH } from './constants/ApiEndpoints';

const app = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [iTrustGlideSsoId, setItrustGlideSsoId] = useState();
	const [oktaGlideSsoId, setOktaGlideSsoId] = useState();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const response = await axios.get(CHECK_AUTH);
			setItrustGlideSsoId(response.data.result.itrust_idp);
			setOktaGlideSsoId(response.data.result.okta_idp);
			setIsUserLoggedIn(response.data.result.logged_in);
			setIsLoading(false);
		})();
	}, []);

	let routes = [];

	if (isUserLoggedIn)
		routes.push(
			<Route
				key='manage-application'
				path={MANAGE_APPLICATION + ':sysId'}
				component={Application}
			/>,
			<Route
				key='vacancy-dashboard'
				path={VACANCY_DASHBOARD}
				exact
				component={VacancyDashboard}
			/>,
			<Route
				key='edit-application'
				path={EDIT_APPLICATION + ':draft?/:appSysId'}
				component={EditApplication}
			/>,
			<Route
				key='chair-dashboard'
				path={CHAIR_DASHBOARD}
				component={ChairDashboard}
			/>,
			<Route
				key='create-vacancy'
				path={CREATE_VACANCY}
				component={CreateVacancy}
			/>,
			<Route
				key='edit-vacancy'
				path={EDIT_VACANCY + ':sysId'}
				component={EditVacancy}
				exact
			/>,
			<Route
				key='manage-vacancy'
				path={MANAGE_VACANCY + ':sysId/:tab?'}
				component={ManageDashboard}
				exact
			/>,
			<Route
				key='edit-draft'
				path={EDIT_DRAFT + ':sysId'}
				component={EditDraft}
			/>,
			<Route
				key='committee-dashboard'
				path={COMMITTEE_DASHBOARD}
				component={CommitteeDashboard}
			/>,

			<Route
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				component={ApplicantDashboard}
			/>,
			<Route key='apply' path={APPLY + ':sysId'} component={Apply} />
		);

	routes.push(
		<ProtectedRoute
			path='/test/vacancy/dashboard'
			key='vacancy-dashboard'
			exact
			component={VacancyDashboard}
			isUserLoggedIn={isUserLoggedIn}
			iTrustGlideSsoId={iTrustGlideSsoId}
			oktaGlideSsoId={oktaGlideSsoId}
		/>,
		<Route
			key='view-vacancy'
			path={VIEW_VACANCY + ':sysId'}
			component={ViewVacancyDetails}
		/>,
		<Route key='register-okta' path={REGISTER_OKTA} component={RegisterOkta} />,
		<Route key='home' path='/' exact component={Home} />,
		<Route key='404'>
			<Redirect to='/' />
		</Route>
	);

	return (
		<Layout>{!isLoading ? <Switch>{routes}</Switch> : <Loading />}</Layout>
	);
};

export default hot(module)(app);
