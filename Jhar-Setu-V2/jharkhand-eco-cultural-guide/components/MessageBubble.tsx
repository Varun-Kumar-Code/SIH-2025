
import React from 'react';
import { Message, MessageAuthor } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
      You
    </div>
);

const AssistantIcon = () => (
    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0zm13.15-4.4a.5.5 0 00-.3-.9l-3.2 1.3a.5.5 0 00-.2.6l1 3.4a.5.5 0 00.9.2l1.8-4.6zM9.5 10a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6 11a.5.5 0 000 1h2a.5.5 0 000-1H6zm1.5-3a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" clipRule="evenodd" />
      </svg>
    </div>
);


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AssistantIcon />}
      <div
        className={`max-w-xl p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {isUser && <UserIcon />}
    </div>
  );
};
