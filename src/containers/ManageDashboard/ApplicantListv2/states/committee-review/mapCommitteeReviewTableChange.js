const mapCommitteeReviewChange = ({ pagination, sorter, searchText }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order,
        orderColumn: sorter?.field,
        searchText: searchText ?? '',
    };
};

export default mapCommitteeReviewChange;
