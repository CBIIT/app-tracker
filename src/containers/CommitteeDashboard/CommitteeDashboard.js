import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { MANAGE_VACANCY, EXE_SEC_DASHBOARD } from '../../constants/Routes.js';
import { GET_COMMITTEE_MEMBER_VIEW } from '../../constants/ApiEndpoints';
import { Table, ConfigProvider, Empty, message } from 'antd';
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
				setIsLoading(true);
				try {
					setreadOnly(user.isReadOnlyUser);
					const url = GET_COMMITTEE_MEMBER_VIEW + currentTenant;
					const currentData = await axios.get(url);

					const committeeMemberData =
						location.pathname === EXE_SEC_DASHBOARD
							? currentData.data.result.filter(
									(vacancy) => vacancy.user_role === COMMITTEE_EXEC_SEC
								)
							: currentData.data.result;
					setData(committeeMemberData);
				} catch (err) {
					message.error('Sorry!  An error occurred.');
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
			compare: (a, b) => a.status.localeCompare(b.status),
			multiple: 2,
		},
		defaultSortOrder: 'ascend',
		render: (status) => {
			if (status) {
				if (status.includes('owm')) {
					status = status.split('_')[0].toUpperCase() + status.substring(3);
				}
				if (status.includes('_')) {
					status = status
						.split('_')
						.map((word) => word[0].toUpperCase() + word.substring(1))
						.join(' ');
					return <span style={{ color: 'rgb(86,86,86)' }}>{status}</span>;
				} else {
					return (
						<span style={{ color: 'rgb(86,86,86)' }}>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</span>
					);
				}
			}
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
