const mapCommitteeReviewChange = ({ pagination, sorter }) => {
    return {
        page: pagination?.current,
        pageSize: pagination?.pageSize,
        orderBy: sorter?.orderBy,
        orderColumn: sorter?.field
    };
};

export default mapCommitteeReviewChange;
