import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip } from 'react-leaflet';
import { Icon } from 'leaflet';
import { 
  MinusIcon, 
  PlusIcon, 
  ArrowPathIcon, 
  XMarkIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LoadingOverlay, EmptyState } from './LoadingStates';
import { getAllExperiences } from '../utils/experienceManager';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView({ countries = [], onCountrySelect, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapCountries, setMapCountries] = useState([]);
  const [exploredCountries, setExploredCountries] = useState(new Set());
  const mapRef = useRef(null);

  // Country coordinates mapping
  const countryCoordinates = {
    'Japan': [36.2048, 138.2529],
    'China': [35.8617, 104.1954],
    'India': [20.5937, 78.9629],
    'South Korea': [35.9078, 127.7669],
    'Thailand': [15.8700, 100.9925],
    'Vietnam': [14.0583, 108.2772],
    'Indonesia': [-0.7893, 113.9213],
    'Malaysia': [4.2105, 108.9758],
    'Philippines': [12.8797, 121.7740],
    'Singapore': [1.3521, 103.8198],
    'France': [46.2276, 2.2137],
    'Germany': [51.1657, 10.4515],
    'Italy': [41.8719, 12.5674],
    'Spain': [40.4637, -3.7492],
    'United Kingdom': [55.3781, -3.4360],
    'Netherlands': [52.1326, 5.2913],
    'Belgium': [50.8503, 4.3517],
    'Switzerland': [46.8182, 8.2275],
    'Austria': [47.5162, 14.5501],
    'Sweden': [60.1282, 18.6435],
    'Norway': [60.4720, 8.4689],
    'Denmark': [56.2639, 9.5018],
    'Finland': [61.9241, 25.7482],
    'Poland': [51.9194, 19.1451],
    'Czech Republic': [49.8175, 15.4730],
    'Hungary': [47.1625, 19.5033],
    'Greece': [39.0742, 21.8243],
    'Portugal': [39.3999, -8.2245],
    'Ireland': [53.1424, -7.6921],
    'Mexico': [23.6345, -102.5528],
    'Canada': [56.1304, -106.3468],
    'United States': [37.0902, -95.7129],
    'Brazil': [-14.2350, -51.9253],
    'Argentina': [-38.4161, -63.6167],
    'Chile': [-35.6751, -71.5430],
    'Peru': [-9.1900, -75.0152],
    'Colombia': [4.5709, -74.2973],
    'Venezuela': [6.4238, -66.5897],
    'Ecuador': [-1.8312, -78.1834],
    'Uruguay': [-32.5228, -55.7658],
    'Paraguay': [-23.4425, -58.4438],
    'Bolivia': [-16.2902, -63.5887],
    'Guyana': [4.8604, -58.9302],
    'Suriname': [3.9193, -56.0278],
    'French Guiana': [3.9339, -53.1258],
    'Morocco': [31.7917, -7.0926],
    'Egypt': [26.8206, 30.8025],
    'South Africa': [-30.5595, 22.9375],
    'Nigeria': [9.0820, 8.6753],
    'Kenya': [-0.0236, 37.9062],
    'Ethiopia': [9.1450, 40.4897],
    'Ghana': [7.9465, -1.0232],
    'Senegal': [14.4974, -14.4524],
    'Tunisia': [33.8869, 9.5375],
    'Algeria': [28.0339, 1.6596],
    'Libya': [26.3351, 17.2283],
    'Sudan': [12.8628, 30.2176],
    'Chad': [15.4542, 18.7322],
    'Niger': [17.6078, 8.0817],
    'Mali': [17.5707, -3.9962],
    'Burkina Faso': [12.2383, -1.5616],
    'Côte d\'Ivoire': [7.5400, -5.5471],
    'Guinea': [9.9456, -9.6966],
    'Sierra Leone': [8.4606, -11.7799],
    'Liberia': [6.4281, -9.4295],
    'Togo': [8.6195, 0.8248],
    'Benin': [9.3077, 2.3158],
    'Cameroon': [7.3697, 12.3547],
    'Central African Republic': [6.6111, 20.9394],
    'Gabon': [-0.8037, 11.6094],
    'Republic of the Congo': [-0.2280, 15.8277],
    'Democratic Republic of the Congo': [-4.0383, 21.7587],
    'Angola': [-11.2027, 17.8739],
    'Zambia': [-13.1339, 27.8493],
    'Zimbabwe': [-19.0154, 29.1549],
    'Botswana': [-22.3285, 24.6849],
    'Namibia': [-22.9576, 18.4904],
    'Mozambique': [-18.6657, 35.5296],
    'Madagascar': [-18.7669, 46.8691],
    'Mauritius': [-20.3484, 57.5522],
    'Seychelles': [-4.6796, 55.4920],
    'Comoros': [-11.6455, 43.3333],
    'Djibouti': [11.8251, 42.5903],
    'Somalia': [5.1521, 46.1996],
    'Eritrea': [15.1794, 39.7823],
    'Tanzania': [-6.3690, 34.8888],
    'Uganda': [1.3733, 32.2903],
    'Rwanda': [-1.9403, 29.8739],
    'Burundi': [-3.3731, 29.9189],
    'Malawi': [-13.2543, 34.3015],
    'Lesotho': [-29.6099, 28.2336],
    'Eswatini': [-26.5225, 31.4659],
    'Australia': [-25.2744, 133.7751],
    'New Zealand': [-40.9006, 174.8860],
    'Fiji': [-17.7134, 178.0650],
    'Papua New Guinea': [-6.3150, 143.9555],
    'Solomon Islands': [-9.6457, 160.1562],
    'Vanuatu': [-15.3767, 166.9592],
    'New Caledonia': [-20.9043, 165.6180],
    'Samoa': [-13.7590, -172.1046],
    'Tonga': [-21.1790, -175.1982],
    'Kiribati': [-3.3704, -168.7340],
    'Tuvalu': [-7.1095, 177.6493],
    'Nauru': [-0.5228, 166.9315],
    'Palau': [7.5150, 134.5825],
    'Micronesia': [7.4256, 150.5508],
    'Marshall Islands': [7.1315, 171.1845],
    'Cuba': [21.5218, -77.7812]
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setMapError(null);
        
        // Simulate map loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!countries || countries.length === 0) {
          setMapError('No countries available to display');
          return;
        }

        // Get explored countries
        const experiences = getAllExperiences();
        const exploredSet = new Set(experiences.map(exp => exp.country.name));
        setExploredCountries(exploredSet);

        const processedCountries = countries.map(country => {
          const coordinates = countryCoordinates[country.name];
          
          if (!coordinates) {
            console.warn(`No coordinates found for country: ${country.name}`);
            return null;
          }

          return {
            ...country,
            coordinates: coordinates,
            isExplored: exploredSet.has(country.name)
          };
        }).filter(Boolean);

        setMapCountries(processedCountries);
        console.log('MapView: Processed countries:', processedCountries.length);
        
      } catch (error) {
        console.error('MapView: Error initializing map:', error);
        setMapError('Failed to load world map');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [countries]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    onCountrySelect?.(country);
  };

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2);
    }
  };

  // Create custom marker icon based on exploration status
  const createMarkerIcon = (isExplored) => {
    const color = isExplored ? '#10B981' : '#6366F1'; // Green for explored, indigo for unexplored
    const iconSvg = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
        ${isExplored ? '<path d="M9 12l2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
      </svg>
    `;
    
    return new Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(iconSvg),
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
  };

  if (isLoading) {
    return (
      <LoadingOverlay 
        message="Loading world map..." 
        showProgress={true}
        progress={60}
      />
    );
  }

  if (mapError) {
    return (
      <EmptyState
        icon={GlobeAltIcon}
        title="Map Unavailable"
        description={mapError}
        action={onClose}
        actionText="Return to List View"
      />
    );
  }

  return (
    <motion.div 
      className="relative w-full h-96 bg-dark-primary rounded-xl overflow-hidden border border-dark-border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <motion.button
          onClick={handleReset}
          className="w-10 h-10 bg-dark-secondary/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-dark-secondary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset View"
        >
          <ArrowPathIcon className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Close Button */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 w-10 h-10 bg-dark-secondary/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-dark-secondary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Close Map View"
      >
        <XMarkIcon className="w-5 h-5 text-white" />
      </motion.button>

      {/* Real Interactive Map */}
      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Country Markers */}
        {mapCountries.map((country, index) => (
          <Marker
            key={country.code}
            position={country.coordinates}
            icon={createMarkerIcon(country.isExplored)}
            eventHandlers={{
              click: () => handleCountryClick(country),
            }}
          >
            {/* Hover Tooltip */}
            <Tooltip 
              direction="top" 
              offset={[0, -10]}
              className="custom-tooltip"
              permanent={false}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{country.flag}</div>
                <div className="font-semibold text-gray-900">{country.name}</div>
                <div className="text-sm text-gray-600">{country.region}</div>
                {country.isExplored && (
                  <div className="flex items-center justify-center mt-1">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 ml-1">Explored</span>
                  </div>
                )}
              </div>
            </Tooltip>
            
            <Popup className="custom-popup">
              <div className="text-center">
                <div className="text-2xl mb-2">{country.flag}</div>
                <h3 className="font-semibold text-gray-900">{country.name}</h3>
                <p className="text-sm text-gray-600">{country.region}</p>
                {country.isExplored && (
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 ml-1">Already Explored</span>
                  </div>
                )}
                <button
                  onClick={() => handleCountryClick(country)}
                  className="mt-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors"
                >
                  {country.isExplored ? 'Revisit' : 'Explore'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-dark-secondary/90 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
        <div className="flex items-center space-x-2 mb-2">
          <InformationCircleIcon className="w-4 h-4 text-accent-primary" />
          <span className="font-medium">Interactive World Map</span>
        </div>
        <div className="space-y-1 text-text-secondary">
          <div>• Hover over markers to see country names</div>
          <div>• {mapCountries.length} countries available</div>
          <div>• {Array.from(exploredCountries).length} countries explored</div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span>Unexplored</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Explored</span>
          </div>
        </div>
      </div>

      {/* Selected Country Info */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            className="absolute bottom-4 right-4 z-20 bg-dark-secondary/95 backdrop-blur-sm rounded-lg p-4 max-w-xs"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="text-sm font-semibold text-white">{selectedCountry.name}</h3>
                <p className="text-xs text-text-secondary">{selectedCountry.region}</p>
                {selectedCountry.isExplored && (
                  <div className="flex items-center mt-1">
                    <CheckCircleIcon className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 ml-1">Explored</span>
                  </div>
                )}
              </div>
            </div>
            <motion.button
              onClick={() => setSelectedCountry(null)}
              className="w-full mt-2 px-3 py-1 bg-accent-primary text-white text-xs rounded transition-colors hover:bg-accent-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedCountry.isExplored ? 'Revisit' : 'Explore'} {selectedCountry.name}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MapView;
