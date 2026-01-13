import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import ErrorBoundary from './ErrorBoundary';

// Fix Leaflet default marker icons issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const CommunityMap = () => {
  const centerPosition = [26.7658, 83.3649];  // Example coordinates

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Community Issues Map
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-xl">
         Reported issues in _____ area. (<a href="#" className="text-blue-500 underline">0 issues</a>)
      </p>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <ErrorBoundary>
          <MapContainer center={centerPosition} zoom={13} style={{ height: "500px", width: "600px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={centerPosition} />
          </MapContainer>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CommunityMap;