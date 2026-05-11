const MapTriageTableChange = ({ pagination, sorter }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order || undefined,
        orderColumn: sorter?.field || undefined,
        /* seachText and focusArea come from seperate controls and not antd onChange arguments */
    };
}

export default MapTriageTableChange;
