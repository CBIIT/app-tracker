import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { MANAGE_VACANCY, EXE_SEC_DASHBOARD } from '../../constants/Routes.js';
import { GET_COMMITTEE_MEMBER_VIEW } from '../../constants/ApiEndpoints';
import { Table, ConfigProvider, Empty, message, notification } from 'antd';
import useAuth from '../../hooks/useAuth';
import './CommitteeDashboard.css';
import axios from 'axios';
import {
	COMMITTEE_MEMBER_ROLE,
	COMMITTEE_EXEC_SEC,
} from '../../constants/Roles.js';
import {
	validateRoleForCurrentTenant,
	isExecSec,
} from '../../components/Util/RoleValidator/RoleValidator';
import { validateVacancyData } from '../ChairDashboard/Utils/validateVacancyData.js';
import {
	normalizeStatus,
	compareStatus,
	formatStatusDisplay,
} from '../ChairDashboard/Utils/statusHelper.js';

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
			{text}
		</span>
	) : (
		<span style={{ textTransform: 'capitalize' }}>{text}</span>
	);

const committeeDashboard = () => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [readOnly, setreadOnly] = useState(false);
	const [hasError, setHasError] = useState(false);
	const {
		auth: { user, tenants },
		currentTenant,
	} = useAuth();
	const history = useHistory();

	const location = useLocation();
	let customizeRenderEmpty = () => (
		<div style={{ textAlign: 'center' }}>
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
			<p>No Vacancies Assigned To You</p>
		</div>
	);

	useEffect(() => {
		if (
			validateRoleForCurrentTenant(
				COMMITTEE_MEMBER_ROLE,
				currentTenant,
				tenants
			) ||
			isExecSec(currentTenant, tenants)
		) {
			(async () => {
				try {
					setreadOnly(user.isReadOnlyUser);
					const url = GET_COMMITTEE_MEMBER_VIEW + currentTenant;
					const currentData = await axios.get(url);

					const jsonData = currentData.data.result;

					if (!jsonData?.list || typeof jsonData.list !== 'object') {
						throw new Error('Invalid vacancy data');
					}

					const validatedData = validateVacancyData(jsonData);

					const committeeMemberData =
						location.pathname === EXE_SEC_DASHBOARD
							? validatedData?.list.filter(
									(vacancy) => vacancy.user_role === COMMITTEE_EXEC_SEC
								)
							: validatedData?.list;
					setData(committeeMemberData);
				} catch (err) {
					setHasError(true);
					notification.error({
						message: 'Sorry! There was an error retrieving vacancies.',
						description: (
							<>
								<p>
									Please refresh the page and try again or try logging out and
									logging back in. If the issue persists, contact the Help Desk
									by emailing{' '}
									<a href='mailto:NCIAppSupport@mail.nih.gov'>
										NCIAppSupport@mail.nih.gov
									</a>
								</p>
							</>
						),
						duration: 30,
						style: {
							height: '225px',
							display: 'flex',
							alignItems: 'center',
						},
					});
				} finally {
					setIsLoading(false);
				}
			})();
		} else {
			message.destroy();
			message.error({
				duration: 3,
				content:
					'Sorry! You do not have committee member access in the selected tenant.',
			});
			setIsLoading(false);
			history.push('/');
		}
	}, [currentTenant]);

	return (
		<>
			<div className='HeaderTitle'>
				<h1>Vacancies Assigned To You</h1>
			</div>
			<div className='CommitteeDashboard'>
				<ConfigProvider renderEmpty={customizeRenderEmpty}>
					<Table
						className='CommitteeTable'
						pagination={{ hideOnSinglePage: true }}
						rowKey={(record) => record.vacancy_id}
						dataSource={data}
						columns={readOnly ? committeeColumns.slice(0, 3) : committeeColumns}
						scroll={{ x: 'true' }}
						key='CommitteeVacancies'
						style={{
							width: '1170px',
							display: 'block',
							paddingLeft: '20px',
							paddingRight: '20px',
							paddingTop: '20px',
						}}
						loading={isLoading}
					></Table>
				</ConfigProvider>
			</div>
		</>
	);
};

const committeeColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'vacancy_title',
		key: 'title',
		sorter: {
			compare: (a, b) => a.vacancy_title.localeCompare(b.vacancy_title),
			multiple: 1,
		},
		defaultSortOrder: 'ascend',
		render: (title, record) => (
			<Link to={MANAGE_VACANCY + record.vacancy_id}>{title}</Link>
		),
	},
	{
		title: 'Applicants',
		dataIndex: 'applicants',
		key: 'applicants',
		render: (number, record) => (
			<Link
				key={record.vacancy_id}
				to={MANAGE_VACANCY + record.vacancy_id + '/applicants'}
			>
				{number}{' '}
				{number == 1
					? 'applicant'
					: number == undefined
						? '0 applicants'
						: 'applicants'}
			</Link>
		),
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		sorter: {
			compare: (a, b) => compareStatus(a.status, b.status),
			multiple: 2,
		},
		defaultSortOrder: 'ascend',
		render: (status) => {
			const normalizedStatus = normalizeStatus(status);
			return formatStatusDisplay(normalizedStatus);
		},
	},
	{
		title: 'Scoring Due By',
		dataIndex: 'scoring_due_by_date',
		key: 'scoringDueByDate',
	},
	{
		title: 'Your Scoring',
		dataIndex: 'your_scoring',
		key: 'scoring',
		render: (text) => renderDecision(text),
	},
];

export default committeeDashboard;
