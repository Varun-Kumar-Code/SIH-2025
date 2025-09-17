
import React from 'react';
import { Feature, Language } from '../types';

interface FeatureSelectorProps {
  onSelectFeature: (feature: Feature) => void;
  language: Language;
}

const featureLabels: Record<Language, Record<Feature, string>> = {
    en: {
        [Feature.ITINERARY]: 'Plan an Itinerary',
        [Feature.SOUVENIR]: 'Find Souvenirs',
        [Feature.LOCATION]: 'Location Suggestions',
        [Feature.LANGUAGE]: 'Language Help',
    },
    hi: {
        [Feature.ITINERARY]: 'यात्रा योजना बनाएं',
        [Feature.SOUVENIR]: 'स्मृति चिन्ह खोजें',
        [Feature.LOCATION]: 'स्थान सुझाव',
        [Feature.LANGUAGE]: 'भाषा सहायता',
    },
    bn: {
        [Feature.ITINERARY]: 'ভ্রমণসূচী পরিকল্পনা করুন',
        [Feature.SOUVENIR]: 'স্মারক খুঁজুন',
        [Feature.LOCATION]: 'অবস্থান পরামর্শ',
        [Feature.LANGUAGE]: 'ভাষা সহায়তা',
    },
    mr: {
        [Feature.ITINERARY]: 'प्रवासाची योजना करा',
        [Feature.SOUVENIR]: 'स्मृतिचिन्हे शोधा',
        [Feature.LOCATION]: 'स्थान सूचना',
        [Feature.LANGUAGE]: 'भाषा मदत',
    },
    te: {
        [Feature.ITINERARY]: 'ప్రయాణ ప్రణాళిక చేయండి',
        [Feature.SOUVENIR]: 'జ్ఞాపికలను కనుగొనండి',
        [Feature.LOCATION]: 'స్థాన సూచనలు',
        [Feature.LANGUAGE]: 'భాషా సహాయం',
    },
    ta: {
        [Feature.ITINERARY]: 'பயணத்திட்டத்தைத் திட்டமிடுங்கள்',
        [Feature.SOUVENIR]: 'நினைவுப்பொருட்களைக் கண்டறியவும்',
        [Feature.LOCATION]: 'இட ஆலோசனைகள்',
        [Feature.LANGUAGE]: 'மொழி உதவி',
    }
};


const features = [
  { id: Feature.ITINERARY, icon: '🗺️' },
  { id: Feature.SOUVENIR, icon: '🛍️' },
  { id: Feature.LOCATION, icon: '📍' },
  { id: Feature.LANGUAGE, icon: '🌐' },
];

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ onSelectFeature, language }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => onSelectFeature(feature.id)}
          className="flex flex-col items-center justify-center text-center p-4 bg-gray-700 rounded-lg hover:bg-purple-600/50 transition-colors"
        >
          <span className="text-2xl mb-2">{feature.icon}</span>
          <span className="text-sm font-medium">{featureLabels[language][feature.id]}</span>
        </button>
      ))}
    </div>
  );
};

export default FeatureSelector;