import Chat from '@/components/Chat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              YAAII
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Yet Another AI Interface - Your gateway to Ollama models
            </p>
          </header>

          {/* Chat Container */}
          <Chat />
        </div>
      </main>
    </div>
  );
}
