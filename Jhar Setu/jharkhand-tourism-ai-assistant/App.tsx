
import React from 'react';
import { useChat } from './hooks/useChat';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import FeatureSelector from './components/FeatureSelector';
import LanguageSelector from './components/LanguageSelector';
import { BotIcon } from './components/icons/BotIcon';

const App: React.FC = () => {
  const { 
    messages, 
    conversationState, 
    isLoading, 
    sendMessage, 
    startConversation, 
    resetChat,
    language,
    setLanguage,
    uiStrings,
  } = useChat();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col border border-gray-700 rounded-2xl shadow-2xl bg-gray-800/50 backdrop-blur-md">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-full">
              <BotIcon />
            </div>
            <h1 className="text-xl font-bold text-gray-100">{uiStrings.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector selectedLanguage={language} onSelectLanguage={setLanguage} />
            <button
              onClick={resetChat}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {uiStrings.startOver}
            </button>
          </div>
        </header>
        
        <ChatWindow messages={messages} isLoading={isLoading} />
        
        <footer className="p-4 border-t border-gray-700">
          {conversationState === 'SELECTING_FEATURE' ? (
            <FeatureSelector onSelectFeature={startConversation} language={language} />
          ) : (
            <MessageInput onSendMessage={sendMessage} disabled={isLoading} language={language} />
          )}
        </footer>
      </div>
      <p className="text-center text-xs text-gray-500 mt-4">
        {uiStrings.disclaimer}
      </p>
    </div>
  );
};

export default App;