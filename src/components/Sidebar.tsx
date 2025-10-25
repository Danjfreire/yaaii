'use client';

import DarkModeToggle from './DarkModeToggle';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
    isMobile?: boolean;
}

export default function Sidebar({ className = '', onClose, isMobile = false }: SidebarProps) {
    return (
        <div className={`bg-white dark:bg-[#09090B] shadow-lg h-screen w-[250px] flex flex-col p-4 ${className}`}>
            {/* Mobile Close Button */}
            {isMobile && onClose && (
                <button
                    onClick={onClose}
                    className="self-end p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mb-4"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-400 mb-6">
                YAAII
            </h1>

            {/* Dark Mode Toggle */}
            <div className='mt-auto ml-auto'>
                <DarkModeToggle />
            </div>
        </div>
    );
}