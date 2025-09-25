
import React from 'react';
import { ItineraryIcon, ArtIcon, ChatIcon } from './Icons';

export type Feature = 'itinerary' | 'art';

interface FeatureSelectionProps {
  onSelectFeature: (feature: Feature) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-left w-full hover:shadow-lg hover:border-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 text-green-700 p-3 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

export const FeatureSelection: React.FC<FeatureSelectionProps> = ({ onSelectFeature }) => {
  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full space-y-6">
         <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How can I help you today?</h2>
        <FeatureCard
          icon={<ItineraryIcon />}
          title="Plan Your Trip"
          description="Get a personalized day-by-day itinerary for your Jharkhand adventure."
          onClick={() => onSelectFeature('itinerary')}
        />
        <FeatureCard
          icon={<ArtIcon />}
          title="Discover Local Art"
          description="Find unique artisan crafts, souvenirs, and nearby shops."
          onClick={() => onSelectFeature('art')}
        />
      </div>
    </main>
  );
};
