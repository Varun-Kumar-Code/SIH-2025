
import React, { useState, useEffect } from 'react';
import { SendIcon, MicrophoneIcon } from './Icons';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { LanguageCode } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  language: LanguageCode;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, language }) => {
  const [text, setText] = useState('');
  const { isListening, transcript, startListening, stopListening, browserSupportsSpeechRecognition } = useSpeechRecognition(language);
  
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(text);
    setText('');
  };
  
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setText('');
      startListening();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 md:space-x-4">
        {browserSupportsSpeechRecognition && (
          <button 
            type="button" 
            onClick={handleMicClick}
            className={`flex-shrink-0 p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            <MicrophoneIcon />
          </button>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask about Jharkhand..."}
          className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
          disabled={isLoading || isListening}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="flex-shrink-0 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};
