import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import SimulationPage from './pages/SimulationPage';
import AboutPage from './pages/AboutPage';
import TablesPage from './pages/TablesPage';
import { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showAbout, setShowAbout] = useState(false);

  const handleModeToggle = () => {
    setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  return (
    <BrowserRouter>
      <AppShell mode={mode} onModeToggle={handleModeToggle} onAbout={() => setShowAbout(!showAbout)} />
      <Routes>
        <Route path="/" element={<SimulationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tables" element={<TablesPage />} />
      </Routes>
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAbout(false)}>
          <div className="glass p-8 max-w-2xl max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <AboutPage />
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}
