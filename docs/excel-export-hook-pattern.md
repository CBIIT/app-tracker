# Centralizing Excel Export Data Fetching in ApplicantListv2 Hooks

## Overview

This guide explains how and why to move the logic for fetching all applicants for Excel export into your custom React hooks (e.g., `useNonSplitApplicants`, `useSplitApplicantTables`), with the actual API call implemented in `applicantListService.js`. This approach keeps your components clean, improves maintainability, and makes the data flow more predictable.

---

## Why Centralize Excel Data Fetching in Hooks?

- **Separation of Concerns:** Keeps data-fetching logic out of UI components.
- **Consistency:** All applicant data (paginated, split, or full-for-Excel) is managed in one place.
- **Reusability:** Hooks can be reused across components and tested independently.
- **Coordination:** Ensures Excel data is only fetched after main data loads, avoiding race conditions.
- **State Management:** Loading/error states for Excel export can be managed alongside other applicant data.
- **Future-Proof:** Easy to extend for new filters, roles, or tenant logic.

---

## Recommended Structure

- **applicantListService.js**
  - Add a function like `fetchAllApplicantsForExcel` that fetches all applicants (with a high limit or special endpoint).
- **useNonSplitApplicants.js / useSplitApplicantTables.js**
  - Add state for Excel data, loading, and error.
  - Add a method (e.g., `loadAllApplicantsForExcel`) that calls the service and updates state.
  - Expose Excel data and loading state from the hook.
- **Component (e.g., ApplicantListv2.js)**
  - Call the hook’s Excel loader when needed (e.g., after main data loads or on export button click).
  - Use the Excel data from the hook for export.

---

## Skeleton Code

### 1. applicantListService.js
```js
// Fetches all applicants for Excel export (no pagination)
export const fetchAllApplicantsForExcel = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data?.result?.applicants || [];
  } catch (error) {
    // Handle error (show message, log, etc.)
    throw error;
  }
};
```

### 2. useNonSplitApplicants.js (additions)
```js
import { fetchAllApplicantsForExcel } from '../services/applicantListService';

export const useNonSplitApplicants = ({ ... }) => {
  // ...existing state...
  const [excelApplicants, setExcelApplicants] = useState([]);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState(null);

  // Loads all applicants for Excel export
  const loadAllApplicantsForExcel = useCallback(async () => {
    setExcelLoading(true);
    setExcelError(null);
    try {
      // Build a URL with a high limit (e.g., 1000) or use a dedicated endpoint
      const url = buildApplicantListUrl({
        ...query,
        page: 1,
        pageSize: 1000, // or whatever max is safe
      });
      const allApplicants = await fetchAllApplicantsForExcel(url);
      setExcelApplicants(allApplicants);
    } catch (err) {
      setExcelError(err);
      setExcelApplicants([]);
    } finally {
      setExcelLoading(false);
    }
  }, [query, buildApplicantListUrl]);

  // ...rest of hook...
  return {
    // ...existing return values...
    excelApplicants,
    excelLoading,
    excelError,
    loadAllApplicantsForExcel,
  };
};
```

### 3. ApplicantListv2.js (usage)
```js
const nonSplitApplicants = useNonSplitApplicants({ ... });

// When you want to trigger Excel data load (e.g., after main data loads or on export click):
useEffect(() => {
  if (shouldLoadExcelData) {
    nonSplitApplicants.loadAllApplicantsForExcel();
  }
}, [shouldLoadExcelData, nonSplitApplicants]);

// Use nonSplitApplicants.excelApplicants for ExportToExcel
<Button
  disabled={nonSplitApplicants.excelApplicants.length === 0 || nonSplitApplicants.excelLoading}
  loading={nonSplitApplicants.excelLoading}
  onClick={() => ExportToExcel(nonSplitApplicants.excelApplicants, 'Applicants.xlsx')}
>
  Export to Excel
</Button>
```

---

## Comments & Guidance for Future Developers

- **Why not fetch all in the component?**
  - Keeping all data logic in hooks makes the codebase easier to reason about and test.
- **What if the API changes?**
  - Only the service and hook need to be updated, not every component.
- **How to handle large datasets?**
  - Consider server-side streaming, batching, or a dedicated export endpoint if applicant pools are very large.
- **How to trigger Excel reloads?**
  - Call `loadAllApplicantsForExcel` whenever filters/search change, or only on explicit export.
- **How to handle split-table mode?**
  - Add similar logic to `useSplitApplicantTables` for recommended/non-recommended Excel exports.

---

## Summary

Centralizing Excel export data fetching in hooks and services:
- Keeps UI code clean
- Makes data flow predictable
- Simplifies future maintenance and testing

**Stick to this pattern for all future data-heavy features!**
