import React, { useMemo } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
	MARYLAND_LOCATIONS,
	MARYLAND_CENTER,
	MARYLAND_ZOOM,
	getMarylandLocationsWithData,
} from '../../../data/maryland-locations';
import './MarylandVacancyMap.css';

// Fix for leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Creates a custom icon with a circular badge showing vacancy count
 */
const createCustomIcon = (count) => {
	const html = `
    <div class="vacancy-marker-badge">
      <div class="badge-count">${count}</div>
    </div>
  `;

	return L.divIcon({
		html,
		iconSize: [40, 40],
		iconAnchor: [20, 40],
		popupAnchor: [0, -40],
		className: 'vacancy-marker',
	});
};

/**
 * MarylandVacancyMap Component
 * Displays vacancies by location on an interactive Maryland map
 */
const MarylandVacancyMap = ({ locationData = [], isLoading = false }) => {
	const marylandData = useMemo(() => getMarylandLocationsWithData(locationData), [locationData]);

	const maxVacancies = useMemo(() => {
		if (marylandData.length === 0) return 1;
		return Math.max(...marylandData.map((item) => item.value || 0));
	}, [marylandData]);

	if (isLoading) {
		return (
			<div className='MarylandVacancyMapContainer'>
				<div className='MapLoadingSpinner'>Loading map...</div>
			</div>
		);
	}

	return (
		<div className='MarylandVacancyMapContainer'>
			<Map
				center={MARYLAND_CENTER}
				zoom={MARYLAND_ZOOM}
				className='MarylandVacancyMapLeaflet'
				maxZoom={15}
				minZoom={7}
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='&copy; OpenStreetMap contributors'
					maxZoom={19}
				/>

				{marylandData.map((item, index) => (
					<Marker
						key={index}
						position={[item.coordinates.lat, item.coordinates.lng]}
						icon={createCustomIcon(item.value)}
					>
						<Popup className='VacancyPopup'>
							<div className='PopupContent'>
								<h4>{item.name}</h4>
								<p>
									<strong>Vacancies:</strong> {item.value}
								</p>
								<p>
									<strong>Region:</strong> {item.coordinates.region}
								</p>
							</div>
						</Popup>
					</Marker>
				))}
			</Map>
			{marylandData.length === 0 && (
				<div className='MapEmptyState'>
					<p>No vacancy location data available</p>
				</div>
			)}
		</div>
	);
};

export default MarylandVacancyMap;
