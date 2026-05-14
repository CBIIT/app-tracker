import { useMemo, useCallback, useContext, useEffect, useState } from 'react';
import getIndividualScoringColumns from './individualScoringColumns';
import mapIndividualScoringChanges from './mapIndividualScoringTableChange';
import { Table, Radio, Button, message } from 'antd';
import SearchContext from '../../../Util/SearchContext';
import { getColumnSearchProps } from '../../../Util/ColumnSearchProps';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
} from '../../../../../constants/ApplicationStates';
import { updateTop25Percent } from '../../services/top25Service';
import {
	collectReferences as collectReferencesApi,
	sendRejectionEmail as sendRejectionEmailApi,
} from '../../services/notificationService';
import SplitApplicantTables from '../../tables/SplitApplicantTables';
import InnerScoresTable from '../../components/InnerScoresTable';
import ReferenceModal from '../../modals/ReferenceModal';
import RejectionEmailModal from '../../modals/RejectionEmailModal';

const IndividualScoringView = (props) => {
	// Modal state for legacy-aligned reference/regret confirmation flows.
	const [applicantSysId, setApplicantSysId] = useState('');
	const [showReferenceModal, setShowReferenceModal] = useState(false);
	const [showRejectionEmailModal, setShowRejectionEmailModal] = useState(false);
	const [referencesSent, setReferencesSent] = useState('0');
	const [rejectionEmailSent, setRejectionEmailSent] = useState('0');
	const [referredToInterview, setReferredToInterview] = useState('no');

	const { searchText, setSearchText, searchedColumn, setSearchedColumn, searchInput } =
		useContext(SearchContext);

	// Source of truth for selected focus area filters is the data hook query state.
	// This ensures filter pills/checkmarks stay in sync across refreshes.
	const focusAreaFilter = Array.isArray(props.dataApi?.query?.focusArea)
		? props.dataApi.query.focusArea
		: [];

	const searchProps = useCallback(
		(dataIndex, key) =>
			getColumnSearchProps(
				dataIndex,
				key,
				searchText,
				setSearchText,
				searchedColumn,
				setSearchedColumn,
				searchInput
			),
		[
			searchInput,
			searchText,
			searchedColumn,
			setSearchText,
			setSearchedColumn,
		]
	);

	// Handler for rendering Top 25 select checkbox
	const renderTop25Select = useCallback(
		(sysId, isTop25) => {
			// API may return string/number/boolean; normalize for stable checkbox behavior.
			const normalizedValue =
				typeof isTop25 === 'string' ? isTop25.toLowerCase() : isTop25;
			const checked =
				normalizedValue === '1' ||
				normalizedValue === 1 ||
				normalizedValue === true ||
				normalizedValue === 'true';

			return (
			<input
				type='checkbox'
				checked={checked}
				onChange={async (event) => {
					// Top 25 writes immediately.
					try {
						await updateTop25Percent(sysId, event.target.checked);
						props.dataApi.refresh?.();
					} catch (_error) {
						// Error handling done by service.
					}
				}}
			/>
			);
		},
		[props.dataApi]
	);

	// Handler for rendering regret email button
	const renderRegretEmailButton = useCallback(
		(sysId, rejectionEmailSent, referredToInterview) => {
			// Open modal first; send action happens on confirmation.
			return (
				<Button
					onClick={() => {
						setApplicantSysId(sysId);
						setRejectionEmailSent(rejectionEmailSent);
						setReferredToInterview(referredToInterview);
						setShowRejectionEmailModal(true);
					}}
					size='small'
				>
					Send Regret Email
				</Button>
			);
		},
		[]
	);

	const renderCollectReferencesButton = useCallback((sysId, referencesSent) => {
		// Open modal first; send action happens on confirmation.
		return (
			<Button
				onClick={() => {
					setApplicantSysId(sysId);
					setReferencesSent(referencesSent);
					setShowReferenceModal(true);
				}}
				size='small'
			>
				Collect References
			</Button>
		);
	}, []);

	// Handler for rendering reference count
	const renderReferenceCount = useCallback((text) => {
		return text || '-';
	}, []);

	// Get focus area filter options
	const getFocusAreaFilterOptions = useCallback(() => {
		return props.dataApi.focusAreaOptions || [];
	}, [props.dataApi.focusAreaOptions]);

	// Get focus area filter value
	const getFocusAreaFilterValue = useCallback(() => {
		return focusAreaFilter;
	}, [focusAreaFilter]);

	const handlers = useMemo(
		() => ({
			// searchProps injects ant-table search dropdown UI into Applicant/Email columns.
			searchProps,
			renderTop25Select,
			renderCollectReferencesButton,
			renderRegretEmailButton,
			renderReferenceCount,
			getFocusAreaFilterOptions,
			getFocusAreaFilterValue,
		}),
		[
			searchProps,
			renderTop25Select,
			renderCollectReferencesButton,
			renderRegretEmailButton,
			renderReferenceCount,
			getFocusAreaFilterOptions,
			getFocusAreaFilterValue,
		]
	);

	const sendReferences = useCallback(
		async (sysId) => {
			// Executes only after ReferenceModal confirmation.
			try {
				await collectReferencesApi(sysId);
				props.dataApi.refresh?.();
			} catch (_error) {
				// Error handling done by service.
			}
		},
		[props.dataApi]
	);

	const sendRejectionEmail = useCallback(
		async (sysId) => {
			// Executes only after RejectionEmailModal confirmation.
			try {
				await sendRejectionEmailApi(sysId);
				props.dataApi.refresh?.();
			} catch (_error) {
				// Error handling done by service.
			}
		},
		[props.dataApi]
	);

	useEffect(() => {
		// Keep shared SearchContext in sync with the active data hook query.
		if (searchText === (props.dataApi?.query?.searchText || '')) {
			return;
		}

		props.dataApi.handleTableChange({ searchText, page: 1 });
	}, [searchText, props.dataApi]);

	const columns = useMemo(
		() =>
			getIndividualScoringColumns({
				roleCaps: props.roleCaps,
				tenantCaps: props.tenantCaps,
				handlers,
				focusAreaOptions: props.dataApi.focusAreaOptions,
				focusAreaFilter,
			}),
		[
			props.roleCaps,
			props.tenantCaps,
			handlers,
			props.dataApi.focusAreaOptions,
			focusAreaFilter,
		]
	);

	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	const canViewTriage = props.roleCaps?.canViewTriageFilter;
	const canExpandScores =
		!props.roleCaps?.isCommitteeMember &&
		!props.roleCaps?.isCommitteeNonVoting &&
		!props.roleCaps?.isCommitteeReadOnly;
	const renderExpandedScores = useCallback(
		// Legacy parity: expandable rows render committee scores for each applicant.
		(record) => <InnerScoresTable applicationSysId={record.sys_id} />,
		[]
	);

	const handleNonSplitChange = (pagination, filters, sorter) => {
		// Ant Table emits focus area filters under filters.focus_area.
		const focusArea =
			filters && filters.focus_area ? filters.focus_area : [];

		props.dataApi.handleTableChange(
			mapIndividualScoringChanges({
				pagination,
				sorter,
				searchText,
				focusArea,
			})
		);
	};

	const handleFocusAreaFilterChange = (focusArea) => {
		props.dataApi.handleTableChange({ focusArea, page: 1 });
	};

	return (
		<>
			{isRollingClose && (
				<div>
					<p style={{ display: 'inline-block' }}>Filter Applications: </p>
					<Radio.Group
						style={{ display: 'inline-block', paddingLeft: '10px' }}
						onChange={(e) => props.onSliceChange(e.target.value)}
						value={props.activeSlice}
					>
						{canViewTriage && (
							<Radio.Button value={APP_TRIAGE}>Triage</Radio.Button>
						)}
						<Radio.Button value={SCORING}>Individual Scoring</Radio.Button>
						<Radio.Button value={IN_REVIEW}>Committee Review</Radio.Button>
						<Radio.Button value={REVIEW_COMPLETE}>Selected</Radio.Button>
					</Radio.Group>
				</div>
			)}

			<div className='applicant-table'>
				{/* Split Table View (recommended and non-recommended) for Vacancy Managers */}
				{props.roleCaps.isVacancyManager ? (
					// Managers get split recommended/non-recommended tables.
					<SplitApplicantTables
						recommendedApplicants={props.dataApi.recommendedApplicants}
						nonRecommendedApplicants={props.dataApi.nonRecommendedApplicants}
						recommendedTotalCount={props.dataApi.recommendedTotalCount}
						nonRecommendedTotalCount={props.dataApi.nonRecommendedTotalCount}
						recommendedLoading={props.dataApi.recommendedLoading}
						nonRecommendedLoading={props.dataApi.nonRecommendedLoading}
						pageSize={props.dataApi.query.pageSize}
						columns={columns}
						expandedRowRender={canExpandScores ? renderExpandedScores : undefined}
						onTableChange={props.dataApi.handleTableChange}
						onFocusAreaFilterChange={handleFocusAreaFilterChange}
					/>
				) : (
					// Single Table View (recommended) for other roles
					<Table
						rowKey='sys_id'
						dataSource={props.dataApi.applicants}
						loading={props.dataApi.loading}
						columns={columns}
						expandable={
							canExpandScores
								? {
									expandedRowRender: renderExpandedScores,
								}
								: undefined
						}
						scroll={{ x: true }}
						pagination={{
							current: props.dataApi.query.page,
							pageSize: props.dataApi.query.pageSize,
							total: props.dataApi.totalCount,
							pageSizeOptions: [10, 25, 50],
							showSizeChanger: true,
							hideOnSinglePage: true,
						}}
						onChange={handleNonSplitChange}
					/>
				)}
			</div>
			<ReferenceModal
				appSysId={applicantSysId}
				referenceModal={showReferenceModal}
				setReferenceModal={setShowReferenceModal}
				sendReferences={sendReferences}
				referencesSent={referencesSent}
			/>
			<RejectionEmailModal
				appSysId={applicantSysId}
				rejectionEmailModal={showRejectionEmailModal}
				setRejectionEmailModal={setShowRejectionEmailModal}
				sendRejectionEmail={sendRejectionEmail}
				rejectionEmailSent={rejectionEmailSent}
				referredToInterview={referredToInterview}
			/>
		</>
	);
};

export default IndividualScoringView;
