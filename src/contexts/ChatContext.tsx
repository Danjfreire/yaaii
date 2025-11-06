'use client';

import { createContext, useContext, useCallback, useState } from 'react';

interface ChatContextType {
    triggerChatListRefresh: () => void;
    onChatListRefresh: (callback: () => void) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [refreshListeners, setRefreshListeners] = useState<Set<() => void>>(new Set());

    const triggerChatListRefresh = useCallback(() => {
        console.log('Triggering chat list refresh');
        refreshListeners.forEach(callback => callback());
    }, [refreshListeners]);

    const onChatListRefresh = useCallback((callback: () => void) => {
        setRefreshListeners(prev => {
            const newListeners = new Set(prev);
            newListeners.add(callback);
            return newListeners;
        });

        // Return cleanup function
        return () => {
            setRefreshListeners(prev => {
                const newListeners = new Set(prev);
                newListeners.delete(callback);
                return newListeners;
            });
        };
    }, []);

    return (
        <ChatContext.Provider value={{ triggerChatListRefresh, onChatListRefresh }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
