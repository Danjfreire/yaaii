'use client';

import DarkModeToggle from './DarkModeToggle';
import ModelSelector from './ModelSelector';

export default function Sidebar() {
    return (
        <div className="bg-white dark:bg-[#09090B] shadow-lg h-screen w-[250px] flex flex-col p-4">
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