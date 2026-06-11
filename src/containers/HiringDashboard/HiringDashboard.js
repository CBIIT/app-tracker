import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table, Select, message } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import axios from 'axios';

import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { OWM_TEAM } from '../../constants/Roles';
import { VACANCY_COUNTS, DASHBOARD_VACANCIES } from '../../constants/ApiEndpoints';
import { MANAGE_VACANCY, VACANCY_DASHBOARD } from '../../constants/Routes';
import { transformDateToDisplay } from '../../components/Util/Date/Date';
import KpiCard from './KpiCard/KpiCard';
import MissingReferencesTable from './MissingReferencesTable/MissingReferencesTable';
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

const FUNNEL_STAGES = [
	{ label: 'Triaged', color: '#d46b08' },
	{ label: 'Individual Scoring', color: '#096dd9' },
	{ label: 'Committee Review', color: '#531dab' },
	{ label: 'Voting Complete', color: '#389e0d' },
];

// ---------------------------------------------------------------------------
// Demo stub data for the New User Profiles widget
// ---------------------------------------------------------------------------
const STUB_PROFILES = [
	{ key: '1',  name: 'Alice Johnson',  email: 'alice.johnson@nih.gov',  last_login: '2026-06-10', applications: 3  },
	{ key: '2',  name: 'Bob Martinez',   email: 'bob.martinez@nih.gov',   last_login: '2026-06-05', applications: 7  },
	{ key: '3',  name: 'Carol White',    email: 'carol.white@nih.gov',    last_login: '2026-05-25', applications: 1  },
	{ key: '4',  name: 'David Lee',      email: 'david.lee@nih.gov',      last_login: '2026-04-30', applications: 5  },
	{ key: '5',  name: 'Eva Nguyen',     email: 'eva.nguyen@nih.gov',     last_login: '2026-04-15', applications: 2  },
	{ key: '6',  name: 'Frank Brown',    email: 'frank.brown@nih.gov',    last_login: '2026-03-20', applications: 9  },
	{ key: '7',  name: 'Grace Kim',      email: 'grace.kim@nih.gov',      last_login: '2026-03-05', applications: 4  },
	{ key: '8',  name: 'Henry Davis',    email: 'henry.davis@nih.gov',    last_login: '2026-02-01', applications: 6  },
	{ key: '9',  name: 'Isabel Clark',   email: 'isabel.clark@nih.gov',   last_login: '2026-01-10', applications: 0  },
	{ key: '10', name: 'James Wilson',   email: 'james.wilson@nih.gov',   last_login: '2025-12-15', applications: 8  },
	{ key: '11', name: 'Karen Adams',    email: 'karen.adams@nih.gov',    last_login: '2025-10-22', applications: 2  },
	{ key: '12', name: 'Luis Rivera',    email: 'luis.rivera@nih.gov',    last_login: '2025-07-08', applications: 11 },
];

const profileColumns = [
	{
		title: 'Name',
		dataIndex: 'name',
		sorter: (a, b) => a.name.localeCompare(b.name),
	},
	{
		title: 'Email',
		dataIndex: 'email',
	},
	{
		title: 'Last Logged In',
		dataIndex: 'last_login',
		width: 160,
		render: (date) => transformDateToDisplay(date),
		sorter: (a, b) => new Date(a.last_login) - new Date(b.last_login),
		defaultSortOrder: 'descend',
	},
	{
		title: 'Number of Applications',
		dataIndex: 'applications',
		width: 210,
		sorter: (a, b) => a.applications - b.applications,
	},
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

	// Widget 4 — full closed-vacancy list (needed by MissingReferencesTable)
	const [closedVacancies, setClosedVacancies] = useState([]);

	// Widget 5 — new user profiles (demo stub data; no API call needed)
	const [profileDays, setProfileDays] = useState(365);

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

				// Widget 4: all closed vacancies for missing-references lookup
				setClosedVacancies(vacancies);
			})
			.catch(() => {
				message.error('Sorry! An error occurred while loading dashboard data.');
			})
			.finally(() => {
				setClosedLoading(false);
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

			{/* Widget 4: Missing References */}
			<div className='KpiSection'>
				<h2>📬 Missing References — Closed Vacancies</h2>
				<MissingReferencesTable vacancies={closedVacancies} />
			</div>

			{/* Widget 5: New User Profiles */}
			<div className='KpiSection'>
				<div className='KpiSectionHeader'>
					<h2>👤 New User Profiles Created</h2>
					<Select
						value={profileDays}
						onChange={setProfileDays}
						style={{ width: 160 }}
						options={[
							{ value: 30, label: 'Last 30 days' },
							{ value: 60, label: 'Last 60 days' },
							{ value: 90, label: 'Last 90 days' },
							{ value: 365, label: 'Last 1 year' },
						]}
					/>
				</div>
				<div className='ActionNeededTable'>
					<Table
						rowKey='key'
						dataSource={STUB_PROFILES.filter((p) => {
							const cutoff = Date.now() - profileDays * 24 * 60 * 60 * 1000;
							return new Date(p.last_login).getTime() >= cutoff;
						})}
						columns={profileColumns}
						pagination={{ hideOnSinglePage: true, pageSize: 10 }}
						locale={{ emptyText: 'No profiles found in the selected period.' }}
					/>
				</div>
			</div>

			<div style={{ marginTop: '8px' }}>
				<Link to={VACANCY_DASHBOARD}>← Back to Vacancy Dashboard</Link>
			</div>
		</div>
	);
};

export default hiringDashboard;
