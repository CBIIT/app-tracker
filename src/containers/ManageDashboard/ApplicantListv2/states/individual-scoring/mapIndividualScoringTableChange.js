const mapIndividualScoringChanges = ({
    pagination,
    filters,
    sorter,
    searchText,
    focusArea,
}) => {
    const nextFocusArea = Array.isArray(filters?.focus_area)
        ? filters.focus_area
        : focusArea;

    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order,
        orderColumn: sorter?.field,
        searchText: searchText ?? '',
        focusArea: Array.isArray(nextFocusArea) ? nextFocusArea : [],
    };
};

export default mapIndividualScoringChanges;
