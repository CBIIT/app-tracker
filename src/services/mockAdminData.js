/**
 * Mock Admin Data
 * Provides dummy data for demo and testing purposes
 */

export const mockVacancyStats = {
	totalVacancies: 24,
	vacanciesFilled: 8,
	vacanciesOpen: 16,
	vacanciesByStatus: {
		open: 16,
		in_progress: 5,
		closed: 3,
	},
	statusBreakdown: {
		open: 16,
		in_progress: 5,
		closed: 3,
	},
	averageTimeToHire: 47,
	vacancyTimeline: [
		{ month: 'Jan', created: 3, filled: 1 },
		{ month: 'Feb', created: 4, filled: 2 },
		{ month: 'Mar', created: 5, filled: 1 },
		{ month: 'Apr', created: 6, filled: 2 },
		{ month: 'May', created: 3, filled: 1 },
		{ month: 'Jun', created: 3, filled: 1 },
	],
	topPositions: [
		{ position: 'Software Developer', count: 4, filled: 2 },
		{ position: 'Data Scientist', count: 3, filled: 1 },
		{ position: 'Project Manager', count: 3, filled: 0 },
		{ position: 'Research Analyst', count: 2, filled: 1 },
		{ position: 'Grant Administrator', count: 2, filled: 1 },
	],
};

export const mockApplicationStats = {
	totalApplications: 487,
	applicationsByStatus: {
		submitted: 145,
		under_review: 98,
		approved: 156,
		rejected: 65,
		withdrawn: 23,
	},
	approvalRate: 32,
	averageReviewTime: 8,
	pipelineStages: {
		submitted: 145,
		reviewed: 98,
		approved: 156,
		rejected: 65,
		withdrawn: 23,
	},
	applicationTimeline: [
		{ month: 'Jan', submitted: 45, approved: 12, rejected: 8 },
		{ month: 'Feb', submitted: 52, approved: 18, rejected: 9 },
		{ month: 'Mar', submitted: 48, approved: 14, rejected: 7 },
		{ month: 'Apr', submitted: 61, approved: 22, rejected: 12 },
		{ month: 'May', submitted: 55, approved: 19, rejected: 11 },
		{ month: 'Jun', submitted: 56, approved: 21, rejected: 13 },
	],
	topVacancies: [
		{ vacancyId: 'VAC001', position: 'Software Developer', applications: 52, approved: 8 },
		{ vacancyId: 'VAC002', position: 'Data Scientist', applications: 38, approved: 5 },
		{ vacancyId: 'VAC003', position: 'Project Manager', applications: 31, approved: 4 },
		{ vacancyId: 'VAC004', position: 'Research Analyst', applications: 28, approved: 3 },
		{ vacancyId: 'VAC005', position: 'Grant Administrator', applications: 24, approved: 3 },
	],
};

export const mockUserActivity = {
	activeUsers: 234,
	totalUsers: 456,
	activeUsersLastWeek: 189,
	averageSessionDuration: 28,
	roleDistribution: {
		admin: 5,
		manager: 12,
		committee_member: 89,
		chair: 18,
		applicant: 332,
	},
	activityByRole: [
		{ role: 'Committee Member', users: 89, activeThisWeek: 67, avgSessions: 3.2 },
		{ role: 'Applicant', users: 332, activeThisWeek: 98, avgSessions: 1.5 },
		{ role: 'Chair', users: 18, activeThisWeek: 16, avgSessions: 5.8 },
		{ role: 'Manager', users: 12, activeThisWeek: 11, avgSessions: 6.2 },
		{ role: 'Admin', users: 5, activeThisWeek: 5, avgSessions: 7.4 },
	],
	userActivityTrend: [
		{ day: 'Mon', sessions: 234, newUsers: 8 },
		{ day: 'Tue', sessions: 256, newUsers: 12 },
		{ day: 'Wed', sessions: 289, newUsers: 15 },
		{ day: 'Thu', sessions: 267, newUsers: 10 },
		{ day: 'Fri', sessions: 245, newUsers: 9 },
		{ day: 'Sat', sessions: 78, newUsers: 2 },
		{ day: 'Sun', sessions: 65, newUsers: 1 },
	],
};

export const mockCommitteePerformance = {
	totalCommittees: 12,
	activeCommittees: 10,
	averageReviewTime: 6.5,
	committeeParticipationRate: 85,
	averageScoreDeviation: 1.2,
	committeeSummary: [
		{ committeeId: 'COMM001', name: 'Research Committee', reviews: 45, avgTime: 6.2, participationRate: 92 },
		{ committeeId: 'COMM002', name: 'Finance Committee', reviews: 32, avgTime: 7.1, participationRate: 88 },
		{ committeeId: 'COMM003', name: 'Operations Committee', reviews: 28, avgTime: 5.8, participationRate: 82 },
		{ committeeId: 'COMM004', name: 'Strategic Committee', reviews: 19, avgTime: 8.5, participationRate: 79 },
		{ committeeId: 'COMM005', name: 'HR Committee', reviews: 23, avgTime: 6.9, participationRate: 87 },
	],
	memberScores: [
		{ id: 'MEM001', name: 'Dr. Sarah Johnson', avgScore: 92.5 },
		{ id: 'MEM002', name: 'Prof. Michael Chen', avgScore: 88.3 },
		{ id: 'MEM003', name: 'Dr. Emily Rodriguez', avgScore: 91.2 },
		{ id: 'MEM004', name: 'Prof. James Wilson', avgScore: 85.7 },
		{ id: 'MEM005', name: 'Dr. Lisa Anderson', avgScore: 89.4 },
		{ id: 'MEM006', name: 'Prof. Robert Taylor', avgScore: 87.8 },
		{ id: 'MEM007', name: 'Dr. Amanda Miller', avgScore: 90.1 },
		{ id: 'MEM008', name: 'Prof. David Lee', avgScore: 86.5 },
		{ id: 'MEM009', name: 'Dr. Jessica Martinez', avgScore: 93.2 },
		{ id: 'MEM010', name: 'Prof. Kevin Brown', avgScore: 84.9 },
	],
	scoringPatterns: [
		{ score: '90-100', count: 156, percentage: 32 },
		{ score: '80-89', count: 198, percentage: 41 },
		{ score: '70-79', count: 89, percentage: 18 },
		{ score: '60-69', count: 28, percentage: 6 },
		{ score: '<60', count: 16, percentage: 3 },
	],
	decisionOutcomes: [
		{ outcome: 'Approved', count: 156, percentage: 32 },
		{ outcome: 'Needs Review', count: 89, percentage: 18 },
		{ outcome: 'Rejected', count: 65, percentage: 13 },
		{ outcome: 'Pending', count: 176, percentage: 37 },
	],
};

export const mockComplianceReport = {
	overallComplianceRate: 94,
	documentSubmissionRate: 96,
	referenceSubmissionRate: 91,
	backgroundCheckRate: 89,
	completenessScore: 92,
	complianceByCategory: [
		{ category: 'Documents', required: 245, submitted: 235, rate: 96, daysAverage: 3.2 },
		{ category: 'References', required: 245, submitted: 223, rate: 91, daysAverage: 5.8 },
		{ category: 'Background Check', required: 156, submitted: 139, rate: 89, daysAverage: 7.2 },
		{ category: 'Certifications', required: 89, submitted: 87, rate: 98, daysAverage: 2.1 },
		{ category: 'Visa Status', required: 34, submitted: 33, rate: 97, daysAverage: 4.5 },
	],
	deadlineAdherence: [
		{ deadline: 'Initial Submission', onTimeRate: 92, averageDaysEarly: 2.3 },
		{ deadline: 'Reference Submission', onTimeRate: 88, averageDaysEarly: 1.8 },
		{ deadline: 'Background Check', onTimeRate: 85, averageDaysEarly: 0.9 },
		{ deadline: 'Final Review', onTimeRate: 91, averageDaysEarly: 3.2 },
	],
	riskAreas: [
		{ area: 'Background Check Delays', applicants: 17, severity: 'medium' },
		{ area: 'Missing References', applicants: 22, severity: 'medium' },
		{ area: 'Documentation Incomplete', applicants: 10, severity: 'low' },
		{ area: 'Visa Processing Pending', applicants: 8, severity: 'high' },
	],
};

export const mockSystemAudit = {
	totalEvents: 1247,
	eventsByAction: {
		login: 456,
		view: 345,
		edit: 189,
		delete: 34,
		export: 89,
		download: 67,
		upload: 45,
		approve: 22,
	},
	recentEvents: [
		{
			eventId: 'EVT001',
			timestamp: '2026-07-07T20:30:45Z',
			user: 'jsmith@example.com',
			action: 'view',
			resource: 'Application VAC001-APP123',
			ipAddress: '192.168.1.100',
			status: 'success',
		},
		{
			eventId: 'EVT002',
			timestamp: '2026-07-07T20:25:12Z',
			user: 'mdavis@example.com',
			action: 'edit',
			resource: 'Vacancy VAC001',
			ipAddress: '192.168.1.101',
			status: 'success',
		},
		{
			eventId: 'EVT003',
			timestamp: '2026-07-07T20:20:33Z',
			user: 'jwilson@example.com',
			action: 'export',
			resource: 'Application Report - June 2026',
			ipAddress: '192.168.1.102',
			status: 'success',
		},
		{
			eventId: 'EVT004',
			timestamp: '2026-07-07T20:15:22Z',
			user: 'ktaylor@example.com',
			action: 'approve',
			resource: 'Application VAC001-APP456',
			ipAddress: '192.168.1.103',
			status: 'success',
		},
		{
			eventId: 'EVT005',
			timestamp: '2026-07-07T20:10:45Z',
			user: 'rjones@example.com',
			action: 'login',
			resource: 'System',
			ipAddress: '192.168.1.104',
			status: 'success',
		},
	],
	eventsByUser: [
		{ user: 'jsmith@example.com', totalEvents: 156, lastActive: '2026-07-07T20:30:45Z' },
		{ user: 'mdavis@example.com', totalEvents: 143, lastActive: '2026-07-07T20:25:12Z' },
		{ user: 'jwilson@example.com', totalEvents: 134, lastActive: '2026-07-07T20:20:33Z' },
		{ user: 'ktaylor@example.com', totalEvents: 125, lastActive: '2026-07-07T20:15:22Z' },
		{ user: 'rjones@example.com', totalEvents: 112, lastActive: '2026-07-07T20:10:45Z' },
	],
	eventTimeline: [
		{ hour: '08:00', events: 45 },
		{ hour: '09:00', events: 67 },
		{ hour: '10:00', events: 89 },
		{ hour: '11:00', events: 102 },
		{ hour: '12:00', events: 78 },
		{ hour: '13:00', events: 56 },
		{ hour: '14:00', events: 134 },
		{ hour: '15:00', events: 145 },
		{ hour: '16:00', events: 123 },
		{ hour: '17:00', events: 89 },
	],
};
