import { useMemo } from 'react';
import { Table, Radio } from 'antd';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import GetTriageColumns from './triageColumns';
import MapTriageTableChange from './mapTriageTableChange';
import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
} from '../../../../../constants/ApplicationStates';
import './index.css';

const TriageView = (props) => {
	const columns = useMemo(
		() =>
			GetTriageColumns({
				roleCaps: props.roleCaps,
				tenantCaps: props.tenantCaps,
				handlers: props.handlers,
			}),
		[props.roleCaps, props.tenantCaps, props.handlers]
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
						MapTriageTableChange(pagination, sorter)
					);
				}}
				scroll={{ x: true }}
			/>
		</>
	);
};

export default TriageView;
