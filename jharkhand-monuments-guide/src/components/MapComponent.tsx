import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
  StreetViewPanorama
} from '@react-google-maps/api';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import { MyLocation, SwapVert, LocationOn, Store, Restaurant, Hotel, Park } from '@mui/icons-material';
import { places } from '../data/places';
import { Location, PlaceInfo, LocationType } from '../types/types';

// Common styles
const styles = {
  container: {
    width: '100%',
    height: '100vh'
  },
  inputField: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  panel: {
    position: 'absolute',
    zIndex: 1,
    p: 2,
    width: '300px',
    bgcolor: 'background.paper',
    boxShadow: 1
  },
  flexBox: {
    display: 'flex',
    gap: 1,
    alignItems: 'center'
  },
  categoryButton: {
    minWidth: 'auto',
    px: 2,
    py: 1,
    borderRadius: 2,
    color: 'text.secondary',
    '&.selected': {
      bgcolor: 'primary.light',
      color: 'primary.contrastText'
    }
  }
} as const;

const defaultCenter = {
  lat: 23.3441,
  lng: 85.3096
}; // Ranchi coordinates

const MapComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<LocationType[]>([]);
  const [routePoints, setRoutePoints] = useState<PlaceInfo[]>([]);
  const [isStreetView, setIsStreetView] = useState(false);
  const [startSearchBox, setStartSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [endSearchBox, setEndSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [customEndLocation, setCustomEndLocation] = useState<Location | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const handleFilterChange = (filters: LocationType[]) => {
    setSelectedFilters(filters);
  };

  const handleMarkerClick = (place: PlaceInfo) => {
    setSelectedPlace(place);
    if (routePoints.length < 2) {
      setRoutePoints([...routePoints, place]);
    }
    // Calculate directions if user location is available
    if (userLocation) {
      calculateRoute(userLocation, place.location);
    }
  };

  const calculateRoute = (start: Location, end: Location) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new google.maps.LatLng(start.lat, start.lng),
        destination: new google.maps.LatLng(end.lat, end.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          // If a place is already selected, update the route
          if (selectedPlace) {
            calculateRoute(newLocation, selectedPlace.location);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSwapRoutePoints = () => {
    if (userLocation && customEndLocation) {
      // Swap between user location and custom end location
      const tempLocation = { ...userLocation };
      setUserLocation(customEndLocation);
      setCustomEndLocation(tempLocation);
      calculateRoute(customEndLocation, tempLocation);
    } else if (userLocation && selectedPlace) {
      // Swap between user location and selected place
      const tempLocation = { ...userLocation };
      setUserLocation(selectedPlace.location);
      calculateRoute(selectedPlace.location, tempLocation);
    } else if (routePoints.length === 2) {
      // Fallback for route points array
      setRoutePoints([routePoints[1], routePoints[0]]);
      calculateRoute(routePoints[1].location, routePoints[0].location);
    }
  };

  const handleStreetViewClick = (place: PlaceInfo) => {
    if (place.hasStreetView) {
      // First close any existing street view
      setIsStreetView(false);
      // Then open the new street view after a brief delay
      setTimeout(() => setIsStreetView(true), 100);
    }
  };

  const filteredPlaces = places.filter(
    place => selectedFilters.length === 0 || selectedFilters.includes(place.type)
  );

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Category Navigation */}
      <Paper
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          gap: 1,
          p: 1,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <IconButton 
          sx={{
            ...styles.categoryButton,
            ...(selectedFilters.includes('MONUMENT') && { bgcolor: 'primary.light', color: 'primary.contrastText' })
          }}
          onClick={() => handleFilterChange(['MONUMENT'])}
          title="Monuments"
        >
          <LocationOn />
        </IconButton>
        <IconButton 
          sx={{
            ...styles.categoryButton,
            ...(selectedFilters.includes('RESTAURANT') && { bgcolor: 'primary.light', color: 'primary.contrastText' })
          }}
          onClick={() => handleFilterChange(['RESTAURANT'])}
          title="Restaurants"
        >
          <Restaurant />
        </IconButton>
        <IconButton 
          sx={{
            ...styles.categoryButton,
            ...(selectedFilters.includes('HOTEL') && { bgcolor: 'primary.light', color: 'primary.contrastText' })
          }}
          onClick={() => handleFilterChange(['HOTEL'])}
          title="Hotels"
        >
          <Hotel />
        </IconButton>
        <IconButton 
          sx={{
            ...styles.categoryButton,
            ...(selectedFilters.includes('ARTISAN_MARKET') && { bgcolor: 'primary.light', color: 'primary.contrastText' })
          }}
          onClick={() => handleFilterChange(['ARTISAN_MARKET'])}
          title="Markets"
        >
          <Store />
        </IconButton>
        <IconButton 
          sx={{
            ...styles.categoryButton,
            ...(selectedFilters.length === 0 && { bgcolor: 'primary.light', color: 'primary.contrastText' })
          }}
          onClick={() => handleFilterChange([])}
          title="Show All"
        >
          <Park />
        </IconButton>
      </Paper>
      
      {/* Navigation Controls */}
      <Paper
        sx={{
          ...styles.panel,
          top: 20,
          left: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          Plan Your Visit
        </Typography>
        
        {/* Starting Point */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Starting Point
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Autocomplete
              onLoad={(autocomplete: google.maps.places.Autocomplete) => setStartSearchBox(autocomplete)}
              onPlaceChanged={() => {
                if (startSearchBox) {
                  const place = startSearchBox.getPlace();
                if (place.geometry?.location) {
                  const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                  };
                  setUserLocation(newLocation);
                  if (customEndLocation || selectedPlace) {
                    calculateRoute(newLocation, customEndLocation || selectedPlace!.location);
                  }
                }
              }
            }}
          >
          
            <input
              type="text"
              placeholder="Starting point..."
              style={styles.inputField}
            />
          </Autocomplete>
          <IconButton onClick={handleMyLocationClick} title="Use My Location">
            <MyLocation />
          </IconButton>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Destination
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Autocomplete
              onLoad={(autocomplete: google.maps.places.Autocomplete) => setEndSearchBox(autocomplete)}
              onPlaceChanged={() => {
                if (endSearchBox) {
                  const place = endSearchBox.getPlace();
                  if (place.geometry?.location) {
                    const newLocation = {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng()
                    };
                    setCustomEndLocation(newLocation);
                    if (userLocation) {
                      calculateRoute(userLocation, newLocation);
                    }
                  }
                }
              }}
            >
              <input
                type="text"
                placeholder="Destination..."
                style={styles.inputField}
              />
            </Autocomplete>
            {routePoints.length === 2 && (
              <IconButton onClick={handleSwapRoutePoints} title="Swap Route Points">
                <SwapVert />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Selected Place Info */}
        {selectedPlace && (
          <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2">
              {selectedPlace.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedPlace.type}
            </Typography>
            {selectedPlace.hasStreetView && (
              <Button
                size="small"
                onClick={() => handleStreetViewClick(selectedPlace)}
                sx={{ mt: 1 }}
              >
                View in Street View
              </Button>
            )}
          </Box>
        )}

        {/* Route Information */}
        {directions && directions.routes[0] && (
          <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">
                Route Information
              </Typography>
              {(userLocation && (customEndLocation || selectedPlace)) && (
                <IconButton 
                  onClick={handleSwapRoutePoints} 
                  title="Swap Route Points"
                  size="small"
                >
                  <SwapVert />
                </IconButton>
              )}
            </Box>
            <Typography variant="body2">
              Distance: {directions.routes[0].legs[0].distance?.text}
            </Typography>
            <Typography variant="body2">
              Duration: {directions.routes[0].legs[0].duration?.text}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Main Map */}
      <GoogleMap
        mapContainerStyle={styles.container}
        center={userLocation || defaultCenter}
        zoom={10}
        options={{
          streetViewControl: true,
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2,
            }}
          />
        )}

        {/* Place Markers */}
        {filteredPlaces.map((place: PlaceInfo) => (
          <Marker
            key={place.id}
            position={place.location}
            onClick={() => handleMarkerClick(place)}
          />
        ))}

        {/* Info Window */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.location}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <Box>
              <Typography variant="h6">{selectedPlace.name}</Typography>
              <Typography variant="body2">{selectedPlace.description}</Typography>
              {selectedPlace.rating && (
                <Typography variant="body2">Rating: {selectedPlace.rating}</Typography>
              )}
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                {userLocation && (
                  <Button
                    onClick={() => calculateRoute(userLocation, selectedPlace.location)}
                    size="small"
                    variant="contained"
                  >
                    Get Directions
                  </Button>
                )}
                {selectedPlace.hasStreetView && (
                  <Button
                    onClick={() => handleStreetViewClick(selectedPlace)}
                    size="small"
                    variant="outlined"
                  >
                    Street View
                  </Button>
                )}
              </Box>
            </Box>
          </InfoWindow>
        )}

        {/* Street View */}
        {isStreetView && selectedPlace && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={selectedPlace.location}
              zoom={18}
              onLoad={map => {
                const panorama = new google.maps.StreetViewPanorama(
                  map.getDiv(),
                  {
                    position: new google.maps.LatLng(selectedPlace.location.lat, selectedPlace.location.lng),
                    enableCloseButton: true,
                    addressControl: true,
                    fullscreenControl: true,
                    panControl: true,
                    zoomControl: true,
                    motionTracking: false,
                    visible: true
                  }
                );
                map.setStreetView(panorama);
                panorama.addListener('visible_changed', () => {
                  if (!panorama.getVisible()) {
                    setIsStreetView(false);
                  }
                });
              }}
            />
          </div>
        )}

        {/* Directions */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Box>
  );
};

export default MapComponent;
