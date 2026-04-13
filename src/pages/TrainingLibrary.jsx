import React, { useState } from 'react';
import { 
  PlayCircle, 
  Clock, 
  Users as UsersIcon, 
  ExternalLink,
  Calendar,
  Plus,
  X,
  Image as ImageIcon,
  MessageSquare,
  Send,
  Edit,
  Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { initialPrinciplesData } from '../data/principlesData';
import { initialTrainingsLibraryData } from '../data/trainingsData';
import './TrainingLibrary.css';

const coachesData = [
  { id: 1, name: 'Alessandro Rama' },
  { id: 2, name: 'Deleaval Cyril' },
  { id: 3, name: 'Ilir Selmani' },
  { id: 4, name: 'Ludovic' },
  { id: 5, name: 'Mazamay Yann' },
  { id: 6, name: 'Selmani Arianit' },
];

const initialSessionsData = initialTrainingsLibraryData;

const TrainingLibrary = () => {
  const { primaryColor } = useTheme();
  const [sessions, setSessions] = useState(initialSessionsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  const [editingTraining, setEditingTraining] = useState(null);
  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    coach: coachesData[0].name,
    category: 'U18',
    videoUrl: '',
    image: null
  });

  // Filter States
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCoach, setFilterCoach] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Principles Selection Modal within TrainingLibrary
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState(false);
  const [availablePrinciples] = useState(initialPrinciplesData);

  const handleDeleteTraining = (id) => {
    if (window.confirm('Are you sure you want to delete this drill from the library?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setNewTraining({
      title: '',
      description: '',
      coach: coachesData[0].name,
      category: 'U18',
      videoUrl: '',
      image: null,
      principles: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session) => {
    setModalMode('edit');
    setEditingTraining(session);
    setNewTraining({
      title: session.title,
      description: session.description,
      coach: session.coach,
      category: session.category,
      videoUrl: session.videoUrl || '',
      image: session.image,
      principles: session.principles || []
    });
    setIsModalOpen(true);
  };

  const togglePrinciple = (principleName) => {
    const current = newTraining.principles || [];
    if (current.includes(principleName)) {
      setNewTraining({ ...newTraining, principles: current.filter(p => p !== principleName) });
    } else {
      setNewTraining({ ...newTraining, principles: [...current, principleName] });
    }
  };

  const handleSaveTraining = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const trainingToAdd = {
        ...newTraining,
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        comments: []
      };
      setSessions([trainingToAdd, ...sessions]);
    } else {
      const updatedSessions = sessions.map(s => {
        if (s.id === editingTraining.id) {
          return { ...s, ...newTraining };
        }
        return s;
      });
      setSessions(updatedSessions);
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTraining({ ...newTraining, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'Current User',
      text: commentText,
      time: 'Just now'
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === selectedTraining.id) {
        return { ...s, comments: [...s.comments, newComment] };
      }
      return s;
    });

    setSessions(updatedSessions);
    setSelectedTraining({ ...selectedTraining, comments: [...selectedTraining.comments, newComment] });
    setCommentText('');
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  };

  const filteredSessions = sessions.filter(session => {
    const matchCategory = filterCategory === 'All' || session.category.toUpperCase() === filterCategory.toUpperCase();
    const matchCoach = filterCoach === 'All' || session.coach === filterCoach;
    
    let matchDate = true;
    if (filterStartDate || filterEndDate) {
      const sessionDate = parseDate(session.date);
      if (filterStartDate) {
        const start = new Date(filterStartDate);
        if (sessionDate < start) matchDate = false;
      }
      if (filterEndDate) {
        const end = new Date(filterEndDate);
        if (sessionDate > end) matchDate = false;
      }
    }

    return matchCategory && matchCoach && matchDate;
  });

  return (
    <>
    <div className="trainings-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="welcome-text">Training Library</h1>
          <p className="subtitle">Catalogue of drills and tactical exercises</p>
        </div>
        <div className="header-actions">
          <div className="filters-container glass header-filters">
            <div className="filter-item">
              <span className="filter-label">CATEGORY</span>
              <select 
                className="glass-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="U12">U12</option>
                <option value="U14">U14</option>
                <option value="U16">U16</option>
                <option value="U18">U18</option>
                <option value="U20">U20</option>
                <option value="SENIOR">SENIOR</option>
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">COACH</span>
              <select 
                className="glass-select"
                value={filterCoach}
                onChange={(e) => setFilterCoach(e.target.value)}
              >
                <option value="All">All Coaches</option>
                {coachesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">PERIOD</span>
              <div className="date-range-filters">
                <div className="date-picker-mini glass">
                  <input 
                    type="date" 
                    className="glass-input-small"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                  {filterStartDate && <X size={12} className="clear-date" onClick={() => setFilterStartDate('')} />}
                </div>
                <span className="date-separator">-</span>
                <div className="date-picker-mini glass">
                  <input 
                    type="date" 
                    className="glass-input-small"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                  {filterEndDate && <X size={12} className="clear-date" onClick={() => setFilterEndDate('')} />}
                </div>
              </div>
            </div>
          </div>

          <button 
            className="add-training-btn" 
            style={{ backgroundColor: primaryColor }}
            onClick={handleOpenAddModal}
          >
            <Plus size={18} />
            <span>Add Training</span>
          </button>
        </div>
      </header>

      <div className="sessions-timeline">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
          <div key={session.id} className="timeline-group">
            <div className="date-header">
              <Calendar size={14} className="text-muted" />
              <span>{session.date}</span>
            </div>
            
            <div className="session-item glass">
              <div className="session-main">
                <div className="session-icon" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                  {session.image ? (
                    <img src={session.image} alt={session.title} className="session-card-img" />
                  ) : (
                    <PlayCircle size={28} />
                  )}
                </div>
                <div className="session-content">
                  <div className="session-top">
                    <h3>{session.title}</h3>
                    <span className="coach-tag">
                      <div className="avatar-xs" style={{ backgroundColor: primaryColor }}>{session.coach.charAt(0)}</div>
                      {session.coach}
                    </span>
                  </div>
                  
                  <div className="session-meta">
                    <div className="meta-item">
                      <UsersIcon size={16} />
                      <span className="category-pill">{session.category}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="session-actions">
                <button 
                  className="edit-session-btn glass"
                  onClick={() => handleOpenEditModal(session)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="delete-session-btn glass"
                  onClick={() => handleDeleteTraining(session.id)}
                  style={{ color: '#ff453a' }}
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  className="view-training-btn glass"
                  onClick={() => setSelectedTraining(session)}
                >
                  View training
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-results glass animate-fade-in">
          <p>No training sessions found with the selected filters.</p>
        </div>
      )}
      </div>
    </div>

    {/* Add/Edit Modal */}
    {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px', overflowY: 'auto' }}>
          <div className="modal-content glass animate-scale-in">
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'New Training Session' : 'Edit Training Session'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTraining} className="training-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Training Photo</label>
                  <div className="file-upload-container glass" style={{ marginBottom: '15px' }}>
                    <input 
                      type="file" 
                      id="training-photo" 
                      accept="image/png, image/jpeg" 
                      onChange={handleImageChange}
                      className="hidden-input"
                    />
                    <label htmlFor="training-photo" className="file-label">
                      {newTraining.image ? (
                        <div className="image-preview">
                          <img src={newTraining.image} alt="Preview" />
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

                <div className="form-group full-width">
                  <label>Training Title</label>
                  <input 
                    type="text" 
                    className="glass-input"
                    placeholder="e.g., Tactical Defensive Drill" 
                    required 
                    value={newTraining.title}
                    onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    className="glass-input"
                    placeholder="Describe the main focus and objectives..." 
                    rows="3"
                    value={newTraining.description}
                    onChange={(e) => setNewTraining({...newTraining, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Coach</label>
                  <select 
                    className="glass-select"
                    value={newTraining.coach}
                    onChange={(e) => setNewTraining({...newTraining, coach: e.target.value})}
                  >
                    {coachesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="glass-select"
                    value={newTraining.category}
                    onChange={(e) => setNewTraining({...newTraining, category: e.target.value})}
                  >
                    <option value="U12">U12</option>
                    <option value="U14">U14</option>
                    <option value="U16">U16</option>
                    <option value="U18">U18</option>
                    <option value="U20">U20</option>
                    <option value="SENIOR">SENIOR</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Video URL (Optional)</label>
                  <input 
                    type="url" 
                    className="glass-input"
                    placeholder="e.g., https://youtube.com/..." 
                    value={newTraining.videoUrl || ''}
                    onChange={(e) => setNewTraining({...newTraining, videoUrl: e.target.value})}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Linked Principles</label>
                  <div className="selected-principles-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    {newTraining.principles && newTraining.principles.map(p => (
                      <span key={p} className="category-pill" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {p}
                        <button type="button" onClick={() => togglePrinciple(p)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button type="button" className="view-training-btn" onClick={() => setIsPrinciplesModalOpen(true)} style={{ width: 'fit-content' }}>
                    <Plus size={16} /> Add Principles
                  </button>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" style={{ backgroundColor: primaryColor }}>
                  {modalMode === 'add' ? 'Confirm Training' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Principles Selection Sub-Modal */}
          {isPrinciplesModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 6000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px', overflowY: 'auto' }}>
              <div className="modal-content glass animate-scale-in" style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                  <h2>Select Training Principles</h2>
                  <button type="button" className="close-btn" onClick={() => setIsPrinciplesModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div style={{ overflowY: 'auto', paddingRight: '10px', flex: 1 }}>
                  {availablePrinciples.map(cat => (
                    <div key={cat.type} style={{ marginBottom: '20px' }}>
                      <h3 style={{ color: primaryColor, marginBottom: '10px', fontSize: '16px' }}>{cat.category}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {cat.items.flatMap(sub => sub.principles).map(p => {
                          const isSelected = newTraining.principles?.includes(p.name);
                          return (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => togglePrinciple(p.name)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                background: isSelected ? primaryColor : 'rgba(var(--primary-rgb), 0.1)',
                                color: isSelected ? '#000' : 'var(--text-main)',
                                border: `1px solid ${isSelected ? primaryColor : 'var(--card-border)'}`,
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                transition: 'all 0.2s'
                              }}
                            >
                              {p.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-actions" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button type="button" className="submit-btn" style={{ backgroundColor: primaryColor }} onClick={() => setIsPrinciplesModalOpen(false)}>
                    Done Selecting
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    {/* View Training Details Modal */}
    {selectedTraining && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 20px', overflowY: 'auto' }}>
          <div className="modal-content glass animate-scale-in detail-modal">
            <div className="modal-header">
              <h2>Training Details</h2>
              <button className="close-btn" onClick={() => setSelectedTraining(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="training-details">
              {selectedTraining.image && (
                <div className="detail-image-container">
                  <img src={selectedTraining.image} alt={selectedTraining.title} />
                </div>
              )}
              
              <div className="detail-info">
                <div className="detail-header-row">
                  <h1>{selectedTraining.title}</h1>
                  <span className="category-pill large">{selectedTraining.category}</span>
                </div>
                
                <div className="detail-meta-row">
                  <div className="coach-tag large">
                    <div className="avatar-sm" style={{ backgroundColor: primaryColor }}>{selectedTraining.coach.charAt(0)}</div>
                    <span>Coach: {selectedTraining.coach}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={18} />
                    <span>{selectedTraining.date}</span>
                  </div>
                </div>

                <p className="detail-description">{selectedTraining.description}</p>
                {selectedTraining.videoUrl && (
                  <a href={selectedTraining.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 15px', backgroundColor: primaryColor, color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', marginTop: '15px', marginBottom: '15px' }}>
                    <PlayCircle size={18} />
                    Watch Video
                  </a>
                )}
              </div>

              <div className="comments-section">
                <h3>
                  <MessageSquare size={20} />
                  Evaluations & Comments
                </h3>
                
                <div className="comments-list">
                  {selectedTraining.comments.length > 0 ? (
                    selectedTraining.comments.map(comment => (
                      <div key={comment.id} className="comment-item glass">
                        <div className="comment-header">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No evaluations yet. Be the first to comment!</p>
                  )}
                </div>

                <form className="comment-form" onSubmit={handleAddComment}>
                  <input 
                    type="text" 
                    placeholder="Add an evaluation..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" style={{ color: primaryColor }}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainingLibrary;


