import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table, Select, message } from 'antd';
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { OWM_TEAM } from '../../constants/Roles';
import { VACANCY_COUNTS, DASHBOARD_VACANCIES, HIRED_APPLICANTS_COUNT } from '../../constants/ApiEndpoints';
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

// Colors for the vacancy-by-location pie chart
const LOCATION_COLORS = [
	'#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
	'#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#2f54eb',
];

// Demo stub data for the vacancy-by-location widget
const STUB_VACANCY_LOCATIONS = [
	{ name: 'Bethesda, MD',     value: 18 },
	{ name: 'Rockville, MD',    value: 9  },
	{ name: 'Frederick, MD',    value: 5  },
	{ name: 'Remote',           value: 7  },
	{ name: 'Research Triangle Park, NC', value: 3 },
	{ name: 'Other',            value: 2  },
];

// ---------------------------------------------------------------------------
// Demo stub data for the New User Profiles widget
// ---------------------------------------------------------------------------
const STALE_LOGIN_DAYS = 90;

const isProfileStale = (last_login) => {
	const cutoff = Date.now() - STALE_LOGIN_DAYS * 24 * 60 * 60 * 1000;
	return new Date(last_login).getTime() < cutoff;
};

const STUB_PROFILES = [
	{ key: '1',  name: 'Alice Johnson',  email: 'alice.johnson@nih.gov',  last_login: '2026-06-10', applications: 3,  marked_for_deletion: false },
	{ key: '2',  name: 'Bob Martinez',   email: 'bob.martinez@nih.gov',   last_login: '2026-06-05', applications: 7,  marked_for_deletion: false },
	{ key: '3',  name: 'Carol White',    email: 'carol.white@nih.gov',    last_login: '2026-05-25', applications: 1,  marked_for_deletion: false },
	{ key: '4',  name: 'David Lee',      email: 'david.lee@nih.gov',      last_login: '2026-04-30', applications: 5,  marked_for_deletion: false },
	{ key: '5',  name: 'Eva Nguyen',     email: 'eva.nguyen@nih.gov',     last_login: '2026-04-15', applications: 2,  marked_for_deletion: false },
	{ key: '6',  name: 'Frank Brown',    email: 'frank.brown@nih.gov',    last_login: '2026-03-20', applications: 9,  marked_for_deletion: false },
	{ key: '7',  name: 'Grace Kim',      email: 'grace.kim@nih.gov',      last_login: '2026-03-05', applications: 4,  marked_for_deletion: true  },
	{ key: '8',  name: 'Henry Davis',    email: 'henry.davis@nih.gov',    last_login: '2026-02-01', applications: 6,  marked_for_deletion: true  },
	{ key: '9',  name: 'Isabel Clark',   email: 'isabel.clark@nih.gov',   last_login: '2026-01-10', applications: 0,  marked_for_deletion: true  },
	{ key: '10', name: 'James Wilson',   email: 'james.wilson@nih.gov',   last_login: '2025-12-15', applications: 8,  marked_for_deletion: true  },
	{ key: '11', name: 'Karen Adams',    email: 'karen.adams@nih.gov',    last_login: '2025-10-22', applications: 2,  marked_for_deletion: true  },
	{ key: '12', name: 'Luis Rivera',    email: 'luis.rivera@nih.gov',    last_login: '2025-07-08', applications: 11, marked_for_deletion: true  },
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
	{
		title: 'Marked for Deletion',
		dataIndex: 'marked_for_deletion',
		width: 175,
		render: (val) =>
			val ? (
				<span className='DeletionBadgeYes'>Yes</span>
			) : (
				<span className='DeletionBadgeNo'>No</span>
			),
		filters: [
			{ text: 'Yes', value: true },
			{ text: 'No', value: false },
		],
		onFilter: (value, record) => record.marked_for_deletion === value,
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

	// Widget 6 — hired applicants in last 90 days
	const [hiredCount, setHiredCount] = useState(null);
	const [hiredLoading, setHiredLoading] = useState(true);

	// Widget 7 — vacancies by location
	const [locationData, setLocationData] = useState([]);
	const [locationLoading, setLocationLoading] = useState(true);

	const isManager = validateRoleForCurrentTenant(OWM_TEAM, currentTenant, tenants);
	const pipelineCountsData = PIPELINE_STATES.map((state) => {
		const numericValue = Number(pipelineCounts[state.key]) || 0;
		return {
			...state,
			value: numericValue,
		};
	});
	const pipelineMaxCount = Math.max(...pipelineCountsData.map((item) => item.value), 0);
	const funnelCountsData = FUNNEL_STAGES.map((stage) => ({
		...stage,
		value: Number(funnelCounts[stage.label]) || 0,
	}));
	const funnelMaxCount = Math.max(...funnelCountsData.map((item) => item.value), 0);

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

			// Widget 6: fetch hired applicants count for the last 90 days
		setHiredLoading(true);
		axios
			.get(HIRED_APPLICANTS_COUNT + currentTenant + '?days=90')
			.then((res) => {
				setHiredCount(Number(res.data.result.count) || 0);
			})
			.catch(() => {
				setHiredCount('—');
			})
			.finally(() => {
				setHiredLoading(false);
			});

		// Widget 7: fetch all vacancies and group by location
		setLocationLoading(true);
		axios
			.get(DASHBOARD_VACANCIES + currentTenant)
			.then((res) => {
				const vacancies = res.data.result || [];
				const countMap = {};
				vacancies.forEach((v) => {
					const loc = (v.location && v.location.trim()) ? v.location.trim() : 'Unknown';
					countMap[loc] = (countMap[loc] || 0) + 1;
				});
				const data = Object.entries(countMap)
					.map(([name, value]) => ({ name, value }))
					.sort((a, b) => b.value - a.value);
				setLocationData(data.length > 0 ? data : STUB_VACANCY_LOCATIONS);
			})
			.catch(() => {
				setLocationData(STUB_VACANCY_LOCATIONS);
			})
			.finally(() => {
				setLocationLoading(false);
			});
	}, [currentTenant, isManager, history]);

	return (
		<div className='HiringDashboard'>
			{/* Widget 6: Hired Applicants KPI */}
			<div className='KpiRow KpiRowTop'>
				<KpiCard
					value={hiredCount}
					label='Hired Applicants — Last 90 Days'
					loading={hiredLoading}
					color='#389e0d'
				/>
			</div>

			<div className='ChartColumns'>
				{/* Widget 1: Vacancy Pipeline Overview */}
				<div className='KpiSection CompactChartCard'>
					<h2>📊 Vacancy Pipeline Overview</h2>
					<div className='PipelineBarChart'>
						{pipelineCountsData.map((state) => {
							const barWidth = pipelineMaxCount > 0 ? `${(state.value / pipelineMaxCount) * 100}%` : '0%';

							return (
								<div className='PipelineBarRow' key={state.key}>
									<div className='PipelineBarLabel'>{state.label}</div>
									<div className='PipelineBarTrack'>
										{pipelineLoading ? (
											<div className='PipelineBarLoading'>
												<LoadingOutlined spin />
											</div>
										) : (
											<div className='PipelineBarFill' style={{ width: barWidth, backgroundColor: state.color }} />
										)}
									</div>
									<div className='PipelineBarValue'>{pipelineLoading ? '—' : state.value}</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Widget 2: Post-Close Review Funnel */}
				<div className='KpiSection CompactChartCard'>
					<h2>🔄 Post-Close Review Funnel</h2>
					<div className='PipelineBarChart'>
						{funnelCountsData.map((stage) => {
							const barWidth = funnelMaxCount > 0 ? `${(stage.value / funnelMaxCount) * 100}%` : '0%';

							return (
								<div className='PipelineBarRow' key={stage.label}>
									<div className='PipelineBarLabel'>{stage.label}</div>
									<div className='PipelineBarTrack'>
										{closedLoading ? (
											<div className='PipelineBarLoading'>
												<LoadingOutlined spin />
											</div>
										) : (
											<div className='PipelineBarFill' style={{ width: barWidth, backgroundColor: stage.color }} />
										)}
									</div>
									<div className='PipelineBarValue'>{closedLoading ? '—' : stage.value}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Widget 7: Vacancies by Location */}
			<div className='KpiSection VacancyLocationSection'>
				<h2>📍 Vacancies by Location</h2>
				<div className='VacancyLocationChart'>
					{locationLoading ? (
						<div className='VacancyLocationLoading'>
							<LoadingOutlined style={{ fontSize: '32px' }} spin />
						</div>
					) : (
						<ResponsiveContainer width='100%' height={300}>
							<PieChart>
								<Pie
									data={locationData}
									dataKey='value'
									nameKey='name'
									cx='50%'
									cy='50%'
									outerRadius={110}
									label={({ name, percent }) =>
										`${name} (${(percent * 100).toFixed(0)}%)`
									}
									labelLine={true}
								>
									{locationData.map((entry, index) => (
										<Cell
											key={entry.name}
											fill={LOCATION_COLORS[index % LOCATION_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip formatter={(value, name) => [value, name]} />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					)}
				</div>
			</div>

			<div className='DataSectionGrid'>
				{/* Widget 3: Action Needed — stalled vacancies */}
				<div className='KpiSection CompactDataSection'>
					<h2>
						<WarningOutlined style={{ color: '#d46b08', marginRight: '8px' }} />
						Action Needed — Closed Vacancies Not Yet Voting Complete
					</h2>
					<div className='ActionNeededTable'>
						<Table
							rowKey='sys_id'
							size='small'
							dataSource={actionNeeded}
							columns={actionNeededColumns}
							loading={closedLoading}
							pagination={{ hideOnSinglePage: true, pageSize: 8 }}
							scroll={{ x: true }}
							locale={{ emptyText: '✅ No vacancies require attention.' }}
						/>
					</div>
				</div>

				{/* Widget 4: Missing References */}
				<div className='KpiSection CompactDataSection'>
					<h2>📬 Missing References — Closed Vacancies</h2>
					<MissingReferencesTable vacancies={closedVacancies} compact />
				</div>

				{/* Widget 5: New User Profiles */}
				<div className='KpiSection CompactDataSection DataSectionWide'>
					<div className='KpiSectionHeader'>
						<h2>👤 New User Profiles Created</h2>
						<Select
							value={profileDays}
							onChange={setProfileDays}
							size='small'
							style={{ width: 150 }}
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
							size='small'
							dataSource={STUB_PROFILES.filter((p) => {
								const cutoff = Date.now() - profileDays * 24 * 60 * 60 * 1000;
								return new Date(p.last_login).getTime() >= cutoff;
							})}
							columns={profileColumns}
							rowClassName={(record) => isProfileStale(record.last_login) ? 'ProfileRowStale' : ''}
							pagination={{ hideOnSinglePage: true, pageSize: 8 }}
							scroll={{ x: true }}
							locale={{ emptyText: 'No profiles found in the selected period.' }}
						/>
					</div>
				</div>
			</div>

			<div style={{ marginTop: '8px' }}>
				<Link to={VACANCY_DASHBOARD}>← Back to Vacancy Dashboard</Link>
			</div>
		</div>
	);
};

export default hiringDashboard;
