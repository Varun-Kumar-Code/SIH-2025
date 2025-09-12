import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Autocomplete
} from '@react-google-maps/api';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
  Divider
} from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import CloseIcon from '@mui/icons-material/Close';
import { monuments } from '../data/monuments';
import { Location, Monument } from '../types/types';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 23.3441,
  lng: 85.3096
}; // Ranchi coordinates

interface PlaceInfo {
  monument: Monument;
  distance: string;
  duration: string;
}

const MapComponent: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceInfo[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const calculateDistances = (origin: Location) => {
    const service = new google.maps.DistanceMatrixService();
    const destinations = monuments.map(m => new google.maps.LatLng(m.location.lat, m.location.lng));

    service.getDistanceMatrix({
      origins: [new google.maps.LatLng(origin.lat, origin.lng)],
      destinations: destinations,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === 'OK' && response) {
        const places = monuments.map((monument, index) => ({
          monument,
          distance: response.rows[0].elements[index].distance.text,
          duration: response.rows[0].elements[index].duration.text
        }));
        
        // Sort places by distance
        places.sort((a, b) => {
          const distA = parseFloat(a.distance.replace('km', ''));
          const distB = parseFloat(b.distance.replace('km', ''));
          return distA - distB;
        });
        
        setNearbyPlaces(places);
        setDrawerOpen(true);
      }
    });
  };

  const handlePlaceSelect = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setUserLocation(location);
        calculateDistances(location);
      }
    }
  };

  const handleMarkerClick = (monument: Monument) => {
    setSelectedMonument(monument);
    if (userLocation) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: monument.location,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
      );
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete);
  };

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* Search Box */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          width: '80%',
          maxWidth: 400,
          backgroundColor: 'white',
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={handlePlaceSelect}
        >
          <TextField
            fullWidth
            placeholder="Enter your location"
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
          />
        </Autocomplete>
      </Box>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={12}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        )}

        {monuments.map((monument) => (
          <Marker
            key={monument.id}
            position={monument.location}
            onClick={() => handleMarkerClick(monument)}
          />
        ))}

        {selectedMonument && (
          <InfoWindow
            position={selectedMonument.location}
            onCloseClick={() => setSelectedMonument(null)}
          >
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{selectedMonument.name}</Typography>
              <Typography variant="body2">{selectedMonument.description}</Typography>
            </Paper>
          </InfoWindow>
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Nearby Places Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 300 } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Nearby Monuments</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {nearbyPlaces.map((place) => (
              <ListItem
                key={place.monument.id}
                onClick={() => handleMarkerClick(place.monument)}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer' }}
              >
                <ListItemText 
                  primary={place.monument.name}
                  secondary={`Distance: ${place.distance} (${place.duration})`}
                />
                <Button
                  startIcon={<DirectionsIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(place.monument);
                  }}
                >
                  Get Directions
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MapComponent;