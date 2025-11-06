'use client';

import { useRouter } from 'next/navigation';
import { PanelRight, Plus } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import SidebarToggle from './SidebarToggle';
import ChatHistory from './ChatHistory';
import { Chat } from '@/types/chat';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
    isMobile?: boolean;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    onSelectChat?: (chat: Chat) => void;
}

export default function Sidebar({
    className = '',
    onClose,
    isMobile = false,
    isCollapsed = false,
    onToggleCollapse,
    onSelectChat
}: SidebarProps) {
    const router = useRouter();

    // Calculate width based on collapsed state
    const sidebarWidth = isCollapsed ? 'w-[64px]' : 'w-[250px]';

    function handleToggle() {
        if (isMobile && onClose) {
            onClose();
            return;
        }

        if (onToggleCollapse) {
            onToggleCollapse();
        }
    }

    const handleNewChat = () => {
        router.push('/');
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <div className={`
            bg-white dark:bg-[#09090B] shadow-lg h-screen 
            ${sidebarWidth} 
            flex flex-col p-4 
            transition-all duration-300 ease-in-out
            ${className}
        `}>

            {/* Logo/Title */}
            <div className={`flex h-8 justify-between items-center hover:cursor-pointer ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                <h1 className={`
                text-lg font-semibold text-gray-900 text-center dark:text-gray-400 
                transition-opacity duration-300
            `}>
                    YAAII
                </h1>

                <SidebarToggle onToggle={handleToggle} />
            </div>

            {/* Collapsed Logo - Show only when collapsed , collapses on click*/}
            {isCollapsed && (
                <div className="text-center mb-6">
                    <div className="w-8 h-8 bg-[#303030] rounded-md flex items-center justify-center mx-auto hover:cursor-pointer group"
                        onClick={onToggleCollapse}>
                        <span className="text-white font-bold text-sm group-hover:hidden">Y</span>
                        <SidebarToggle onToggle={handleToggle} className='hidden group-hover:block' />
                    </div>
                </div>
            )}

            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors mb-4 ${isCollapsed ? 'justify-center p-2' : ''}`}
                title="Start a new chat"
            >
                <Plus className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>New Chat</span>}
            </button>

            {/* Chat History */}
            <ChatHistory isCollapsed={isCollapsed} onSelectChat={onSelectChat} />

            {/* Dark Mode Toggle */}
            <DarkModeToggle className={`mt-auto ${isCollapsed ? 'mt-auto' : 'ml-auto'}`} />
        </div>
    );
}