import React from 'react';
import { Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface ChatMessageProps {
  message: Message;
}

const ShopCard: React.FC<{ shopText: string }> = ({ shopText }) => {
  const [name, ...addressParts] = shopText.trim().split('\n');
  const address = addressParts.join('\n').trim();

  return (
    <div className="flex items-start p-3 bg-gray-800/50 rounded-lg mt-2">
      <div className="flex-shrink-0 mr-3">
        <MapPinIcon />
      </div>
      <div>
        <p className="font-semibold text-sm text-purple-300">{name}</p>
        <p className="text-xs text-gray-400">{address}</p>
      </div>
    </div>
  )
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    const text = message.text;
    const shopSectionIdentifier = '**Where to Buy:**';
    const shopSectionIndex = text.indexOf(shopSectionIdentifier);

    if (!isUser && shopSectionIndex !== -1) {
      const mainContent = text.substring(0, shopSectionIndex).trim();
      const shopsString = text.substring(shopSectionIndex + shopSectionIdentifier.length).trim();
      
      const shops = shopsString.split(/\n\s*\n/).filter(s => s.trim().length > 0);

      return (
        <div>
          <p className="whitespace-pre-wrap">{mainContent}</p>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <h4 className="text-sm font-bold text-gray-300 mb-1">Where to Buy:</h4>
            <div className="flex flex-col space-y-2">
              {shops.map((shop, index) => (
                <ShopCard key={index} shopText={shop} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <BotIcon />
        </div>
      )}
      
      <div
        className={`max-w-md rounded-2xl p-4 text-sm ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        {renderContent()}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
            <div className="flex flex-col space-y-2">
              {message.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-300 hover:underline truncate"
                >
                  {index + 1}. {source.title || source.uri}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;