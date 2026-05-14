const mapIndividualScoringChanges = ({
    pagination,
    filters,
    sorter,
    searchText,
    focusArea,
}) => {
    // Prefer live focus-area values from Ant Table filters when available.
    const nextFocusArea = Array.isArray(filters?.focus_area)
        ? filters.focus_area
        : focusArea;

    return {
        // Output matches the query payload contract expected by dataApi.handleTableChange.
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order,
        orderColumn: sorter?.field,
        searchText: searchText ?? '',
        focusArea: Array.isArray(nextFocusArea) ? nextFocusArea : [],
    };
};

export default mapIndividualScoringChanges;
