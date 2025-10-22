'use client';

import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';
import { ApiClient } from '@/lib/api-client';
import { ChatCompleteChunk, ChatMessage, OllamaMessage } from '@/types/chat';

interface ChatProps {
    selectedModel: string;
}

export default function Chat({ selectedModel }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreamingMode, setIsStreamingMode] = useState(false);

    const handleSendMessage = async (messageText: string) => {
        // Add user message immediately
        console.log("Selected model:", selectedModel);
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            content: messageText,
            role: 'user',
            createdAt: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const res = await ApiClient.chat({
            messages: messages,
            model: selectedModel,
            stream: isStreamingMode
        });

        console.log("Chat API response:", res);

        if (!res.success) {
            // Handle error
            return;
        }

        // TODO: Handle streaming and complete response properly
        if (res.chunk.done) {
            handleCompleteMessage(res.chunk as ChatCompleteChunk);
        }

    };

    const handleCompleteMessage = (msg: ChatCompleteChunk) => {
        const assitantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            content: msg.message.content,
            role: 'assistant',
            createdAt: new Date(msg.created_at)
        };

        setMessages(prev => [...prev, assitantMessage]);
        setIsLoading(false);
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