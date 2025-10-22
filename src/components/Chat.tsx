'use client';

import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';
import { ApiClient } from '@/lib/api-client';
import { ChatChunk, ChatCompleteChunk, ChatMessage, OllamaMessage } from '@/types/chat';

interface ChatProps {
    selectedModel: string;
}

export default function Chat({ selectedModel }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreamingMode, setIsStreamingMode] = useState(true); // Enable streaming by default

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

        try {
            if (isStreamingMode) {
                // Use streaming API
                console.log("Starting streaming chat...");
                let message = '';

                await ApiClient.chatStreaming(
                    {
                        messages: [...messages, userMessage],
                        model: selectedModel,
                        stream: true
                    },
                    (chunk) => {
                        // Log each chunk to console
                        console.log("Received message chunk:", chunk.message.content);

                        message += chunk.message.content;

                        // Check if this is the final chunk
                        if (chunk.done) {
                            console.log("Streaming complete!");
                            handleCompleteMessage(message);
                        }
                    }
                );
            } else {
                // Use non-streaming API (fallback)
                const res = await ApiClient.chat({
                    messages: [...messages, userMessage],
                    model: selectedModel,
                    stream: false
                });

                console.log("Chat API response:", res);

                if (!res.success) {
                    console.error("Chat API error:", res.error);
                    setIsLoading(false);
                    return;
                }

                if (res.chunk.done) {
                    handleCompleteMessage(res.chunk.message.content);
                }
            }
        } catch (error) {
            console.error("Error during chat:", error);
            setIsLoading(false);
        }
    };

    const handleCompleteMessage = (content: string) => {
        const assitantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            content,
            role: 'assistant',
            createdAt: new Date()
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