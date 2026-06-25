import { Routes, Route, Navigate } from 'react-router-dom';
import { hot } from 'react-hot-loader';
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
import { atleastOneChair } from './components/Util/RoleValidator/RoleValidator';

const renderProtectedElement = (Component, routeProps = {}) => (
	<ProtectedRoute component={Component} {...routeProps} />
);

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { auth, setAuth } = useAuth();
	const { isUserLoggedIn, user, tenants } = auth;
	const isChairUser = isUserLoggedIn && atleastOneChair(tenants);
	const isManager = isUserLoggedIn && user?.isManager;
	const isCommitteeMember =
		isUserLoggedIn && user?.roles?.includes(COMMITTEE_MEMBER_ROLE);
	const canManageApplications =
		isChairUser || isManager || isCommitteeMember;

	useEffect(() => {
		checkAuth(setIsLoading, setAuth);
		if (!auth.isUserLoggedIn) checkAuth(setIsLoading, setAuth);
	}, []);

	if (user && isUserLoggedIn) {
		console.log(
			`User: ${user.uid} Time: ${transformDateTimeToDisplay(new Date())}  Action: 'Session start'`
		);
	}

	return !isLoading ? (
		<Layout>
			{isUserLoggedIn && <TimeoutModal />}
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path={REGISTER_OKTA} element={<RegisterOkta />} />
				<Route path={VIEW_VACANCY + ':sysId'} element={<ViewVacancyDetails />} />
				<Route path={APPLY + ':vacancySysId'} element={<Apply />} />

				{isUserLoggedIn ? (
					<>
						{isChairUser && (
							<Route
								path={CHAIR_DASHBOARD}
								element={renderProtectedElement(ChairDashboard)}
							/>
						)}

						{isManager && (
							<>
								<Route
									path={VACANCY_DASHBOARD + '/:tab?'}
									element={renderProtectedElement(VacancyDashboard)}
								/>
								<Route
									path={EXE_SEC_DASHBOARD}
									element={renderProtectedElement(CommitteeDashboard)}
								/>
								<Route
									path={CREATE_VACANCY}
									element={renderProtectedElement(CreateVacancy)}
								/>
								<Route
									path={EDIT_VACANCY + ':sysId'}
									element={renderProtectedElement(EditVacancy)}
								/>
								<Route
									path={EDIT_DRAFT + ':sysId'}
									element={renderProtectedElement(EditDraft)}
								/>
							</>
						)}

						{isCommitteeMember && (
							<Route
								path={COMMITTEE_DASHBOARD}
								element={renderProtectedElement(CommitteeDashboard)}
							/>
						)}

						{canManageApplications && (
							<>
								<Route
									path={MANAGE_APPLICATION + ':sysId'}
									element={renderProtectedElement(Application)}
								/>
								<Route
									path={MANAGE_VACANCY + ':sysId/:tab?'}
									element={renderProtectedElement(ManageDashboard)}
								/>
							</>
						)}

						<Route
							path={APPLICANT_DASHBOARD}
							element={renderProtectedElement(ApplicantDashboard)}
						/>
						<Route
							path={EDIT_APPLICATION + ':draft?/:appSysId'}
							element={renderProtectedElement(EditApplication)}
						/>
						<Route
							path={VIEW_APPLICATION + ':appSysId'}
							element={renderProtectedElement(ApplicantApplicationView)}
						/>
						<Route
							path={PROFILE + ':sysId'}
							element={renderProtectedElement(ApplicantProfile)}
						/>
					</>
				) : (
					<>
						<Route
							path={MANAGE_APPLICATION + ':sysId'}
							element={renderProtectedElement(Application)}
						/>
						<Route
							path={VACANCY_DASHBOARD + '/:tab?'}
							element={renderProtectedElement(VacancyDashboard)}
						/>
						<Route
							path={EDIT_APPLICATION + ':draft?/:appSysId'}
							element={renderProtectedElement(EditApplication)}
						/>
						<Route
							path={CHAIR_DASHBOARD}
							element={renderProtectedElement(ChairDashboard)}
						/>
						<Route
							path={CREATE_VACANCY}
							element={renderProtectedElement(CreateVacancy)}
						/>
						<Route
							path={EDIT_VACANCY + ':sysId'}
							element={renderProtectedElement(EditVacancy)}
						/>
						<Route
							path={MANAGE_VACANCY + ':sysId/:tab?'}
							element={renderProtectedElement(ManageDashboard)}
						/>
						<Route
							path={EDIT_DRAFT + ':sysId'}
							element={renderProtectedElement(EditDraft)}
						/>
						<Route
							path={COMMITTEE_DASHBOARD}
							element={renderProtectedElement(CommitteeDashboard)}
						/>
						<Route
							path={APPLICANT_DASHBOARD}
							element={renderProtectedElement(ApplicantDashboard, {
								useOktaAuth: true,
							})}
						/>
					</>
				)}

				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</Layout>
	) : null;
};

export default hot(module)(App);
