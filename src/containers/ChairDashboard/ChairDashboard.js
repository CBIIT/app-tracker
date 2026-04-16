import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MANAGE_VACANCY } from '../../constants/Routes.js';
import { Table, message, notification } from 'antd';
import { validateVacancyData } from './Utils/validateVacancyData.js';
import { GET_COMMITTEE_CHAIR_VACANCIES } from '../../constants/ApiEndpoints';
import './ChairDashboard.css';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { COMMITTEE_MEMBER_ROLE } from '../../constants/Roles.js';
import useAuth from '../../hooks/useAuth';
import {
	normalizeStatus,
	compareStatus,
	formatStatusDisplay,
} from './Utils/statusHelper.js';

const chairDashboard = () => {
	const {
		auth: { tenants },
		currentTenant,
	} = useAuth();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const history = useHistory();

	useEffect(() => {
		if (
			validateRoleForCurrentTenant(
				COMMITTEE_MEMBER_ROLE,
				currentTenant,
				tenants
			)
		) {
			(async () => {
				try {
					const currentData = await axios.get(
						GET_COMMITTEE_CHAIR_VACANCIES + currentTenant
					);
					const jsonData = currentData.data.result;

					if (!jsonData?.list || typeof jsonData.list !== 'object') {
						throw new Error('Invalid vacancy data');
					}

					const validateData = validateVacancyData(jsonData);

					setData(
						validateData?.list.filter(
							(vacancy) => vacancy.status != 'live' && vacancy.status != 'final'
						)
					);
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

	return hasError ? (
		<div className='Content'>
			<h2>Unable to load vacancies</h2>
			<p>
				Please refresh the page and try again. If the issue persists, contact
				the Help Desk by emailing{' '}
				<a href='mailto:NCIAppSupport@mail.nih.gov'>
					NCIAppSupport@mail.nih.gov
				</a>
			</p>
		</div>
	) : (
		<>
			<div className='HeaderTitle'>
				<h1>Vacancies Assigned To You</h1>
			</div>
			<div className='ChairDashboard'>
				<Table
					rowKey={(record) => record.vacancy_id}
					dataSource={data}
					columns={chairColumns}
					scroll={{ x: 'true' }}
					loading={
						isLoading
							? { indicator: <LoadingOutlined style={{ fontSize: 24 }} spin /> }
							: false
					}
					key='ChairVacancies'
				></Table>
			</div>
		</>
	);
};

const chairColumns = [
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
			<Link to={MANAGE_VACANCY + record.vacancy_id + '/applicants'}>
				{number} {number == 1 ? 'applicant' : 'applicants'}
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
];

export default chairDashboard;
