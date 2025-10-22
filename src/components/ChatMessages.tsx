import { ChatMessage as Message } from '@/types/chat';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
    messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    if (messages.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                <p>Welcome! Start a conversation with your AI assistant.</p>
                <p className="text-sm mt-2">Choose a model and begin chatting below.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.role === 'user'}
                    timestamp={message.createdAt}
                />
            ))}
        </div>
    );
}