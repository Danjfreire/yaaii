'use client';

import { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';
import ModelSelector from '@/components/ModelSelector';
import { PanelRight } from 'lucide-react';
import SidebarToggle from '@/components/SidebarToggle';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181A] flex flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        className="hidden md:flex"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Overlay Sidebar */}
      <div className={`
        fixed inset-0 z-50 md:hidden
        transition-opacity duration-300 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/50
            transition-opacity duration-300 ease-in-out
            ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Sliding Sidebar */}
        <div className="relative">
          <Sidebar
            className={`
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            onClose={() => setIsMobileMenuOpen(false)}
            isMobile={true}
          />
        </div>
      </div>

      <main className="flex-1 p-4">
        {/* Header */}
        <div className='flex items-center'>
          <div onClick={() => setIsMobileMenuOpen(true)}>
            <SidebarToggle className='md:hidden mr-2' />
          </div>
          <div className="flex-1 md:flex-none items-center justify-center">
            <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Chat selectedModel={selectedModel} />
        </div>
      </main>
    </div>
  );
}
