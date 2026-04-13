import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Coaches from './pages/Coaches';
import TrainingLibrary from './pages/TrainingLibrary';
import PrinciplesLibrary from './pages/PrinciplesLibrary';
import TrainingSessions from './pages/TrainingSessions';
import Suggestions from './pages/Suggestions';
import Settings from './pages/Settings';
import Players from './pages/Players';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Sidebar />
        <main className="main-content">
          <div className="gradient-bg"></div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/library" element={<TrainingLibrary />} />
            <Route path="/principles" element={<PrinciplesLibrary />} />
            <Route path="/sessions" element={<TrainingSessions />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/players" element={<Players />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
