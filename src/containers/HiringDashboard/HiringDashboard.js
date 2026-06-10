import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table, message } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import axios from 'axios';

import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { OWM_TEAM } from '../../constants/Roles';
import { VACANCY_COUNTS, DASHBOARD_VACANCIES } from '../../constants/ApiEndpoints';
import { MANAGE_VACANCY, VACANCY_DASHBOARD } from '../../constants/Routes';
import { transformDateToDisplay } from '../../components/Util/Date/Date';
import KpiCard from './KpiCard/KpiCard';
import './HiringDashboard.css';

// Map raw vacancy states to human-readable review stage labels
const getReviewStage = (state) => {
	switch (state) {
		case 'triage':
		case 'chair_triage':
			return 'Triaged';
		case 'individual_scoring_in_progress':
		case 'individual_scoring_complete':
			return 'Individual Scoring';
		case 'committee_review_in_progress':
		case 'committee_review_complete':
			return 'Committee Review';
		case 'voting_complete':
			return 'Voting Complete';
		default:
			return 'Triaged';
	}
};

const stageCssClass = (stage) => {
	switch (stage) {
		case 'Triaged': return 'StageTriaged';
		case 'Individual Scoring': return 'StageScoring';
		case 'Committee Review': return 'StageCommittee';
		case 'Voting Complete': return 'StageVoting';
		default: return 'StageDefault';
	}
};

const PIPELINE_STATES = [
	{ key: 'preflight', label: 'Pre-flight', color: '#722ed1' },
	{ key: 'live', label: 'Live', color: '#1890ff' },
	{ key: 'rolling', label: 'Rolling Close', color: '#13c2c2' },
	{ key: 'closed', label: 'Closed / In Review', color: '#d4380d' },
];

const APPLICATION_STATUS_STATES = [
	{ key: 'triage', label: 'Triage', color: '#d46b08' },
	{ key: 'scoring', label: 'Scoring', color: '#096dd9' },
	{ key: 'in_review', label: 'In Review', color: '#531dab' },
	{ key: 'review_complete', label: 'Review Complete', color: '#389e0d' },
	{ key: 'completed', label: 'Completed', color: '#13c2c2' },
];

const REFERENCE_STATES = [
	{ key: 'references_sent', label: 'Requests Sent', color: '#1890ff' },
	{ key: 'references_received', label: 'Refs Received', color: '#389e0d' },
	{ key: 'references_pending', label: 'Refs Pending', color: '#d46b08' },
	{ key: 'references_complete', label: 'All Refs In', color: '#13c2c2' },
];

const FUNNEL_STAGES = [
	{ label: 'Triaged', color: '#d46b08' },
	{ label: 'Individual Scoring', color: '#096dd9' },
	{ label: 'Committee Review', color: '#531dab' },
	{ label: 'Voting Complete', color: '#389e0d' },
];

const actionNeededColumns = [
	{
		title: 'Vacancy Title',
		dataIndex: 'title',
		render: (title, record) => (
			<Link to={MANAGE_VACANCY + record.sys_id}>{title}</Link>
		),
		sorter: (a, b) => a.title.localeCompare(b.title),
	},
	{
		title: 'Applicants',
		dataIndex: 'applicants',
		width: 110,
		sorter: (a, b) => a.applicants - b.applicants,
	},
	{
		title: 'Close Date',
		dataIndex: 'close_date',
		width: 130,
		render: (date) => (date ? transformDateToDisplay(date) : '—'),
		sorter: (a, b) => new Date(a.close_date) - new Date(b.close_date),
		defaultSortOrder: 'ascend',
	},
	{
		title: 'Review Stage',
		dataIndex: 'reviewStage',
		width: 180,
		render: (stage) => (
			<span className={`StageBadge ${stageCssClass(stage)}`}>{stage}</span>
		),
		filters: FUNNEL_STAGES.map((s) => ({ text: s.label, value: s.label })),
		onFilter: (value, record) => record.reviewStage === value,
	},
];

const hiringDashboard = () => {
	const history = useHistory();
	const {
		auth: { tenants },
		currentTenant,
	} = useAuth();

	// Widget 1 — pipeline counts
	const [pipelineCounts, setPipelineCounts] = useState({});
	const [pipelineLoading, setPipelineLoading] = useState(true);

	// Widget 2 — post-close review funnel counts derived from closed vacancies
	const [funnelCounts, setFunnelCounts] = useState({});

	// Widget 3 — action-needed table (closed vacancies not yet at voting complete)
	const [actionNeeded, setActionNeeded] = useState([]);
	const [closedLoading, setClosedLoading] = useState(true);

	// Widget 4 — application status counts
	const [appStatusCounts, setAppStatusCounts] = useState({});
	const [appStatusLoading, setAppStatusLoading] = useState(true);

	// Widget 5 — reference collection counts
	const [refCounts, setRefCounts] = useState({});
	const [refLoading, setRefLoading] = useState(true);

	const isManager = validateRoleForCurrentTenant(OWM_TEAM, currentTenant, tenants);

	useEffect(() => {
		if (!isManager) {
			message.destroy();
			message.error({
				duration: 3,
				content: 'Sorry! You do not have vacancy manager access in the selected tenant.',
			});
			history.push('/');
			return;
		}

		// Widget 1: fetch vacancy counts for each pipeline state
		setPipelineLoading(true);
		const countPromises = PIPELINE_STATES.map((s) =>
			axios
				.get(VACANCY_COUNTS + currentTenant + '?state=' + s.key)
				.then((res) => ({ key: s.key, count: res.data.result.count }))
				.catch(() => ({ key: s.key, count: '—' }))
		);

		Promise.all(countPromises).then((results) => {
			const counts = {};
			results.forEach(({ key, count }) => {
				counts[key] = count;
			});
			setPipelineCounts(counts);
			setPipelineLoading(false);
		});

		// Widgets 2 & 3: fetch closed vacancies list
		setClosedLoading(true);
		axios
			.get(DASHBOARD_VACANCIES + currentTenant + '?state=closed')
			.then((res) => {
				const vacancies = res.data.result || [];

				// Widget 2: group by review stage
				const stageMap = {};
				FUNNEL_STAGES.forEach((s) => {
					stageMap[s.label] = 0;
				});
				vacancies.forEach((v) => {
					const stage = getReviewStage(v.state);
					if (stageMap[stage] !== undefined) stageMap[stage]++;
				});
				setFunnelCounts(stageMap);

				// Widget 3: vacancies not yet at voting complete need attention
				const stalled = vacancies
					.filter((v) => v.state !== 'voting_complete')
					.map((v) => ({ ...v, reviewStage: getReviewStage(v.state) }));
				setActionNeeded(stalled);
			})
			.catch(() => {
				message.error('Sorry! An error occurred while loading dashboard data.');
			})
			.finally(() => {
				setClosedLoading(false);
			});

		// Widget 4: fetch application status counts
		setAppStatusLoading(true);
		const appStatusPromises = APPLICATION_STATUS_STATES.map((s) =>
			axios
				.get(VACANCY_COUNTS + currentTenant + '?state=' + s.key)
				.then((res) => ({ key: s.key, count: res.data.result.count }))
				.catch(() => ({ key: s.key, count: '—' }))
		);

		Promise.all(appStatusPromises).then((results) => {
			const counts = {};
			results.forEach(({ key, count }) => {
				counts[key] = count;
			});
			setAppStatusCounts(counts);
			setAppStatusLoading(false);
		});

		// Widget 5: fetch reference collection counts
		setRefLoading(true);
		const refPromises = REFERENCE_STATES.map((s) =>
			axios
				.get(VACANCY_COUNTS + currentTenant + '?state=' + s.key)
				.then((res) => ({ key: s.key, count: res.data.result.count }))
				.catch(() => ({ key: s.key, count: '—' }))
		);

		Promise.all(refPromises).then((results) => {
			const counts = {};
			results.forEach(({ key, count }) => {
				counts[key] = count;
			});
			setRefCounts(counts);
			setRefLoading(false);
		});
	}, [currentTenant, isManager, history]);

	return (
		<div className='HiringDashboard'>
			{/* Widget 1: Vacancy Pipeline Overview */}
			<div className='KpiSection'>
				<h2>📊 Vacancy Pipeline Overview</h2>
				<div className='KpiRow'>
					{PIPELINE_STATES.map((s) => (
						<KpiCard
							key={s.key}
							value={pipelineCounts[s.key]}
							label={s.label}
							loading={pipelineLoading}
							color={s.color}
						/>
					))}
				</div>
			</div>

			{/* Widget 2: Post-Close Review Funnel */}
			<div className='KpiSection'>
				<h2>🔄 Post-Close Review Funnel</h2>
				<div className='KpiRow'>
					{FUNNEL_STAGES.map((s) => (
						<KpiCard
							key={s.label}
							value={funnelCounts[s.label]}
							label={s.label}
							loading={closedLoading}
							color={s.color}
						/>
					))}
				</div>
			</div>

			{/* Widget 3: Action Needed — stalled vacancies */}
			<div className='KpiSection'>
				<h2>
					<WarningOutlined style={{ color: '#d46b08', marginRight: '8px' }} />
					Action Needed — Closed Vacancies Not Yet Voting Complete
				</h2>
				<div className='ActionNeededTable'>
					<Table
						rowKey='sys_id'
						dataSource={actionNeeded}
						columns={actionNeededColumns}
						loading={closedLoading}
						pagination={{ hideOnSinglePage: true, pageSize: 10 }}
						scroll={{ x: 'true' }}
						locale={{ emptyText: '✅ No vacancies require attention.' }}
					/>
				</div>
			</div>

			{/* Widget 4: Application Status */}
			<div className='KpiSection'>
				<h2>📋 Application Status</h2>
				<div className='KpiRow'>
					{APPLICATION_STATUS_STATES.map((s) => (
						<KpiCard
							key={s.key}
							value={appStatusCounts[s.key]}
							label={s.label}
							loading={appStatusLoading}
							color={s.color}
						/>
					))}
				</div>
			</div>

			{/* Widget 5: Reference Collection */}
			<div className='KpiSection'>
				<h2>📬 Reference Collection</h2>
				<div className='KpiRow'>
					{REFERENCE_STATES.map((s) => (
						<KpiCard
							key={s.key}
							value={refCounts[s.key]}
							label={s.label}
							loading={refLoading}
							color={s.color}
						/>
					))}
				</div>
			</div>

			<div style={{ marginTop: '8px' }}>
				<Link to={VACANCY_DASHBOARD}>← Back to Vacancy Dashboard</Link>
			</div>
		</div>
	);
};

export default hiringDashboard;
