import { Collapse, Table } from 'antd';

const { Panel } = Collapse;

const pageSizeOptions = [10, 25, 50];

const SplitApplicantTables = (props) => {
	const columns = Array.isArray(props.columns) ? props.columns : [];

	const buildPayloadFromTableChange = (pagination, filters, sorter) => {
		const payload = {
			page: pagination?.current,
			pageSize: pagination?.pageSize,
			orderBy: sorter?.order,
			orderColumn: sorter?.field,
		};

		if (Array.isArray(filters?.focus_area)) {
			payload.focusArea = filters.focus_area;
		}

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
