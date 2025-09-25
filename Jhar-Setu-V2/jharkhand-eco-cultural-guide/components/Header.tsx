
import React from 'react';
import { SpeakerOnIcon, SpeakerOffIcon, BackIcon } from './Icons';
import { LanguageCode, supportedLanguages } from '../types';

interface HeaderProps {
  isTtsEnabled: boolean;
  onTtsToggle: () => void;
  isSpeaking: boolean;
  showBackButton: boolean;
  onBack: () => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({ isTtsEnabled, onTtsToggle, isSpeaking, showBackButton, onBack, language, onLanguageChange }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 shadow-sm flex justify-between items-center flex-shrink-0">
      <div className="flex items-center space-x-3">
        {showBackButton ? (
          <button 
            onClick={onBack}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Go back to features"
          >
            <BackIcon />
          </button>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0zm13.15-4.4a.5.5 0 00-.3-.9l-3.2 1.3a.5.5 0 00-.2.6l1 3.4a.5.5 0 00.9.2l1.8-4.6zM9.5 10a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6 11a.5.5 0 000 1h2a.5.5 0 000-1H6zm1.5-3a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" clipRule="evenodd" />
          </svg>
        )}
        <h1 className="text-xl font-bold text-gray-800">Jharkhand Eco-Cultural Guide</h1>
      </div>
      <div className="flex items-center space-x-4">
         <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2"
            aria-label="Select language"
          >
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        <button 
          onClick={onTtsToggle}
          className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isTtsEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          aria-label={isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
        >
          {isTtsEnabled ? <SpeakerOnIcon isSpeaking={isSpeaking} /> : <SpeakerOffIcon />}
        </button>
      </div>
    </header>
  );
};
