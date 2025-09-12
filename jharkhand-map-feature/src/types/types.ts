export interface Monument {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  imageUrl?: string;
}

export interface Location {
  lat: number;
  lng: number;
}