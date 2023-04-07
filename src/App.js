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
	VIEW_APPLICATION,
	CREATE_PROFILE,
	PROFILE
} from './constants/Routes';
import ApplicantApplicationView from './containers/ApplicantApplicationView/ApplicantApplicationView';
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
import ApplicantProfile from './containers/Profile/ApplicantProfile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import TimeoutModal from './components/TimeoutModal/TimeoutModal';
import { CHECK_AUTH } from './constants/ApiEndpoints';
import { COMMITTEE_MEMBER_ROLE } from './constants/Roles';
import useAuth from './hooks/useAuth';

const app = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { auth, setAuth } = useAuth();

	useEffect(() => {
		if (!auth.isUserLoggedIn) checkAuth();
	}, []);

	const checkAuth = async () => {
		setIsLoading(true);
		const response = await axios.get(CHECK_AUTH);
		const data = response.data.result;
		setAuth({
			isUserLoggedIn: data.logged_in,
			iTrustGlideSsoId: data.itrust_idp,
			oktaGlideSsoId: data.okta_idp,
			sessionTimeout: data.session_timeout,
			user: {
				firstName: data.user.first_name,
				lastInitial: data.user.last_initial,
				uid: data.user.user_id,
				hasProfile: data.has_profile,
				isChair: data.is_chair,
				isManager: data.is_manager,
				isExecSec: data.is_exec_sec,
				hasApplications: data.user.has_applications,
				roles: data.user.roles,
			},
			oktaLoginAndRedirectUrl: data.okta_login_and_redirect_url,
		});
		setIsLoading(false);
	};

	let routes = [];
	const { isUserLoggedIn, user } = auth;

	if (isUserLoggedIn) {
		if (user.isChair) {
			routes.push(
				<ProtectedRoute
					key='chair-dashboard'
					path={CHAIR_DASHBOARD}
					component={ChairDashboard}
				/>
			);
		}

		if (user.isManager) {
			routes.push(
				<ProtectedRoute
					key='vacancy-dashboard'
					path={VACANCY_DASHBOARD + '/:tab?'}
					exact
					component={VacancyDashboard}
				/>,
				<ProtectedRoute
					key='create-vacancy'
					path={CREATE_VACANCY}
					component={CreateVacancy}
				/>,
				<ProtectedRoute
					key='edit-vacancy'
					path={EDIT_VACANCY + ':sysId'}
					component={EditVacancy}
					exact
				/>,

				<ProtectedRoute
					key='edit-draft'
					path={EDIT_DRAFT + ':sysId'}
					component={EditDraft}
				/>
			);
		}

		if (user.roles.includes(COMMITTEE_MEMBER_ROLE))
			routes.push(
				<ProtectedRoute
					key='committee-dashboard'
					path={COMMITTEE_DASHBOARD}
					component={CommitteeDashboard}
				/>
			);

		if (
			user.isChair ||
			user.isManager ||
			user.roles.includes(COMMITTEE_MEMBER_ROLE)
		) {
			routes.push(
				<ProtectedRoute
					key='manage-application'
					path={MANAGE_APPLICATION + ':sysId'}
					component={Application}
				/>,
				<ProtectedRoute
					key='manage-vacancy'
					path={MANAGE_VACANCY + ':sysId/:tab?'}
					component={ManageDashboard}
					exact
				/>
			);
		}

		routes.push(
			<ProtectedRoute
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				component={ApplicantDashboard}
			/>,
			<ProtectedRoute
				key='edit-application'
				path={EDIT_APPLICATION + ':draft?/:appSysId'}
				component={EditApplication}
			/>,
			<ProtectedRoute
				key='view-application'
				path={VIEW_APPLICATION + ':appSysId'}
				component={ApplicantApplicationView}
			/>,
			<ProtectedRoute
				key='applicant-profile'
				path={PROFILE + ':sysId'}
				component={ApplicantProfile}
			/>
		);
	} else {
		routes.push(
			<ProtectedRoute
				key='manage-application'
				path={MANAGE_APPLICATION + ':sysId'}
				component={Application}
			/>,
			<ProtectedRoute
				key='vacancy-dashboard'
				path={VACANCY_DASHBOARD + '/:tab?'}
				exact
				component={VacancyDashboard}
			/>,
			<ProtectedRoute
				key='edit-application'
				path={EDIT_APPLICATION + ':draft?/:appSysId'}
				component={EditApplication}
			/>,
			<ProtectedRoute
				key='chair-dashboard'
				path={CHAIR_DASHBOARD}
				component={ChairDashboard}
			/>,
			<ProtectedRoute
				key='create-vacancy'
				path={CREATE_VACANCY}
				component={CreateVacancy}
			/>,
			<ProtectedRoute
				key='edit-vacancy'
				path={EDIT_VACANCY + ':sysId'}
				component={EditVacancy}
				exact
			/>,
			<ProtectedRoute
				key='manage-vacancy'
				path={MANAGE_VACANCY + ':sysId/:tab?'}
				component={ManageDashboard}
				exact
			/>,
			<ProtectedRoute
				key='edit-draft'
				path={EDIT_DRAFT + ':sysId'}
				component={EditDraft}
			/>,
			<ProtectedRoute
				key='committee-dashboard'
				path={COMMITTEE_DASHBOARD}
				component={CommitteeDashboard}
			/>,
			<ProtectedRoute
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				component={ApplicantDashboard}
				useOktaAuth={true}
			/>
		);
	}

	routes.push(
		<ProtectedRoute
			key='apply'
			path={APPLY + ':vacancySysId'}
			component={Apply}
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

	return !isLoading ? (
		<Layout>
			<TimeoutModal />
			<Switch>{routes}</Switch>
		</Layout>
	) : null;
};

export default hot(module)(app);
