'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';
import { ApiClient } from '@/lib/api-client';
import { ChatChunk, ChatCompleteChunk, ChatMessage, OllamaMessage } from '@/types/ollama-chat';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatProps {
    selectedModel: string;
    chatId?: string;
}

export default function Chat({ selectedModel }: ChatProps) {
    const { triggerChatListRefresh } = useChatContext();
    const [chatId, setChatId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreamingMode, setIsStreamingMode] = useState(true); // Enable streaming by default
    const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Function to scroll to bottom smoothly
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-scroll during streaming when streamingMessage content changes
    useEffect(() => {
        scrollToBottom();
    }, [streamingMessage?.content]);

    const handleSendMessage = async (messageText: string) => {

        // if it's a new chat, create a new Chat Id
        if (!chatId && messages.length === 0) {
            setChatId(crypto.randomUUID());
        }

        // Add user message immediately
        console.log("Selected model:", selectedModel);
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            chatId: chatId!,
            content: messageText,
            role: 'user',
            createdAt: new Date().toISOString()

        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            if (isStreamingMode) {
                // Create initial streaming message
                const initialStreamingMessage: ChatMessage = {
                    id: crypto.randomUUID(),
                    chatId: chatId!,
                    content: '',
                    role: 'assistant',
                    createdAt: new Date().toISOString()
                };
                setStreamingMessage(initialStreamingMessage);

                // Keep track of accumulated content
                let accumulatedContent = '';

                await ApiClient.chatStreaming(
                    {
                        messages: [...messages, userMessage],
                        model: selectedModel,
                        stream: true,
                        chatId: chatId!
                    },
                    (chunk) => {
                        accumulatedContent += chunk.message.content;

                        // Update streaming message with accumulated content
                        setStreamingMessage(prev => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                content: accumulatedContent
                            };
                        });

                        if (chunk.done) {
                            console.log("Streaming complete!");
                            console.log("Final accumulated content:", accumulatedContent);
                            handleCompleteMessage(accumulatedContent, initialStreamingMessage);
                        }
                    }
                );
            } else {
                const res = await ApiClient.chat({
                    messages: [...messages, userMessage],
                    model: selectedModel,
                    stream: false,
                    chatId: chatId!
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
            setStreamingMessage(null); // Clean up streaming message on error
        }
    };

    const handleCompleteMessage = (content?: string, messageTemplate?: ChatMessage) => {
        console.log("handleCompleteMessage called with:", { content, messageTemplate, streamingMessage });

        if (messageTemplate && content) {
            // Convert streaming message to completed message using the template
            const finalMessage: ChatMessage = {
                ...messageTemplate,
                content: content
            };
            console.log("Converting streaming message to final:", finalMessage);
            setMessages(prev => [...prev, finalMessage]);
            setStreamingMessage(null);
        } else if (streamingMessage) {
            const finalMessage: ChatMessage = {
                ...streamingMessage,
                content: content || streamingMessage.content
            };
            console.log("Converting streaming message to final (fallback):", finalMessage);
            setMessages(prev => [...prev, finalMessage]);
            setStreamingMessage(null);
        } else if (content) {
            // Non-streaming mode
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                chatId: chatId!,
                content,
                role: 'assistant',
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, assistantMessage]);
        }

        // if this was the fist message in a new chat, notify that a new chat was created
        if (messages.length === 1) {
            triggerChatListRefresh();
        }


        setIsLoading(false);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Chat Messages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 p-6 overflow-y-auto hide-scrollbar"
            >
                <ChatMessages
                    messages={messages}
                    streamingMessage={streamingMessage}
                />
                {isLoading && !streamingMessage && <ChatLoading />}
            </div>

            {/* Chat Input Area */}
            <div className="border-t border-gray-200 dark:border-[#303030] p-4">
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
}