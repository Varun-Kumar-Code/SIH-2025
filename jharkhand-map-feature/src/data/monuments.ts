import { Monument } from '../types/types';

export const monuments: Monument[] = [
  {
    id: '1',
    name: 'Hundru Falls',
    location: {
      lat: 23.4274,
      lng: 85.5914
    },
    description: 'One of the highest waterfalls in Jharkhand, falling from a height of 98 meters.',
    imageUrl: 'https://example.com/hundru-falls.jpg'
  },
  {
    id: '2',
    name: 'Pahari Mandir',
    location: {
      lat: 23.3828,
      lng: 85.3357
    },
    description: 'Ancient temple located on a hill offering panoramic views of Ranchi.',
    imageUrl: 'https://example.com/pahari-mandir.jpg'
  },
  {
    id: '3',
    name: 'Jagannath Temple',
    location: {
      lat: 23.3701,
      lng: 85.3242
    },
    description: 'Famous temple dedicated to Lord Jagannath, built in traditional Kalinga architecture style.',
    imageUrl: 'https://example.com/jagannath-temple.jpg'
  },
  {
    id: '4',
    name: 'Dassam Falls',
    location: {
      lat: 23.3683,
      lng: 85.7648
    },
    description: 'Spectacular waterfall cascading down from a height of 144 feet.',
    imageUrl: 'https://example.com/dassam-falls.jpg'
  }
];