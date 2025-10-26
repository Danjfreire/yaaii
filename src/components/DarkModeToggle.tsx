'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export interface DarkModeToggleProps {
    className?: string
}

export default function DarkModeToggle({ className = '' }: DarkModeToggleProps) {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div
            onClick={toggleDarkMode}
            className={`w-8 h-8 flex items-center justify-center p-1 hover:cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 hover:text-white hover:bg-[#303030] transition-colors ${className} group`}
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? (
                <Sun className='w-5 h-5' />
            ) : (
                <Moon className="text-gray-500 group-hover:text-white" />
            )}
        </div>

    );
}