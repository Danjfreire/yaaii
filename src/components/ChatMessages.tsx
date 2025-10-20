import ChatMessage from './ChatMessage';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

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
                    message={message.text}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                />
            ))}
        </div>
    );
}