import { useMemo } from 'react';
import { Table, Tabs } from 'antd';
import { ROLLING_CLOSE } from '../../../../../constants/VacancyStates';
import GetTriageColumns from './triageColumns';
import MapTriageTableChange from './mapTriageTableChange';

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

	const pagination = {
		current: props.dataApi.query.page,
		pageSize: props.dataApi.query.pageSize,
		total: props.dataApi.totalCount,
		pageSizeOptions: [10, 25, 50],
		showSizeChanger: true,
		hideOnSinglePage: true,
	};

	return (
		<>
			{isRollingClose && (
				<Tabs
					activeKey={props.activeSlice}
					onChange={(key) => {
						props.onSliceChange(key);
					}}
					items={
						[
							// { key: 'triage', label: 'Triage' }
							// { key: 'scoring', label: 'Scoring' }
							// { key: 'in_review', label: 'In Review' }
							// { key: 'voting', label: 'Voting Complete' }
						]
					}
				/>
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
