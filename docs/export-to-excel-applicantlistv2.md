# ApplicantListv2 Excel Export: State, Role, and Tenant-Aware Implementation

This guide provides a detailed, step-by-step approach to implementing robust Excel export in `ApplicantListv2`, supporting:
- State-specific columns (Triage, Individual Scoring, Committee Review, Voting Complete)
- Dynamic column visibility based on user roles (`roleCaps`) and tenant properties
- Clean, modular, and maintainable code structure

---

## 1. **Overview of the ExportToExcel Utility**

- **Location:** `src/containers/ManageDashboard/Util/ExportToExcel/ExportToExcel.js`
- **Purpose:** Exports an array of objects to an Excel file using `xlsx` and `file-saver`.
- **Usage:**
  ```js
  ExportToExcel(data, filename);
  ```

---

## 2. **Design Goals for ApplicantListv2 Export**

- Export columns must adapt to the current workflow state.
- Columns must be shown/hidden based on `roleCaps` and tenant properties.
- All export logic and configuration should be modular and testable.
- UI should provide clear feedback (disable button if no data, show loading state).

---

## 3. **File Structure for Modular Export**

- `ExportToExcel.js` (already exists): Core export utility.
- `exportColumns.js` (NEW): State, role, and tenant-aware column definitions.
- `exportHelpers.js` (NEW): Helpers for state/role/tenant logic and data transformation.

---

## 4. **Step-by-Step Implementation**

### a. **Define Column Metadata (exportColumns.js)**

Create a new file:
`src/containers/ManageDashboard/Util/ExportToExcel/exportColumns.js`

```js
// Each column can specify required roles/tenant properties for visibility
export const EXPORT_COLUMNS = {
  triage: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'triage_status', label: 'Triage Status', roles: ['canViewTriage'] },
    // ...
  ],
  scoring: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'average_score', label: 'Average Score', roles: ['canViewScores'] },
    { key: 'focus_area', label: 'Focus Area', tenantProps: ['enableFocusArea'] },
    // ...
  ],
  review: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'interview_recommendation', label: 'Interview Recommendation', roles: ['canViewInterview'] },
    { key: 'committee_comments', label: 'Committee Comments', roles: ['canViewComments'] },
    // ...
  ],
  voting: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'selected', label: 'Selected', roles: ['canViewVoting'] },
    { key: 'referred_to_selecting_official', label: 'Referred to Selecting Official', roles: ['canViewVoting'] },
    // ...
  ],
};
```

---

### b. **Column Filtering Logic (exportHelpers.js)**

Create a new file:
`src/containers/ManageDashboard/Util/ExportToExcel/exportHelpers.js`

```js
import { EXPORT_COLUMNS } from './exportColumns';

// Returns the export state string for the current workflow
export function getExportState(vacancyState, filter) {
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

// Returns a filtered column list based on roleCaps and tenantProps
export function getVisibleExportColumns(columns, roleCaps, tenantProps) {
  return columns.filter(col => {
    // If column requires a role, check roleCaps
    if (col.roles && !col.roles.some(role => roleCaps[role])) return false;
    // If column requires a tenant property, check tenantProps
    if (col.tenantProps && !col.tenantProps.some(prop => tenantProps.includes(prop))) return false;
    return true;
  });
}

// Transforms applicant data for export
export function getExportData(applicants, columns) {
  return applicants.map(applicant => {
    const row = {};
    columns.forEach(col => {
      row[col.label] = applicant[col.key];
    });
    return row;
  });
}
```

---

### c. **Integrate in ApplicantListv2**

```js
import ExportToExcel from '../Util/ExportToExcel/ExportToExcel';
import { EXPORT_COLUMNS } from '../Util/ExportToExcel/exportColumns';
import { getExportState, getVisibleExportColumns, getExportData } from '../Util/ExportToExcel/exportHelpers';
// ...existing imports...

const ApplicantListv2 = (props) => {
  // ...existing state and hooks...
  const [isLoadingExcelData, setIsLoadingExcelData] = useState(false);

  // Assume roleCaps and resolvedTenantProperties are already computed in the component

  const handleExport = () => {
    setIsLoadingExcelData(true);
    const exportState = getExportState(props.vacancyState, props.filter);
    const allColumns = EXPORT_COLUMNS[exportState];
    const visibleColumns = getVisibleExportColumns(allColumns, roleCaps, resolvedTenantProperties.map(p => p.name));
    const data = getExportData(filteredDataApi.applicants, visibleColumns);
    ExportToExcel(data, `ApplicantList-${exportState}-${Date.now()}.xlsx`);
    setIsLoadingExcelData(false);
  };

  return (
    <Button
      disabled={filteredDataApi.applicants.length === 0 || isLoadingExcelData}
      loading={isLoadingExcelData}
      onClick={handleExport}
    >
      Export to Excel
    </Button>
    // ...rest of the component...
  );
};
```

---

## 5. **Legacy Exported Columns by State (What Exists Today)**

Use this section as the source of truth for how legacy export behaves before v2 refactor.

### 5.1 **Global Rules**

- Export uses the current `excelApplicantColumns` list.
- Only columns with a `dataIndex` are exported.
- Action/button columns and icon-only columns do not export.

### 5.2 **Base Export Columns (Default Fallback)**

When dynamic scoring columns are not overriding, legacy starts from:

1. Applicant
2. Email
3. Submitted
4. Vacancy Manager Triage Decision
5. Chair Triage Decision
6. Reference Status

### 5.3 **Committee Role Override (Applies Across States)**

For these committee roles, legacy rewrites export columns:

- Committee Member Read Only:
1. Applicant
2. Email

- Committee Member Voting and Committee Member Non Voting:
1. Applicant
2. Email
3. Raw Score
4. Average Score
5. Recommend Interview?

### 5.4 **State: Triage**

Most commonly exports the base fallback set:

1. Applicant
2. Email
3. Submitted
4. Vacancy Manager Triage Decision
5. Chair Triage Decision
6. Reference Status

If user is in committee override roles, use section 5.3 instead.

### 5.5 **State: Individual Scoring**

Base columns in scoring table:

1. Applicant
2. Email

Conditional columns:

1. Top 25% (only when isVacancyManager and tenant property enableTop25Percent is true)
2. Focus Area (only when tenant property enableFocusArea is true)
3. Average Score (only when Top 25% feature is not enabled)
4. Scoring Status (when not yet in review/voting branch)
5. Interview Recommendation (when not yet in review/voting branch)
6. Reference Status (when isVacancyManager)

### 5.6 **State: Committee Review In Progress**

Base:

1. Applicant
2. Email

Then typically:

1. Average Score (if Top 25% is not enabled)
2. Referred to Interview
3. Committee Comments
4. Reference Status (if isVacancyManager)

Optional in some flows:

1. Focus Area (if tenant property enableFocusArea is true in scoring-related flow)

### 5.7 **State: Voting Complete**

Base:

1. Applicant
2. Email

Then typically:

1. Average Score (if Top 25% is not enabled)
2. Referred to Interview
3. Referred to Selecting Official
4. Selected
5. Committee Comments
6. Reference Status (if isVacancyManager)

Optional in some flows:

1. Focus Area (if tenant property enableFocusArea is true in scoring-related flow)

### 5.8 **Rolling Close Mapping**

Rolling close slices map to the same export column behavior:

1. Triage slice -> Triage behavior
2. Scoring slice -> Individual Scoring behavior
3. In Review slice -> Committee Review behavior
4. Review Complete or Completed slice -> Voting Complete behavior

### 5.9 **Known Legacy Field Differences**

- Committee override path uses `average_score`.
- IndividualScoringTable path uses `average_member_score` for Average Score.
- This can create differences in exported values by role/path.

### 5.10 **How to Represent This Cleanly in v2 Config**

Create state configs in `exportColumns.js` with role and tenant guards, then filter with helper logic:

```js
export const EXPORT_COLUMNS = {
  triage: [
    { key: 'applicant_name', label: 'Applicant' },
    { key: 'applicant_email', label: 'Email' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'triage_status', label: 'Vacancy Manager Triage Decision', roles: ['canViewTriage'] },
    { key: 'chair_triage_status', label: 'Chair Triage Decision', roles: ['canViewTriage'] },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
  scoring: [
    { key: 'applicant_name', label: 'Applicant' },
    { key: 'applicant_email', label: 'Email' },
    { key: 'top_25', label: 'Top 25%', roles: ['isVacancyManager'], tenantProps: ['enableTop25Percent'] },
    { key: 'focus_area', label: 'Focus Area', tenantProps: ['enableFocusArea'] },
    { key: 'average_member_score', label: 'Average Score', tenantPropsNot: ['enableTop25Percent'] },
    { key: 'scoring_status', label: 'Scoring Status', stages: ['scoring'] },
    { key: 'interview_recommendation', label: 'Interview Recommendation', stages: ['scoring'] },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
  review: [
    { key: 'applicant_name', label: 'Applicant' },
    { key: 'applicant_email', label: 'Email' },
    { key: 'average_member_score', label: 'Average Score', tenantPropsNot: ['enableTop25Percent'] },
    { key: 'referred_to_interview', label: 'Referred to Interview' },
    { key: 'committee_comments', label: 'Committee Comments' },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
  voting: [
    { key: 'applicant_name', label: 'Applicant' },
    { key: 'applicant_email', label: 'Email' },
    { key: 'average_member_score', label: 'Average Score', tenantPropsNot: ['enableTop25Percent'] },
    { key: 'referred_to_interview', label: 'Referred to Interview' },
    { key: 'referred_to_selecting_official', label: 'Referred to Selecting Official' },
    { key: 'selected', label: 'Selected' },
    { key: 'committee_comments', label: 'Committee Comments' },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
};
```

---

## 6. **Best Practices and Edge Cases**

- **Dynamic Columns:** You can extend `getVisibleExportColumns` to support user-selected columns.
- **Localization:** Use a translation function for `label` if needed.
- **Testing:** Add unit tests for `exportHelpers.js` to ensure correct filtering and transformation.
- **Performance:** Memoize visible columns if role/tenant state is stable.
- **UI Feedback:** Always disable the export button if no data or while loading.

---

## 7. **Optional Enhancements**

- Allow users to select columns to export (e.g., via a modal or settings panel).
- Add tooltips or help text for the export button.
- Show a notification on successful export.
- Support exporting recommended/non-recommended tables separately if needed.
- Add unit tests for exportHelpers.js to ensure correct data transformation.

---

**By following this approach, you ensure that Excel export in ApplicantListv2 is robust, state-aware, role/tenant-aware, and maintainable.**
