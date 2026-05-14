const mapVotingCompleteChange = ({ pagination, sorter, searchText }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.order,
        orderColumn: sorter?.field,
        searchText: serachText ?? '',
    };
};

export default mapVotingCompleteChange;
