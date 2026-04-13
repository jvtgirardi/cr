import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Plus,
  X,
  User,
  Ruler,
  Weight as WeightIcon,
  Layout,
  Edit,
  Trash2,
  Star,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Players.css';

import { initialPlayersData } from '../data/playersData';

const categories = ['All', 'U12', 'U14', 'U16', 'U18', 'U20', 'Senior'];

const Players = () => {
  const { primaryColor } = useTheme();
  const [players, setPlayers] = useState(initialPlayersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isAssessModalOpen, setIsAssessModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  
  const [individualAssessments, setIndividualAssessments] = useState(() => {
    const saved = localStorage.getItem('player_assessments');
    return saved ? JSON.parse(saved) : {};
  });

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleToggleSort = (criterion) => {
    if (sortBy === criterion) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criterion);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    localStorage.setItem('player_assessments', JSON.stringify(individualAssessments));
  }, [individualAssessments]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      handleOpenAddModal();
    }
  }, [location]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'U18',
    height: '',
    weight: '',
    position: '',
    status: 'Active',
    image: null
  });

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: 'U18',
      height: '',
      weight: '',
      position: '',
      status: 'Active',
      image: null
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (player) => {
    setModalMode('edit');
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      category: player.category,
      height: player.height,
      weight: player.weight,
      position: player.position,
      status: player.status || 'Active',
      image: player.image || null
    });
    setIsModalOpen(true);
  };

  const handleDeletePlayer = (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      setPlayers(players.filter(p => p.id !== id));
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

  const handleSavePlayer = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newPlayer = {
        ...formData,
        id: Date.now(),
        initial: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      };
      setPlayers([...players, newPlayer]);
    } else {
      setPlayers(players.map(p => p.id === editingPlayer.id ? { ...p, ...formData, initial: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() } : p));
    }
    setIsModalOpen(false);
  };

  const positionOrder = ['Goalkeeper', 'Defender', 'Winger', 'Midfielder', 'Forward'];

  const filteredPlayers = players.filter(player => {
    if (activeTab === 'active' && player.status === 'Inactive') return false;
    if (activeTab === 'inactive' && player.status !== 'Inactive') return false;

    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          player.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || player.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      const orderA = positionOrder.indexOf(a.position);
      const orderB = positionOrder.indexOf(b.position);
      if (orderA !== orderB) {
        return sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
      }
      return a.name.localeCompare(b.name);
    }
  });

  const groupedPlayers = categories.slice(1).reduce((acc, cat) => {
    const catPlayers = filteredPlayers.filter(p => p.category.toUpperCase() === cat.toUpperCase());
    if (catPlayers.length > 0) acc[cat] = catPlayers;
    return acc;
  }, {});

  return (
    <>
    <div className="players-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="welcome-text">Players</h1>
          <p className="subtitle">Manage the Nextrainers FC squad</p>
        </div>
        <div className="header-right">
            <div className="search-bar glass">
            <Search size={20} className="text-muted" />
            <input 
                type="text" 
                placeholder="Search players..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <button className="add-player-btn" style={{ backgroundColor: primaryColor }} onClick={handleOpenAddModal}>
                <Plus size={18} />
                <span>Add Player</span>
            </button>
        </div>
      </header>

      <div className="players-layout">
        <aside className="filters-sidebar glass">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`cat-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={selectedCategory === cat ? { color: primaryColor, backgroundColor: `${primaryColor}15` } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="order-by-section" style={{ marginTop: '35px' }}>
            <h3 style={{ marginBottom: '15px' }}>Ordenar por</h3>
            <div className="order-options glass" style={{ padding: '8px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className={`glass ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => handleToggleSort('name')}
                style={{ 
                    width: '100%', 
                    padding: '12px 18px', 
                    fontSize: '14px', 
                    borderRadius: '12px', 
                    border: sortBy === 'name' ? `1px solid ${primaryColor}` : '1px solid transparent', 
                    color: sortBy === 'name' ? primaryColor : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
              >
                Nome
                {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </button>
              <button 
                className={`glass ${sortBy === 'position' ? 'active' : ''}`}
                onClick={() => handleToggleSort('position')}
                style={{ 
                    width: '100%', 
                    padding: '12px 18px', 
                    fontSize: '14px', 
                    borderRadius: '12px', 
                    border: sortBy === 'position' ? `1px solid ${primaryColor}` : '1px solid transparent', 
                    color: sortBy === 'position' ? primaryColor : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
              >
                Posição
                {sortBy === 'position' && (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </button>
            </div>
          </div>
        </aside>

        <main className="players-content">
          <div className="status-tabs" style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid var(--card-border)' }}>
            <button 
              className={`status-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
              style={{
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: activeTab === 'active' ? primaryColor : 'var(--text-muted)',
                borderBottom: activeTab === 'active' ? `2px solid ${primaryColor}` : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Active Athletes
            </button>
            <button 
              className={`status-tab-btn ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
              style={{
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: activeTab === 'inactive' ? '#ff453a' : 'var(--text-muted)',
                borderBottom: activeTab === 'inactive' ? `2px solid #ff453a` : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Inactive / Transferred
            </button>
          </div>
          {Object.keys(groupedPlayers).length > 0 ? (
            Object.entries(groupedPlayers).map(([category, list]) => (
              <section key={category} className="players-section">
                <h2 className="section-title">{category} Grade</h2>
                <div className="players-grid">
                  {list.map(player => (
                    <div key={player.id} className="player-card glass">
                      <div className="player-card-header">
                        <div className="player-avatar" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
                          {player.image ? (
                            <img src={player.image} alt={player.name} className="player-img" />
                          ) : (
                            player.initial
                          )}
                        </div>
                        <div className="player-actions">
                            <button className="edit-player-btn glass" onClick={() => handleOpenEditModal(player)} title="Edit">
                                <Edit size={14} />
                            </button>
                            <button className="assess-player-btn glass" onClick={() => { setEditingPlayer(player); setIsAssessModalOpen(true); }} style={{ color: primaryColor }} title="Assess">
                                <Star size={14} />
                            </button>
                            <button className="delete-player-btn glass" onClick={(e) => { e.stopPropagation(); handleDeletePlayer(player.id); }} style={{ color: '#ff453a' }} title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </div>
                      </div>
                      <div className="player-info">
                        <h4>{player.name}</h4>
                        <span className="position-tag">{player.position}</span>
                      </div>
                      <div className="player-stats">
                        <div className="stat-item">
                          <Ruler size={14} className="text-muted" />
                          <span>{player.height}</span>
                        </div>
                        <div className="stat-item">
                          <WeightIcon size={14} className="text-muted" />
                          <span>{player.weight}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="no-results glass">
              <p>No players found.</p>
            </div>
          )}
        </main>
      </div>
    </div>

    {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 20px', overflowY: 'auto', background: 'rgba(0,0,0,0.9)' }}>
          <div className="modal-content glass animate-scale-in">
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add New Player' : 'Edit Player'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePlayer} className="player-form">
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
                <label>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <input 
                  type="text" 
                  placeholder="e.g., Forward" 
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Height (m)</label>
                <input 
                  type="text" 
                  placeholder="1.80m" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input 
                  type="text" 
                  placeholder="75kg" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="glass-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group full-width">
                  <label>Player Photo</label>
                  <div className="file-upload-container glass">
                    <input 
                      type="file" 
                      id="player-photo" 
                      accept="image/png, image/jpeg" 
                      onChange={handleImageChange}
                      className="hidden-input"
                    />
                    <label htmlFor="player-photo" className="file-label">
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
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn" style={{ backgroundColor: primaryColor }}>
                  {modalMode === 'add' ? 'Create Player' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssessModalOpen && editingPlayer && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px', overflowY: 'auto' }}>
          <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${primaryColor}22`, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800 }}>
                    {editingPlayer.image ? <img src={editingPlayer.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : editingPlayer.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', margin: 0 }}>Athlete Assessment</h2>
                  <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>{editingPlayer.name} • {editingPlayer.category}</p>
                </div>
              </div>
              <button className="glass" onClick={() => setIsAssessModalOpen(false)} style={{ padding: '12px', borderRadius: '15px', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div className="form-group">
                  <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Performance Score (0-10)</label>
                  <select 
                    className="glass-select" 
                    style={{ width: '100%', height: '50px' }}
                    value={individualAssessments[editingPlayer.id]?.score || ''}
                    onChange={(e) => setIndividualAssessments({...individualAssessments, [editingPlayer.id]: { ...individualAssessments[editingPlayer.id], score: e.target.value }})}
                  >
                    <option value="">Select score...</option>
                    {[...Array(11).keys()].map(n => <option key={n} value={n} style={{ background: '#111' }}>{n}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Complete Technical Profile (Max 3000 chars)</label>
                  <textarea 
                    className="glass-input" 
                    maxLength={3000}
                    placeholder="Describe technical strengths, weaknesses and tactical development..."
                    style={{ width: '100%', minHeight: '200px', resize: 'none', fontSize: '14px', paddingTop: '15px', borderRadius: '15px' }}
                    value={individualAssessments[editingPlayer.id]?.note || ''}
                    onChange={(e) => setIndividualAssessments({...individualAssessments, [editingPlayer.id]: { ...individualAssessments[editingPlayer.id], note: e.target.value }})}
                  />
                  <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
                    {(individualAssessments[editingPlayer.id]?.note?.length || 0)} / 3000
                  </div>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <button className="submit-btn" onClick={() => setIsAssessModalOpen(false)} style={{ width: '100%', background: primaryColor, color: '#000', padding: '18px', borderRadius: '18px', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer' }}>
                Save Technical Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Players;
