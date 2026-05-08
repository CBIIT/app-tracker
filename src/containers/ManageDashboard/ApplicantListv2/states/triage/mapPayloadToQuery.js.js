const mapTriageTableChange = ({ pagination, filters, sorter }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.orderBy,
        orderColumn: sorter?.orderColumn,
    };
}

export default mapTriageTableChange;