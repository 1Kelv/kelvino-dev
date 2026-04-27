import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AgentDashboard } from './components/AgentDashboard';

type View = 'landing' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('landing');

  return (
    <div className="app">
      {view === 'landing' && <LandingPage onLaunch={() => setView('dashboard')} />}
      {view === 'dashboard' && <AgentDashboard onBack={() => setView('landing')} />}
    </div>
  );
}

export default App;
