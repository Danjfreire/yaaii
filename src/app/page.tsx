import Chat from '@/components/Chat';
import DarkModeToggle from '@/components/DarkModeToggle';
import Sidebar from '@/components/Sidebar';

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#212121] flex flex-row">
      <Sidebar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <header className="text-center mb-8 relative">

          </header>

          {/* Chat Container */}
          <Chat />
        </div>
      </main>
    </div>
  );
}
