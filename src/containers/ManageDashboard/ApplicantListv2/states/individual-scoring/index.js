import IndividualScoringTable from '../../tables/IndividualScoringTable';
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
		<IndividualScoringTable
			applicants={props.dataApi.applicants}
			loading={props.dataApi.loading}
			pagination={{
				current: props.dataApi.query.page,
				pageSize: props.dataApi.query.pageSize,
				total: props.dataApi.totalCount,
				pageSizeOptions: [10, 25, 50],
				showSizeChanger: true,
				hideOnSinglePage: true,
			}}
			focusAreaFilter={props.dataApi.query.focusArea}
			onTableChange={(pagination, filters, sorter) => {
				props.dataApi.handleTableChange(
					mapIndividualScoringChanges({
						pagination,
						sorter,
						searchText: props.dataApi.query.searchText,
						focusArea: props.dataApi.query.focusArea,
					})
				);
			}}
			onFocusAreaFilterChange={(focusArea) =>
				props.dataApi.handleTableChange({ focusArea, page: 1 })
			}
		/>
	);
};

export default IndividualScoringView;
