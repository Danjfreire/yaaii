import Markdown from "react-markdown";
interface ChatMessageProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
    isStreaming?: boolean;
}

export default function ChatMessage({ message, isUser, timestamp, isStreaming = false }: ChatMessageProps) {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${isUser
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white'
                    : 'bg-gray-100 dark:bg-[#303030] text-gray-900 dark:text-white'
                    }`}
            >
                <div className="text-base flex items-end">
                    <div className="w-full">
                        <Markdown
                            components={{
                                p: ({ children }) => <span>{children}</span>,
                                em: ({ children }) => <span className="text-[#9ca3af] italic">{children}</span>,
                                pre: ({ children }) => <pre className="bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono text-sm overflow-x-auto my-2">{children}</pre>,
                            }}
                        >
                            {message}
                        </Markdown>
                        {isStreaming && (
                            <span className="animate-pulse text-white ml-1">|</span>
                        )}
                    </div>
                </div>
                <p className="text-xs opacity-70 mt-1">
                    {timestamp.toLocaleTimeString()}
                    {isStreaming && <span className="ml-1 text-green-500">• streaming</span>}
                </p>
            </div>
        </div>
    );
}