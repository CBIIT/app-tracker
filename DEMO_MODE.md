# Demo Mode Documentation

## Overview

The app-tracker application includes a demo mode that allows you to stub API calls with dummy data for demonstration and testing purposes. This is useful when:
- Developing features without access to a live API
- Demonstrating the application without requiring backend infrastructure
- Testing UI behavior with realistic data
- Creating training materials

## Enabling Demo Mode

There are two ways to enable demo mode:

### Method 1: Environment Variable (Persistent)

Add this to your `.env` file or environment variables during build:

```bash
REACT_APP_DEMO_MODE=true
```

### Method 2: Runtime Toggle (Browser Console)

You can enable/disable demo mode at runtime using the browser console:

```javascript
// Import and use the demo mode service
import { setDemoMode, isDemoMode } from './services/demoModeService';

// Enable demo mode
setDemoMode(true);

// Disable demo mode
setDemoMode(false);

// Check if demo mode is active
console.log(isDemoMode());
```

Or directly in browser console:

```javascript
localStorage.setItem('appTrackerDemoMode', 'true');
// Then refresh the page
```

## How It Works

When demo mode is enabled, the application sets up an axios interceptor that:

1. **Intercepts Admin API Calls**: All requests to admin endpoints are intercepted
2. **Returns Mock Data**: Instead of hitting the backend, mock data is returned with a 200 status code
3. **Preserves Normal Behavior**: All other API calls continue as normal

## Mocked Endpoints

The following 6 admin API endpoints are stubbed with demo data:

### 1. Vacancy Statistics
- **Endpoint**: `/api/x_g_nci_app_tracke/admin/vacancy_stats`
- **Returns**: Total vacancies, fill rates, vacancy timeline, status breakdown, top positions

### 2. Application Statistics
- **Endpoint**: `/api/x_g_nci_app_tracke/admin/application_stats`
- **Returns**: Application counts by status, approval rates, application timeline, pipeline stages, top vacancies

### 3. User Activity Report
- **Endpoint**: `/api/x_g_nci_app_tracke/admin/user_activity`
- **Returns**: Active user counts, role distribution, activity trends

### 4. Committee Performance
- **Endpoint**: `/api/x_g_nci_app_tracke/admin/committee_performance`
- **Returns**: Committee summary, scoring patterns, decision outcomes, participation rates

### 5. Compliance Report
- **Endpoint**: `/api/x_g_nci_app_tracke/admin/compliance_report`
- **Returns**: Overall compliance rate, compliance by category, deadline adherence, risk areas

### 6. System Audit Log
- **Endpoint**: `/api/x_g_nci_app_tracke/admin/system_audit`
- **Returns**: Audit events, events by action, recent events, activity timeline

## Demo Data Characteristics

The mock data provided represents realistic scenarios:
- **24 total vacancies** with varying statuses
- **487 applications** tracked through pipeline stages (submitted, reviewed, approved, rejected, withdrawn)
- **234 active users** with role distribution
- **12 committees** with participation metrics
- **94% compliance rate** with detailed category breakdown
- **1247 audit events** with realistic user actions and timestamps

## Customizing Mock Data

To customize the mock data:

1. Edit `/src/services/mockAdminData.js` to modify any of the 6 mock data objects
2. Changes will automatically apply when demo mode is enabled
3. No need to rebuild - the changes take effect immediately

## Testing with Demo Mode

### Enable Demo Mode for Tests

```javascript
import { setDemoMode } from './services/demoModeService';

describe('AdminDashboard', () => {
	beforeEach(() => {
		setDemoMode(true);
	});

	afterEach(() => {
		setDemoMode(false);
	});

	it('should render with demo data', () => {
		// Your test here
	});
});
```

### Example: Testing AdminDashboard with Demo Data

```javascript
import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { setDemoMode } from '../../services/demoModeService';

describe('AdminDashboard with Demo Data', () => {
	beforeEach(() => {
		setDemoMode(true);
	});

	afterEach(() => {
		setDemoMode(false);
	});

	it('displays vacancy statistics', async () => {
		render(<AdminDashboard />);
		// Wait for data to load
		await screen.findByText(/24/); // Total vacancies
		expect(screen.getByText(/Vacancy Analytics/)).toBeInTheDocument();
	});

	it('displays application statistics', async () => {
		render(<AdminDashboard />);
		await screen.findByText(/487/); // Total applications
		expect(screen.getByText(/Application Analytics/)).toBeInTheDocument();
	});
});
```

## Debugging Demo Mode

To verify that demo mode is working correctly:

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Look for `appTrackerDemoMode` key (should be 'true' if enabled)
4. In Network tab, API responses should show status "OK (DEMO MODE)"

## Performance Benefits

Demo mode provides several benefits:
- **Faster loading**: No network latency
- **Reliable data**: Consistent mock data for reproducible results
- **No backend required**: Works offline or without API access
- **Better UX testing**: Focus on UI without API errors

## Disabling Demo Mode

To disable demo mode:

### For Environment Variable
Remove or set to `false`:
```bash
REACT_APP_DEMO_MODE=false
```

### For Runtime Toggle
In browser console:
```javascript
localStorage.removeItem('appTrackerDemoMode');
// Then refresh the page
```

## Notes

- Demo mode does NOT affect non-admin API calls
- Demo mode is automatically disabled in production builds (unless explicitly enabled)
- Existing browser cache may need to be cleared when toggling demo mode
- Demo data is realistic but generated/synthetic - it does not represent actual production data
