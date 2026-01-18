import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt, FaCrosshairs, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import axios from 'axios';

// Fix for default marker icon in Leaflet and create custom purple marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom purple marker icon
const purpleIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="36" height="48">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path fill="url(#grad)" stroke="#ffffff" stroke-width="1.5" d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.42-3.58-8-8-8z"/>
      <circle cx="12" cy="8" r="3" fill="white"/>
      <text x="12" y="11" font-family="Arial" font-size="8" font-weight="bold" fill="#7c3aed" text-anchor="middle">+</text>
    </svg>
  `),
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -48]
});

// Component to handle map double-click events
function LocationMarker({ position, setPosition, setTempPosition, showConfirmPopup }) {
  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;
      setTempPosition([lat, lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={purpleIcon}>
      {showConfirmPopup && (
        <Popup>
          <div className="text-center py-1">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-base mb-2">
              <FaMapMarkerAlt />
              <span>Selected Location</span>
            </div>
            <div className="text-gray-700 font-medium text-sm">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
}

export default function ReportIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('infrastructure');
  const [priority, setPriority] = useState('medium');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [mapPosition, setMapPosition] = useState(null);
  const [tempPosition, setTempPosition] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Reverse geocoding using Nominatim API
  const getAddressFromCoords = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      setLoadingAddress(false);
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setLoadingAddress(false);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleConfirmLocation = async () => {
    if (tempPosition) {
      setMapPosition(tempPosition);
      setLocation(`${tempPosition[0].toFixed(6)}, ${tempPosition[1].toFixed(6)}`);
      
      // Fetch and parse address from coordinates with high accuracy
      setLoadingAddress(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${tempPosition[0]}&lon=${tempPosition[1]}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        setLoadingAddress(false);
        
        if (data && data.address) {
          const addr = data.address;
          
          // Set the full formatted address in the address field
          setAddress(data.display_name || '');
          
          // Get most accurate city name
          setCity(
            addr.city || 
            addr.town || 
            addr.village || 
            addr.municipality || 
            addr.city_district || 
            ''
          );
          
          // Get state/province with fallback options
          setState(
            addr.state || 
            addr.province || 
            addr.state_district || 
            addr.county || 
            addr.region || 
            ''
          );
          
          setZipCode(addr.postcode || '');
          setCountry(addr.country || '');
        } else if (data && data.display_name) {
          // Fallback to display name if address components not available
          setAddress(data.display_name);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setLoadingAddress(false);
      }
      
      setShowConfirmModal(false);
    }
  };

  const handleCancelLocation = () => {
    setTempPosition(null);
    setShowConfirmModal(false);
  };

  // Open modal when temp position is set
  React.useEffect(() => {
    if (tempPosition) {
      setShowConfirmModal(true);
    }
  }, [tempPosition]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    setPhotos((prev) => [...prev, ...imageFiles]);
    setVideos((prev) => [...prev, ...videoFiles]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * FORM SUBMISSION HANDLER
   * CHANGE #5: Modified to send data to MongoDB backend
   * Previous: Just showed a draft message
   * Now: Sends HTTP POST request to save data in MongoDB
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim() || !description.trim() || !location.trim()) {
      setStatusMsg('Please fill out title, description, and location.');
      return;
    }

    try {
      setStatusMsg('Saving issue...');
      
      // Prepare the data object to send to backend
      // This must match the schema defined in data.model.js
      const issueData = {
        title: title.trim(),
        description: description.trim(),
        category,                    
        priority,                   
        location: location.trim(),   
        address: address.trim(),    
        city: city.trim(),          
        state: state.trim(),         
        zipCode: zipCode.trim(),     
        country: country.trim(),     
        coordinates: mapPosition ? { // GPS coordinates from map selection
          lat: mapPosition[0],
          lng: mapPosition[1]
        } : null,
        image: photos.length > 0 ? photos[0].name : undefined 
      };

      // IMPORTANT: Send POST request to backend API
      // Make sure backend server is running on localhost:5001
      const response = await fetch('http://localhost:5001/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify(issueData) // Convert object to JSON string
      });

      // Parse the response from server
      const data = await response.json();

      // Check if save was successful
      if (response.ok && data.success) {
        setStatusMsg('✅ Issue saved successfully!');
        
        // Clear form after 2 seconds to allow user to see success message
        setTimeout(() => {
          setTitle('');
          setDescription('');
          setLocation('');
          setCategory('infrastructure');
          setPriority('medium');
          setPhotos([]);
          setVideos([]);
          setMapPosition(null);
          setAddress('');
          setCity('');
          setState('');
          setZipCode('');
          setCountry('');
          setStatusMsg('');
        }, 2000);
      } else {
        // Show error message from server
        setStatusMsg('❌ ' + (data.message || 'Failed to save issue'));
      }
    } catch (error) {
      // Network error or server not running
      console.error('Error submitting issue:', error);
      setStatusMsg('❌ Error: Unable to connect to server');
    }
  };
  return (
    <div className="min-h-screen bg-[#f7fafc] p-0 sm:p-0 relative">
      {/* Back Button */}
      <Link to='/' className='absolute left-4 top-4 flex items-center gap-1 text-black hover:bg-gray-200 px-3 py-1.5 rounded-lg font-semibold transition duration-200 z-10'>
        <IoIosArrowRoundBack className='text-2xl' /> Back
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-16 pb-8">
        {/* Icon */}
        <div className='flex justify-center items-center mb-2'>
          <div className='bg-green-500 shadow-lg p-4 rounded-full flex items-center justify-center'>
            <FiAlertTriangle className='text-white text-4xl' />
          </div>
        </div>
        {/* Title */}
        <h1 className='text-5xl font-bold text-green-700 text-center mb-2 mt-2'>Create Issue Report</h1>
        {/* Subtitle */}
        <p className='text-center text-2xl text-gray-600 max-w-2xl mb-6'>
          Report community issues with precise location mapping. Click on the map to pinpoint the exact location of the problem.
        </p>

        {/* Emergency Alert Box */}
        <div className='w-full bg-red-50 rounded-2xl shadow-md p-7 mt-2 mb-2 border border-red-100'>
          <div className='flex items-center gap-3 mb-2'>
            <FiAlertTriangle className='text-red-500 text-3xl' />
            <span className='text-2xl font-bold text-red-700'>Emergency Situations</span>
          </div>
          <div className='text-lg text-red-700 mb-4'>
            For immediate emergencies requiring police, fire, or medical assistance, please call emergency services directly.
          </div>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-2 bg-red-200 text-red-700 px-5 py-2 rounded-lg font-semibold text-lg'>
              <span className='text-xl'>📞</span> Emergency: 911
            </div>
            <div className='flex items-center gap-2 bg-red-200 text-red-700 px-5 py-2 rounded-lg font-semibold text-lg'>
              <span className='text-xl'>📞</span> Non-Emergency: 311
            </div>
          </div>
        </div>
        <div className='flex mt-4 w-full flex-col md:flex-row gap-6'>
          {/* Left: Issue Section */}
          <div className='md:w-1/2 w-full bg-white rounded-2xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Issue Details</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Broken streetlight"
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white'
                >
                  <option value="infrastructure">Infrastructure</option>
                  <option value="safety">Safety</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="utilities">Utilities</option>
                  <option value="environment">Environment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the issue..."
                  rows={5}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none overflow-y-auto max-h-40'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., 123 Main St, Springfield"
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                />
                <p className='text-xs text-gray-500 mt-1'>Tip: You can paste an address or landmark name.</p>
              </div>
              
              <div>
                <label className='block text-xl font-medium text-gray-700 mb-2'>Priority Level</label>
                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => setPriority('low')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      priority === 'low'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div className='font-semibold'>Low</div>
                    <div className='text-xs mt-1 opacity-90'>Minor issue</div>
                  </button>
                  <button
                    type='button'
                    onClick={() => setPriority('medium')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      priority === 'medium'
                        ? 'bg-yellow-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div className='font-semibold'>Medium</div>
                    <div className='text-xs mt-1 opacity-90'>Needs attention</div>
                  </button>
                  <button
                    type='button'
                    onClick={() => setPriority('high')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                      priority === 'high'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div className='font-semibold'>High</div>
                    <div className='text-xs mt-1 opacity-90'>Urgent</div>
                  </button>
                </div>
              </div>

              {/* Photo and Video Upload Section */}
              <div>
                <label className='block text-xl font-medium text-gray-700 mb-2'>Media Upload</label>
                <input
                  type='file'
                  accept='image/*,video/*'
                  multiple
                  onChange={handlePhotoUpload}
                  className='hidden'
                  id='media-upload'
                />
                <label
                  htmlFor='media-upload'
                  className='flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 cursor-pointer hover:border-green-500 hover:bg-green-50 transition'
                >
                  <div className='text-center'>
                    <div className='flex justify-center gap-3 text-3xl mb-2'>
                      <span>📷</span>
                      <span>🎥</span>
                    </div>
                    <p className='text-sm text-gray-600 font-medium'>Click to upload photos or videos</p>
                    <p className='text-xs text-gray-500 mt-1'>Supports JPG, PNG, GIF, MP4, MOV, AVI</p>
                    <p className='text-xs text-gray-500'>Images up to 10MB, Videos up to 50MB</p>
                  </div>
                </label>
                {(photos.length > 0 || videos.length > 0) && (
                  <div className='mt-3 space-y-2'>
                    {photos.map((photo, index) => (
                      <div key={`photo-${index}`} className='flex items-center justify-between bg-gray-50 rounded-md px-3 py-2'>
                        <div className='flex items-center gap-2 flex-1 truncate'>
                          <span className='text-lg'>📷</span>
                          <span className='text-sm text-gray-700 truncate'>{photo.name}</span>
                        </div>
                        <button
                          type='button'
                          onClick={() => removePhoto(index)}
                          className='text-red-500 hover:text-red-700 ml-2 text-sm font-medium'
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {videos.map((video, index) => (
                      <div key={`video-${index}`} className='flex items-center justify-between bg-gray-50 rounded-md px-3 py-2'>
                        <div className='flex items-center gap-2 flex-1 truncate'>
                          <span className='text-lg'>🎥</span>
                          <span className='text-sm text-gray-700 truncate'>{video.name}</span>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeVideo(index)}
                          className='text-red-500 hover:text-red-700 ml-2 text-sm font-medium'
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {statusMsg && (
                <div className='text-sm text-gray-700 bg-gray-100 rounded-md px-3 py-2'>
                  {statusMsg}
                </div>
              )}
              <div className='flex items-center gap-3'>
                <button
                  type='submit'
                  className='bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition'
                >
                  Submit Issue
                </button>
                <button
                  type='button'
                  className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg transition'
                  onClick={() => { setTitle(''); setDescription(''); setLocation(''); setCategory('infrastructure'); setPriority('medium'); setPhotos([]); setVideos([]); setStatusMsg(''); }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Right: Location Section (map or details) */}
          <div className='md:w-1/2 w-full bg-white rounded-2xl shadow-md p-6 border border-gray-200'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2'>
              <FaMapMarkerAlt className='text-green-600' />
              Location Mapping
            </h2>
            <p className='text-gray-600 mb-4 text-sm'>
              Double-click on the map to select location, then fill in or edit address details below.
            </p>
            
            {/* Interactive Map */}
            <div className='relative h-80 w-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-sm hover:border-green-400 transition-colors duration-300'>
              <MapContainer
                center={[26.73086, 83.432846]} // Center of Delhi as default
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={mapPosition} 
                  setPosition={setMapPosition} 
                  setTempPosition={setTempPosition}
                  showConfirmPopup={false}
                />
              </MapContainer>
              
              {/* Map Overlay Instruction */}
              {!mapPosition && (
                <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-green-200 z-[1000] pointer-events-none'>
                  <div className='flex items-center gap-2 text-sm font-medium text-green-700'>
                    <FaCrosshairs className='animate-pulse' />
                    <span>Double-click to select location</span>
                  </div>
                </div>
              )}

              {/* Location Confirmation Popup Modal */}
              {showConfirmModal && tempPosition && (
                <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 z-[1000] p-5 min-w-[280px]'>
                  <button 
                    onClick={handleCancelLocation}
                    className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition'
                  >
                    <FaTimes />
                  </button>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-purple-600 font-bold text-lg mb-3">
                      <FaMapMarkerAlt className='text-xl' />
                      <span>Selected Location</span>
                    </div>
                    <div className="text-gray-700 font-semibold text-base mb-4">
                      {tempPosition[0].toFixed(6)}, {tempPosition[1].toFixed(6)}
                    </div>
                    <button
                      onClick={handleConfirmLocation}
                      className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg'
                    >
                      Confirm This Location
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Location Details Section Below Map - Always visible */}
            <div className={`mt-6 bg-white border-2 ${mapPosition || address || city ? 'border-purple-200' : 'border-gray-200'} rounded-2xl shadow-lg p-5 transition-all duration-300`}>
              <div className='flex items-center gap-3 mb-4 pb-3 border-b border-gray-200'>
                <div className={`${mapPosition || address || city ? 'bg-purple-100' : 'bg-gray-100'} p-2 rounded-full transition-colors`}>
                  <FaMapMarkerAlt className={`${mapPosition || address || city ? 'text-purple-600' : 'text-gray-400'} text-xl transition-colors`} />
                </div>
                <h3 className='text-xl font-bold text-gray-800'>Location Details</h3>
              </div>
              
              <div className='space-y-4 mb-5'>
                {/* Coordinates Display - Only show when map location is selected */}
                {mapPosition && (
                  <div>
                    <span className='text-sm font-semibold text-gray-600'>Coordinates:</span>
                    <p className='text-base font-mono mt-1 text-gray-800'>
                      {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
                    </p>
                  </div>
                )}

                {/* Manual Location Entry */}
                <div>
                  <span className='text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2'>
                    <span className='text-lg'>📍</span>
                    Address Information
                  </span>
                  {loadingAddress ? (
                    <div className='flex items-center gap-2 py-8 justify-center'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600'></div>
                      <span className='text-sm text-gray-500'>Fetching address...</span>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street Address"
                        className='w-full rounded-lg border border-purple-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800 placeholder-gray-400'
                      />
                      <div className='grid grid-cols-2 gap-3'>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className='w-full rounded-lg border border-purple-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800 placeholder-gray-400'
                        />
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State/Province"
                          className='w-full rounded-lg border border-purple-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800 placeholder-gray-400'
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-3'>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="ZIP/Postal Code"
                          className='w-full rounded-lg border border-purple-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800 placeholder-gray-400'
                        />
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Country"
                          className='w-full rounded-lg border border-purple-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800 placeholder-gray-400'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => {
                    // Build full address from manual fields
                    const fullAddress = [
                      address,
                      city,
                    ].filter(Boolean).join(', ');
                    
                    if (fullAddress) {
                      setLocation(fullAddress);
                      setStatusMsg('Location confirmed successfully!');
                    } else {
                      setStatusMsg('Please enter address details or select location on map.');
                    }
                  }}
                  disabled={!address && !city && !mapPosition}
                  className={`flex-1 ${
                    address || city || mapPosition
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  } font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <FaCheck />
                  Confirm
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setMapPosition(null);
                    setLocation('');
                    setAddress('');
                    setCity('');
                    setState('');
                    setZipCode('');
                    setCountry('');
                    setTempPosition(null);
                  }}
                  disabled={!address && !city && !mapPosition}
                  className={`flex-1 ${
                    address || city || mapPosition
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300' 
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  } font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border`}
                >
                  <FaTimes />
                  Clear
                </button>
              </div>
            </div>

            {/* Help Text - Only show when no location selected */}
            {!mapPosition && (
              <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <p className='text-xs text-blue-800 font-medium mb-1'>💡 Pro Tips:</p>
                <ul className='text-xs text-blue-700 space-y-1 ml-4 list-disc'>
                  <li>Zoom in for precise location selection</li>
                  <li>Use scroll wheel or +/- buttons to zoom</li>
                  <li>Double-click on the exact spot of the issue</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}