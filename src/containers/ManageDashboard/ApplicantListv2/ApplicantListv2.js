import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowView } from './workflowRouter';
import { getRoleCapabilities } from './adapters/roleCapabilities';
import { getTenantCapabilities } from './adapters/tenantWorkflowCapabilities';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';

const ApplicantListv2 = (props) => {
	const { sysId } = useParams();

	const roleCaps = useMemo(
		() => getRoleCapabilities(props.userRoles, props.userCommitteeRole),
		[props.userRole, props.userCommitteeRole]
	);

	const tenantCaps = useMemo(
		() =>
			getTenantCapabilities(props.vacancyTenant, props.tenantProperties | []),
		[props.vacancyTenan, props.tenantProperties]
	);

	const splitTables = useSplitApplicantTables({
		sysId,
		vacancyState: props.vacancyState,
	});

	const View = useMemo(
		() =>
			getWorkflowView({
				vacancyState: props.vacancyState,
				filter: props.filter,
				tenantCaps,
			}),
		[props.vacancyState, props.filter, tenantCaps]
	);

	return (
		<View
			{...props}
			sysId={sysId}
			roleCaps={roleCaps}
			tenantCaps={tenantCaps}
			splitTables={splitTables}
		/>
	);
};

export default ApplicantListv2;
