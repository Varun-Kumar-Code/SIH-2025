
import React from 'react';
import { Language, Languages } from '../types';

interface LanguageSelectorProps {
    selectedLanguage: Language;
    onSelectLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage }) => {
    return (
        <div className="relative">
            <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value as Language)}
                className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                aria-label="Select language"
            >
                {Languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;