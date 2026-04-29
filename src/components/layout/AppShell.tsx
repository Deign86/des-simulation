import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnimatedBackground from '../ui/AnimatedBackground';

interface AppShellProps {
  onAbout: () => void;
}

export default function AppShell({ onAbout }: AppShellProps) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onAbout={onAbout} />
        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
