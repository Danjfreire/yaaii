'use client';

import { useState } from 'react';
import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';
import ModelSelector from '@/components/ModelSelector';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181A] flex flex-row">
      <Sidebar />
      <main className="flex-1 p-4">
        {/* Header */}
        <div className='flex justify-start'>
          <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
        </div>

        <div className="max-w-5xl mx-auto">
          <Chat selectedModel={selectedModel} />
        </div>
      </main>
    </div>
  );
}
