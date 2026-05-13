const MapTriageTableChange = ({ pagination, sorter, searchText }) => {
    return {
        // Minimal payload for triage: page/sort/search (no focus-area filter in triage).
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order || undefined,
        orderColumn: sorter?.field || undefined,
        searchText: searchText ?? '',
    };
}

export default MapTriageTableChange;
