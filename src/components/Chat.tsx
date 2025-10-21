'use client';

import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (messageText: string) => {
        // Add user message immediately
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // TODO: Here we'll implement the Ollama API call
        // For now, let's simulate a response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "This is a placeholder response. Soon this will be connected to Ollama!",
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col">
            {/* Chat Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <ChatMessages messages={messages} />
                {isLoading && <ChatLoading />}
            </div>

            {/* Chat Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
}