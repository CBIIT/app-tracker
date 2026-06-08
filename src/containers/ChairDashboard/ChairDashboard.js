import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MANAGE_VACANCY } from '../../constants/Routes.js';
import { Table, message, notification, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { validateVacancyData } from './Utils/validateVacancyData.js';
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
	const history = useHistory();

	    useEffect(() => {
        // Stop immediately if no tenant is selected, notify the user, and go home.
        if (!currentTenant) {
            message.destroy();
            message.error({
                duration: 3,
                content: 'Sorry! Please reselect your tenant and try again.',
            });
            setIsLoading(false);
            history.push('/');
            return;
        }

        // Wait until tenant data has finished loading before checking access.
        if (!Array.isArray(tenants)) {
            return;
        }

        // Allow this dashboard only for users who are chair in this tenant
        // or who satisfy the fallback role check for this tenant.
        const hasChairAccess =
            isChair(currentTenant, tenants) ||
            validateRoleForCurrentTenant(
                COMMITTEE_MEMBER_ROLE,
                currentTenant,
                tenants
            );

        // If the user does not have access in the selected tenant, notify and redirect.
        if (!hasChairAccess) {
            message.destroy();
            message.error({
                duration: 3,
                content: noAssignedVacanciesMessage,
            });
            setIsLoading(false);
            history.push('/');
            return;
        }

        // Track whether this effect is still current so async work does not update stale state.
        let isMounted = true;

        (async () => {
            // Reset error state and show the loading spinner before fetching data.
            setHasError(false);
            setIsLoading(true);

            try {
                // Fetch the chair vacancies for the currently selected tenant.
                const currentData = await axios.get(
                    GET_COMMITTEE_CHAIR_VACANCIES + currentTenant
                );
                const jsonData = currentData.data.result;

                // Validate the API payload and normalize access to the vacancy list.
                const validateData = validateVacancyData(jsonData);
                const vacancyList = validateData?.list || [];

                // Remove vacancies that are still in live/final states because this dashboard
                // only shows vacancies that can be acted on here.
                const filteredVacancies = vacancyList.filter(
                    (vacancy) =>
                        vacancy.status != 'live' && vacancy.status != 'final'
                );

                // Stop if the component unmounted or the effect was replaced while waiting.
                if (!isMounted) {
                    return;
                }

                // If nothing remains after filtering, decide which user message to show,
                // clear data, and redirect away from the dashboard.
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
                    history.push('/');
                    return;
                }

                // Save the filtered vacancies so the table can render them.
                setData(filteredVacancies);
            } catch (err) {
                // Stop if the effect is no longer current before updating UI state.
                if (!isMounted) {
                    return;
                }

                // Show the fallback error UI and a notification if the request fails
                // or the response cannot be processed.
                setHasError(true);
                notification.error({
                    message: 'Sorry! There was an error retrieving vacancies.',
                    description: (
                        <>
                            <p>
                                Please refresh the page and try again or try logging out and
                                logging back in. If the issue persists, contact the Help Desk by
                                emailing{' '}
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
                // Turn off loading only if this effect instance is still active.
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();

        // Cleanup marks this effect instance as stale so late async completions
        // do not update state after unmount or dependency changes.
        return () => {
            isMounted = false;
        };
    }, [currentTenant, tenants, history]);

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
