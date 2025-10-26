'use client';

import { PanelRight } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import SidebarToggle from './SidebarToggle';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
    isMobile?: boolean;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export default function Sidebar({
    className = '',
    onClose,
    isMobile = false,
    isCollapsed = false,
    onToggleCollapse
}: SidebarProps) {
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

            {/* Dark Mode Toggle */}
            <DarkModeToggle className={`mt-auto ${isCollapsed ? 'mt-auto' : 'ml-auto'}`} />
        </div>
    );
}