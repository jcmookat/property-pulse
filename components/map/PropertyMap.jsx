'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const MapProps = {
	lat: 52.505,
	lng: -0.09,
};
const PropertyMap = ({ property }) => {
	return (
		<MapContainer
			center={[MapProps.lat, MapProps.lng]}
			zoom={13}
			scrollWheelZoom={true}
			style={{ height: '500px', width: '100%' }}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<Marker position={[MapProps.lat, MapProps.lng]} draggable={false}>
				<Popup>{property.name}</Popup>
			</Marker>
		</MapContainer>
	);
};

export default PropertyMap;
