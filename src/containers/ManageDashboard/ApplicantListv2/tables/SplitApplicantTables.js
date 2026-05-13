import { Collapse, Table } from 'antd';

const { Panel } = Collapse;

const pageSizeOptions = [10, 25, 50];

const SplitApplicantTables = (props) => {
	const columns = Array.isArray(props.columns) ? props.columns : [];
	const expandable =
		typeof props.expandedRowRender === 'function'
			? { expandedRowRender: props.expandedRowRender }
			: undefined;

	const buildPayloadFromTableChange = (pagination, filters, sorter) => {
		const focusArea = Array.isArray(filters?.focus_area)
			? filters.focus_area
			: [];

		const payload = {
			page: pagination?.current,
			pageSize: pagination?.pageSize,
			orderBy: sorter?.order,
			orderColumn: sorter?.field,
			focusArea,
		};

		return payload;
	};

	const handleRecommendedChange = (pagination, filters, sorter) => {
		props.onTableChange(buildPayloadFromTableChange(pagination, filters, sorter));
	};

	const handleNonRecommendedChange = (pagination, filters, sorter) => {
		props.onTableChange(buildPayloadFromTableChange(pagination, filters, sorter));
	};

	const commonPagination = {
		current: 1,
		pageSize: props.pageSize || 50,
		pageSizeOptions,
		showSizeChanger: true,
		hideOnSinglePage: true,
	};

	return (
		<Collapse defaultActiveKey={['recommended']} ghost>
			<Panel header='Recommended Applicants' key='recommended'>
				<Table
					rowKey='sys_id'
					dataSource={props.recommendedApplicants || []}
					columns={columns}
					loading={props.recommendedLoading}
					expandable={expandable}
					pagination={{
						...commonPagination,
						total: props.recommendedTotalCount || 0,
					}}
					scroll={{ x: true }}
					onChange={handleRecommendedChange}
				/>
			</Panel>

			<Panel header='Non-Recommended Applicants' key='nonRecommended'>
				<Table
					rowKey='sys_id'
					dataSource={props.nonRecommendedApplicants || []}
					columns={columns}
					loading={props.nonRecommendedLoading}
					expandable={expandable}
					pagination={{
						...commonPagination,
						total: props.nonRecommendedTotalCount || 0,
					}}
					scroll={{ x: true }}
					onChange={handleNonRecommendedChange}
				/>
			</Panel>
		</Collapse>
	);
};

export default SplitApplicantTables;
