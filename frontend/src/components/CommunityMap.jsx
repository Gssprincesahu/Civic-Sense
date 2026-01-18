import React, { useState, useEffect } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import ErrorBoundary from './ErrorBoundary';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const createIssueIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: #16a34a; 
      width: 30px; 
      height: 30px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
    ">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const CommunityMap = () => {
  // ⭐ NEW: State variables for issues and loading
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const centerPosition = [26.7658, 83.3649];

  useEffect(() => {
    fetchIssues();
  }, []);

  // ⭐ NEW: Function to fetch all issues from backend
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/issues');
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Filter only issues that have coordinates
        const issuesWithCoordinates = data.data.filter(
          issue => issue.coordinates && issue.coordinates.lat && issue.coordinates.lng
        );
        setIssues(issuesWithCoordinates);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  // ⭐ NEW: Error state
  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-8">
        <div className="max-w-md bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchIssues}
            className="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Community Issues Map
      </h1>

      {/* ⭐ CHANGE: Updated to show dynamic count */}
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Reported issues in your area. ({issues.length} issues with location)
      </p>

      {/* ⭐ NEW: Refresh button */}
      <button
        onClick={fetchIssues}
        className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        🔄 Refresh Map 
      </button>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <ErrorBoundary>
          {/* ⭐ CHANGE: Auto-center to first issue if available */}
          <MapContainer 
            center={issues.length > 0 
              ? [issues[0].coordinates.lat, issues[0].coordinates.lng] 
              : centerPosition
            }   
            zoom={13} 
            style={{ height: "500px", width: "600px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* ⭐ NEW: Map through all issues and create markers */}
            {issues.map((issue) => (
              <Marker 
                key={issue._id} 
                position={[issue.coordinates.lat, issue.coordinates.lng]}
                icon={createIssueIcon()} // ⭐ Same icon for all issues
              >
                {/* ⭐ NEW: Popup with issue details */}
                <Popup maxWidth={300}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2 text-green-700">{issue.title}</h3>
                    
                    <div className="mb-2">
                      <span className="px-2 py-1 rounded text-xs font-semibold uppercase bg-green-100 text-green-700">
                        {issue.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>📍 Location:</strong> {issue.location}</p>
                      <p><strong>🏷️ Category:</strong> {issue.category}</p>
                      {issue.address && <p><strong>📮 Address:</strong> {issue.address}</p>}
                      {issue.city && <p><strong>🏙️ City:</strong> {issue.city}</p>}
                      <p><strong>📅 Reported:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </ErrorBoundary>
      </div>

      {/* ⭐ NEW: Show message if no issues with coordinates */}
      {issues.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-center">
          No issues found with location data.
        </div>
      )}
    </div>
  );
};

export default CommunityMap;