import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowComponent } from './workflowRouter';
import { getRoleCapabilities } from './adapters/roleCapabilities';
import { getTenantCapabilities } from './adapters/tenantWorkflowCapabilities';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';
import { useNonSplitApplicants } from './hooks/useNonSplitApplicants';
import { ROLLING_CLOSE, TRIAGE } from '../../../constants/VacancyStates';

const ApplicantListv2 = (props) => {
	const { sysId } = useParams();
	const [activeSlice, setActiveSlice] = useState(props.filter || TRIAGE);

	const roleCaps = useMemo(
		() => getRoleCapabilities(props.userRoles, props.userCommitteeRole),
		[props.userRoles, props.userCommitteeRole]
	);

	const tenantCaps = useMemo(
		() =>
			getTenantCapabilities(props.vacancyTenant, props.tenantProperties || []),
		[props.vacancyTenant, props.tenantProperties]
	);

	const splitTables = useSplitApplicantTables({
		sysId,
		vacancyState: props.vacancyState,
	});

	const nonSplitApplicants = useNonSplitApplicants({
		sysId,
		vacancyState: props.vacancyState,
	});

	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	const currentSlice = props.filter || activeSlice;
	const isTriageStage =
		props.vacancyState === TRIAGE ||
		(isRollingClose && currentSlice === TRIAGE);
	const canUseSplit =
		roleCaps.canUseRecommendationSplit || roleCaps.isVacancyManager;

	const dataApi = isTriageStage || !canUseSplit ? nonSplitApplicants : splitTables;

	const handleSliceChange = (slice) => {
		setActiveSlice(slice);
		dataApi.initializeForVacancy();
	};

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
			dataApi={dataApi}
			nonSplitApplicants={nonSplitApplicants}
			splitTables={splitTables}
			activeSlice={activeSlice}
			onSliceChange={handleSliceChange}
		/>
	);
};

export default ApplicantListv2;
