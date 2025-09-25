
import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Message, MessageAuthor, LanguageCode } from './types';
import { generateResponse, createChatSession } from './services/geminiService';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { FeatureSelection, Feature } from './components/FeatureSelection';
import type { Chat } from '@google/genai';

const initialMessages: Record<Feature, Message[]> = {
  itinerary: [
    {
      author: MessageAuthor.ASSISTANT,
      content: "I can help plan your perfect trip to Jharkhand! To get started, please tell me your travel dates, interests (like waterfalls or temples), and preferred pace."
    }
  ],
  art: [
    {
      author: MessageAuthor.ASSISTANT,
      content: "Let's discover the beautiful arts and crafts of Jharkhand! Are you looking for pottery, wood carvings, or perhaps a unique souvenir for your home or a friend?"
    }
  ],
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home');
  const chatSessionRef = useRef<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en-US');
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  const handleFeatureSelect = (feature: Feature) => {
    setMessages(initialMessages[feature]);
    setCurrentView('chat');
    chatSessionRef.current = null; // Reset chat session on new feature selection
    if (isTtsEnabled) {
       speak(initialMessages[feature][0].content);
    }
  };
  
  const handleBackToHome = () => {
    setCurrentView('home');
    setMessages([]);
    chatSessionRef.current = null;
    if (isSpeaking) {
      cancel();
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
    }

    const userMessage: Message = { author: MessageAuthor.USER, content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantResponse = await generateResponse(chatSessionRef.current, text, language);
      const assistantMessage: Message = { author: MessageAuthor.ASSISTANT, content: assistantResponse };
      setMessages(prev => [...prev, assistantMessage]);
      if (isTtsEnabled) {
        speak(assistantResponse);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = { author: MessageAuthor.ASSISTANT, content: "I'm sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTtsToggle = () => {
    if (isSpeaking) {
      cancel();
    }
    setIsTtsEnabled(prev => !prev);
  };


  return (
    <div className="bg-green-50/50 min-h-screen h-screen flex flex-col font-sans antialiased relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-10"
        style={{ backgroundImage: `url('https://source.unsplash.com/random/1920x1080?nature,jharkhand')` }}
      ></div>
      <div className="relative z-10 flex flex-col h-full">
        <Header 
          isTtsEnabled={isTtsEnabled} 
          onTtsToggle={handleTtsToggle} 
          isSpeaking={isSpeaking}
          showBackButton={currentView === 'chat'}
          onBack={handleBackToHome}
          language={language}
          onLanguageChange={setLanguage}
        />
        {currentView === 'home' ? (
          <FeatureSelection onSelectFeature={handleFeatureSelect} />
        ) : (
          <>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <ChatWindow messages={messages} isLoading={isLoading} />
            </main>
            <footer className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} language={language} />
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
