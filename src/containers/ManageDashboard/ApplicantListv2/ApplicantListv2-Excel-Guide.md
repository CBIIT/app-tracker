# ApplicantListv2 Export to Excel Guide

This document explains how to make the Export to Excel button render across the ApplicantListv2 views and how to keep the export data aligned with the legacy workflow columns.

The main goal is to preserve the current ApplicantListv2 architecture:

- `ApplicantListv2.js` stays the orchestration layer.
- Each workflow view decides what it renders.
- The data hooks own loading and caching.
- Excel column shape stays in one shared utility layer.

## What should happen

The button should render in every workflow view that uses the ApplicantListv2 flow:

- Triage
- Individual Scoring
- Committee Review
- Voting Complete

The button should not be reimplemented separately in each view with different data logic. Instead, each view should receive one export config object and render a shared toolbar component above the table.

When the user clicks export, the code should:

1. Read the current workflow state and active filter from the view.
2. Read the export rows already fetched by the hook.
3. Map those rows to the correct column labels.
4. Download the generated `.xlsx` file.

## Why this structure is needed

This is the best fit for React because it keeps responsibilities separated:

- The orchestrator decides which view is active.
- The view decides where the button appears.
- The hook manages the network request and loading state.
- The export utility transforms data without touching UI.

That separation keeps the UI predictable and makes the export logic testable. It also avoids duplicating Excel code inside every state view.

## Current architecture notes

`ApplicantListv2.js` already imports the export utilities, which is the right direction. The missing piece is not the data hook. The missing piece is a shared render path for the button and a clear export payload that uses the correct workflow-specific columns.

The legacy ApplicantList flow already shows the expected export column behavior. It exports a normalized dataset and uses labels such as:

- Name
- Email
- Top 25
- Focus Area
- Average Score
- Scoring Status
- Interview Recommendation
- Referred to Interview
- Selected
- Committee Comments
- Reference Status

Use that as the reference contract when you define the new workflow columns.

## Recommended file plan

### 1. Keep orchestration in `ApplicantListv2.js`

This file should decide which workflow view is active and pass an `excelExport` object down to the selected view.

### 2. Add a shared toolbar component

Create a reusable component, for example:

- `src/containers/ManageDashboard/ApplicantListv2/components/WorkflowExportToolbar.js`

This component should render:

- the Export to Excel button
- loading text or disabled state
- optional error text

### 3. Keep row loading in the hooks

The hooks already fetch the visible table data and the export data. That is the right place for network access.

### 4. Keep row-to-column mapping in the export utility layer

The column definitions and row transformer should stay in:

- `src/containers/ManageDashboard/Util/ExportToExcel/exportColumns.js`
- `src/containers/ManageDashboard/Util/ExportToExcel/exportHelpers.js`
- `src/containers/ManageDashboard/Util/ExportToExcel/ExportToExcel.js`

## Skeleton code

### A. `ApplicantListv2.js`

Put this logic near the bottom of the component, just before `return`, so the view gets one export config object.

```javascript
// ApplicantListv2.js
// Add this near the render block, after dataApi / filteredDataApi is resolved.

import { useMemo } from 'react';

const excelExport = useMemo(() => {
  const workflowState = getExportState(props.vacancyState, props.filter || activeState);
  const allRows = splitEnabled
    ? splitApplicants.excelCombinedApplicants
    : nonSplitApplicants.excelApplicants;

  const columns = getVisibleExportColumns(
    EXPORT_COLUMNS[workflowState],
    roleCaps,
    tenantCaps
  );

  return {
    workflowState,
    columns,
    rows: getExportData(allRows, columns),
    loading: splitEnabled
      ? splitApplicants.excelLoading
      : nonSplitApplicants.excelLoading,
    error: splitEnabled
      ? splitApplicants.excelError
      : nonSplitApplicants.excelError,
    onRefresh: splitEnabled
      ? splitApplicants.loadAllApplicantsForExcel
      : nonSplitApplicants.loadAllApplicantsForExcel,
  };
}, [
  props.vacancyState,
  props.filter,
  activeState,
  splitEnabled,
  splitApplicants,
  nonSplitApplicants,
  roleCaps,
  tenantCaps,
]);

return (
  <View
    {...props}
    sysId={sysId}
    roleCaps={roleCaps}
    tenantCaps={tenantCaps}
    dataApi={filteredDataApi}
    excelExport={excelExport}
    nonSplitApplicants={nonSplitApplicants}
    splitApplicants={splitApplicants}
    activeState={activeState}
    onStateChange={handleSliceChange}
  />
);
```

### B. Shared toolbar component

Put this file under a reusable view component folder so all ApplicantListv2 states can reuse it.

```javascript
// WorkflowExportToolbar.js
// Put this in src/containers/ManageDashboard/ApplicantListv2/components/
// Import it in each state view and render it above the table.

import { Button, Tooltip } from 'antd';
import ExportToExcel from '../../Util/ExportToExcel/ExportToExcel';

const WorkflowExportToolbar = ({ excelExport, filenamePrefix }) => {
  const canExport = Array.isArray(excelExport?.rows) && excelExport.rows.length > 0;

  return (
    <div className='export-toolbar'>
      <Tooltip title={excelExport?.loading ? 'Loading export data...' : 'Export the current view to Excel'}>
        <Button
          type='primary'
          ghost
          disabled={!canExport || excelExport?.loading}
          onClick={() => {
            // This is the only place that should trigger the file download.
            ExportToExcel(
              excelExport.rows,
              `${filenamePrefix}-${excelExport.workflowState}.xlsx`
            );
          }}
        >
          Export to Excel
        </Button>
      </Tooltip>
    </div>
  );
};

export default WorkflowExportToolbar;
```

### C. `triageView.js`, `indivdualScoringView.js`, `committeeReviewView.js`, `votingCompleteView.js`

Add the toolbar near the top of each view render, above the table or split table.

```javascript
// Example placement inside a view file.
// Put this just before the <div className='applicant-table'> block.

import WorkflowExportToolbar from '../../components/WorkflowExportToolbar';

return (
  <>
    {isRollingClose && (
      /* existing filter tabs stay here */
    )}

    <WorkflowExportToolbar
      excelExport={props.excelExport}
      filenamePrefix={props.vacancyTitle || 'ApplicantList'}
    />

    <div className='applicant-table'>
      {/* existing table or split table */}
    </div>
  </>
);
```

### D. `exportColumns.js`

Use one source of truth for the workbook columns. Make the workflow names match the values returned by `getExportState`.

```javascript
// exportColumns.js
// Put the column definitions here so every workflow reads the same contract.

export const EXPORT_COLUMNS = {
  triage: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'triage_status', label: 'Triage Status', roles: ['canViewTriage'] },
    { key: 'chair_triage_status', label: 'Chair Triage Status', roles: ['canViewTriage'] },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
  scoring: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'top_25', label: 'Top 25', roles: ['isVacancyManager'], tenantCaps: ['enableTop25Percent'] },
    { key: 'focus_area', label: 'Focus Area', tenantCaps: ['enableFocusArea'] },
    { key: 'average_member_score', label: 'Average Score', tenantCapsNot: ['enableTop25Percent'] },
    { key: 'scoring_status', label: 'Scoring Status' },
    { key: 'interview_recommendation', label: 'Interview Recommendation' },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
  review: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'average_member_score', label: 'Average Score', tenantCapsNot: ['enableTop25Percent'] },
    { key: 'referred_to_interview', label: 'Referred to Interview' },
    { key: 'committee_comments', label: 'Committee Comments' },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
  voting: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'average_member_score', label: 'Average Score', tenantCapsNot: ['enableTop25Percent'] },
    { key: 'referred_to_interview', label: 'Referred to Interview' },
    { key: 'referred_to_selecting_official', label: 'Referred to Selecting Official' },
    { key: 'selected', label: 'Selected' },
    { key: 'committee_comments', label: 'Committee Comments' },
    { key: 'total_received_references', label: 'Reference Status', roles: ['isVacancyManager'] },
  ],
};
```

### E. `exportHelpers.js`

Put the transformation logic here. This is where row objects become workbook-ready rows.

```javascript
// exportHelpers.js
// Put pure data-shaping helpers here. Do not touch React state in this file.

export function getVisibleExportColumns(columns, roleCaps, tenantCaps) {
  return columns.filter((column) => {
    if (Array.isArray(column.roles) && column.roles.length > 0) {
      const hasAllowedRole = column.roles.some((role) => Boolean(roleCaps?.[role]));
      if (!hasAllowedRole) {
        return false;
      }
    }

    if (Array.isArray(column.tenantCaps) && column.tenantCaps.length > 0) {
      const hasTenantCap = column.tenantCaps.some((cap) => tenantCaps?.includes(cap));
      if (!hasTenantCap) {
        return false;
      }
    }

    if (Array.isArray(column.tenantCapsNot) && column.tenantCapsNot.length > 0) {
      const blockedByTenant = column.tenantCapsNot.some((cap) => tenantCaps?.includes(cap));
      if (blockedByTenant) {
        return false;
      }
    }

    return true;
  });
}

export function getExportData(applicants, columns) {
  return (applicants || []).map((applicant) => {
    const row = {};

    columns.forEach((column) => {
      const value = applicant?.[column.key];
      row[column.label] = value ?? '';
    });

    return row;
  });
}
```

## Where to put the logic

Use this map when implementing the change.

- `ApplicantListv2.js`: decide the active workflow and pass `excelExport` into the view.
- `states/*View.js`: render the shared export toolbar above the table.
- `hooks/useNonSplitApplicants.js`: keep fetching one-table export rows.
- `hooks/useSplitApplicantTables.js`: keep fetching combined split export rows.
- `Util/ExportToExcel/exportColumns.js`: define the workflow-specific columns.
- `Util/ExportToExcel/exportHelpers.js`: filter columns and convert data.
- `Util/ExportToExcel/ExportToExcel.js`: keep the actual workbook download.

## Legacy column parity checklist

Before shipping, verify the v2 workbook includes the same semantic fields the legacy flow exported where the workflow allows them.

For the scoring and review workflows, confirm the workbook handles:

- Name
- Email
- Top 25 when the tenant allows it
- Focus Area when enabled
- Average Score when Top 25 is not the selected metric
- Scoring Status
- Interview Recommendation
- Referred to Interview
- Referred to Selecting Official in voting workflows
- Selected in voting workflows
- Committee Comments
- Reference Status for vacancy managers

For triage, keep the workbook smaller and only include the triage-specific columns.

## Why this fixes the render problem

The button will now render reliably because it is no longer tied to a single table branch or a single hook output. The view is responsible for the toolbar placement, so every workflow state can include it.

The download will work because the hook owns the data load and the utility layer owns the export conversion. That gives you one predictable place to update columns, one predictable place to update row shaping, and one predictable place to update the file download implementation.

## Suggested follow-up

If you want this to be fully production-ready, add one small test per view that verifies:

- the toolbar renders
- the button is disabled while loading
- the button calls `ExportToExcel` with the mapped rows and filename
