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
import { COMMITTEE_MEMBER_ROLE } from './constants/Roles';

const app = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [iTrustGlideSsoId, setItrustGlideSsoId] = useState();
	const [oktaGlideSsoId, setOktaGlideSsoId] = useState();
	const [user, setUser] = useState({});

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const response = await axios.get(CHECK_AUTH);
			setItrustGlideSsoId(response.data.result.itrust_idp);
			setOktaGlideSsoId(response.data.result.okta_idp);
			setUser(response.data.result);
			setIsUserLoggedIn(response.data.result.logged_in);
			setIsLoading(false);
		})();
	}, []);

	let routes = [];

	if (isUserLoggedIn) {
		if (user.is_chair) {
			routes.push(
				<ProtectedRoute
					key='chair-dashboard'
					path={CHAIR_DASHBOARD}
					component={ChairDashboard}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>
			);
		}

		if (user.is_manager) {
			routes.push(
				<ProtectedRoute
					key='vacancy-dashboard'
					path={VACANCY_DASHBOARD + '/:tab?'}
					exact
					component={VacancyDashboard}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>,
				<ProtectedRoute
					key='create-vacancy'
					path={CREATE_VACANCY}
					component={CreateVacancy}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>,
				<ProtectedRoute
					key='edit-vacancy'
					path={EDIT_VACANCY + ':sysId'}
					component={EditVacancy}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
					exact
				/>,

				<ProtectedRoute
					key='edit-draft'
					path={EDIT_DRAFT + ':sysId'}
					component={EditDraft}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>
			);
		}

		if (user.user.roles.includes(COMMITTEE_MEMBER_ROLE))
			routes.push(
				<ProtectedRoute
					key='committee-dashboard'
					path={COMMITTEE_DASHBOARD}
					component={CommitteeDashboard}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>
			);

		if (user.user.roles.includes(COMMITTEE_MEMBER_ROLE))
			<ProtectedRoute
				key='committee-dashboard'
				path={COMMITTEE_DASHBOARD}
				component={CommitteeDashboard}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>;

		if (
			user.is_chair ||
			user.is_manager ||
			user.user.roles.includes(COMMITTEE_MEMBER_ROLE)
		) {
			routes.push(
				<ProtectedRoute
					key='manage-application'
					path={MANAGE_APPLICATION + ':sysId'}
					component={Application}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>,
				<ProtectedRoute
					key='manage-vacancy'
					path={MANAGE_VACANCY + ':sysId/:tab?'}
					component={ManageDashboard}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
					exact
				/>
			);
		}

		if (user.user.has_applications)
			routes.push(
				<ProtectedRoute
					key='applicant-dashboard'
					path={APPLICANT_DASHBOARD}
					component={ApplicantDashboard}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>,
				<ProtectedRoute
					key='edit-application'
					path={EDIT_APPLICATION + ':draft?/:appSysId'}
					component={EditApplication}
					isUserLoggedIn={isUserLoggedIn}
					iTrustGlideSsoId={iTrustGlideSsoId}
					oktaGlideSsoId={oktaGlideSsoId}
				/>
			);
	} else {
		routes.push(
			<ProtectedRoute
				key='manage-application'
				path={MANAGE_APPLICATION + ':sysId'}
				component={Application}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='vacancy-dashboard'
				path={VACANCY_DASHBOARD + '/:tab?'}
				exact
				component={VacancyDashboard}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='edit-application'
				path={EDIT_APPLICATION + ':draft?/:appSysId'}
				component={EditApplication}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='chair-dashboard'
				path={CHAIR_DASHBOARD}
				component={ChairDashboard}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='create-vacancy'
				path={CREATE_VACANCY}
				component={CreateVacancy}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='edit-vacancy'
				path={EDIT_VACANCY + ':sysId'}
				component={EditVacancy}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
				exact
			/>,
			<ProtectedRoute
				key='manage-vacancy'
				path={MANAGE_VACANCY + ':sysId/:tab?'}
				component={ManageDashboard}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
				exact
			/>,
			<ProtectedRoute
				key='edit-draft'
				path={EDIT_DRAFT + ':sysId'}
				component={EditDraft}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='committee-dashboard'
				path={COMMITTEE_DASHBOARD}
				component={CommitteeDashboard}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
			/>,
			<ProtectedRoute
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				component={ApplicantDashboard}
				isUserLoggedIn={isUserLoggedIn}
				iTrustGlideSsoId={iTrustGlideSsoId}
				oktaGlideSsoId={oktaGlideSsoId}
				useOktaAuth={true}
			/>
		);
	}

	routes.push(
		<ProtectedRoute
			key='apply'
			path={APPLY + ':sysId'}
			component={Apply}
			isUserLoggedIn={isUserLoggedIn}
			iTrustGlideSsoId={iTrustGlideSsoId}
			oktaGlideSsoId={oktaGlideSsoId}
			useOktaAuth={true}
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
