import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowView } from './workflowRouter';
import { getRoleCapabilities } from './adapters/roleCapabilities';
import { getTenantCapabilities } from './adapters/tenantWorkflowCapabilities';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';
import { useNonSplitApplicants } from './hooks/useNonSplitApplicants';
import { ROLLING_CLOSE, TRIAGE } from '../../../constants/VacancyStates';

const ApplicantListv2 = (props) => {
	const { sysId } = useParams();
	const [activeSlice, setActiveSlice] = useState(props.filter || TRIAGE);

	// User roles tied to the Vacancy. Can be found in adapters > roleCapabilities.js
	const roleCaps = useMemo(
		() => getRoleCapabilities(props.userRoles, props.userCommitteeRole),
		[props.userRoles, props.userCommitteeRole]
	);

	// Tenant properties. Can be found in adapters > tenantWorkflowCapabilities.js
	const tenantCaps = useMemo(
		() =>
			getTenantCapabilities(props.vacancyTenant, props.tenantProperties || []),
		[props.vacancyTenant, props.tenantProperties]
	);

	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	const currentSlice = props.filter || activeSlice;
	const isTriageStage =
		props.vacancyState === TRIAGE ||
		(isRollingClose && currentSlice === TRIAGE);

	const canUseSplit =
		roleCaps.canUseRecommendationSplit || roleCaps.isVacancyManager;
	const splitEnabled = !isTriageStage && canUseSplit;
	const nonSplitEnabled = isTriageStage || !canUseSplit;

	// Hook that makes recommended and non-recommended api calls
	const splitTables = useSplitApplicantTables({
		sysId,
		vacancyState: props.vacancyState,
		enabled: splitEnabled,
	});

	// Hook that calls recommended applicants for Committee Members (Chairs?)
	const nonSplitApplicants = useNonSplitApplicants({
		sysId,
		vacancyState: props.vacancyState,
		enabled: nonSplitEnabled,
	});

	const dataApi = isTriageStage || !canUseSplit ? nonSplitApplicants : splitTables;

	// Filter applicants by their state property for Rolling Close
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

	// Create a filtered data API object for rolling close
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

	// This handles the filter change on Rolling Close Vacancies
	const handleSliceChange = (slice) => {
		setActiveSlice(slice);
		// Reset both data sources when switching tabs
		nonSplitApplicants.initializeForVacancy();
		splitTables.initializeForVacancy();
	};

	// View is dynamic based on Vacancy State or filter for Rolling Close, This is done in workFlowRouter.js file
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
