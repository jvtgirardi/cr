import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  ClipboardCheck, 
  Trash2, 
  Plus, 
  X, 
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit2,
  ChevronRight,
  PlayCircle, 
  Download, 
  Target,
  ChevronDown,
  XCircle,
  Star,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend,
  AreaChart,
  Area,
  LabelList
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { initialPrinciplesData } from '../data/principlesData';
import { initialTrainingsLibraryData } from '../data/trainingsData';
import { initialPlayersData } from '../data/playersData';
import './TrainingSessions.css';

// Mock data
const coachesData = [
  { id: 1, name: 'Alessandro Rama' },
  { id: 2, name: 'Deleaval Cyril' },
  { id: 3, name: 'Ilir Selmani' },
  { id: 4, name: 'Ludovic' },
  { id: 5, name: 'Mazamay Yann' },
  { id: 6, name: 'Selmani Arianit' },
];

const mockPlayersByCategory = initialPlayersData.reduce((acc, player) => {
  if (!acc[player.category]) acc[player.category] = [];
  acc[player.category].push(player);
  return acc;
}, {});

const initialSessions = [
  {
    id: 1,
    date: '2026-04-10',
    category: 'U18',
    coach: 'Alessandro Rama',
    activities: [
      { 
        id: 101, 
        drillTitle: 'Defensive Organization', 
        duration: '45', 
        selectedAthletes: ['Rodrygo Goes', 'Vinicius Jr', 'Gabriel Martinelli'],
        selectedPrinciples: ['Compactness', 'Recovery Power', 'Defensive Transition']
      },
      { 
        id: 102, 
        drillTitle: 'Finishing Drills', 
        duration: '45', 
        selectedAthletes: ['Rodrygo Goes', 'Vinicius Jr'],
        selectedPrinciples: ['Finishing', 'Attacking the Box']
      }
    ]
  },
  {
    id: 2,
    date: '2026-04-12',
    category: 'U18',
    coach: 'Alessandro Rama',
    activities: [
      { 
        id: 103, 
        drillTitle: 'Ball Possession', 
        duration: '60', 
        selectedAthletes: ['Rodrygo Goes', 'Casemiro'],
        selectedPrinciples: ['Possession', 'Switch of Play']
      }
    ]
  }
];

const TrainingSessions = () => {
  const { primaryColor, institutionName, logo } = useTheme();
  const [sessions, setSessions] = useState(initialSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCoach, setFilterCoach] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const getTodayStr = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    // Forcing local midnight to avoid UTC timezone shifts
    return new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  };

  // Form State
  const [editFormData, setEditFormData] = useState(null);
  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('training_assessments');
    return saved ? JSON.parse(saved) : {};
  });
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessingSession, setAssessingSession] = useState(null);
  const [tempAssessments, setTempAssessments] = useState({});

  React.useEffect(() => {
    localStorage.setItem('training_assessments', JSON.stringify(assessments));
  }, [assessments]);

  const [formData, setFormData] = useState({
    date: getTodayStr(),
    category: 'U18',
    coach: coachesData[0].name,
    videoUrl: '',
    activities: []
  });

  const [modalMode, setModalMode] = useState('add');
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [selectedIndividualAthlete, setSelectedIndividualAthlete] = useState('');

  const [currentActivity, setCurrentActivity] = useState({
    drillTitle: '',
    duration: '',
    selectedAthletes: [],
    selectedPrinciples: []
  });

  const [isActivityPrinciplesModalOpen, setIsActivityPrinciplesModalOpen] = useState(false);
  const [isActivityPlayersModalOpen, setIsActivityPlayersModalOpen] = useState(false);
  const [athleteFilterName, setAthleteFilterName] = useState('');
  const [athleteFilterCategory, setAthleteFilterCategory] = useState('U18');
  const [showDrillDropdown, setShowDrillDropdown] = useState(false);
  const [drillSearchTerm, setDrillSearchTerm] = useState('');

  const allPlayersList = Object.entries(mockPlayersByCategory).flatMap(([cat, players]) => players.map(p => ({ ...p, category: cat })));
  
  const handlePrint = () => {
    window.print();
  };

  const COLORS = ['#5CE1E6', '#FFD700', '#FF2D55', '#AF52DE', '#34C759', '#FF9500', '#007AFF', '#FF1493', '#00CED1'];

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const getPrinciplesData = (filteredSessionsData) => {
    const counts = {};
    filteredSessionsData.forEach(session => {
       session.activities?.forEach(act => {
          act.selectedPrinciples?.forEach(p => {
             counts[p] = (counts[p] || 0) + 1;
          });
       });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getWeeklyPrinciplesData = (filteredSessionsData) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => ({ day }));
    
    filteredSessionsData.forEach(session => {
       const date = parseLocalDate(session.date);
       const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
       const dayObj = data.find(d => d.day === dayName);
       if (dayObj) {
          session.activities?.forEach(act => {
             act.selectedPrinciples?.forEach(p => {
                dayObj[p] = (dayObj[p] || 0) + 1;
             });
          });
       }
    });
    return data;
  };

  const handleDeleteSession = (id) => {
    if (window.confirm('Are you sure you want to delete this training session?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      date: getTodayStr(),
      category: 'U18',
      coach: coachesData[0].name,
      videoUrl: '',
      activities: []
    });
    setCurrentActivity({ drillTitle: '', duration: '', selectedAthletes: [], selectedPrinciples: [] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session) => {
    setModalMode('edit');
    setEditingSession(session);
    setFormData({
      date: session.date,
      category: session.category,
      coach: session.coach,
      videoUrl: session.videoUrl || '',
      activities: session.activities || []
    });
    setIsModalOpen(true);
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (formData.activities.length === 0) {
      alert("Por favor, adicione pelo menos uma atividade à sessão.");
      return;
    }
    if (modalMode === 'add') {
      setSessions([{ ...formData, id: Date.now() }, ...sessions]);
    } else {
      setSessions(sessions.map(s => s.id === editingSession.id ? { ...s, ...formData } : s));
    }
    setIsModalOpen(false);
  };

  const handleAddActivity = () => {
    if (!currentActivity.drillTitle || !currentActivity.duration) {
      alert("Preencha o título e a duração da atividade.");
      return;
    }
    setFormData({
      ...formData,
      activities: [...formData.activities, { 
        id: Date.now(), 
        ...currentActivity,
        athletesCount: currentActivity.selectedAthletes.length
      }]
    });
    setCurrentActivity({ drillTitle: '', duration: '', selectedAthletes: [], selectedPrinciples: [] });
  };

  const handleDrillTitleChange = (val) => {
    setCurrentActivity({ ...currentActivity, drillTitle: val });
    setDrillSearchTerm(val);
    setShowDrillDropdown(true);
  };

  const selectDrillFromLibrary = (drill) => {
    setCurrentActivity({
      ...currentActivity,
      drillTitle: drill.title,
      duration: drill.duration || currentActivity.duration
    });
    setDrillSearchTerm(drill.title);
    setShowDrillDropdown(false);
  };

  const toggleAthlete = (name) => {
    setCurrentActivity(prev => {
      const isSelected = prev.selectedAthletes.includes(name);
      return {
        ...prev,
        selectedAthletes: isSelected ? prev.selectedAthletes.filter(n => n !== name) : [...prev.selectedAthletes, name]
      };
    });
  };

  const toggleActivityPrinciple = (principleName) => {
    setCurrentActivity(prev => {
      const isSelected = (prev.selectedPrinciples || []).includes(principleName);
      return {
        ...prev,
        selectedPrinciples: isSelected ? prev.selectedPrinciples.filter(p => p !== principleName) : [...(prev.selectedPrinciples || []), principleName]
      };
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchCategory = filterCategory === 'All' || session.category === filterCategory;
    const matchCoach = filterCoach === 'All' || session.coach === filterCoach;
    const matchSearch = searchTerm === '' || 
      session.coach.toLowerCase().includes(searchTerm.toLowerCase()) || 
      session.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchDate = true;
    if (filterStartDate) {
      if (parseLocalDate(session.date) < parseLocalDate(filterStartDate)) matchDate = false;
    }
    if (filterEndDate) {
      if (parseLocalDate(session.date) > parseLocalDate(filterEndDate)) matchDate = false;
    }

    return matchCategory && matchCoach && matchSearch && matchDate;
  });

  const filteredActivityPlayers = allPlayersList.filter(p => {
    const matchCat = athleteFilterCategory === 'All' ? true : p.category.toUpperCase() === athleteFilterCategory.toUpperCase();
    const matchName = p.name.toLowerCase().includes(athleteFilterName.toLowerCase());
    return matchCat && matchName;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const TACTICAL_PRINCIPLES = initialPrinciplesData.map(cat => ({
    category: cat.category,
    principles: cat.items.flatMap(sub => sub.principles).map(p => ({ name: p.name }))
  }));

  return (
    <>
    <div className="training-sessions animate-fade-in">
      <header className="page-header print-hidden">
        <div>
          <h1 className="welcome-text">Training 360</h1>
          <p className="subtitle">Daily performance and tactical evolution</p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
          <div className="filters-container glass header-filters">
            <div className="filter-item">
              <span className="filter-label">CATEGORY</span>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="glass-select">
                <option value="All">All Categories</option>
                {Object.keys(mockPlayersByCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="filter-item">
              <span className="filter-label">COACH</span>
              <select value={filterCoach} onChange={(e) => setFilterCoach(e.target.value)} className="glass-select">
                <option value="All">All Coaches</option>
                {coachesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">PERIOD</span>
              <div className="date-range-filters">
                <div className="date-picker-mini glass">
                  <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="glass-input-small" />
                  {filterStartDate && <X size={12} className="clear-date" onClick={() => setFilterStartDate('')} />}
                </div>
                <span className="date-separator">-</span>
                <div className="date-picker-mini glass">
                  <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="glass-input-small" />
                  {filterEndDate && <X size={12} className="clear-date" onClick={() => setFilterEndDate('')} />}
                </div>
              </div>
            </div>
          </div>

          <button className="add-session-btn" style={{ backgroundColor: primaryColor, height: 'fit-content' }} onClick={handleOpenAddModal}>
            <Plus size={18} /> Register Session
          </button>
        </div>
      </header>

      <div className="tabs-navigation print-hidden">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`} 
            onClick={() => setActiveTab('sessions')}
            style={activeTab === 'sessions' ? { backgroundColor: primaryColor, color: '#000' } : {}}
          >
            Sessions Log
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history-group' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history-group')}
            style={activeTab === 'history-group' ? { backgroundColor: primaryColor, color: '#000' } : {}}
          >
            History: Group
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history-individual' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history-individual')}
            style={activeTab === 'history-individual' ? { backgroundColor: primaryColor, color: '#000' } : {}}
          >
            History: Individual
          </button>
        </div>
      </div>

      <div className="sessions-content mt-xl">
        {activeTab === 'sessions' && (
          <div className="sessions-list animate-fade-in">
            {filteredSessions.length > 0 ? filteredSessions.map(session => (
              <div key={session.id} className="session-card glass">
                <div className="session-header">
                  <div className="session-info-main">
                    <div className="date-tag">
                      <Calendar size={14} /> 
                      {new Date(session.date + 'T00:00:00').toLocaleDateString()}
                    </div>
                    <h3>{session.category} Training Session</h3>
                    <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>
                      <div className="coach-badge" style={{ color: primaryColor }}><Users size={14} /> {session.coach}</div>
                      <div className="meta-badge"><Clock size={14} /> {session.activities?.reduce((acc, a) => acc + (Number(a.duration)||0), 0)} min</div>
                    </div>
                  </div>
                  <div className="flex gap-sm">
                    <button className="glass" onClick={() => handleOpenEditModal(session)} style={{ padding: '8px', borderRadius: '10px' }}><Edit2 size={16} /></button>
                    <button className="glass" onClick={() => { setAssessingSession(session); setIsAssessmentModalOpen(true); }} style={{ padding: '8px', borderRadius: '10px', color: primaryColor }} title="Assess Athletes"><Star size={16} /></button>
                    <button className="glass" onClick={() => handleDeleteSession(session.id)} style={{ padding: '8px', borderRadius: '10px', color: '#ff453a' }}><Trash2 size={16} /></button>
                    <button className="glass" onClick={() => setSelectedSession(session)} style={{ padding: '8px', borderRadius: '10px', background: primaryColor, color: '#000' }}><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="session-body">
                  <div className="drills-section">
                    <h4>Applied Activities</h4>
                    <div className="drills-tags">
                      {session.activities.map((act, i) => (
                        <span key={i} className="drill-tag">{act.drillTitle} ({act.duration} min)</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="no-results glass" style={{ padding: '60px', textAlign: 'center' }}>
                <Calendar size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
                <p>No training sessions found for the selected filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history-group' && (
          <div className="history-tab-content animate-fade-in print-area" id="group-report">
            {/* Print Header */}
            <div className="print-only report-header" style={{ display: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                {logo ? <img src={logo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} /> : <div style={{ width: '80px', height: '80px', background: primaryColor, borderRadius: '12px' }} />}
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px' }}>{institutionName}</h1>
                  <p style={{ margin: 0 }}>Group Performance Report - {parseLocalDate(getTodayStr()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Group History: <span style={{ color: primaryColor }}>{filterCategory === 'All' ? 'All Categories' : filterCategory}</span></h2>
                <p style={{ color: 'var(--text-muted)' }}>Analysis of tactical focus and workload distribution</p>
              </div>
              <button className="glass print-hidden" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                <Download size={18} /> Export Group PDF
              </button>
            </div>

            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
              <div className="metric-card glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>Total Sessions</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{filteredSessions.length}</div>
              </div>
              <div className="metric-card glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>Total Volume</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{filteredSessions.reduce((acc, s) => acc + s.activities.reduce((a, b) => a + Number(b.duration), 0), 0)} min</div>
              </div>
              <div className="metric-card glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>Principles Worked</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{getPrinciplesData(filteredSessions).length}</div>
              </div>
              <div className="metric-card glass" style={{ padding: '20px', borderRadius: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '5px' }}>Avg Intensity</div>
                <div style={{ fontSize: '28px', fontWeight: 700 }}>{filteredSessions.length > 0 ? (getPrinciplesData(filteredSessions).reduce((a,b) => a + b.value, 0) / filteredSessions.length).toFixed(1) : 0}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>1. Tactical Principles Distribution (%)</h4>
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={getPrinciplesData(filteredSessions)} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" label={renderPieLabel} labelLine={false}>
                        {getPrinciplesData(filteredSessions).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>2. Principle intensity by Weekday</h4>
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getWeeklyPrinciplesData(filteredSessions)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} />
                      {getPrinciplesData(filteredSessions).map((p, i) => (
                        <Bar key={i} dataKey={p.name} stackId="a" fill={COLORS[i % COLORS.length]}>
                          {/* Only show labels if the value is > 0 */}
                          <LabelList dataKey={p.name} position="center" fill="white" fontSize={10} fontWeight="bold" formatter={(val) => val > 0 ? val : ''} />
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
              <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>3. Group Volume Evolution (Total min)</h4>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredSessions.map(s => ({ date: parseLocalDate(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), volume: s.activities.reduce((a, b) => a + Number(b.duration), 0) })).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="volume" stroke={primaryColor} fillOpacity={0.3} fill={primaryColor}>
                        <LabelList dataKey="volume" position="top" fill={primaryColor} fontSize={11} fontWeight="bold" offset={10} />
                      </Area>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>4. Avg. Athlete Performance (Score 0-10)</h4>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredSessions.map(s => {
                      const sessionAss = assessments[s.id] || {};
                      const scores = Object.values(sessionAss).map(a => Number(a.score)).filter(score => !isNaN(score));
                      const avg = scores.length > 0 ? (scores.reduce((a,b) => a+b, 0) / scores.length) : 0;
                      return { date: parseLocalDate(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), score: avg };
                    }).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 10]} stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="score" fill={primaryColor} radius={[10, 10, 0, 0]}>
                        <LabelList dataKey="score" position="top" fill={primaryColor} fontSize={12} fontWeight="bold" offset={8} formatter={(val) => val > 0 ? val.toFixed(1) : ''} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history-individual' && (
          <div className="history-tab-content animate-fade-in print-area" id="individual-report">
            <div className="print-only report-header" style={{ display: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                {logo ? <img src={logo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} /> : <div style={{ width: '80px', height: '80px', background: primaryColor, borderRadius: '12px' }} />}
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px' }}>{institutionName}</h1>
                  <p style={{ margin: 0 }}>Individual Player Report - {parseLocalDate(getTodayStr()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h2>Individual Evolution</h2>
                <div className="athlete-selector glass print-hidden" style={{ padding: '8px 15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={16} style={{ color: primaryColor }} />
                  <select value={selectedIndividualAthlete} onChange={(e) => setSelectedIndividualAthlete(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer' }}>
                    <option value="" style={{ background: '#111' }}>Select Athlete...</option>
                    {allPlayersList.map(p => <option key={p.id} value={p.name} style={{ background: '#111' }}>{p.name} ({p.category})</option>)}
                  </select>
                </div>
              </div>
              {selectedIndividualAthlete && (
                <button className="glass print-hidden" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  <Download size={18} /> Export Athlete PDF
                </button>
              )}
            </div>

            {selectedIndividualAthlete ? (
              <>
                <div className="athlete-summary glass" style={{ padding: '30px', borderRadius: '25px', marginBottom: '30px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: primaryColor, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 900 }}>{selectedIndividualAthlete.charAt(0)}</div>
                  <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{selectedIndividualAthlete}</h1>
                    <div style={{ display: 'flex', gap: '30px', color: 'var(--text-muted)' }}>
                      <span>Attendance: <strong>{sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete))).length} sessions</strong></span>
                      <span>Category: <strong>{allPlayersList.find(p => p.name === selectedIndividualAthlete)?.category}</strong></span>
                      <span>Total Volume: <strong>{sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete))).reduce((acc, s) => acc + s.activities.filter(a => a.selectedAthletes.includes(selectedIndividualAthlete)).reduce((aa, bb) => aa + Number(bb.duration), 0), 0)} min</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                  <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                    <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>1. Tactical Principles Focus (%)</h4>
                    <div style={{ height: '350px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={getPrinciplesData(sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete))))} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" label={renderPieLabel} labelLine={false}>
                            {getPrinciplesData(sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete)))).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                    <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>2. Frequency by Weekday</h4>
                    <div style={{ height: '350px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getWeeklyPrinciplesData(sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete))))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                          <Legend verticalAlign="bottom" height={36} />
                          {getPrinciplesData(sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete)))).map((p, i) => (
                            <Bar key={i} dataKey={p.name} stackId="a" fill={COLORS[i % COLORS.length]}>
                                <LabelList dataKey={p.name} position="center" fill="white" fontSize={10} fontWeight="bold" formatter={(val) => val > 0 ? val : ''} />
                            </Bar>
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                  <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                    <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>3. Personalized Load History (min)</h4>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete))).map(s => ({ date: parseLocalDate(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), volume: s.activities.filter(a => a.selectedAthletes.includes(selectedIndividualAthlete)).reduce((aa, bb) => aa + Number(bb.duration), 0) })).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                          <YAxis stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                          <Area type="monotone" dataKey="volume" stroke={primaryColor} fillOpacity={0.3} fill={primaryColor}>
                            <LabelList dataKey="volume" position="top" fill={primaryColor} fontSize={11} fontWeight="bold" offset={10} />
                          </Area>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card glass" style={{ padding: '25px', borderRadius: '20px' }}>
                    <h4 style={{ marginBottom: '25px', fontSize: '16px' }}>4. Personal Score Evolution (0-10)</h4>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sessions.filter(s => s.activities.some(a => a.selectedAthletes.includes(selectedIndividualAthlete))).map(s => {
                          const athleteId = allPlayersList.find(p => p.name === selectedIndividualAthlete)?.id;
                          const scoreObj = assessments[s.id]?.[athleteId];
                          const score = scoreObj ? Number(scoreObj.score) : 0;
                          return {
                            date: parseLocalDate(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                            score: score
                          };
                        }).sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 10]} stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                          <Area type="monotone" dataKey="score" stroke={primaryColor} fillOpacity={0.3} fill={primaryColor}>
                            <LabelList dataKey="score" position="top" fill={primaryColor} fontSize={11} fontWeight="bold" offset={10} formatter={(val) => val > 0 ? val.toFixed(1) : ''} />
                          </Area>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass" style={{ padding: '80px', textAlign: 'center', borderRadius: '30px', color: 'var(--text-muted)' }}>
                <Users size={60} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <h3>Select an athlete above to visualize their historical performance and development profile.</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Detail Modal */}
    {selectedSession && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 6000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '50px 20px', overflowY: 'auto' }}>
        <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', padding: '35px', overflowY: 'auto', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Session Details</h2>
            <button className="glass" onClick={() => setSelectedSession(null)} style={{ padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '30px', margin: 0 }}>{selectedSession.category} Session</h1>
              <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Lead Coach: <strong>{selectedSession.coach}</strong></p>
            </div>
            <div className="date-tag" style={{ padding: '8px 16px' }}>
              <Calendar size={14} /> {new Date(selectedSession.date + 'T00:00:00').toLocaleDateString()}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={18} /> Training Activities ({selectedSession.activities?.length || 0})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {selectedSession.activities?.map((act, i) => (
                <div key={i} className="glass" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600, fontSize: '18px', color: primaryColor }}>{act.drillTitle}</span>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {act.duration} min</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                      {act.selectedPrinciples?.map(p => <span key={p} style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--text-muted)' }}>{p}</span>)}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                      <strong>Athletes ({act.selectedAthletes?.length || 0}):</strong> {act.selectedAthletes?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedSession.videoUrl && (
            <a href={selectedSession.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', background: primaryColor, color: '#000', borderRadius: '16px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
              <PlayCircle size={20} /> Watch Training Video
            </a>
          )}
        </div>
      </div>
    )}

    {/* Registration Modal */}
    {isModalOpen && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '50px 20px', overflowY: 'auto' }}>
        <div className="modal-content glass animate-scale-in session-modal" style={{ width: '100%', maxWidth: '950px', maxHeight: '90vh', padding: '35px', overflowY: 'auto', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{modalMode === 'add' ? 'Register New Session' : 'Edit Training Session'}</h2>
            <button className="glass" onClick={() => setIsModalOpen(false)} style={{ padding: '8px', cursor: 'pointer', border: 'none' }}><X size={24} /></button>
          </div>
          
          <form onSubmit={handleSaveSession}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Session Date</label>
                <input type="date" className="glass-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Category</label>
                <select className="glass-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {Object.keys(mockPlayersByCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Lead Coach</label>
                <select className="glass-select" value={formData.coach} onChange={(e) => setFormData({ ...formData, coach: e.target.value })}>
                  {coachesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="activity-builder-section glass" style={{ padding: '25px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}><Target size={18} style={{ color: primaryColor }} /> Activity Builder</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '15px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="Drill Title (e.g. 4 vs 4 + 3 jokers)" 
                    value={currentActivity.drillTitle} 
                    onChange={(e) => handleDrillTitleChange(e.target.value)} 
                    onFocus={() => setShowDrillDropdown(true)}
                    style={{ paddingRight: '40px', width: '100%' }}
                  />
                  <ChevronDown 
                    size={18} 
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} 
                  />
                  {showDrillDropdown && (
                    <div className="glass drill-dropdown" style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 100, maxHeight: '250px', overflowY: 'auto', borderRadius: '16px', backdropFilter: 'blur(20px)' }}>
                      {initialTrainingsLibraryData
                        .filter(d => d.title.toLowerCase().includes(drillSearchTerm.toLowerCase()))
                        .map(drill => (
                          <div 
                            key={drill.id} 
                            className="drill-option" 
                            onClick={() => selectDrillFromLibrary(drill)}
                            style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{drill.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{drill.category.toUpperCase()} • {drill.duration} min</div>
                          </div>
                        ))
                      }
                      {initialTrainingsLibraryData.filter(d => d.title.toLowerCase().includes(drillSearchTerm.toLowerCase())).length === 0 && (
                        <div style={{ padding: '12px 15px', fontSize: '13px', color: 'var(--text-muted)' }}>No drills found. Press enter to use as new title.</div>
                      )}
                    </div>
                  )}
                </div>
                <input type="number" className="glass-input" placeholder="Min" value={currentActivity.duration} onChange={(e) => setCurrentActivity({ ...currentActivity, duration: e.target.value })} style={{ width: '100%' }} />
                {showDrillDropdown && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} onClick={() => setShowDrillDropdown(false)} />}
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <button type="button" className="glass" onClick={() => setIsActivityPlayersModalOpen(true)} style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Users size={18} style={{ color: primaryColor }} /> Select Athletes ({currentActivity.selectedAthletes.length})
                </button>
                <button type="button" className="glass" onClick={() => setIsActivityPrinciplesModalOpen(true)} style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <ClipboardCheck size={18} style={{ color: primaryColor }} /> Select Principles ({currentActivity.selectedPrinciples.length})
                </button>
              </div>
              <button type="button" onClick={handleAddActivity} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
                + Add Activity to Session Plan
              </button>
            </div>

            {formData.activities.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>Session Plan Summary:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {formData.activities.map((act, i) => (
                    <div key={i} className="glass" style={{ padding: '15px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                      <div>
                        <strong style={{ color: primaryColor }}>{act.drillTitle}</strong> 
                        <span style={{ marginLeft: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>{act.duration} min • {act.selectedAthletes.length} athletes</span>
                      </div>
                      <button type="button" onClick={() => setFormData({ ...formData, activities: formData.activities.filter((_, idx) => idx !== i) })} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer', padding: '5px' }}><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions" style={{ display: 'flex', gap: '15px', paddingTop: '10px' }}>
              <button type="submit" className="submit-btn" style={{ flex: 2, padding: '18px', borderRadius: '16px', background: primaryColor, color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                {modalMode === 'add' ? 'Confirm Session Registration' : 'Update Session Data'}
              </button>
              <button type="button" className="glass" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '18px', borderRadius: '16px', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Assessment Modal */}
    {isAssessmentModalOpen && assessingSession && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 9000, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '50px 20px', overflowY: 'auto' }}>
        <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '900px', padding: '40px', borderRadius: '30px', marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Session Performance Assessment</h2>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{assessingSession.category} - {new Date(assessingSession.date + 'T00:00:00').toLocaleDateString()} with {assessingSession.coach}</p>
                {(() => {
                  const sessionAss = tempAssessments[assessingSession.id] || assessments[assessingSession.id] || {};
                  const scores = Object.values(sessionAss).map(a => Number(a.score)).filter(score => !isNaN(score) && score !== null && score !== 0);
                  const avg = scores.length > 0 ? (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1) : '-';
                  return (
                    <div className="glass" style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(var(--primary-rgb), 0.1)', border: `1px solid ${primaryColor}44`, color: primaryColor, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                      <Star size={14} fill={primaryColor} /> Group Avg: {avg}
                    </div>
                  );
                })()}
              </div>
            </div>
            <button className="glass" onClick={() => { setIsAssessmentModalOpen(false); setAssessingSession(null); }} style={{ padding: '12px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
          </div>

          <div className="assessments-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(() => {
              const uniqueAthletes = [...new Set(assessingSession.activities.flatMap(a => a.selectedAthletes))];
              return uniqueAthletes.map(athleteName => {
                const athlete = allPlayersList.find(p => p.name === athleteName);
                const athleteId = athlete?.id;
                if (!athleteId) return null;

                const currentAss = tempAssessments[assessingSession.id]?.[athleteId] || assessments[assessingSession.id]?.[athleteId] || { score: '', note: '' };
                
                return (
                  <div key={athleteName} className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'grid', gridTemplateColumns: '80px 1fr 150px 1.5fr', gap: '25px', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="player-avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', background: `${primaryColor}15`, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
                      {athlete?.image ? <img src={athlete.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} /> : athleteName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px' }}>{athleteName}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Athlete</p>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Score (0-10)</label>
                      <select 
                        className="glass-select" 
                        style={{ height: '45px', width: '100%' }}
                        value={currentAss.score}
                        onChange={(e) => {
                          const newTemp = { ...tempAssessments };
                          if (!newTemp[assessingSession.id]) newTemp[assessingSession.id] = { ...(assessments[assessingSession.id] || {}) };
                          newTemp[assessingSession.id][athleteId] = { ...currentAss, score: e.target.value };
                          setTempAssessments(newTemp);
                        }}
                      >
                        <option value="">-</option>
                        {[...Array(11).keys()].map(n => <option key={n} value={n} style={{ background: '#111' }}>{n}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>Observations (Max 800 chars)</label>
                      <textarea 
                        className="glass-input" 
                        placeholder="Technical and tactical notes..."
                        maxLength={800}
                        style={{ height: '70px', minHeight: '70px', fontSize: '13px', paddingTop: '10px' }}
                        value={currentAss.note}
                        onChange={(e) => {
                          const newTemp = { ...tempAssessments };
                          if (!newTemp[assessingSession.id]) newTemp[assessingSession.id] = { ...(assessments[assessingSession.id] || {}) };
                          newTemp[assessingSession.id][athleteId] = { ...currentAss, note: e.target.value };
                          setTempAssessments(newTemp);
                        }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          <div style={{ marginTop: '35px', textAlign: 'right' }}>
            <button className="submit-btn" onClick={() => setIsAssessmentModalOpen(false)} style={{ background: primaryColor, color: '#000', padding: '15px 40px', borderRadius: '15px', fontWeight: 700, fontSize: '16px' }}>
              Save Assessments
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Select Athletes Modal */}
    {isActivityPlayersModalOpen && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 6500, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '1000px', maxHeight: '85vh', padding: '35px', display: 'flex', flexDirection: 'column', borderRadius: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Select Participating Athletes</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="search-box glass" style={{ width: '250px', padding: '8px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={16} />
                <input type="text" placeholder="Filter athletes..." className="glass-input-small" value={athleteFilterName} onChange={(e) => setAthleteFilterName(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
              </div>
              <div className="glass" style={{ padding: '4px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                <select className="glass-select" value={athleteFilterCategory} onChange={(e) => setAthleteFilterCategory(e.target.value)} style={{ padding: '8px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <option value="All">All Categories</option>
                  {Object.keys(mockPlayersByCategory).map(cat => <option key={cat} value={cat} style={{ background: '#111' }}>{cat}</option>)}
                </select>
              </div>
              <button 
                type="button" 
                onClick={() => setIsActivityPlayersModalOpen(false)} 
                style={{ width: '40px', height: '40px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.1)', color: '#ff4b4b' }}
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="selection-grid" style={{ overflowY: 'auto', flex: 1, paddingRight: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {filteredActivityPlayers.length > 0 ? filteredActivityPlayers.map(p => {
              const isSelected = currentActivity.selectedAthletes.includes(p.name);
              return (
                <div key={p.id} onClick={() => toggleAthlete(p.name)} className={`glass selection-item ${isSelected ? 'selected' : ''}`} style={{ padding: '15px', borderRadius: '16px', cursor: 'pointer', border: `1px solid ${isSelected ? primaryColor : 'rgba(255,255,255,0.08)'}`, position: 'relative', background: isSelected ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isSelected ? primaryColor : 'rgba(var(--primary-rgb), 0.1)', color: isSelected ? '#000' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{p.name.charAt(0)}</div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: isSelected ? 700 : 500, color: 'var(--text-main)' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.category}</div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={16} style={{ position: 'absolute', top: '10px', right: '10px', color: primaryColor }} />}
                </div>
              );
            }) : <div style={{ gridColumn: '1/ -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No athletes found.</div>}
          </div>
          
          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <div style={{ color: primaryColor, fontWeight: 700 }}>{currentActivity.selectedAthletes.length} Athletes Selected</div>
            <button type="button" className="submit-btn" onClick={() => setIsActivityPlayersModalOpen(false)} style={{ padding: '12px 40px', background: primaryColor, color: '#000', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Confirm Attendance</button>
          </div>
        </div>
      </div>
    )}

    {/* Principles Selection Modal */}
    {isActivityPrinciplesModalOpen && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 6500, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '850px', maxHeight: '85vh', padding: '35px', overflowY: 'auto', borderRadius: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'sticky', top: 0, background: 'var(--bg-darker)', zIndex: 10 }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>Select Tactical Focus</h2>
            <button className="glass" onClick={() => setIsActivityPrinciplesModalOpen(false)} style={{ padding: '8px', cursor: 'pointer', border: 'none' }}><X size={20} /></button>
          </div>
          
          {TACTICAL_PRINCIPLES.map(cat => (
            <div key={cat.category} style={{ marginBottom: '35px' }}>
              <h3 style={{ fontSize: '17px', color: primaryColor, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '20px', fontWeight: 700 }}>{cat.category}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {cat.principles.map(p => {
                  const isSelected = (currentActivity.selectedPrinciples || []).includes(p.name);
                  return (
                    <button key={p.name} type="button" onClick={() => toggleActivityPrinciple(p.name)} style={{ padding: '10px 15px', borderRadius: '12px', background: isSelected ? primaryColor : 'rgba(var(--primary-rgb), 0.1)', color: isSelected ? '#000' : 'var(--text-main)', border: `1px solid ${isSelected ? primaryColor : 'var(--card-border)'}`, cursor: 'pointer', fontSize: '13px', textAlign: 'left', transition: 'all 0.2s', fontWeight: isSelected ? 700 : 400 }}>{p.name}</button>
                  );
                })}
              </div>
            </div>
          ))}
          
          <button type="button" className="submit-btn" onClick={() => setIsActivityPrinciplesModalOpen(false)} style={{ width: '100%', marginTop: '10px', padding: '16px', background: primaryColor, color: '#000', borderRadius: '14px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Apply Selected Principles</button>
        </div>
      </div>
    )}
    </>
  );
};

export default TrainingSessions;
