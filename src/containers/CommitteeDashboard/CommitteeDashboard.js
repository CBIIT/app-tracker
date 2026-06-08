import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { MANAGE_VACANCY, EXE_SEC_DASHBOARD } from '../../constants/Routes.js';
import { GET_COMMITTEE_MEMBER_VIEW } from '../../constants/ApiEndpoints';
import {
	Table,
	ConfigProvider,
	Empty,
	message,
	notification,
	Tooltip,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
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
	isInvalidVacancyStatus,
	getInvalidStatusMessage,
	isVacancyRowInteractive,
} from '../ChairDashboard/Utils/statusHelper.js';

const renderDecision = (text) =>
	text == 'Pending' ? (
		<span style={{ color: 'rgba(0,0,0,0.65)', textTransform: 'capitalize' }}>
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

        // Wait until auth data has loaded before checking roles or reading user fields.
        if (!user || !Array.isArray(tenants)) {
            return;
        }

        // Allow this dashboard only for committee members in the selected tenant
        // or executive secretaries in the selected tenant.
        const hasCommitteeAccess =
            validateRoleForCurrentTenant(
                COMMITTEE_MEMBER_ROLE,
                currentTenant,
                tenants
            ) ||
            isExecSec(currentTenant, tenants);

        // If the user does not have access in the selected tenant, notify and redirect.
        if (!hasCommitteeAccess) {
            message.destroy();
            message.error({
                duration: 3,
                content:
                    'Sorry! You do not have committee member access in the selected tenant.',
            });
            setIsLoading(false);
            history.push('/');
            return;
        }

        // Track whether this effect is still current so async work does not update stale state.
        let isMounted = true;

        (async () => {
            // Reset error state and show loading before fetching vacancy data.
            setHasError(false);
            setIsLoading(true);

            try {
                // Read the current user's read-only flag once auth is available.
                setreadOnly(!!user.isReadOnlyUser);

                // Fetch the committee vacancy view for the selected tenant.
                const url = GET_COMMITTEE_MEMBER_VIEW + currentTenant;
                const currentData = await axios.get(url);
                const jsonData = currentData.data.result;

                // Validate the API payload and normalize access to the vacancy list.
                const validatedData = validateVacancyData(jsonData);

                // On the executive secretary route, only keep executive secretary rows.
                // On the normal committee dashboard route, use the full list.
                const committeeMemberData =
                    location.pathname === EXE_SEC_DASHBOARD
                        ? validatedData?.list.filter(
                                (vacancy) => vacancy.user_role === COMMITTEE_EXEC_SEC
                          )
                        : validatedData?.list;

                // Stop if the component unmounted or the effect was replaced while waiting.
                if (!isMounted) {
                    return;
                }

                // Save the rows so the table can render them.
                setData(committeeMemberData);
            } catch (err) {
                // Stop if the effect is no longer current before updating UI state.
                if (!isMounted) {
                    return;
                }

                // Show the fallback error UI and notification if the request fails
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
    }, [currentTenant, user, tenants, location.pathname, history]);

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
			<div className='CommitteeDashboard'>
				<ConfigProvider renderEmpty={customizeRenderEmpty}>
					<Table
						className='CommitteeTable'
						pagination={{ hideOnSinglePage: true }}
						rowKey={(record) => record.vacancy_id}
						dataSource={data}
						columns={readOnly ? committeeColumns.slice(0, 3) : committeeColumns}
						rowClassName={(record) =>
							isInvalidVacancyStatus(record.status)
								? 'disabled-vacancy-row'
								: ''
						}
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
