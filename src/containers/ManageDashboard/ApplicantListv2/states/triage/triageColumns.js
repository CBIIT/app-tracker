const GetTriageColumns = ({
	roleCaps,
	tenantCaps,
	handlers
}) => {
	const cols = [
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
			width: 250,
			...handlers.searchProps('applicant_name', 'name'),
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			width: 250,
			...handlers.searchProps('applicant_email', 'email'),
		},
		{
			title: 'Submitted',
			dataIndex: 'submitted',
			key: 'submitted',
			render: handlers.renderDate,
		},
		{
			title: 'Vacancy Manager Triage Decision',
			dataIndex: 'triage_status',
			key: 'triage_status',
			render: handlers.renderDecision,
		},
		{
			title: 'Chair Triage Decision',
			dataIndex: 'chair_triage_status',
			key: 'chair_triage_status',
			render: handlers.renderDecision,
		},
	];

	if (tenantCaps.showCompleteColumn) {
		cols.push({
			title: 'Complete',
			dataIndex: 'is_app_complete',
			key: 'complete',
			render: handlers.renderCompleteIcon,
		});
	}

	if (tenantCaps.canCollectReferences) {
		cols.push({
			title: '',
			key: 'collect_refs',
			align: 'center',
			width: 200,
			render: handlers.renderCollectReferencesButton(record.sys_id, record.send_references),
		});
	}

	if (tenantCaps.canSendRegretEmails) {
		cols.push({
			title: '',
			key: 'regret_email',
			align: 'center',
			width: 200,
			render: handlers.renderRegretEmailButton(record.sys_id, record.rejection_email_sent, record.referred_to_interview),
		});
	}

	if (tenantCaps.canViewReferenceStatus) {
		cols.push({
			title: 'Reference Status',
			dataIndex: 'total_received_references',
			key: 'reference_status',
			align: 'center',
			render: handlers.renderReferenceCount,
		});
	}

	return cols;
}

export default GetTriageColumns;
