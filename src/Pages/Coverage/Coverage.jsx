import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';
import { FiSearch, FiMapPin, FiNavigation } from 'react-icons/fi';

// Configure Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FlyToDistrict = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { 
        duration: 1.5,
        easeLinearity: 0.5
      });
    }
  }, [coords, map]);
  return null;
};

const Coverage = () => {
  const [districts, setDistricts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeCoords, setActiveCoords] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get('./warehouses.json');
        setDistricts(response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDistricts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    
    const district = districts.find(d => 
      d.district.toLowerCase().includes(searchText.toLowerCase())
    );
    
    if (district) {
      setActiveCoords([district.latitude, district.longitude]);
      setActiveDistrict(district.district);
    }
  };

  const handleDistrictSelect = (district) => {
    setActiveCoords([district.latitude, district.longitude]);
    setActiveDistrict(district.district);
    setSearchText(district.district);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Nationwide Coverage
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We operate across all 64 districts of Bangladesh with strategically located service centers for fast and reliable delivery.
        </p>
      </div>

      {/* Search and Map Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by district name..."
                className="input input-bordered w-full pl-10 pr-4 py-3 focus:ring-2 focus:ring-lime-500 focus:border-blue-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="ml-3 btn  btn-primary hover:bg-lime-700 border-none text-gray-700 px-6 py-3"
            >
              <FiNavigation className="mr-2" />
              Locate
            </button>
          </form>
          
          {/* Quick District Links */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi'].map(city => (
              <button
                key={city}
                onClick={() => handleDistrictSelect(districts.find(d => d.district === city))}
                className="text-sm px-3 py-1 rounded-full bg-white text-lime-800 border border-lime-200 hover:bg-lime-50 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Map and District Info */}
        <div className="grid md:grid-cols-3 gap-0">
          {/* District List */}
          <div className="bg-gray-50 p-4 h-[500px] overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <FiMapPin className="mr-2" />
              Available Districts
            </h3>
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse">Loading districts...</div>
                </div>
              ) : (
                districts.map((district) => (
                  <div
                    key={district.district}
                    onClick={() => handleDistrictSelect(district)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activeDistrict === district.district
                        ? 'bg-lime-100 border-l-4 border-lime-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <h4 className="font-medium text-gray-800">{district.district}</h4>
                    <p className="text-sm text-gray-500">{district.covered_area.length} areas covered</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-2 h-[500px] relative">
            {isLoading ? (
              <div className="flex justify-center items-center h-full bg-gray-100">
                <div className="animate-pulse">Loading map...</div>
              </div>
            ) : (
              <MapContainer
                center={[23.685, 90.3563]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <FlyToDistrict coords={activeCoords} />

                {districts.map((district) => (
                  <Marker
                    key={district.district}
                    position={[district.latitude, district.longitude]}
                    eventHandlers={{
                      click: () => handleDistrictSelect(district),
                    }}
                  >
                    <Popup autoOpen={district.district === activeDistrict}>
                      <div className="text-sm">
                        <h2 className="font-bold text-base text-blue-600">{district.district}</h2>
                        <p className="text-gray-700"><strong>City:</strong> {district.city}</p>
                        <p className="text-gray-700 mt-1"><strong>Areas:</strong></p>
                        <ul className="list-disc list-inside">
                          {district.covered_area.slice(0, 3).map(area => (
                            <li key={area}>{area}</li>
                          ))}
                          {district.covered_area.length > 3 && (
                            <li className="text-blue-500">+{district.covered_area.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-3xl font-bold text-lime-600 mb-2">64</h3>
          <p className="text-gray-600">Districts Covered</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-3xl font-bold text-lime-600 mb-2">500+</h3>
          <p className="text-gray-600">Service Centers</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-3xl font-bold text-lime-600 mb-2">24/7</h3>
          <p className="text-gray-600">Customer Support</p>
        </div>
      </div>
    </div>
  );
};

export default Coverage;