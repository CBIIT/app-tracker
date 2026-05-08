import individualScoringTable from '../../tables/IndividualScoringTable';
import SplitApplicantTables from '../../tables/SplitApplicantTables';
import mapIndividualScoringChanges from './mapPayloadToQuery';

const IndividualScoringView = (props) => {
	const shouldSplit =
		props.roleCaps.canUseRecommendationSplit &&
		!props.tenantCaps.forceSingleScoringTable;

	if (shouldSplit) {
		return (
			<SplitApplicantTables
				recommendedApplicants={props.splitTables.recommendedApplicants}
				nonRecommendedApplicants={props.splitTables.nonRecommendedApplicants}
				recommendedTotalCount={props.splitTables.recommendedTotalCount}
				nonRecommendedTotalCount={props.splitTables.nonRecommendedTotalCount}
				recommendedLoading={props.splitTables.recommendedLoading}
				nonRecommendedLoading={props.splitTables.nonRecommendedLoading}
				pageSize={props.splitTables.query.pageSize}
				onTableChange={(payload) =>
					props.splitTables.handleTableChange(payload)
				}
				onFocusAreaFilterChange={(focusArea) =>
					props.splitTables.handleTableChange({ focusArea, page: 1 })
				}
				onCollectionReferencesClick={props.handlers.onCollectionReferencesClick}
				onRegretEmailClick={props.handlers.onRegretEmailClick}
			/>
		);
	}

	return (
		<individualScoringTable
			applicants={props.applicants}
			loading={props.loading}
			pagination={props.pagination}
			focusAreaFilter={props.query.focusArea}
			onTableChange={(pagination, filters, sorter) => {
				props.onTableChange(
					mapIndividualScoringChange({
						pagination,
						sorter,
						searchText: props.query.searchText,
						focusArea: props.query.focusArea,
					})
				);
			}}
			onFocusAreaFilterChange={(focusArea) =>
				props.onTableChange({ focusArea, page: 1 })
			}
		/>
	);
};

export default IndividualScoringView;
