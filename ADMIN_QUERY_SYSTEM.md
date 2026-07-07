# Admin Query System Documentation

## Overview

The Admin Query System provides a comprehensive set of tools for superusers/admins to query, analyze, and report on application tracking data. It includes services, hooks, utilities, and a dashboard for business intelligence and monitoring.

## Components

### 1. Admin API Endpoints (`src/constants/ApiEndpoints.js`)

New REST API endpoints for admin queries:

- `GET_ADMIN_VACANCY_STATS` - Fetch vacancy statistics
- `GET_ADMIN_APPLICATION_STATS` - Fetch application pipeline data
- `GET_ADMIN_USER_ACTIVITY` - Fetch user engagement metrics
- `GET_ADMIN_COMMITTEE_PERFORMANCE` - Fetch committee scoring and decision data
- `GET_ADMIN_COMPLIANCE_REPORT` - Fetch compliance tracking metrics
- `GET_ADMIN_SYSTEM_AUDIT` - Fetch system audit logs

### 2. Admin Query Service (`src/services/adminQueries.js`)

Provides reusable query builders and fetchers for admin analytics.

#### Functions

- `fetchVacancyStats(filters)` - Get vacancy analytics including fill rates and time-to-hire
- `fetchApplicationStats(filters)` - Get application pipeline data
- `fetchUserActivity(filters)` - Get user engagement metrics
- `fetchCommitteePerformance(filters)` - Get committee performance data
- `fetchComplianceReport(filters)` - Get compliance metrics
- `fetchSystemAudit(filters)` - Get system audit logs

#### AdminQueryBuilder Class

Fluent query builder for complex admin queries:

```javascript
import { AdminQueryBuilder } from '../services/adminQueries';

const query = new AdminQueryBuilder()
  .addStatusFilter('open')
  .addRoleFilter('admin')
  .setExportFormat('csv')
  .setPagination(1, 50)
  .setSorting('created_at', 'desc')
  .build();
```

### 3. Admin Query Hooks (`src/hooks/useAdminQueries.js`)

React hooks for fetching admin data with automatic loading/error states.

#### Available Hooks

- `useVacancyAnalytics(filters)` - Fetch and manage vacancy analytics
- `useApplicationAnalytics(filters)` - Fetch and manage application analytics
- `useUserActivityReport(filters)` - Fetch and manage user activity data
- `useCommitteePerformance(filters)` - Fetch and manage committee performance
- `useComplianceReport(filters)` - Fetch and manage compliance data
- `useSystemAuditLog(filters)` - Fetch and manage audit logs

#### Hook Usage Example

```javascript
import { useVacancyAnalytics } from '../hooks/useAdminQueries';

const MyComponent = () => {
  const { data, loading, error, refetch } = useVacancyAnalytics({ status: 'open' });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  return (
    <div>
      <button onClick={() => refetch({ status: 'closed' })}>
        Refresh with different filter
      </button>
      <p>Total Vacancies: {data?.totalVacancies}</p>
    </div>
  );
};
```

### 4. Query Builder Utility (`src/utils/queryBuilder.js`)

Flexible query builders with predefined filters for different data types.

#### Date Range Presets

```javascript
import { DATE_RANGE_PRESETS, getDateRangeFromPreset } from '../utils/queryBuilder';

// Available presets
DATE_RANGE_PRESETS.TODAY
DATE_RANGE_PRESETS.YESTERDAY
DATE_RANGE_PRESETS.LAST_7_DAYS
DATE_RANGE_PRESETS.LAST_30_DAYS
DATE_RANGE_PRESETS.LAST_QUARTER
DATE_RANGE_PRESETS.THIS_QUARTER
DATE_RANGE_PRESETS.LAST_FISCAL_YEAR
DATE_RANGE_PRESETS.THIS_FISCAL_YEAR
DATE_RANGE_PRESETS.CUSTOM

// Get date range for a preset
const { startDate, endDate } = getDateRangeFromPreset(DATE_RANGE_PRESETS.LAST_30_DAYS);
```

#### Filter Builders

**VacancyFilterBuilder**
```javascript
import { VacancyFilterBuilder } from '../utils/queryBuilder';

const filter = new VacancyFilterBuilder()
  .addStatus('open')
  .addPosition('Manager')
  .setDateRangePreset(DATE_RANGE_PRESETS.THIS_QUARTER)
  .build();
```

**ApplicationFilterBuilder**
```javascript
import { ApplicationFilterBuilder } from '../utils/queryBuilder';

const filter = new ApplicationFilterBuilder()
  .addStatus('submitted')
  .addStage('review')
  .addOutcome('approved')
  .addVacancy('vac123')
  .setDateRangePreset(DATE_RANGE_PRESETS.LAST_30_DAYS)
  .build();
```

**UserActivityFilterBuilder**
```javascript
import { UserActivityFilterBuilder } from '../utils/queryBuilder';

const filter = new UserActivityFilterBuilder()
  .addRole('admin')
  .addRole('reviewer')
  .addDepartment('HR')
  .setDateRangePreset(DATE_RANGE_PRESETS.THIS_FISCAL_YEAR)
  .build();
```

**CommitteeFilterBuilder**
```javascript
import { CommitteeFilterBuilder } from '../utils/queryBuilder';

const filter = new CommitteeFilterBuilder()
  .addCommittee('comm123')
  .addVacancy('vac456')
  .setDateRangePreset(DATE_RANGE_PRESETS.LAST_QUARTER)
  .build();
```

#### Pagination and Sorting

```javascript
import { Pagination, Sorting } from '../utils/queryBuilder';

const pagination = new Pagination(1, 50)
  .setPageNumber(2)
  .setPageSize(100)
  .build();

const sorting = new Sorting('created_at', 'desc')
  .setField('name')
  .toggle()
  .build();
```

### 5. Report Data Transformers (`src/utils/reportTransformers.js`)

Functions to transform raw data into reportable formats.

#### Key Functions

**calculateAggregations(data, field)**
```javascript
import { calculateAggregations } from '../utils/reportTransformers';

const stats = calculateAggregations(data, 'score');
// Returns: { count, sum, average, min, max }
```

**groupByField(data, field)**
```javascript
import { groupByField } from '../utils/reportTransformers';

const grouped = groupByField(data, 'status');
// Returns: { [status]: { count, data, percentage } }
```

**calculateKPIs(data)**
```javascript
import { calculateKPIs } from '../utils/reportTransformers';

const kpis = calculateKPIs({
  totalVacancies: 10,
  vacanciesFilled: 5,
  totalApplications: 100,
  applicationsApproved: 50,
  // ... more fields
});
// Returns: KPI calculations
```

**prepareTimeSeriesData(data, timeField, valueField, groupBy)**
```javascript
import { prepareTimeSeriesData } from '../utils/reportTransformers';

const timeSeries = prepareTimeSeriesData(
  data,
  'created_at',
  'count',
  'day' // or 'week', 'month', 'quarter', 'year'
);
// Returns: [{ date, value, count }, ...]
```

**convertToCSV(data, headers)**
```javascript
import { convertToCSV } from '../utils/reportTransformers';

const csv = convertToCSV(data, ['id', 'name', 'status']);
// Returns: CSV formatted string
```

**formatTableData(data, columnConfig)**
```javascript
import { formatTableData } from '../utils/reportTransformers';

const formatted = formatTableData(data, {
  created_at: { type: 'date' },
  approval_rate: { type: 'percentage' },
  salary: { type: 'currency' },
  score: { formatter: (val) => val.toFixed(2) }
});
```

### 6. Admin Dashboard (`src/containers/AdminDashboard/AdminDashboard.js`)

Comprehensive dashboard for viewing admin metrics and analytics.

#### Features

- **Vacancy Analytics Tab**: View vacancy statistics, fill rates, time-to-hire metrics
- **Application Analytics Tab**: View application pipeline, approval rates, withdrawal rates
- **User Activity Tab**: View active users, role distribution, activity rates
- **Committee Performance Tab**: View participation rates, review completion, performance metrics
- **Compliance Tab**: View document/reference submission rates, deadline adherence
- **System Audit Tab**: View recent system audit events

#### Usage

```javascript
import AdminDashboard from '../containers/AdminDashboard/AdminDashboard';

// Use in your routing
<Route path="/admin/dashboard" component={AdminDashboard} />
```

#### Dashboard Features

- **Date Range Selection**: Today, Last 7 Days, Last 30 Days, This Quarter
- **Refresh**: Update all data with current filters
- **Export CSV**: Download reports as CSV files
- **Real-time Statistics**: Display key metrics and KPIs
- **Responsive Design**: Works on desktop, tablet, and mobile

## Usage Examples

### Example 1: Fetch Vacancy Stats with Custom Filters

```javascript
import { useVacancyAnalytics } from '../hooks/useAdminQueries';
import { VacancyFilterBuilder, DATE_RANGE_PRESETS } from '../utils/queryBuilder';

function VacancyReport() {
  const filters = new VacancyFilterBuilder()
    .addStatus('open')
    .setDateRangePreset(DATE_RANGE_PRESETS.THIS_QUARTER)
    .build();

  const { data, loading, error } = useVacancyAnalytics(filters);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <h2>Quarterly Vacancy Report</h2>
      <p>Total Open Vacancies: {data?.totalVacancies}</p>
      <p>Filled Positions: {data?.vacanciesFilled}</p>
    </div>
  );
}
```

### Example 2: Export Application Data to CSV

```javascript
import { useApplicationAnalytics } from '../hooks/useAdminQueries';
import { convertToCSV } from '../utils/reportTransformers';

function ApplicationExport() {
  const { data } = useApplicationAnalytics({});

  const handleExport = () => {
    const csv = convertToCSV(data, ['id', 'status', 'applicant_name', 'submitted_date']);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
  };

  return <button onClick={handleExport}>Export to CSV</button>;
}
```

### Example 3: Display Committee Performance KPIs

```javascript
import { useCommitteePerformance } from '../hooks/useAdminQueries';
import { calculateKPIs } from '../utils/reportTransformers';

function CommitteeMetrics() {
  const { data } = useCommitteePerformance({});

  const kpis = calculateKPIs({
    committeeParticipating: data?.committeeParticipating,
    totalCommittee: data?.totalCommittee,
    totalReviewTime: data?.totalReviewTime,
    reviewsCompleted: data?.reviewsCompleted,
  });

  return (
    <div>
      <h2>Committee Performance</h2>
      <p>Participation Rate: {kpis.committeeParticipationRate.toFixed(2)}%</p>
      <p>Average Review Time: {kpis.averageReviewTime.toFixed(2)} hours</p>
    </div>
  );
}
```

## Security Considerations

- All admin endpoints require proper authentication and authorization
- Admin queries should be restricted to users with admin/superuser roles
- Audit logs track all admin data access for compliance
- Sensitive data should be filtered based on user permissions

## Performance Notes

- Use date range presets to limit large queries
- Pagination is recommended for large datasets (default 50 per page)
- Export formats (CSV) are recommended for large reports
- Consider caching frequently accessed reports

## Future Enhancements

- Add PDF export functionality
- Implement real-time data streaming
- Add advanced filtering UI component
- Create scheduled report generation
- Add data visualization charts
- Implement drill-down capabilities
