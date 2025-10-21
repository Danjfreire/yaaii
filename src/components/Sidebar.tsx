'use client';

import DarkModeToggle from './DarkModeToggle';
import ModelSelector from './ModelSelector';

interface SidebarProps {
    selectedModel: string;
    onModelSelect: (modelName: string) => void;
}

export default function Sidebar({ selectedModel, onModelSelect }: SidebarProps) {
    return (
        <div className="bg-white dark:bg-[#181818] shadow-lg h-screen w-[250px] flex flex-col p-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-400 mb-6">
                YAAII
            </h1>

            {/* Model Selection */}
            <ModelSelector
                selectedModel={selectedModel}
                onModelSelect={onModelSelect}
            />

            {/* Dark Mode Toggle */}
            <div className='mt-auto ml-auto'>
                <DarkModeToggle />
            </div>
        </div>
    );
}