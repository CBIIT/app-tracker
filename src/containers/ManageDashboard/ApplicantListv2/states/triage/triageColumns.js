const GetTriageColumns = ({ roleCaps, tenantCaps, handlers }) => {
	const safeRoleCaps = roleCaps || {};
	const safeTenantCaps = tenantCaps || {};
	const safeHandlers = handlers || {};
	const getSearchProps = safeHandlers.searchProps || (() => ({}));
	const renderDate = safeHandlers.renderDate || ((value) => value);
	const renderDecision = safeHandlers.renderDecision || ((value) => value);
	const renderCompleteIcon =
		safeHandlers.renderCompleteIcon || ((value) => value);
	const renderReferenceCount =
		safeHandlers.renderReferenceCount || ((value) => value);
	const renderCollectReferencesButton =
		safeHandlers.renderCollectReferencesButton || (() => null);
	const renderRegretEmailButton =
		safeHandlers.renderRegretEmailButton || (() => null);

	const cols = [
		{
			title: 'Applicant',
			dataIndex: 'applicant_name',
			key: 'name',
			width: 250,
			...getSearchProps('applicant_name', 'name'),
		},
		{
			title: 'Email',
			dataIndex: 'applicant_email',
			key: 'email',
			width: 250,
			...getSearchProps('applicant_email', 'email'),
		},
		{
			title: 'Submitted',
			dataIndex: 'submitted',
			key: 'submitted',
			render: renderDate,
		},
		{
			title: 'Vacancy Manager Triage Decision',
			dataIndex: 'triage_status',
			key: 'triage_status',
			render: renderDecision,
		},
		{
			title: 'Chair Triage Decision',
			dataIndex: 'chair_triage_status',
			key: 'chair_triage_status',
			render: renderDecision,
		},
	];

	if (safeTenantCaps.showCompleteColumn) {
		cols.push({
			title: 'Complete',
			dataIndex: 'is_app_complete',
			key: 'complete',
			render: renderCompleteIcon,
		});
	}

	if (safeRoleCaps.canCollectReferences) {
		cols.push({
			title: '',
			key: 'collect_refs',
			align: 'center',
			width: 200,
			render: (_text, record) =>
				renderCollectReferencesButton(record.sys_id, record.references_sent),
		});
	}

	if (safeRoleCaps.canSendRegretEmail && !safeTenantCaps.showTop25) {
		cols.push({
			title: '',
			key: 'regret_email',
			align: 'center',
			width: 200,
			render: (_text, record) =>
				renderRegretEmailButton(
					record.sys_id,
					record.rejection_email_sent,
					record.referred_to_interview
				),
		});
	}

	cols.push({
		title: 'Reference Status',
		dataIndex: 'total_received_references',
		key: 'reference_status',
		align: 'center',
		render: renderReferenceCount,
	});

	return cols;
};

export default GetTriageColumns;
