'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chat } from '@/types/chat';
import { ApiClient } from '@/lib/api-client';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatListProps {
    isCollapsed?: boolean;
    onSelectChat?: (chat: Chat) => void;
}

export default function ChatHistory({ isCollapsed = false, onSelectChat }: ChatListProps) {
    const router = useRouter();
    const { onChatListRefresh } = useChatContext();
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleChatClick = (chat: Chat) => {
        // Call the callback if provided
        onSelectChat?.(chat);
        // Navigate to the chat
        router.push(`/chat/${chat.id}`);
    };

    const fetchChats = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedChats = await ApiClient.getChats();
            setChats(fetchedChats);
        } catch (err) {
            setError('Failed to load chats');
            console.error('Error fetching chats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchChats();

        // Subscribe to chat list refresh events
        const unsubscribe = onChatListRefresh(() => {
            console.log('ChatHistory: Refreshing chat list');
            fetchChats();
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, [onChatListRefresh]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-3 py-4 text-sm text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className={`px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400 ${isCollapsed ? 'hidden' : ''}`}>
                No chats yet. Start a new conversation!
            </div>
        );
    }

    return (
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'hidden' : ''}`}>
            <div className="space-y-2 px-2 py-4">
                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => handleChatClick(chat)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2a2e] transition-colors group text-left"
                    >
                        <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {chat.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {new Date(chat.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
