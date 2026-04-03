# Duplicate API Calls Analysis - Recommended/NonRecommended Applicant Tables

## Executive Summary

When you interact with search, sort, or focus area filters on the Recommended applicant table, **3 API calls are triggered instead of the expected 2**. This occurs because two independent mechanisms fire API requests simultaneously:

1. A `useEffect` hook that reacts to search term changes
2. The Ant Design Table's `onChange` handler

These operate in parallel without coordination, causing one set of load functions to fire without the latest filter parameters, followed by another call with all parameters included.

---

## Detailed Root Cause Analysis

### The Two-Trigger Problem

Your ApplicantList component has **two separate entry points** that trigger data loading for the split Recommended/NonRecommended tables:

#### Trigger #1: useEffect Dependency on `searchText`

Located at line ~417:
```javascript
useEffect(() => {
    updateData(1, pageSize);
}, [props.vacancyState, searchText, filter]);
```

**What happens:**
- When `searchText` changes (user types in search box), this effect fires
- It calls `updateData(1, pageSize)` with NO information about the search term
- Note: `searchText` is in the dependency array but NOT passed as a parameter to `updateData`

#### Trigger #2: Table onChange Handler

The `IndividualScoringTable` components receive this prop:
```javascript
<IndividualScoringTable
    onTableChange={loadRecommendedApplicants}  // Direct function reference
    // ... other props including focusAreaFilter
/>
```

**What happens:**
- When user interacts with table (search, sort, filter), Ant Design fires the `onChange` handler
- This directly calls `loadRecommendedApplicants(page, pageSize, orderBy, orderColumn, focusArea)`
- This call HAS all the parameters including search term (via closure) and focus area

### The Parameter Gap

The `updateData` function signature:
```javascript
const updateData = async (page, pageSize, orderBy, orderColumn) => {
    if (
        props.userRoles.includes(OWM_TEAM) &&
        (props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
            props.vacancyState === VOTING_COMPLETE ||
            props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
            (props.vacancyState === ROLLING_CLOSE && filter !== TRIAGE))
    ) {
        loadRecommendedApplicants(
            1,
            recommendedApplicantsPageSize,
            orderBy,
            orderColumn
            // ❌ Missing: searchText parameter
            // ❌ Missing: focusAreaFilter parameter
        );
        loadNonRecommendedApplicants(
            1,
            nonRecommendedApplicantsPageSize,
            orderBy,
            orderColumn
            // ❌ Missing: searchText parameter
            // ❌ Missing: focusAreaFilter parameter
        );
    } else {
        loadAllApplicants(1, pageSize, orderBy, orderColumn);
    }
};
```

While `loadRecommendedApplicants` signature is:
```javascript
const loadRecommendedApplicants = async (
    page,
    pageSize,
    orderBy,
    orderColumn,
    focusArea = focusAreaFilter  // ✅ Has focusArea param
) => {
    const data = await loadApplicants(
        page,
        pageSize,
        orderBy,
        orderColumn,
        'yes',
        focusArea
    );
    // ...
};
```

And `loadApplicants` (the actual API caller) uses the search term from closure:
```javascript
const loadApplicants = async (
    page,
    pageSize,
    orderBy,
    orderColumn,
    recommended,
    focusArea
) => {
    let apiString = api + sysId + '?offset=' + offset + '&limit=' + limit;
    if (orderBy && orderColumn) {
        apiString += '&orderBy=' + orderBy + '&orderColumn=' + orderColumn;
    }
    if (recommended) apiString += '&recommended=' + recommended;
    if (searchText) apiString += '&search=' + searchText.toLowerCase();  // ✅ Uses closure
    const safeFocusArea = Array.isArray(focusArea) ? focusArea : [];
    if (safeFocusArea.length > 0) {
        apiString += '&focusArea=' + safeFocusArea.join(',');  // ✅ Uses param
    }
    // Makes API call with constructed apiString
};
```

### Call Sequence Visualization

#### Scenario: User Searches for "Smith" in Recommended Table

```
Timeline:

T0: User Types "Smith" in Recommended table search box
    ↓
T1: ColumnSearchProps onChange fires
    → Updates SearchContext: searchText = "Smith"
    ↓
T2: useEffect detects searchText dependency change
    → Calls: updateData(1, pageSize)
    → Inside: loadRecommendedApplicants(1, 50, undefined, undefined)
    → Inside: loadRecommendedApplicants → loadApplicants
    
    🔴 API CALL #1 (Recommended):
       /api/applicants?offset=1&limit=50&recommended=yes
       (NO search parameter because updateData didn't pass it)
    ↓
T3: Ant Design Table onChange fires (same event as T1)
    → Direct call: loadRecommendedApplicants(page, pageSize, orderBy, orderColumn, focusArea)
    → searchText is now "Smith" in the closure
    
    🟢 API CALL #2 (Recommended):
       /api/applicants?offset=1&limit=50&recommended=yes&search=smith
       (WITH search parameter from closure)
    
    🟢 API CALL #3 (NonRecommended):
       /api/applicants/offset=1&limit=50&recommended=no&search=smith
       (WITH search parameter from closure)

Result: 3 API calls (1 without search, 2 with search)
Expected: 2 API calls (both with search)
```

#### Scenario: User Applies Focus Area Filter

```
Timeline:

T0: User Clicks Focus Area filter checkbox
    ↓
T1: IndividualScoringTable onChange fires
    → Calls: props.onFocusAreaFilterChange(newFilter)
    → Updates component state: setFocusAreaFilter(newFilter)
    → Calls: props.onTableChange(..., newFilter) which is loadRecommendedApplicants
    
    🟢 API CALL #1 (Recommended):
       /api/applicants?offset=1&limit=50&recommended=yes&focusArea=Healthcare
       (WITH focus area)
    
    🟢 API CALL #2 (NonRecommended):
       /api/applicants?offset=1&limit=50&recommended=no&focusArea=Healthcare
       (WITH focus area)
    ↓
T2: State update triggers useEffect dependency on focusAreaFilter? 
    (Note: focusAreaFilter is NOT in the useEffect dependency array, but other state changes might be)
```

### Why This Architecture Causes Duplicates

1. **Loose Coupling**: `useEffect` and `onChange` are both valid entry points to data loading, but they don't know about each other

2. **Closure Over Parameters**: `loadApplicants` relies on closure variables (`searchText`) that may be stale when called from `updateData`

3. **Incomplete Parameter Passing**: `updateData` doesn't accept or pass through search and filter parameters, creating an information barrier

4. **Race Conditions**: Both triggers fire nearly simultaneously, and the first one may complete (or start) with stale parameters before the second, more complete call executes

5. **Context State Pattern**: Using SearchContext for search state creates a delayed update pattern where:
   - User input changes SearchContext
   - useEffect fires on change
   - Table onChange fires on same input event
   - Both use different timing to get the final state

---

## Solution Approaches

### Solution #1: Make updateData Parameter-Complete (RECOMMENDED)

**Concept:** Pass search and focus area parameters through `updateData` so all calls have complete information.

**Pros:**
- ✅ Single responsibility - `updateData` becomes the single coordinator
- ✅ Explicit parameter passing - easier to trace data flow
- ✅ Minimal changes - only affects updateData function signature and calls
- ✅ Maintainable - new developers see all required params in function signature
- ✅ Eliminates race condition - updateData creates consistent state

**Cons:**
- ⚠️ Must ensure SearchContext state is synchronized before calling updateData
- ⚠️ Slightly more parameters passed through the function

**Implementation:**

```javascript
// BEFORE
const updateData = async (page, pageSize, orderBy, orderColumn) => {
    if (
        props.userRoles.includes(OWM_TEAM) &&
        (props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
            props.vacancyState === VOTING_COMPLETE ||
            props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
            (props.vacancyState === ROLLING_CLOSE && filter !== TRIAGE))
    ) {
        loadRecommendedApplicants(
            1,
            recommendedApplicantsPageSize,
            orderBy,
            orderColumn
        );
        loadNonRecommendedApplicants(
            1,
            nonRecommendedApplicantsPageSize,
            orderBy,
            orderColumn
        );
    } else {
        loadAllApplicants(1, pageSize, orderBy, orderColumn);
    }
};

// AFTER
const updateData = async (
    page,
    pageSize,
    orderBy,
    orderColumn,
    search = searchText,  // Add search parameter
    focusArea = focusAreaFilter  // Add focus area parameter
) => {
    if (
        props.userRoles.includes(OWM_TEAM) &&
        (props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
            props.vacancyState === VOTING_COMPLETE ||
            props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
            (props.vacancyState === ROLLING_CLOSE && filter !== TRIAGE))
    ) {
        loadRecommendedApplicants(
            1,
            recommendedApplicantsPageSize,
            orderBy,
            orderColumn,
            focusArea  // Now explicitly passed
        );
        loadNonRecommendedApplicants(
            1,
            nonRecommendedApplicantsPageSize,
            orderBy,
            orderColumn,
            focusArea  // Now explicitly passed
        );
    } else {
        loadAllApplicants(1, pageSize, orderBy, orderColumn, focusArea);
    }
};

// Update all calls to updateData
useEffect(() => {
    updateData(1, pageSize, undefined, undefined, searchText, focusAreaFilter);
}, [props.vacancyState, searchText, filter, focusAreaFilter]);

// In loadVacancyAndApplicants
const loadVacancyAndApplicants = () => {
    updateData(1, pageSize, undefined, undefined, searchText, focusAreaFilter);
    props.reloadVacancy();
};
```

**Key Changes:**
1. Add `search` and `focusArea` parameters to `updateData` signature
2. Update useEffect to pass `searchText` and `focusAreaFilter` to updateData
3. Pass focusArea explicitly to all load functions within updateData
4. Update `sendReferences` and `sendRejectionEmail` to pass parameters when they call `loadVacancyAndApplicants`

---

### Solution #2: Remove useEffect from Search Dependency Chain

**Concept:** Remove `searchText` from useEffect dependency array so searches only trigger via Table onChange, and remove the search state management from context.

**Pros:**
- ✅ Eliminates dual-trigger problem entirely
- ✅ Single source of truth - only Table onChange triggers data loads
- ✅ Cleaner data flow - filter actions directly trigger loads
- ✅ Less code - simpler useEffect dependency

**Cons:**
- ❌ Major refactor - must change how search state is managed
- ❌ Breaks SearchContext pattern used across tables
- ❌ Affects multiple components (ColumnSearchProps, SearchContext)
- ❌ More complex to implement than Solution #1
- ❌ May break other functionality that depends on SearchContext

**Implementation:**

```javascript
// BEFORE
useEffect(() => {
    updateData(1, pageSize);
}, [props.vacancyState, searchText, filter]);  // ❌ searchText is dependency

// AFTER
useEffect(() => {
    updateData(1, pageSize);
}, [props.vacancyState, filter]);  // ✅ Remove searchText

// But then SearchContext can still be used internally by ColumnSearchProps
// to trigger the table's onChange handler directly
```

**Why This is Complex:**
- SearchContext is shared between ApplicantList.js and ColumnSearchProps.js
- Removing searchText dependency means ColumnSearchProps must trigger table filters differently
- Would require refactoring how column search filters work
- Other components may depend on SearchContext behavior

---

### Solution #3: Deduplicate in loadApplicants with Request Deduplication

**Concept:** Track in-flight requests and cancel/ignore stale requests before they complete.

**Pros:**
- ✅ Already partially implemented via `requestRef.current` pattern
- ✅ Prevents race condition effects (stale data overwriting fresh)
- ✅ Network requests still happen but responses are ignored
- ✅ Minimal code changes

**Cons:**
- ❌ Doesn't reduce actual API calls (still 3 requests)
- ❌ Wastes bandwidth with duplicate requests
- ❌ Slower user experience (waits for all 3 calls to start)
- ❌ Defers to slower network (depends on response times)
- ❌ Doesn't address the root architectural issue

**Current Implementation:**
```javascript
const recommendedRequestRef = useRef(0);

const loadRecommendedApplicants = async (...) => {
    const requestId = ++recommendedRequestRef.current;
    setRecommendedApplicantsTableLoading(true);
    const data = await loadApplicants(...);
    if (requestId !== recommendedRequestRef.current) {
        return;  // ✅ Already ignores stale responses
    }
    setRecommendedApplicantsTableLoading(false);
    setRecommendedApplicants(data.applicants);
    // ...
};
```

This is **already implemented** but only prevents stale data from overwriting fresh data. It doesn't prevent the API calls themselves.

---

### Solution #4: Debounce Table onChange Triggers

**Concept:** Debounce the Table onChange handler to prevent rapid-fire API calls.

**Pros:**
- ✅ Reduces unnecessary API calls from rapid user interactions
- ✅ Good user experience for fast typing/filtering
- ✅ Relatively simple to implement

**Cons:**
- ❌ Doesn't solve the core issue - still fires multiple calls
- ❌ Adds latency - user perceives slower response
- ❌ May make UI feel sluggish
- ❌ False economy - might still fire updateData + onChange

**Implementation:**
```javascript
const debouncedTableChange = useCallback(
    debounce((page, pageSize, orderBy, orderColumn, focusArea) => {
        loadRecommendedApplicants(page, pageSize, orderBy, orderColumn, focusArea);
    }, 300),
    []
);

// Pass debounced version to table
<IndividualScoringTable
    onTableChange={debouncedTableChange}
    // ...
/>
```

---

### Solution #5: Separate Search State from Filter Triggers

**Concept:** Keep search input local to the component, only pass complete state to API calls.

**Pros:**
- ✅ Clear separation of concerns - input state vs. filter state
- ✅ Prevents useEffect confusion
- ✅ Predictable update patterns

**Cons:**
- ❌ Major refactor of search handling
- ❌ Conflicts with existing SearchContext pattern
- ❌ Breaking change for search functionality

---

## Recommended Solution: Solution #1 (Parameter-Complete updateData)

**Why This Is Best:**

1. **Minimal Impact**: Only changes one function signature and its callers
2. **Maximum Clarity**: All parameters explicit in function calls - easy to debug
3. **Maintainable**: Future developers see exactly what data `updateData` needs
4. **Eliminates Root Cause**: updateData now comprehensive, no stale parameters
5. **Scalable**: Easy to add more parameters in future if needed
6. **Preserves Current Patterns**: Keeps SearchContext and onChange handler pattern intact

---

## Implementation Detailed Code Snippets

### Complete Diff for Solution #1

**File:** `src/containers/ManageDashboard/ApplicantList/ApplicantList.js`

#### Change 1: Update updateData Signature and Implementation

```javascript
// ========== BEFORE ==========
const updateData = async (page, pageSize, orderBy, orderColumn) => {
    if (
        props.userRoles.includes(OWM_TEAM) &&
        (props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
            props.vacancyState === VOTING_COMPLETE ||
            props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
            (props.vacancyState === ROLLING_CLOSE && filter !== TRIAGE))
    ) {
        loadRecommendedApplicants(
            1,
            recommendedApplicantsPageSize,
            orderBy,
            orderColumn
        );
        loadNonRecommendedApplicants(
            1,
            nonRecommendedApplicantsPageSize,
            orderBy,
            orderColumn
        );
    } else {
        loadAllApplicants(1, pageSize, orderBy, orderColumn);
    }
};

// ========== AFTER ==========
const updateData = async (
    page,
    pageSize,
    orderBy,
    orderColumn,
    search = searchText,
    focus = focusAreaFilter
) => {
    if (
        props.userRoles.includes(OWM_TEAM) &&
        (props.vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS ||
            props.vacancyState === VOTING_COMPLETE ||
            props.vacancyState === COMMITTEE_REVIEW_IN_PROGRESS ||
            (props.vacancyState === ROLLING_CLOSE && filter !== TRIAGE))
    ) {
        loadRecommendedApplicants(
            1,
            recommendedApplicantsPageSize,
            orderBy,
            orderColumn,
            focus
        );
        loadNonRecommendedApplicants(
            1,
            nonRecommendedApplicantsPageSize,
            orderBy,
            orderColumn,
            focus
        );
    } else {
        loadAllApplicants(1, pageSize, orderBy, orderColumn, focus);
    }
};
```

#### Change 2: Update useEffect to Pass Search and Focus Area

```javascript
// ========== BEFORE ==========
useEffect(() => {
    updateData(1, pageSize);
}, [props.vacancyState, searchText, filter]);

// ========== AFTER ==========
useEffect(() => {
    updateData(1, pageSize, undefined, undefined, searchText, focusAreaFilter);
}, [props.vacancyState, searchText, filter, focusAreaFilter]);
```

#### Change 3: Update loadVacancyAndApplicants

```javascript
// ========== BEFORE ==========
const loadVacancyAndApplicants = () => {
    updateData(1, pageSize);
    props.reloadVacancy();
};

// ========== AFTER ==========
const loadVacancyAndApplicants = () => {
    updateData(1, pageSize, undefined, undefined, searchText, focusAreaFilter);
    props.reloadVacancy();
};
```

#### Change 4: Update loadAllApplicants to Accept focusArea

```javascript
// ========== BEFORE ==========
const loadAllApplicants = async (
    page,
    pageSize,
    orderBy,
    orderColumn,
    focusArea = focusAreaFilter
) => {
    // ... existing code
};

// No change needed - it already accepts focusArea parameter!
// Just verify it's being used correctly
```

---

## Testing Strategy

After implementing Solution #1:

### Test Case 1: Search in Recommended Table
**Steps:**
1. Navigate to a vacancy with multiple applicants
2. Open browser Network Developer Tools
3. Type a search term in the Recommended table search
4. **Expected**: Only 2 API calls (1 Recommended with search, 1 NonRecommended with search)
5. **Verify**: Both calls include `&search=<term>` parameter

### Test Case 2: Sort in Recommended Table
**Steps:**
1. Click on column header in Recommended table to sort
2. **Expected**: 2 API calls with sort parameters
3. **Verify**: Both calls include `&orderBy=<order>&orderColumn=<field>`

### Test Case 3: Focus Area Filter
**Steps:**
1. Select a focus area checkbox in Recommended table
2. **Expected**: 2 API calls with focus area filter
3. **Verify**: Both calls include `&focusArea=<area>`

### Test Case 4: Combined Filters
**Steps:**
1. Search for a term AND apply focus area filter
2. **Expected**: 2 API calls with both `&search=<term>` AND `&focusArea=<area>`
3. **Verify**: Each call is complete with all parameters

### Test Case 5: Reference Collection
**Steps:**
1. Click "Collect References" button
2. Confirm collection
3. **Expected**: 2 API calls after reload (via loadVacancyAndApplicants)
4. **Verify**: Parameters preserved if user had search/filter active

---

## Summary Table

| Solution | API Calls Reduced | Code Complexity | Breaking Changes | Maintainability |
|----------|-------------------|-----------------|------------------|-----------------|
| #1: Parameter-Complete updateData | YES (3→2) | Low | No | Excellent |
| #2: Remove useEffect Dependency | YES (3→2) | High | Yes | Poor |
| #3: Request Deduplication | NO (3→3) | Low | No | Excellent |
| #4: Debounce onChange | Partial | Low | No | Good |
| #5: Separate Search State | YES (3→2) | Very High | Yes | Good |

**Recommendation: Implement Solution #1**

---

## Additional Notes

### Why the Current Code Has Duplicates

The current code already has **partial mitigation** with the `requestRef` pattern:
```javascript
const requestId = ++recommendedRequestRef.current;
// ...
if (requestId !== recommendedRequestRef.current) return;  // Ignore stale
```

This prevents **stale data** from overwriting fresh data, but it doesn't prevent the **API calls themselves**. Both calls still execute and consume bandwidth.

### Future Improvements

After fixing the duplicate calls, consider:
1. **Centralized Filter State Manager**: Move search/filter logic to a custom hook
2. **Request Cancellation**: Use AbortController to actually cancel in-flight requests
3. **Caching**: Implement response caching to reduce API hits on repeated searches
4. **Pagination**: Consider infinite scroll instead of page-based pagination for better UX

---

## Questions?

Key decision points:
1. Are you comfortable with the parameter-complete approach, or prefer a different solution?
2. Do other components depend on SearchContext behavior that would complicate Solution #2?
3. Should we add request cancellation (AbortController) alongside parameter deduplication?
