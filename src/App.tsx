import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import SimulationPage from './pages/SimulationPage';
import AboutPage from './pages/AboutPage';
import TablesPage from './pages/TablesPage';
import { useState, createContext, useContext, type ReactNode } from 'react';

interface ModeContextValue {
  mode: 'encrypt' | 'decrypt';
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}

function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const toggleMode = () => setMode(prev => prev === 'encrypt' ? 'decrypt' : 'encrypt');
  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export default function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <BrowserRouter>
      <ModeProvider>
        <AppShell onAbout={() => setShowAbout(!showAbout)} />
        <Routes>
          <Route path="/" element={<SimulationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tables" element={<TablesPage />} />
        </Routes>
      </ModeProvider>
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
