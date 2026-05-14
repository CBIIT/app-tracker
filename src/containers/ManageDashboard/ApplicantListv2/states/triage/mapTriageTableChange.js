const MapTriageTableChange = ({ pagination, sorter, searchText }) => {
    return {
        // Minimal payload for triage with page, sort, and search fields only.
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order || undefined,
        orderColumn: sorter?.field || undefined,
        searchText: searchText ?? '',
    };
}

export default MapTriageTableChange;
