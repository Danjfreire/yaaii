interface ChatMessageProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
            >
                <p className="text-sm">{message}</p>
                <p className="text-xs opacity-70 mt-1">
                    {timestamp.toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}