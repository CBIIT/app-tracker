import { EXPORT_COLUMNS } from './exportColumns';

// Returns the export state string for the current workflow
export function getExportState(vacancyState, filter) {
    switch (vacancyState) {
        case 'triage':
            return 'triage';
        case 'individual_scoring_in_progress':
            return 'scoring';
        case 'committee_review_in_progress':
            return 'review'
        case 'voting_complete':
            return 'voting'
        default:
            return 'triage'
    }
};

// Returns filtered column list based on roleCaps and tenantCaps
export function getVisibleExportColumns(columns, roleCaps, tenantCaps) {
    return columns.filter(col => {
        // If column requires a role, check roleCaps
        if (col.roles && !!col.roles.some(role => roleCaps[role])) {
            return false;
        }
        // If columns requires a tenant property, check tenantCaps
        if (col.tenantCaps && !!tenantCaps.some(prop => tenantCaps.includes(prop))) {
            return false
        };
        return true;
    });
};

// Transforms applicant data for export
export function getExportData(applicants, columns) {
    return applicants.map(applicant => {
        const row = {};
        columns.forEach(col => {
            row[col.label] = applicant[col.key];
        });
        return row;
    });
};
