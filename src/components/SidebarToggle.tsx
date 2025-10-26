'use client';

import { PanelRight } from "lucide-react";


export interface SidebarToggleProps {
    onToggle?: () => void;
    className?: string;
}

export default function SidebarToggle({ onToggle, className = '' }: SidebarToggleProps) {

    return (
        <div
            className={`p-1 rounded-md hover:cursor-pointer hover:bg-[#303030] ${className}`}
            onClick={onToggle}
        >
            < PanelRight className="text-gray-500 dark:text-white hover:text-white" />
        </div>
    );
}