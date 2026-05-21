// Returns the export state string for the current workflow
export function getExportState(vacancyState, filter) {
    if (vacancyState === 'rolling_close') {
        switch (filter) {
            case 'scoring':
                return 'scoring';
            case 'in_review':
                return 'review';
            case 'review_complete':
            case 'completed':
                return 'voting';
            case 'triage':
            default:
                return 'triage';
        }
    }

    switch (vacancyState) {
        case 'triage':
            return 'triage';
        case 'individual_scoring_in_progress':
            return 'scoring';
        case 'committee_review_in_progress':
            return 'review';
        case 'voting_complete':
            return 'voting';
        default:
            return 'triage';
    }
}

const hasCapability = (capabilities, capabilityName) => {
    if (!capabilityName) {
        return false;
    }

    if (Array.isArray(capabilities)) {
        return capabilities.includes(capabilityName);
    }

    // Current ApplicantListv2 tenant caps are a boolean map object.
    if (capabilities && typeof capabilities === 'object') {
        if (Boolean(capabilities[capabilityName])) {
            return true;
        }

        // Backward-compatible aliases used by adapters/columns.
        if (capabilityName === 'enableTop25Percent') {
            return Boolean(capabilities.showTop25);
        }
    }

    return false;
};

// Returns filtered column list based on roleCaps and tenantCaps
export function getVisibleExportColumns(columns, roleCaps, tenantCaps) {
    const safeColumns = Array.isArray(columns) ? columns : [];
    const safeRoleCaps = roleCaps && typeof roleCaps === 'object' ? roleCaps : {};

    return safeColumns.filter((col) => {
        // If a column requires roles, include only when at least one role is granted.
        if (Array.isArray(col.roles) && col.roles.length > 0) {
            const hasRole = col.roles.some((role) => Boolean(safeRoleCaps[role]));
            if (!hasRole) {
                return false;
            }
        }

        // If a column requires tenant capabilities, include only when at least one is enabled.
        if (Array.isArray(col.tenantCaps) && col.tenantCaps.length > 0) {
            const hasRequiredTenantCap = col.tenantCaps.some((cap) =>
                hasCapability(tenantCaps, cap)
            );
            if (!hasRequiredTenantCap) {
                return false;
            }
        }

        // Exclude columns when a blocked tenant capability is enabled.
        if (Array.isArray(col.tenantCapsNot) && col.tenantCapsNot.length > 0) {
            const isBlockedByTenantCap = col.tenantCapsNot.some((cap) =>
                hasCapability(tenantCaps, cap)
            );
            if (isBlockedByTenantCap) {
                return false;
            }
        }

        return true;
    });
}

// Transforms applicant data for export
export function getExportData(applicants, columns) {
    const safeApplicants = Array.isArray(applicants) ? applicants : [];
    const safeColumns = Array.isArray(columns) ? columns : [];

    return safeApplicants.map((applicant) => {
        const row = {};

        safeColumns.forEach((col) => {
            row[col.label] = applicant?.[col.key] ?? '';
        });

        return row;
    });
}
