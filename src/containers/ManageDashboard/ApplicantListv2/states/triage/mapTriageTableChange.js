const MapTriageTableChange = ({ pagination, sorter, searchText }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order || undefined,
        orderColumn: sorter?.field || undefined,
        searchText: searchText ?? '',
    };
}

export default MapTriageTableChange;
