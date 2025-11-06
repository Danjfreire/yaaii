'use client';

import { useRouter } from 'next/navigation';
import ChatInput from './ChatInput';

interface WelcomeInputProps {
    selectedModel: string;
}

export default function WelcomeInput({ selectedModel }: WelcomeInputProps) {
    const router = useRouter();

    const handleSendMessage = (messageText: string) => {
        if (!selectedModel || !messageText.trim()) return;

        // Generate a new chatId
        const chatId = crypto.randomUUID();

        // Pass the message as a query parameter to the chat page
        router.push(`/chat/${chatId}?initialMessage=${encodeURIComponent(messageText)}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                    What would you like to talk about?
                </h1>

                <div>
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        disabled={!selectedModel}
                        isLoading={false}
                        minHeight="min-h-20"
                        maxHeight="max-h-64"
                        placeholder="Ask me anything..."
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {!selectedModel ? 'Please select a model to start' : 'Press Enter to send'}
                    </p>
                </div>
            </div>
        </div>
    );
}
