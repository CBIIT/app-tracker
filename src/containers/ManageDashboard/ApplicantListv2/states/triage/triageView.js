import { useMemo, useCallback, useContext, useEffect, useState } from 'react';
import { Table, Radio, Button, message } from 'antd';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import GetTriageColumns from './triageColumns';
import MapTriageTableChange from './mapTriageTableChange';
import SearchContext from '../../../Util/SearchContext';
import { getColumnSearchProps } from '../../../Util/ColumnSearchProps';
import {
	collectReferences as collectReferencesApi,
	sendRejectionEmail as sendRejectionEmailApi,
} from '../../services/notificationService';
import { transformDateTimeToDisplay } from '../../../../../components/Util/Date/Date';
import ReferenceModal from '../../modals/ReferenceModal';
import RejectionEmailModal from '../../modals/RejectionEmailModal';
import ApplicantFilter from '../../components/ApplicantFilters';
import WorkflowExcelExportToolbar from '../../components/WorkflowExcelExportToolbar';
import './index.css';

const TriageView = (props) => {
	// Modal state used by legacy-aligned Collect References / Regret Email flows.
	const [applicantSysId, setApplicantSysId] = useState('');
	const [showReferenceModal, setShowReferenceModal] = useState(false);
	const [showRejectionEmailModal, setShowRejectionEmailModal] = useState(false);
	const [referencesSent, setReferencesSent] = useState('0');
	const [rejectionEmailSent, setRejectionEmailSent] = useState('0');
	const [referredToInterview, setReferredToInterview] = useState('no');

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

	useEffect(() => {
		// SearchContext is shared across ManageDashboard views. Keep the active
		// data hook query state synchronized so API requests include search text.
		if (searchText === (props.dataApi?.query?.searchText || '')) {
			return;
		}

		props.dataApi.handleTableChange({ searchText, page: 1 });
	}, [searchText, props.dataApi]);

	// Renders API date values using the shared display formatter.
	const renderDate = useCallback((date) => {
		return transformDateTimeToDisplay(date);
	}, []);

	// Renders decision text with legacy styling for pending values.
	const renderDecision = useCallback((text) => {
		if (text === 'Pending') {
			return (
				<span
					style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}
				>
					{text}
				</span>
			);
		}
		return <span style={{ textTransform: 'capitalize' }}>{text}</span>;
	}, []);

	// Renders the completion icon used in Stadtman workflows.
	const renderCompleteIcon = useCallback((value) => {
		return value === '1' ? '✓' : '';
	}, []);

	// Renders the reference count with a fallback value.
	const renderReferenceCount = useCallback((text) => {
		return text || '-';
	}, []);

	// Opens the collect references confirmation modal.
	const renderCollectReferencesButton = useCallback((sysId, referencesSent) => {
		// Open confirmation modal first (legacy parity), API call happens on confirm.
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

	// Opens the regret email confirmation modal.
	const renderRegretEmailButton = useCallback(
		(sysId, rejectionEmailSent, referredToInterview) => {
			// Modal content varies based on interview/rejection status.
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

	const handlers = useMemo(
		() => ({
			searchProps,
			renderDate,
			renderDecision,
			renderCompleteIcon,
			renderReferenceCount,
			renderCollectReferencesButton,
			renderRegretEmailButton,
		}),
		[
			searchProps,
			renderDate,
			renderDecision,
			renderCompleteIcon,
			renderReferenceCount,
			renderCollectReferencesButton,
			renderRegretEmailButton,
		]
	);

	const columns = useMemo(
		() =>
			GetTriageColumns({
				roleCaps: props.roleCaps,
				tenantCaps: props.tenantCaps,
				handlers,
			}),
		[props.roleCaps, props.tenantCaps, handlers]
	);

	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	const canViewTriage = props.roleCaps?.canViewTriageFilter;

	return (
		<>
			{isRollingClose && (
				<ApplicantFilter
					canViewTriage={canViewTriage}
					onStateChange={props.onStateChange}
					activeState={props.activeState}
				/>
			)}

			<WorkflowExcelExportToolbar
				excelExport={props.excelExport}
				filenamePrefix={props.vacancyTitle || 'ApplicantList'}
			/>

			<div className='applicant-table'>
				<Table
					rowKey='sys_id'
					dataSource={props.dataApi.applicants}
					columns={columns}
					loading={props.dataApi.loading}
					pagination={{
						current: props.dataApi.query.page,
						pageSize: props.dataApi.query.pageSize,
						total: props.dataApi.totalCount,
						pageSizeOptions: [10, 25, 50],
						showSizeChanger: true,
						hideOnSinglePage: true,
					}}
					onChange={(pagination, _filters, sorter) => {
						// Triage currently uses search + sort + pagination (no focus-area filter).
						props.dataApi.handleTableChange(
							MapTriageTableChange({
								pagination,
								sorter,
								searchText,
							})
						);
					}}
					scroll={{ x: true }}
				/>
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

export default TriageView;
