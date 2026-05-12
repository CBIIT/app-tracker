import { useMemo, useState, useCallback } from 'react';
import getIndividualScoringColumns from './individualScoringColumns';
import mapIndividualScoringChanges from './mapIndividualScoringTableChange';
import { Table, Radio, Button, message } from 'antd';
import axios from 'axios';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
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
import SplitApplicantTables from '../../tables/SplitApplicantTables';

const IndividualScoringView = (props) => {
	const [focusAreaFilter, setFocusAreaFilter] = useState([]);

	// Handler for rendering Top 25 select checkbox
	const renderTop25Select = useCallback(
		(sysId, isTop25) => (
			<input
				type='checkbox'
				checked={isTop25 === '1' ? true : false}
				onChange={() => {
					// This would need to call an API to update
				}}
			/>
		),
		[]
	);

	// Handler for rendering regret email button
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
			renderTop25Select,
			renderRegretEmailButton,
			renderReferenceCount,
			getFocusAreaFilterOptions,
			getFocusAreaFilterValue,
		}),
		[
			renderTop25Select,
			renderRegretEmailButton,
			renderReferenceCount,
			getFocusAreaFilterOptions,
			getFocusAreaFilterValue,
		]
	);

	const columns = useMemo(
		() =>
			getIndividualScoringColumns({
				roleCaps: props.roleCaps,
				tenantCaps: props.tenantCaps,
				handlers,
				focusAreaFilter,
			}),
		[props.roleCaps, props.tenantCaps, handlers, focusAreaFilter]
	);

	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	const canViewTriage = props.roleCaps?.canViewTriageFilter;

	const handleNonSplitChange = (pagination, filters, sorter) => {
		const focusArea =
			filters && filters.focus_area ? filters.focus_area : [];
		setFocusAreaFilter(focusArea);

		props.dataApi.handleTableChange(
			mapIndividualScoringChanges({
				pagination,
				sorter,
				searchText: props.dataApi.query.searchText,
				focusArea,
			})
		);
	};

	const handleFocusAreaFilterChange = (focusArea) => {
		setFocusAreaFilter(focusArea);
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
		</>
	);
};

export default IndividualScoringView;
