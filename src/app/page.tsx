'use client';

import { useState } from 'react';
import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#212121] flex flex-row">
      <Sidebar
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
      />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto h-full">
          <Chat selectedModel={selectedModel} />
        </div>
      </main>
    </div>
  );
}
