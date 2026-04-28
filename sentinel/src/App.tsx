import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AgentDashboard } from './components/AgentDashboard';
import { useTheme } from './hooks/useTheme';

type View = 'landing' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('landing');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      {view === 'landing' && (
        <LandingPage onLaunch={() => setView('dashboard')} theme={theme} onToggleTheme={toggleTheme} />
      )}
      {view === 'dashboard' && (
        <AgentDashboard onBack={() => setView('landing')} theme={theme} onToggleTheme={toggleTheme} />
      )}
    </div>
  );
}

export default App;
