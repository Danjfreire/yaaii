'use client';

import { useState } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatLoading from './ChatLoading';
import DarkModeToggle from './DarkModeToggle';

export default function Sidebar() {

    return (
        <div className="bg-white dark:bg-[#181818] shadow-lg h-screen w-[250px] flex flex-col p-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-400 mb-2">
                YAAII
            </h1>
            <div className='mt-auto ml-auto'>
                <DarkModeToggle />
            </div>
        </div>
    );
}