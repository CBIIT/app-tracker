import { useState } from 'react';
import { Tabs, Card, Row, Col, Statistic, Spin, message, Tooltip, Button, Space, Table } from 'antd';
import {
	ReloadOutlined,
	FileExcelOutlined,
} from '@ant-design/icons';

import {
	useVacancyAnalytics,
	useApplicationAnalytics,
	useUserActivityReport,
	useCommitteePerformance,
	useComplianceReport,
	useSystemAuditLog,
} from '../../hooks/useAdminQueries';
import {
	VacancyFilterBuilder,
	ApplicationFilterBuilder,
	UserActivityFilterBuilder,
	CommitteeFilterBuilder,
	DATE_RANGE_PRESETS,
} from '../../utils/queryBuilder';
import {
	calculateKPIs,
	groupByField,
	convertToCSV,
	prepareTimeSeriesData,
} from '../../utils/reportTransformers';
import './AdminDashboard.css';

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState('1');
	const [filters, setFilters] = useState({});

	// Fetch all analytics data
	const vacancyAnalytics = useVacancyAnalytics(filters);
	const applicationAnalytics = useApplicationAnalytics(filters);
	const userActivity = useUserActivityReport(filters);
	const committeePerf = useCommitteePerformance(filters);
	const compliance = useComplianceReport(filters);
	const auditLogs = useSystemAuditLog(filters);

	const handleRefresh = () => {
		vacancyAnalytics.refetch(filters);
		applicationAnalytics.refetch(filters);
		userActivity.refetch(filters);
		committeePerf.refetch(filters);
		compliance.refetch(filters);
		auditLogs.refetch(filters);
		message.success('Data refreshed successfully');
	};

	const handleDownloadCSV = (data, filename = 'report.csv') => {
		// Handle case where data is an object and needs to be converted to array
		let dataArray = data;
		if (data && typeof data === 'object' && !Array.isArray(data)) {
			// If data is an object, try to convert it to array format
			dataArray = Object.keys(data).length > 0 ? [data] : [];
		}

		if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
			message.warning('No data to download');
			return;
		}

		const csv = convertToCSV(dataArray);
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		message.success('Report downloaded successfully');
	};

	const handleDateRangeChange = (preset) => {
		const vacancyFilter = new VacancyFilterBuilder().setDateRangePreset(preset);
		setFilters(vacancyFilter.build());
	};

	const renderLoadingOrError = (loading, error) => {
		if (loading) {
			return <Spin />;
		}
		if (error) {
			return <p style={{ color: 'red' }}>Error loading data. Please try again.</p>;
		}
		return null;
	};

	// Vacancy Analytics Tab
	const renderVacancyAnalytics = () => {
		const { loading, error, data } = vacancyAnalytics;
		const loadingOrError = renderLoadingOrError(loading, error);
		if (loadingOrError) return loadingOrError;

		const kpis = calculateKPIs({
			totalVacancies: data?.totalVacancies || 0,
			vacanciesFilled: data?.vacanciesFilled || 0,
			totalTimeToHire: data?.totalTimeToHire || 0,
		});

		return (
			<div>
				<Space style={{ marginBottom: '20px' }}>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
					>
						Refresh
					</Button>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownloadCSV(data, 'vacancy_analytics.csv')}
					>
						Export CSV
					</Button>
				</Space>

				<Row gutter={16} style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic title="Total Vacancies" value={data?.totalVacancies || 0} />
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic title="Filled Positions" value={data?.vacanciesFilled || 0} />
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Percentage of positions filled">
							<Statistic
								title="Fill Rate"
								value={Math.round(kpis.vacancyFillRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Average time to hire in days">
							<Statistic
								title="Avg Time-to-Hire"
								value={Math.round(kpis.averageTimeToHire)}
								suffix=" days"
							/>
						</Tooltip>
					</Col>
				</Row>

				<Card title="Vacancy Status Breakdown">
					{data?.statusBreakdown && (
						<div>
							{Object.entries(data.statusBreakdown).map(([status, count]) => (
								<div key={status} style={{ marginBottom: '10px' }}>
									<span>{status}: </span>
									<strong>{count}</strong>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		);
	};

	// Application Analytics Tab
	const renderApplicationAnalytics = () => {
		const { loading, error, data } = applicationAnalytics;
		const loadingOrError = renderLoadingOrError(loading, error);
		if (loadingOrError) return loadingOrError;

		const kpis = calculateKPIs({
			totalApplications: data?.totalApplications || 0,
			applicationsApproved: data?.applicationsApproved || 0,
			applicationsWithdrawn: data?.applicationsWithdrawn || 0,
		});

		return (
			<div>
				<Space style={{ marginBottom: '20px' }}>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
					>
						Refresh
					</Button>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownloadCSV(data, 'application_analytics.csv')}
					>
						Export CSV
					</Button>
				</Space>

				<Row gutter={16} style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic title="Total Applications" value={data?.totalApplications || 0} />
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Approved applications percentage">
							<Statistic
								title="Approval Rate"
								value={Math.round(kpis.applicationApprovalRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Withdrawn applications percentage">
							<Statistic
								title="Withdrawal Rate"
								value={Math.round(kpis.applicationWithdrawalRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic
							title="Avg Apps/Vacancy"
							value={Math.round(kpis.averageApplicationsPerVacancy * 100) / 100}
						/>
					</Col>
				</Row>

				<Card title="Application Pipeline">
					{data?.pipelineStages && (
						<div>
							{Object.entries(data.pipelineStages).map(([stage, count]) => (
								<div key={stage} style={{ marginBottom: '10px' }}>
									<span>{stage}: </span>
									<strong>{count}</strong>
								</div>
							))}
						</div>
					)}
				</Card>

				<Card title="Application Timeline" style={{ marginTop: '20px' }}>
					{data?.applicationTimeline && data.applicationTimeline.length > 0 ? (
						<Table
							dataSource={data.applicationTimeline.map((item, index) => ({
								...item,
								key: item.month || index,
							}))}
							columns={[
								{
									title: 'Month',
									dataIndex: 'month',
									key: 'month',
								},
								{
									title: 'Submitted',
									dataIndex: 'submitted',
									key: 'submitted',
									align: 'center',
								},
								{
									title: 'Approved',
									dataIndex: 'approved',
									key: 'approved',
									align: 'center',
								},
								{
									title: 'Rejected',
									dataIndex: 'rejected',
									key: 'rejected',
									align: 'center',
								},
							]}
							pagination={false}
							size="small"
						/>
					) : (
						<p>No timeline data available</p>
					)}
				</Card>
			</div>
		);
	};

	// User Activity Tab
	const renderUserActivity = () => {
		const { loading, error, data } = userActivity;
		const loadingOrError = renderLoadingOrError(loading, error);
		if (loadingOrError) return loadingOrError;

		return (
			<div>
				<Space style={{ marginBottom: '20px' }}>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
					>
						Refresh
					</Button>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownloadCSV(data, 'user_activity.csv')}
					>
						Export CSV
					</Button>
				</Space>

				<Row gutter={16} style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic title="Active Users" value={data?.activeUsers || 0} />
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic title="Total Users" value={data?.totalUsers || 0} />
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic
							title="Activity Rate"
							value={
								data?.totalUsers
									? Math.round((data.activeUsers / data.totalUsers) * 100 * 100) / 100
									: 0
							}
							suffix="%"
						/>
					</Col>
				</Row>

				<Card title="User Roles">
					{data?.roleDistribution && (
						<div>
							{Object.entries(data.roleDistribution).map(([role, count]) => (
								<div key={role} style={{ marginBottom: '10px' }}>
									<span>{role}: </span>
									<strong>{count}</strong>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		);
	};

	// Committee Performance Tab
	const renderCommitteePerformance = () => {
		const { loading, error, data } = committeePerf;
		const loadingOrError = renderLoadingOrError(loading, error);
		if (loadingOrError) return loadingOrError;

		const kpis = calculateKPIs({
			committeeParticipating: data?.committeeParticipating || 0,
			totalCommittee: data?.totalCommittee || 0,
			totalReviewTime: data?.totalReviewTime || 0,
			reviewsCompleted: data?.reviewsCompleted || 0,
		});

		return (
			<div>
				<Space style={{ marginBottom: '20px' }}>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
					>
						Refresh
					</Button>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownloadCSV(data, 'committee_performance.csv')}
					>
						Export CSV
					</Button>
				</Space>

				<Row gutter={16} style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Percentage of committee members participating">
							<Statistic
								title="Participation Rate"
								value={Math.round(kpis.committeeParticipationRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Statistic
							title="Reviews Completed"
							value={data?.reviewsCompleted || 0}
						/>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Average review time in hours">
							<Statistic
								title="Avg Review Time"
								value={Math.round(kpis.averageReviewTime * 100) / 100}
								suffix=" hrs"
							/>
						</Tooltip>
					</Col>
				</Row>

				<Card title="Committee Member Performance">
					{data?.memberScores && (
						<div>
							{data.memberScores.slice(0, 10).map((member) => (
								<div key={member.id} style={{ marginBottom: '10px' }}>
									<span>{member.name}: </span>
									<strong>{member.avgScore || 'N/A'}</strong>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		);
	};

	// Compliance Tab
	const renderCompliance = () => {
		const { loading, error, data } = compliance;
		const loadingOrError = renderLoadingOrError(loading, error);
		if (loadingOrError) return loadingOrError;

		const kpis = calculateKPIs({
			documentsSubmitted: data?.documentsSubmitted || 0,
			documentsRequired: data?.documentsRequired || 0,
			referencesSubmitted: data?.referencesSubmitted || 0,
			referencesRequested: data?.referencesRequested || 0,
			onTimeCompletions: data?.onTimeCompletions || 0,
			totalCompletions: data?.totalCompletions || 0,
		});

		return (
			<div>
				<Space style={{ marginBottom: '20px' }}>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
					>
						Refresh
					</Button>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownloadCSV(data, 'compliance_report.csv')}
					>
						Export CSV
					</Button>
				</Space>

				<Row gutter={16} style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="Required documents submitted">
							<Statistic
								title="Document Submission"
								value={Math.round(kpis.documentSubmissionRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="References submitted">
							<Statistic
								title="Reference Submission"
								value={Math.round(kpis.referenceSubmissionRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6}>
						<Tooltip title="On-time completions">
							<Statistic
								title="On-Time Completion"
								value={Math.round(kpis.onTimeCompletionRate * 100) / 100}
								suffix="%"
							/>
						</Tooltip>
					</Col>
				</Row>

				<Card title="Compliance Status">
					{data?.complianceStatus && (
						<div>
							{Object.entries(data.complianceStatus).map(([status, count]) => (
								<div key={status} style={{ marginBottom: '10px' }}>
									<span>{status}: </span>
									<strong>{count}</strong>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		);
	};

	// System Audit Tab
	const renderSystemAudit = () => {
		const { loading, error, data } = auditLogs;
		const loadingOrError = renderLoadingOrError(loading, error);
		if (loadingOrError) return loadingOrError;

		return (
			<div>
				<Space style={{ marginBottom: '20px' }}>
					<Button
						type="primary"
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
					>
						Refresh
					</Button>
					<Button
						icon={<FileExcelOutlined />}
						onClick={() => handleDownloadCSV(data, 'system_audit.csv')}
					>
						Export CSV
					</Button>
				</Space>

				<Card title="Recent Audit Events">
					{data && data.length > 0 ? (
						<div style={{ maxHeight: '500px', overflowY: 'auto' }}>
							{data.slice(0, 50).map((event, index) => (
								<div key={index} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
									<div>
										<strong>User:</strong> {event.user_id}
									</div>
									<div>
										<strong>Action:</strong> {event.action}
									</div>
									<div>
										<strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}
									</div>
								</div>
							))}
						</div>
					) : (
						<p>No audit events found</p>
					)}
				</Card>
			</div>
		);
	};

	return (
		<div className="admin-dashboard">
			<h1>Admin Dashboard</h1>

			<Space style={{ marginBottom: '20px' }}>
				<Button onClick={() => handleDateRangeChange(DATE_RANGE_PRESETS.TODAY)}>
					Today
				</Button>
				<Button onClick={() => handleDateRangeChange(DATE_RANGE_PRESETS.LAST_7_DAYS)}>
					Last 7 Days
				</Button>
				<Button onClick={() => handleDateRangeChange(DATE_RANGE_PRESETS.LAST_30_DAYS)}>
					Last 30 Days
				</Button>
				<Button onClick={() => handleDateRangeChange(DATE_RANGE_PRESETS.THIS_QUARTER)}>
					This Quarter
				</Button>
			</Space>

			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<Tabs.TabPane tab="Vacancy Analytics" key="1">
					{renderVacancyAnalytics()}
				</Tabs.TabPane>
				<Tabs.TabPane tab="Application Analytics" key="2">
					{renderApplicationAnalytics()}
				</Tabs.TabPane>
				<Tabs.TabPane tab="User Activity" key="3">
					{renderUserActivity()}
				</Tabs.TabPane>
				<Tabs.TabPane tab="Committee Performance" key="4">
					{renderCommitteePerformance()}
				</Tabs.TabPane>
				<Tabs.TabPane tab="Compliance" key="5">
					{renderCompliance()}
				</Tabs.TabPane>
				<Tabs.TabPane tab="System Audit" key="6">
					{renderSystemAudit()}
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default AdminDashboard;
