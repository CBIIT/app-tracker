/**
 * Maryland location coordinates for vacancy mapping
 * Includes major Maryland cities/areas where NIH vacancies may be located
 */

export const MARYLAND_LOCATIONS = {
	'Bethesda, MD': { lat: 38.9847, lng: -77.0945, region: 'Montgomery County' },
	'Rockville, MD': { lat: 39.0840, lng: -77.1528, region: 'Montgomery County' },
	'Frederick, MD': { lat: 39.4143, lng: -77.4105, region: 'Frederick County' },
	'Gaithersburg, MD': { lat: 39.1434, lng: -77.2026, region: 'Montgomery County' },
	'Silver Spring, MD': { lat: 39.0026, lng: -77.0369, region: 'Montgomery County' },
	'Bowie, MD': { lat: 39.0107, lng: -76.7816, region: 'Prince George\'s County' },
	'Columbia, MD': { lat: 39.2034, lng: -76.8905, region: 'Howard County' },
	'Annapolis, MD': { lat: 38.9776, lng: -76.4922, region: 'Anne Arundel County' },
	'Baltimore, MD': { lat: 39.2904, lng: -76.6122, region: 'Baltimore City' },
	'Remote': { lat: 39.0639, lng: -77.1800, region: 'Remote' },
};

/**
 * Maryland bounding box for map centering
 * [minLat, minLng, maxLat, maxLng]
 */
export const MARYLAND_BOUNDS = [
	[37.8, -79.5], // Southwest
	[39.7, -75.3], // Northeast
];

/**
 * Default map center (center of Maryland)
 */
export const MARYLAND_CENTER = [39.0639, -77.1800];

/**
 * Default map zoom level for Maryland
 */
export const MARYLAND_ZOOM = 8;

/**
 * Helper function to get location coordinates
 */
export const getLocationCoordinates = (locationName) => {
	return MARYLAND_LOCATIONS[locationName] || null;
};

/**
 * Helper function to get all unique Maryland locations with data
 */
export const getMarylandLocationsWithData = (locationData) => {
	if (!locationData || !Array.isArray(locationData)) {
		return [];
	}

	return locationData
		.filter((item) => MARYLAND_LOCATIONS[item.name])
		.map((item) => ({
			...item,
			coordinates: MARYLAND_LOCATIONS[item.name],
		}));
};
