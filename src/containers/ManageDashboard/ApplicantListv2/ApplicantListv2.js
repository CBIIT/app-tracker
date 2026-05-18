// Orchestrates ApplicantListv2 routing, capability resolution, and data hook selection.

import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowView } from './workflowRouter';
import { getRoleCapabilities } from './adapters/roleCapabilities';
import { getTenantCapabilities } from './adapters/tenantWorkflowCapabilities';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';
import { useNonSplitApplicants } from './hooks/useNonSplitApplicants';
import { ROLLING_CLOSE, TRIAGE } from '../../../constants/VacancyStates';
import { EXPORT_COLUMNS } from '../Util/ExportToExcel/exportColumns';
import { getExportState, getVisibleExportColumns, getExportData } from '../Util/ExportToExcel/exportHelpers';
import ExportToExcel from '../Util/ExportToExcel/ExportToExcel';
import useAuth from '../../../hooks/useAuth';
import './ApplicantListv2.css';

const ApplicantListv2 = (props) => {
	// Reads the vacancy identifier from the route.
	const { sysId } = useParams();
	const {
		auth: { tenants },
		currentTenant,
	} = useAuth();
	// Tracks the active rolling-close stage selected in the UI.
	const [activeSlice, setActiveSlice] = useState(props.filter || TRIAGE);

	// Maps user roles to capability flags used throughout the workflow.
	const roleCaps = useMemo(
		() => getRoleCapabilities(props.userRoles, props.userCommitteeRole),
		[props.userRoles, props.userCommitteeRole]
	);

	const resolvedTenantProperties = useMemo(() => {
		if (Array.isArray(props.tenantProperties) && props.tenantProperties.length > 0) {
			return props.tenantProperties;
		}

		const activeTenant = Array.isArray(tenants)
			? tenants.find((tenant) => tenant.value === currentTenant)
			: undefined;

		return Array.isArray(activeTenant?.properties)
			? activeTenant.properties
			: [];
	}, [props.tenantProperties, tenants, currentTenant]);

	// Maps tenant properties to workflow capability flags.
	const tenantCaps = useMemo(
		() => getTenantCapabilities(props.vacancyTenant, resolvedTenantProperties),
		[props.vacancyTenant, resolvedTenantProperties]
	);

	// Detects rolling-close workflows.
	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	
	// Resolves the active slice when rolling-close filters are in use.
	const currentSlice = props.filter || activeSlice;

	// Triage always uses non-split table mode.
	const isTriageStage =
		props.vacancyState === TRIAGE ||
		(isRollingClose && currentSlice === TRIAGE);

	// Split mode is available for supported roles and workflow settings.
	const canUseSplit =
		roleCaps.canUseRecommendationSplit || roleCaps.isVacancyManager;

	// Enables exactly one data hook to prevent duplicate API calls.
	const splitEnabled = !isTriageStage && canUseSplit;
	const nonSplitEnabled = isTriageStage || !canUseSplit;

	// Split-table hook for recommended and non-recommended applicant lists.
	const splitTables = useSplitApplicantTables({
		sysId,
		vacancyState: props.vacancyState,
		enabled: splitEnabled,
	});

	// Non-split hook for triage and roles that do not use split tables.
	const nonSplitApplicants = useNonSplitApplicants({
		sysId,
		vacancyState: props.vacancyState,
		enabled: nonSplitEnabled,
	});

	// Exposes one data API shape regardless of split or non-split mode.
	const dataApi = isTriageStage || !canUseSplit ? nonSplitApplicants : splitTables;

	// Applies client-side state filtering for rolling-close slices.
	const getFilteredApplicants = (applicants, filter) => {
		if (!isRollingClose) {
			return applicants;
		}
		return applicants.filter((applicant) => {
			let applicantState = '';
			switch (applicant.state) {
				case 'triage':
					applicantState = 'triage';
					break;
				case 'scoring':
					applicantState = 'scoring';
					break;
				case 'in_review':
					applicantState = 'in_review';
					break;
				case 'review_complete':
				case 'completed':
					applicantState = 'review_complete';
					break;
			}
			return applicantState === filter;
		});
	};

	// Builds a filtered data API for rolling-close views.
	const filteredDataApi = useMemo(() => {
		if (!isRollingClose) {
			return dataApi;
		}

		const filteredApplicants = getFilteredApplicants(
			dataApi.applicants || [],
			currentSlice
		);

		return {
			...dataApi,
			applicants: filteredApplicants,
			recommendedApplicants: getFilteredApplicants(
				dataApi.recommendedApplicants || [],
				currentSlice
			),
			nonRecommendedApplicants: getFilteredApplicants(
				dataApi.nonRecommendedApplicants || [],
				currentSlice
			),
		};
	}, [dataApi, isRollingClose, currentSlice]);

	// Handles rolling-close slice changes and resets both query states.
	const handleSliceChange = (slice) => {
		setActiveSlice(slice);
		nonSplitApplicants.initializeForVacancy();
		splitTables.initializeForVacancy();
	};

	// Selects the active view component for the current workflow context.
	const View = useMemo(
		() =>
			getWorkflowView({
				vacancyState: props.vacancyState,
				filter: props.filter || activeSlice,
				isRollingClose,
				tenantCaps,
			}),
		[props.vacancyState, props.filter, activeSlice, isRollingClose, tenantCaps]
	);

	// Renders the selected workflow view with shared context and data handlers.
	return (
		<View
			{...props}
			sysId={sysId}
			roleCaps={roleCaps}
			tenantCaps={tenantCaps}
			dataApi={filteredDataApi}
			nonSplitApplicants={nonSplitApplicants}
			splitTables={splitTables}
			activeSlice={activeSlice}
			onSliceChange={handleSliceChange}
		/>
	);
};

export default ApplicantListv2;
