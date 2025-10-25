'use client';

import { useState, useEffect } from 'react';
import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';
import ModelSelector from '@/components/ModelSelector';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <Sidebar className="hidden md:flex" />

      {/* Mobile Overlay Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sliding Sidebar */}
          <div className="relative">
            <Sidebar
              className="transform transition-transform duration-300 ease-in-out"
              onClose={() => setIsMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      <main className="flex-1 p-4">
        {/* Header */}
        <div className='flex justify-between items-center'>
          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 md:flex-none">
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
