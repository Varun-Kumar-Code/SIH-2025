export interface Location {
  lat: number;
  lng: number;
}

export type LocationType = 'MONUMENT' | 'ARTISAN_MARKET' | 'RESTAURANT' | 'HOTEL' | 'LAKE' | 'VIEWPOINT' | 'MALL';

export interface PlaceInfo {
  id: string;
  name: string;
  type: LocationType;
  location: Location;
  description: string;
  imageUrl?: string;
  rating?: number;
  address?: string;
  hasStreetView?: boolean;
}

export interface RoutePoint {
  location: Location;
  name: string;
  isStart: boolean;
}