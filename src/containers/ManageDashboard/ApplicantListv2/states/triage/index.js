import { useMemo } from 'react';
import { Table } from 'antd';
import { getTriageColumns } from './columns';
import { mapTriageTableChange } from './mapPayloadToQuery';

const TriageView = (props) => {
    const columns = useMemo(
        () => getTriageColumns({
            roleCaps: props.roleCaps,
            tenantCaps: props.tenantCaps,
            handlers: props.handlers,
            searchProps: props.getSearchProps,
        }),
        [props.roleCaps, props.tenantCaps, props.handlers, props.getSearchProps]
    );

    const dataSource = props.isSplitMode
        ? [...props.splitTables.recommendedApplicants, ...props.splitTables.nonRecommendedApplicants]
        : props.applicants

    return (
        <Table
            rowKey='sys_id'
            columns={columns}
            dataSource={dataSource}
            loading={props.isSplitMode ? (props.splitTables.recommendedLoading || props.splitTables.nonRecommendedLoading) : props.loading}
            pagination={props.pagination}
            onChange={(pagination, filters, sorter) => {
                props.onTableChange(mapTriageTableChange(pagination, filters, sorter));
            }}
            scroll={{ x: true }}
        />
    );
};

export default TriageView;