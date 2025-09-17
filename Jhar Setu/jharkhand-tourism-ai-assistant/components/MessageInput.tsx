
import React, { useState, useEffect } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { MicIcon } from './icons/MicIcon';
import { Language } from '../types';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  language: Language;
}

const placeholders: Record<Language, string> = {
    en: 'Ask me anything about Jharkhand...',
    hi: 'झारखंड के बारे में कुछ भी पूछें...',
    bn: 'ঝাড়খণ্ড সম্পর্কে কিছু জিজ্ঞাসা করুন...',
    mr: 'झारखंडबद्दल काहीही विचारा...',
    te: 'జార్ఖండ్ గురించి ఏదైనా అడగండి...',
    ta: 'ஜார்கண்ட் பற்றி எதுவும் கேளுங்கள்...',
};

const sendButtonLabels: Record<Language, string> = {
    en: 'Send',
    hi: 'भेजें',
    bn: 'পাঠান',
    mr: 'पाठवा',
    te: 'పంపండి',
    ta: 'அனுப்பு',
};

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled, language }) => {
  const [text, setText] = useState('');
  const { isListening, transcript, startListening, stopListening, error } = useVoiceRecognition({lang: language});

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleMicClick = () => {
    if(isListening) {
      stopListening();
    } else {
      setText('');
      startListening();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholders[language]}
        disabled={disabled || isListening}
        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={handleMicClick}
        disabled={disabled}
        className={`p-2 rounded-lg text-white transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'} disabled:bg-gray-600`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <MicIcon />
      </button>
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {sendButtonLabels[language]}
      </button>
      {error && <p className="text-xs text-red-400 absolute bottom-0">{error}</p>}
    </form>
  );
};

export default MessageInput;