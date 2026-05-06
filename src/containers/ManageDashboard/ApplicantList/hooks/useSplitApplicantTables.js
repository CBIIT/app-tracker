export const useSplitApplicantTables = (props) => {
    return {
        query,                  // Current query state
        recommendedApplicants,  // Loaded Data
        nonRecommendedApplicants,
        recommendedLoading,     // Loading flags
        nonRecommendedLoading,
        recommendedPagination,  // Pagination info
        nonRecommendedPagination,
        handleTableChange,      // Main event handler
        initializeForVacancy,   // Reset when vacancy changes
        refresh,                // Manual refresh
    };
};