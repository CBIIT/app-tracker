import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MANAGE_VACANCY } from '../../constants/Routes.js';
import { Table, message, notification, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GET_COMMITTEE_CHAIR_VACANCIES } from '../../constants/ApiEndpoints';
import './ChairDashboard.css';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import { isChair } from '../../components/Util/RoleValidator/RoleValidator';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { COMMITTEE_MEMBER_ROLE } from '../../constants/Roles.js';
import useAuth from '../../hooks/useAuth';
import {
	normalizeStatus,
	compareStatus,
	formatStatusDisplay,
	isInvalidVacancyStatus,
	getInvalidStatusMessage,
	isVacancyRowInteractive,
} from './Utils/statusHelper.js';

const chairDashboard = () => {
	const noAssignedVacanciesMessage =
		'Sorry! You do not have any vacancies assigned to you in the selected tenant.';
	const liveOrFinalVacanciesMessage =
		"Sorry! Your assigned vacancy is still in 'Live' or 'Final' status and cannot be accessed from this dashboard yet.";
	const {
		auth: { tenants },
		currentTenant,
	} = useAuth();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		console.log('ChairDashboard mount/update', {
			currentTenant,
			tenantsLoaded: !!tenants,
		});

		if (currentTenant) {
			if (!tenants) {
				// Wait for tenants to load
				console.log('ChairDashboard waiting for tenants to load');
				return;
			}

			const hasChairAccess =
				isChair(currentTenant, tenants) ||
				validateRoleForCurrentTenant(
					COMMITTEE_MEMBER_ROLE,
					currentTenant,
					tenants
				);

			if (hasChairAccess) {
				(async () => {
					setHasError(false);
					setIsLoading(true);
					try {
						console.log('ChairDashboard fetching vacancies', {
							currentTenant,
						});
						const currentData = await axios.get(
							GET_COMMITTEE_CHAIR_VACANCIES + currentTenant
						);
						console.log('ChairDashboard API response', currentData?.data);

						const jsonData = currentData?.data?.result || {};
						console.log('ChairDashboard result payload', jsonData);

						// Validate that result has required list field
						if (!Array.isArray(jsonData?.list)) {
							throw new Error('API response missing required list field');
						}

						const vacancyList = jsonData.list;
						const filteredVacancies = vacancyList.filter(
							(vacancy) =>
								vacancy.status != 'live' && vacancy.status != 'final'
						);

						if (filteredVacancies.length === 0) {
							const hasOnlyLiveOrFinalVacancies =
								vacancyList.length > 0 &&
								vacancyList.every(
									(vacancy) =>
										vacancy.status == 'live' || vacancy.status == 'final'
								);
							message.destroy();
							message.error({
								duration: 3,
								content: hasOnlyLiveOrFinalVacancies
									? liveOrFinalVacanciesMessage
									: noAssignedVacanciesMessage,
							});
							setData([]);
							navigate('/');
							return;
						}

						setData(filteredVacancies);
					} catch (err) {
						console.error('ChairDashboard load failed', err);
						console.error('ChairDashboard error details:', {
							message: err?.message,
							stack: err?.stack,
							name: err?.name,
						});
						setHasError(true);
						notification.error({
							message: 'Sorry! There was an error retrieving vacancies.',
							description: (
								<>
									<p>
										Please refresh the page and try again or try logging out and
										logging back in. If the issue persists, contact the Help
										Desk by emailing{' '}
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
					content: noAssignedVacanciesMessage,
				});
				setIsLoading(false);
				navigate('/');
			}
		} else {
			message.destroy();
			message.error({
				duration: 3,
				content: 'Sorry! Please reselect your tenant and try again.',
			});
			setIsLoading(false);
			navigate('/');
		}
	}, [currentTenant, tenants]);

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
					rowClassName={(record) =>
						isInvalidVacancyStatus(record.status) ? 'disabled-vacancy-row' : ''
					}
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
		render: (title, record) => {
			const isInteractive = isVacancyRowInteractive(record.status);
			return isInteractive ? (
				<Link to={MANAGE_VACANCY + record.vacancy_id}>{title}</Link>
			) : (
				<span style={{ cursor: 'not-allowed', color: 'rgba(0,0,0,0.65)' }}>
					{title}
				</span>
			);
		},
	},
	{
		title: 'Applicants',
		dataIndex: 'applicants',
		key: 'applicants',
		render: (number, record) => {
			const isInteractive = isVacancyRowInteractive(record.status);
			const count = number ?? 0;
			const applicantText = count == 1 ? 'applicant' : 'applicants';
			const displayText = `${count} ${applicantText}`;

			return isInteractive ? (
				<Link
					key={record.vacancy_id}
					to={MANAGE_VACANCY + record.vacancy_id + '/applicants'}
				>
					{displayText}
				</Link>
			) : (
				<span style={{ cursor: 'not-allowed', color: 'rgba(0,0,0,0.65)' }}>
					{displayText}
				</span>
			);
		},
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
			const isInvalid = isInvalidVacancyStatus(status);
			const normalizedStatus = normalizeStatus(status);
			const displayStatus = formatStatusDisplay(normalizedStatus);

			if (isInvalid) {
				return (
					<span
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '6px',
						}}
					>
						{displayStatus}
						<Tooltip
							title={getInvalidStatusMessage()}
							trigger={['hover', 'focus', 'click']}
						>
							<ExclamationCircleOutlined
								style={{ color: '#d46b08', cursor: 'pointer' }}
								aria-label='Vacancy status issue'
							/>
						</Tooltip>
					</span>
				);
			}
			return displayStatus;
		},
	},
];

export default chairDashboard;
