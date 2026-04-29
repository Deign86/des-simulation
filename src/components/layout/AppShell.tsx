import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnimatedBackground from '../ui/AnimatedBackground';

interface AppShellProps {
  mode: 'encrypt' | 'decrypt';
  onModeToggle: () => void;
  onAbout: () => void;
}

export default function AppShell({ mode, onModeToggle, onAbout }: AppShellProps) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header mode={mode} onModeToggle={onModeToggle} onAbout={onAbout} />
        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
