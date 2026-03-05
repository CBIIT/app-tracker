import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
	PROFILE,
	EXE_SEC_DASHBOARD,
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
import { COMMITTEE_MEMBER_ROLE } from './constants/Roles';
import { checkAuth } from './constants/checkAuth';
import useAuth from './hooks/useAuth';
import { transformDateTimeToDisplay } from './components/Util/Date/Date';
import { atleastOneChair } from './components/Util/RoleValidator/RoleValidator'

const app = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { auth, setAuth } = useAuth();	// this populates auth
	
	useEffect(() => {
		checkAuth(setIsLoading, setAuth);
		if (!auth.isUserLoggedIn) checkAuth(setIsLoading, setAuth);
	}, []);

	let routes = [];
	const { isUserLoggedIn, user, tenants } = auth;

	if (user && isUserLoggedIn) {
		console.log(`User: ${user.uid} Time: ${transformDateTimeToDisplay(new Date())}  Action: 'Session start'`);
	}

	if (isUserLoggedIn) {
		if (atleastOneChair(tenants)) {
			routes.push(
				<Route
					key='chair-dashboard'
					path={CHAIR_DASHBOARD}
					element={<ProtectedRoute><ChairDashboard /></ProtectedRoute>}
				/>
			);
		}

		if (user.isManager) {
			routes.push(
				<Route
					key='vacancy-dashboard'
					path={VACANCY_DASHBOARD + '/:tab?'}
					element={<ProtectedRoute><VacancyDashboard /></ProtectedRoute>}
				/>,
				<Route
					key='exe-sec-dashboard'
					path={EXE_SEC_DASHBOARD}
					element={<ProtectedRoute><CommitteeDashboard /></ProtectedRoute>}
				/>,
				<Route
					key='create-vacancy'
					path={CREATE_VACANCY}
					element={<ProtectedRoute><CreateVacancy /></ProtectedRoute>}
				/>,
				<Route
					key='edit-vacancy'
					path={EDIT_VACANCY + ':sysId'}
					element={<ProtectedRoute><EditVacancy /></ProtectedRoute>}
				/>,

				<Route
					key='edit-draft'
					path={EDIT_DRAFT + ':sysId'}
					element={<ProtectedRoute><EditDraft /></ProtectedRoute>}
				/>
			);
		}

		if (user.roles.includes(COMMITTEE_MEMBER_ROLE))
			routes.push(
				<Route
					key='committee-dashboard'
					path={COMMITTEE_DASHBOARD}
					element={<ProtectedRoute><CommitteeDashboard /></ProtectedRoute>}
				/>
			);

		if (
			atleastOneChair(tenants) ||
			user.isManager ||
			user.roles.includes(COMMITTEE_MEMBER_ROLE)
		) {
			routes.push(
				<Route
					key='manage-application'
					path={MANAGE_APPLICATION + ':sysId'}
					element={<ProtectedRoute><Application /></ProtectedRoute>}
				/>,
				<Route
					key='manage-vacancy'
					path={MANAGE_VACANCY + ':sysId/:tab?'}
					element={<ProtectedRoute><ManageDashboard /></ProtectedRoute>}
				/>
			);
		}

		routes.push(
			<Route
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				element={<ProtectedRoute><ApplicantDashboard /></ProtectedRoute>}
			/>,
			<Route
				key='edit-application'
				path={EDIT_APPLICATION + ':draft?/:appSysId'}
				element={<ProtectedRoute><EditApplication /></ProtectedRoute>}
			/>,
			<Route
				key='view-application'
				path={VIEW_APPLICATION + ':appSysId'}
				element={<ProtectedRoute><ApplicantApplicationView /></ProtectedRoute>}
			/>,
			<Route
				key='applicant-profile'
				path={PROFILE + ':sysId'}
				element={<ProtectedRoute><ApplicantProfile /></ProtectedRoute>}
			/>
		);
	} else {
		routes.push(
			<Route
				key='manage-application'
				path={MANAGE_APPLICATION + ':sysId'}
				element={<ProtectedRoute><Application /></ProtectedRoute>}
			/>,
			<Route
				key='vacancy-dashboard'
				path={VACANCY_DASHBOARD + '/:tab?'}
				element={<ProtectedRoute><VacancyDashboard /></ProtectedRoute>}
			/>,
			<Route
				key='edit-application'
				path={EDIT_APPLICATION + ':draft?/:appSysId'}
				element={<ProtectedRoute><EditApplication /></ProtectedRoute>}
			/>,
			<Route
				key='chair-dashboard'
				path={CHAIR_DASHBOARD}
				element={<ProtectedRoute><ChairDashboard /></ProtectedRoute>}
			/>,
			<Route
				key='create-vacancy'
				path={CREATE_VACANCY}
				element={<ProtectedRoute><CreateVacancy /></ProtectedRoute>}
			/>,
			<Route
				key='edit-vacancy'
				path={EDIT_VACANCY + ':sysId'}
				element={<ProtectedRoute><EditVacancy /></ProtectedRoute>}
			/>,
			<Route
				key='manage-vacancy'
				path={MANAGE_VACANCY + ':sysId/:tab?'}
				element={<ProtectedRoute><ManageDashboard /></ProtectedRoute>}
			/>,
			<Route
				key='edit-draft'
				path={EDIT_DRAFT + ':sysId'}
				element={<ProtectedRoute><EditDraft /></ProtectedRoute>}
			/>,
			<Route
				key='committee-dashboard'
				path={COMMITTEE_DASHBOARD}
				element={<ProtectedRoute><CommitteeDashboard /></ProtectedRoute>}
			/>,
			<Route
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				element={<ProtectedRoute useOktaAuth={true}><ApplicantDashboard /></ProtectedRoute>}
			/>
		);
	}

	routes.push(
		<Route
				key='applicant-dashboard'
				path={APPLICANT_DASHBOARD}
				element={<ProtectedRoute useOktaAuth={true}><ApplicantDashboard /></ProtectedRoute>}
			/>,
		<Route
			key='apply'
			path={APPLY + ':vacancySysId'}
			element={<ProtectedRoute useOktaAuth={true}><Apply /></ProtectedRoute>}
		/>,
		<Route
			key='view-vacancy'
			path={VIEW_VACANCY + ':sysId'}
			element={<ViewVacancyDetails />}
		/>,
		<Route key='register-okta' path={REGISTER_OKTA} element={<RegisterOkta />} />,
		<Route key='home' path='/' element={<Home />} />,
		<Route key='404' path='*' element={<Navigate to='/' replace />} />
	);

	return !isLoading ? (
		<Layout>
			{isUserLoggedIn && <TimeoutModal />}
			<Routes>{routes}</Routes>
		</Layout>
	) : null;
};

export default app;
