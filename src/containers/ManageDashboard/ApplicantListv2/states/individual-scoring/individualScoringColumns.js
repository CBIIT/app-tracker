import { Checkbox, Select, Tag } from 'antd';

const getIndividualScoringColumns = ({
	roleCaps,
	tenantCaps,
	handlers,
	searchProps,
	focusAreaOptions,
	focusAreaFilter,
}) => {
	const safeHandlers = handlers || {};
	const getSearchProps =
		searchProps || safeHandlers.searchProps || (() => ({}));
	const renderDecision = safeHandlers.renderDecision || ((value) => value);
	const columnChangeHandler = safeHandlers.columnChangeHandler || (() => {});
	const renderAverageScore =
		safeHandlers.renderAverageScore ||
		((text) => {
			if (!text || text === 'NaN') {
				return <span style={{ color: 'rgba(0,0,0,0.25)' }}>Pending</span>;
			}
			return parseFloat(text).toFixed(2);
		});
	const renderTop25Select = safeHandlers.renderTop25Select || (() => null);
	const renderCollectReferencesButton =
		safeHandlers.renderCollectReferencesButton || (() => null);
	const renderRegretEmailButton = safeHandlers.renderRegretEmailButton || (() => null);
	const renderReferenceCount = safeHandlers.renderReferenceCount || ((text) => text || '-');
	const getFocusAreaFilterOptions =
		safeHandlers.getFocusAreaFilterOptions ||
		(() => (Array.isArray(focusAreaOptions) ? focusAreaOptions : []));
	const getFocusAreaFilterValue =
		safeHandlers.getFocusAreaFilterValue ||
		(() => (Array.isArray(focusAreaFilter) ? focusAreaFilter : []));

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
	];

	// Top 25 column requires manager role and tenat opt-in (statdman)
	if (roleCaps.isVacancyManager && tenantCaps.showTop25 && tenantCaps.isStadtman) {
		cols.unshift({
			title: 'Top 25',
			dataIndex: 'top_25',
			key: 'top_25',
			align: 'center',
			render: (_text, record) =>
				renderTop25Select(
					record.sys_id,
					record.top_25 ?? record.top_25_percent
				),
		});
	}

	// column is visual aid filter. Tenant based as not all tenants use
	if (tenantCaps.enableFocusArea && tenantCaps.isStadtman) {
		cols.push({
			title: 'Focus Area',
			dataIndex: 'focus_area',
			key: 'focus_area',
			render: (focusArea, record) => {
				if (focusArea) {
					return focusArea;
				}

				const primaryFocusArea = record?.primary_focus_area;
				const secondaryFocusArea = record?.secondary_focus_area;

				if (primaryFocusArea && secondaryFocusArea) {
					return `${primaryFocusArea}, ${secondaryFocusArea}`;
				}

				return primaryFocusArea || secondaryFocusArea || '-';
			},
			filters: getFocusAreaFilterOptions(),
			filteredValue: getFocusAreaFilterValue(),
			width: 250,
		});
	}

	if (!tenantCaps.showTop25) {
		cols.push({
			title: 'Average Score',
			dataIndex: 'average_member_score',
			key: 'average_member_score',
			width: 50,
			render: renderAverageScore,
			sorter: {
				compare: (a, b) =>
					(a.average_member_score || 0) - (b.average_member_score || 0),
			},
		});
	}

	if (roleCaps.canCollectReferences) {
		cols.push({
			title: '',
			key: 'collect_references',
			align: 'center',
			width: 180,
			render: (_text, record) =>
				renderCollectReferencesButton(record.sys_id, record.references_sent),
		});
	}

	if (roleCaps.canSendRegretEmail && !tenantCaps.showTop25) {
		cols.push({
			title: '',
			key: 'regret_email',
			align: 'center',
			width: 180,
			render: (_text, record) =>
				renderRegretEmailButton(
					record.sys_id,
					record.rejection_email_sent,
					record.referred_to_interview
				),
		});
	}

	if (roleCaps.canViewReferenceStatus) {
		cols.push({
			title: 'Reference Status',
			dataIndex: 'total_received_references',
			key: 'reference_status',
			align: 'center',
			render: renderReferenceCount,
		});
	}

	return cols;
};

export default getIndividualScoringColumns;
