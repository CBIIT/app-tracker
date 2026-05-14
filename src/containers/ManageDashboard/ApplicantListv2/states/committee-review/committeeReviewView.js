import { useMemo, useCallback, useContext, useEffect, useState } from 'react';
import getCommitteeReviewColumns from './committeeReviewColumns';
import mapCommitteeReviewChange from './mapCommitteeReviewTableChange';
import { Table, Radio, Button, Modal, Input } from 'antd';
import SearchContext from '../../../Util/SearchContext';
import { getColumnSearchProps } from '../../../Util/ColumnSearchProps';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
} from '../../../../../constants/ApplicationStates';
import {
	collectReferences as collectReferencesApi,
	sendRejectionEmail as sendRejectionEmailApi,
	submitCommitteeComments as submitCommitteeCommentsApi,
} from '../../services/notificationService';
import { updateReferredToInterview } from '../../services/decisionService';
import SplitApplicantTables from '../../tables/SplitApplicantTables';
import InnerScoresTable from '../../components/InnerScoresTable';
import ReferenceModal from '../../modals/ReferenceModal';
import RejectionEmailModal from '../../modals/RejectionEmailModal';

const { TextArea } = Input;

const CommitteeReviewView = (props) => {
	const [applicantSysId, setApplicantSysId] = useState('');
	const [showReferenceModal, setShowReferenceModal] = useState(false);
	const [showRejectionEmailModal, setShowRejectionEmailModal] = useState(false);
	const [showCommentModal, setShowCommentModal] = useState(false);
	const [referencesSent, setReferencesSent] = useState('0');
	const [rejectionEmailSent, setRejectionEmailSent] = useState('0');
	const [referredToInterview, setReferredToInterview] = useState('no');
	const [committeeComment, setCommitteeComment] = useState('');

	const {
		searchText,
		setSearchText,
		searchedColumn,
		setSearchedColumn,
		searchInput,
	} = useContext(SearchContext);

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
		[searchInput, searchText, searchedColumn, setSearchText, setSearchedColumn]
	);

	const renderRegretEmailButton = useCallback(
		(sysId, rejectionEmailSent, referredToInterview) => {
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

	const renderReferenceCount = useCallback((text) => {
		return text || '-';
	}, []);

	const columnChangeHandler = useCallback(
		async (value, sysId) => {
			try {
				await updateReferredToInterview(sysId, value);
				props.dataApi.refresh?.();
			} catch (_error) {
				// Error toast shown in decisionService.
			}
		},
		[props.dataApi]
	);

	const onCommentButtonClick = useCallback((comment, sysId) => {
		setApplicantSysId(sysId);
		setCommitteeComment(comment || '');
		setShowCommentModal(true);
	}, []);

	const handleCommentCancel = useCallback(() => {
		setShowCommentModal(false);
		setCommitteeComment('');
	}, []);

	const handleCommentSave = useCallback(async () => {
		if (!applicantSysId) {
			return;
		}

		try {
			await submitCommitteeCommentsApi(applicantSysId, committeeComment);
			setShowCommentModal(false);
			props.dataApi.refresh?.();
		} catch (_error) {
			// Error toast shown in notificationService.
		}
	}, [applicantSysId, committeeComment, props.dataApi]);

	const handlers = useMemo(
		() => ({
			searchProps,
			columnChangeHandler,
			renderCollectReferencesButton,
			renderRegretEmailButton,
			renderReferenceCount,
			onCommentButtonClick,
		}),
		[
			searchProps,
			columnChangeHandler,
			renderCollectReferencesButton,
			renderRegretEmailButton,
			renderReferenceCount,
			onCommentButtonClick,
		]
	);

	const sendReferences = useCallback(
		// Executes only after ReferenceModal confirmation
		async (sysId) => {
			try {
				await collectReferencesApi(sysId);
				props.dataApi.refresh?.();
			} catch (_error) {
				// Will add custom error message
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
				// Will add custom error message
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
			getCommitteeReviewColumns({
				roleCaps: props.roleCaps,
				tenantCaps: props.tenantCaps,
				handlers,
			}),
		[props.roleCaps, props.tenantCaps, handlers]
	);

	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	const canViewTriage = props.roleCaps?.canViewTriageFilter;
	const canExpandScores =
		!props.roleCaps?.isCommitteeMember &&
		!props.roleCaps?.isCommitteeNonVoting &&
		!props.roleCaps?.isCommitteeReadOnly;
	// Might need to reference legacy code to ensure who can see this.
	const renderExpandedScores = useCallback(
		// expandable rows render committee scores for each applicant.
		(record) => <InnerScoresTable applicationSysId={record.sys_id} />,
		[]
	);

	const handleNonSplitChange = (pagination, filters, sorter) => {
		props.dataApi.handleTableChange(
			mapCommitteeReviewChange({
				pagination,
				sorter,
				searchText,
			})
		);
	};

	return (
		<>
			{isRollingClose && (
				<div>
					<p style={{ display: 'inline-block' }}>Filter Applications:</p>
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
			<Modal
				title='Voting Comments'
				open={showCommentModal}
				onOk={handleCommentSave}
				onCancel={handleCommentCancel}
				okText='Save'
				destroyOnClose
			>
				<TextArea
					placeholder='add your comments here'
					rows={4}
					maxLength={10000}
					value={committeeComment}
					onChange={(event) => setCommitteeComment(event.target.value)}
				/>
			</Modal>
		</>
	);
};

export default CommitteeReviewView;
