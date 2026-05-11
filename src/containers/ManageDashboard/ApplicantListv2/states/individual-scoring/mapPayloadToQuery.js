const mapIndividualScoringChanges = ({ pagination, sorter, searchText, focusArea }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order,
        orderColumn: sorter?.field,
        searchText,
        focusArea,
    };
};

export default mapIndividualScoringChanges;
