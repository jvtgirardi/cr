import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Phone, 
  ClipboardList,
  Plus,
  X,
  Edit2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Coaches.css';

const today = new Date();
const date5DaysAgo = new Date(today); date5DaysAgo.setDate(today.getDate() - 5);
const date20DaysAgo = new Date(today); date20DaysAgo.setDate(today.getDate() - 20);

const coachesData = [
  { id: 1, name: 'Alessandro Rama', team: 'U20 QR Coach', category: 'u20', sessions: 5, initial: 'AR', status: 'Active', createdAt: date20DaysAgo.toISOString() },
  { id: 2, name: 'Deleaval Cyril', team: 'QR Coach FC', category: 'u14', sessions: 15, initial: 'DC', status: 'Active', createdAt: date5DaysAgo.toISOString() },
  { id: 3, name: 'Ilir Selmani', team: 'AI Interstar', category: 'u20', sessions: 86, initial: 'IS', status: 'Active', createdAt: date20DaysAgo.toISOString() },
  { id: 4, name: 'Ludovic', team: 'Verso Nave', category: 'adults', sessions: 12, initial: 'L', status: 'Active', createdAt: date20DaysAgo.toISOString() },
  { id: 5, name: 'Mazamay Yann', team: 'FC Meyrin', category: 'u18', sessions: 0, initial: 'MY', status: 'Active', createdAt: date20DaysAgo.toISOString() },
  { id: 6, name: 'Selmani Arianit', team: 'AI Interstar', category: 'u12', sessions: 22, initial: 'SA', status: 'Inactive', createdAt: date20DaysAgo.toISOString() },
];

const Coaches = () => {
  const { primaryColor } = useTheme();
  const [coaches, setCoaches] = useState(() => {
    const saved = localStorage.getItem('coaches_data');
    return saved ? JSON.parse(saved) : coachesData;
  });

  useEffect(() => {
    localStorage.setItem('coaches_data', JSON.stringify(coaches));
  }, [coaches]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingCoach, setEditingCoach] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [activityFilters, setActivityFilters] = useState({
    mostActive: false,
    newCoaches: false,
    inactive: false
  });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      handleOpenAddModal();
    }
  }, [location]);

  const [formData, setFormData] = useState({
    name: '',
    team: '',
    category: 'u18',
    status: 'Active',
    image: null
  });

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', team: '', category: 'u18', status: 'Active', image: null });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coach) => {
    setModalMode('edit');
    setEditingCoach(coach);
    setFormData({ name: coach.name, team: coach.team, category: coach.category, status: coach.status || 'Active', image: coach.image || null });
    setIsModalOpen(true);
  };

  const handleDeleteCoach = (id) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      setCoaches(coaches.filter(c => c.id !== id));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCoach = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newCoach = {
        ...formData,
        id: Date.now(),
        sessions: 0,
        createdAt: new Date().toISOString(),
        initial: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      };
      setCoaches([...coaches, newCoach]);
    } else {
      setCoaches(coaches.map(c => c.id === editingCoach.id ? { ...c, ...formData, initial: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() } : c));
    }
    setIsModalOpen(false);
  };

  let filteredCoaches = coaches.filter(coach => {
    if (activeTab === 'active' && coach.status === 'Inactive') return false;
    if (activeTab === 'inactive' && coach.status !== 'Inactive') return false;

    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          coach.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || coach.category.toLowerCase() === selectedCategory.toLowerCase();
    
    if (!matchesSearch || !matchesCategory) return false;

    if (activityFilters.inactive && coach.sessions > 0) return false;
    if (activityFilters.newCoaches) {
      const isNew = coach.createdAt && (new Date() - new Date(coach.createdAt)) / (1000 * 60 * 60 * 24) <= 15;
      if (!isNew) return false;
    }

    return true;
  });

  if (activityFilters.mostActive) {
    filteredCoaches.sort((a, b) => b.sessions - a.sessions);
  }

  return (
    <div className="coaches-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="welcome-text">Coaches</h1>
          <p className="subtitle">Manage and track your coaching staff</p>
        </div>
        <div className="header-right">
            <div className="search-bar glass">
            <Search size={20} className="text-muted" />
            <input 
                type="text" 
                placeholder="Search coaches..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <button className="add-coach-btn" style={{ backgroundColor: primaryColor }} onClick={handleOpenAddModal}>
                <Plus size={18} />
                <span>Add Coach</span>
            </button>
        </div>
      </header>

      <div className="tabs-container" style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'active' ? `2px solid ${primaryColor}` : '2px solid transparent', color: activeTab === 'active' ? primaryColor : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => setActiveTab('active')}
        >
          Active Coaches
        </button>
        <button 
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'inactive' ? `2px solid #ff453a` : '2px solid transparent', color: activeTab === 'inactive' ? '#ff453a' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive (Dismissed)
        </button>
      </div>

      <div className="coaches-grid">
        <aside className="filters-sidebar glass">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Category</label>
            <select 
                className="glass"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="u12">U12</option>
              <option value="u14">U14</option>
              <option value="u18">U18</option>
              <option value="u20">U20</option>
              <option value="adults">Senior</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Activity</label>
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={activityFilters.mostActive}
                  onChange={(e) => setActivityFilters({...activityFilters, mostActive: e.target.checked})}
                /> 
                Most Active
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={activityFilters.newCoaches}
                  onChange={(e) => setActivityFilters({...activityFilters, newCoaches: e.target.checked})}
                /> 
                New Coaches
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={activityFilters.inactive}
                  onChange={(e) => setActivityFilters({...activityFilters, inactive: e.target.checked})}
                /> 
                Inactive
              </label>
            </div>
          </div>
        </aside>

        <main className="coaches-list">
          {filteredCoaches.map(coach => (
            <div key={coach.id} className="coach-card glass">
              <div className="coach-avatar" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
                {coach.image ? (
                  <img src={coach.image} alt={coach.name} className="coach-img" />
                ) : (
                  coach.initial
                )}
              </div>
              <div className="coach-main-info">
                <h4>{coach.name}</h4>
                <p>{coach.team} • {coach.category}</p>
              </div>
              <div className="coach-stats">
                <div className="mini-stat">
                  <span className="value">{coach.sessions}</span>
                  <span className="label">Sessions</span>
                </div>
              </div>
              <div className="coach-actions">
                  <button className="edit-btn glass" onClick={() => handleOpenEditModal(coach)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="delete-btn glass" onClick={() => handleDeleteCoach(coach.id)}>
                    <Trash2 size={16} />
                  </button>
                  <button className="view-details-btn">
                    <ChevronRight size={20} />
                  </button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 20px', overflowY: 'auto', background: 'rgba(0,0,0,0.9)' }}>
          <div className="modal-content glass animate-scale-in">
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add New Coach' : 'Edit Coach'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCoach} className="coach-form">
              <div className="form-group full-width">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Team</label>
                <input 
                  type="text" 
                  required 
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="u12">U12</option>
                  <option value="u14">U14</option>
                  <option value="u18">U18</option>
                  <option value="u20">U20</option>
                  <option value="adults">Senior</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group full-width">
                  <label>Coach Photo</label>
                  <div className="file-upload-container glass">
                    <input 
                      type="file" 
                      id="coach-photo" 
                      accept="image/png, image/jpeg" 
                      onChange={handleImageChange}
                      className="hidden-input"
                    />
                    <label htmlFor="coach-photo" className="file-label">
                      {formData.image ? (
                        <div className="image-preview">
                          <img src={formData.image} alt="Preview" />
                          <span>Change image</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <ImageIcon size={24} />
                          <span>Click to upload PNG or JPG</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              <div className="form-actions full-width">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn" style={{ backgroundColor: primaryColor }}>
                  {modalMode === 'add' ? 'Create Coach' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coaches;
