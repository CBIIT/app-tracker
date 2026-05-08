const mapIndividualScoringChanges = ({ pagination, sorter, searchText, focusArea }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.orderBy,
        orderColumn: sorter?.field,
        searchText,
        focusArea,
    };
};

export default mapIndividualScoringChanges;
