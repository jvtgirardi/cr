import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { initialPlayersData } from '../data/playersData';
import './Dashboard.css';

const Dashboard = () => {
  const { primaryColor, institutionName, directorName, directorPhoto } = useTheme();
  const navigate = useNavigate();

  const [players] = React.useState(() => {
    const saved = localStorage.getItem('players_data');
    return saved ? JSON.parse(saved) : initialPlayersData;
  });

  const [coaches] = React.useState(() => {
    const saved = localStorage.getItem('coaches_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [libraryDrills] = React.useState(() => {
    const saved = localStorage.getItem('training_library_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [trainingSessions] = React.useState(() => {
    const saved = localStorage.getItem('training_sessions_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestions] = React.useState(() => {
    const saved = localStorage.getItem('club_suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const sessionsThisMonth = trainingSessions.filter(session => {
    const date = new Date(session.date + 'T00:00:00');
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const today = new Date().toISOString().split('T')[0];
  const activeSuggestionsCount = suggestions.filter(s => s.endDate >= today).length;

  const coachActivityData = coaches.map(coach => {
    const drillCount = libraryDrills.filter(drill => drill.coach === coach.name).length;
    return { ...coach, drillCount };
  }).sort((a, b) => b.drillCount - a.drillCount).slice(0, 4);

  // Dynamic players by group calculation
  const categories = ['u12', 'u14', 'u16', 'u18', 'u20', 'senior'];
  const chartData = categories.map(cat => ({
    name: cat,
    value: players.filter(p => p.category.toLowerCase() === cat && p.status === 'Active').length
  })).filter(item => item.value >= 0); // Keep zeros to show groups

  const sortedCoaches = [...coaches].sort((a, b) => (b.sessions || 0) - (a.sessions || 0)).slice(0, 4);

  return (
    <div className="dashboard-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="welcome-text">{directorName || 'Technical Director'}</h1>
          <p className="subtitle">Welcome back, {institutionName || 'CoachBoard'}</p>
        </div>
        <div className="user-profile glass" style={{ border: `1px solid ${primaryColor}` }}>
          <span className="premium-badge neon-shadow">Premium</span>
          {directorPhoto ? (
            <img src={directorPhoto} alt="User" style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }} />
          ) : (
            <div style={{ backgroundColor: primaryColor, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'black' }}>
               {directorName ? directorName.charAt(0) : 'U'}
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="stats-section">
          <h2 className="section-title">Club management</h2>
          <div 
            className="stats-card glass clickable" 
            onClick={() => navigate('/sessions')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <h3>Training statistics</h3>
              <ChevronRight size={20} />
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-value">{sessionsThisMonth}</span>
                <span className="stat-label">this month</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{coaches.length}</span>
                <span className="stat-label">active trainers</span>
              </div>
            </div>
          </div>
          
          <div 
            className="suggestions-card glass mt-lg clickable" 
            onClick={() => navigate('/suggestions')}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <div className="flex items-center gap-sm">
                <Plus size={20} className="accent-text" />
                <h3>Active suggestions</h3>
              </div>
              <ChevronRight size={20} />
            </div>
            <div className="suggestion-item">
              <span className="suggestion-count">{activeSuggestionsCount} Active suggestions</span>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h2 className="section-title">Players by Group</h2>
          <div 
            className="chart-card glass clickable"
            onClick={() => navigate('/players')}
            style={{ cursor: 'pointer' }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'none', borderRadius: '10px' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={primaryColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="recent-activity mt-xl">
        <h2 className="section-title">Coaches Activity</h2>
        <div 
          className="activity-list glass clickable"
          onClick={() => navigate('/library')}
          style={{ cursor: 'pointer' }}
        >
          {coachActivityData.length > 0 ? coachActivityData.map((coach, index) => (
            <div key={coach.name} className="activity-item">
              <div className="coach-info">
                <div className="rank">{index + 1}</div>
                <div className="avatar-placeholder">{coach.name.charAt(0)}</div>
                <span className="coach-name">{coach.name}</span>
              </div>
              <div className="activity-track">
                <div 
                  className="track-progress" 
                  style={{ 
                    width: `${(coach.drillCount / (coachActivityData[0]?.drillCount || 1)) * 100}%`,
                    backgroundColor: primaryColor
                  }}
                ></div>
              </div>
              <span className="activity-count">{coach.drillCount}</span>
            </div>
          )) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
               No activities recorded in the library yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
