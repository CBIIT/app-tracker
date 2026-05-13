const mapIndividualScoringChanges = ({
    pagination,
    filters,
    sorter,
    searchText,
    focusArea,
}) => {
    // Prefer live values from antd filters when available, otherwise preserve
    // the focus-area array supplied by caller.
    const nextFocusArea = Array.isArray(filters?.focus_area)
        ? filters.focus_area
        : focusArea;

    return {
        // This output matches the query payload contract expected by dataApi.handleTableChange.
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order,
        orderColumn: sorter?.field,
        searchText: searchText ?? '',
        focusArea: Array.isArray(nextFocusArea) ? nextFocusArea : [],
    };
};

export default mapIndividualScoringChanges;
