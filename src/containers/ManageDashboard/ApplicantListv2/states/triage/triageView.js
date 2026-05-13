import { useMemo, useCallback, useContext, useEffect } from 'react';
import { Table, Radio, Button, message } from 'antd';
import axios from 'axios';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import GetTriageColumns from './triageColumns';
import MapTriageTableChange from './mapTriageTableChange';
import SearchContext from '../../../Util/SearchContext';
import { getColumnSearchProps } from '../../../Util/ColumnSearchProps';
import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
} from '../../../../../constants/ApplicationStates';
import {
	SEND_REGRET_EMAIL,
	COLLECT_REFERENCES,
} from '../../../../../constants/ApiEndpoints';
import { transformDateTimeToDisplay } from '../../../../../components/Util/Date/Date';
import './index.css';

const TriageView = (props) => {
	const { searchText, setSearchText, searchedColumn, setSearchedColumn, searchInput } =
		useContext(SearchContext);

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

	useEffect(() => {
		if (searchText === (props.dataApi?.query?.searchText || '')) {
			return;
		}

		props.dataApi.handleTableChange({ searchText, page: 1 });
	}, [searchText, props.dataApi]);

	// Handler for rendering date
	const renderDate = useCallback((date) => {
		return transformDateTimeToDisplay(date);
	}, []);

	// Handler for rendering decision
	const renderDecision = useCallback((text) => {
		if (text === 'Pending') {
			return (
				<span style={{ color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
					{text}
				</span>
			);
		}
		return <span style={{ textTransform: 'capitalize' }}>{text}</span>;
	}, []);

	// Handler for rendering complete icon
	const renderCompleteIcon = useCallback((value) => {
		return value === '1' ? '✓' : '';
	}, []);

	// Handler for rendering reference count
	const renderReferenceCount = useCallback((text) => {
		return text || '-';
	}, []);

	// Handler for collect references button
	const renderCollectReferencesButton = useCallback(
		(sysId, referencesSent) => {
			const handleCollectReferences = async () => {
				try {
					await axios.get(COLLECT_REFERENCES + sysId);
					message.success('Reference collection initiated.');
					props.dataApi.refresh?.();
				} catch (error) {
					message.error('Error collecting references.');
				}
			};

			return (
				<Button onClick={handleCollectReferences} size='small'>
					Collect References
				</Button>
			);
		},
		[props.dataApi]
	);

	// Handler for regret email button
	const renderRegretEmailButton = useCallback(
		(sysId, rejectionEmailSent, referredToInterview) => {
			const handleSendRegretEmail = async () => {
				try {
					await axios.get(SEND_REGRET_EMAIL + sysId);
					message.success('Regret email sent.');
					props.dataApi.refresh?.();
				} catch (error) {
					message.error('Error sending regret email.');
				}
			};

			return (
				<Button onClick={handleSendRegretEmail} size='small'>
					Send Regret Email
				</Button>
			);
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
		</>
	);
};

export default TriageView;
