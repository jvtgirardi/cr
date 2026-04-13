import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Target, 
  Users, 
  Trash2,
  MessageSquare,
  X,
  User,
  Filter,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  ChevronRight,
  Edit2,
  Send
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Suggestions.css';

// Mock/Initial data
const coachesData = [
  { id: 1, name: 'Alessandro Rama' },
  { id: 2, name: 'Deleaval Cyril' },
  { id: 3, name: 'Ilir Selmani' },
  { id: 4, name: 'Ludovic' },
  { id: 5, name: 'Mazamay Yann' },
  { id: 6, name: 'Selmani Arianit' },
];

const categories = ['All', 'U12', 'U14', 'U16', 'U18', 'U20', 'SENIOR'];

const initialSuggestions = [
  {
    id: 1,
    title: 'Pressão e Transições Defensivas',
    description: 'Foco técnico do mês de Março para as categorias de base.',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    category: 'U18',
    coach: 'Alessandro Rama',
    note: 'Garantir que os atletas entendam o momento da perda e a compactação defensiva imediata.',
    type: 'Sugestão',
    appliedCount: 8,
    comments: [
      { id: 101, author: 'Deleaval Cyril', text: 'Excelente tema, as categorias U14 já começaram a aplicar.', time: 'Ontem às 14:30' }
    ]
  }
];

const Suggestions = () => {
  const { primaryColor } = useTheme();
  
  // States
  const [suggestions, setSuggestions] = useState(() => {
    const saved = localStorage.getItem('club_suggestions');
    return saved ? JSON.parse(saved) : initialSuggestions;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  
  // Feedback states
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedSugForFeedback, setSelectedSugForFeedback] = useState(null);
  const [commentText, setCommentText] = useState('');
  
  // Filter States
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCoach, setFilterCoach] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    category: 'U18',
    coach: coachesData[0].name,
    note: '',
    type: 'Sugestão'
  });

  useEffect(() => {
    localStorage.setItem('club_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      category: 'U18',
      coach: coachesData[0].name,
      note: '',
      type: 'Sugestão'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sug) => {
    setModalMode('edit');
    setEditingId(sug.id);
    setFormData({
      title: sug.title,
      startDate: sug.startDate,
      endDate: sug.endDate,
      category: sug.category,
      coach: sug.coach,
      note: sug.note,
      type: sug.type || 'Sugestão'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newSug = {
        ...formData,
        id: Date.now(),
        appliedCount: 0,
        comments: []
      };
      setSuggestions([newSug, ...suggestions]);
    } else {
      setSuggestions(suggestions.map(s => s.id === editingId ? { ...s, ...formData } : s));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setSuggestions(suggestions.filter(s => s.id !== id));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedSugForFeedback) return;

    const newComment = {
      id: Date.now(),
      author: 'Alessandro Rama', // Mock current coach
      text: commentText,
      time: 'Agora mesmo'
    };

    const updatedSuggestions = suggestions.map(s => {
      if (s.id === selectedSugForFeedback.id) {
        return { ...s, comments: [...(s.comments || []), newComment] };
      }
      return s;
    });

    setSuggestions(updatedSuggestions);
    setSelectedSugForFeedback({
      ...selectedSugForFeedback,
      comments: [...(selectedSugForFeedback.comments || []), newComment]
    });
    setCommentText('');
  };

  // Filter Logic
  const filteredSuggestions = suggestions.filter(s => {
    const matchCat = filterCategory === 'All' || s.category === filterCategory;
    const matchCoach = filterCoach === 'All' || s.coach === filterCoach;
    
    let matchDate = true;
    if (filterStartDate && s.startDate < filterStartDate) matchDate = false;
    if (filterEndDate && s.endDate > filterEndDate) matchDate = false;
    
    return matchCat && matchCoach && matchDate;
  });

  // Split into active and history
  const today = new Date().toISOString().split('T')[0];
  const activeAlignments = filteredSuggestions.filter(s => s.endDate >= today);
  const historyAlignments = filteredSuggestions.filter(s => s.endDate < today);

  const formatDatePattern = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(m)-1]} ${d}, ${y}`;
  };

  return (
    <>
    <div className="suggestions-page animate-fade-in">
      <header className="page-header print-hidden">
        <div>
          <h1 className="welcome-text">Sugestões e Anotações</h1>
          <p className="subtitle">Alinhamento técnico e notas estratégicas para o clube</p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
          <div className="filters-container glass header-filters">
            <div className="filter-item">
              <span className="filter-label">CATEGORIA</span>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="glass-select">
                {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'Todas' : cat}</option>)}
              </select>
            </div>
            
            <div className="filter-item">
              <span className="filter-label">TREINADOR</span>
              <select value={filterCoach} onChange={(e) => setFilterCoach(e.target.value)} className="glass-select">
                <option value="All">Todos</option>
                {coachesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">PERÍODO</span>
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

          <button className="create-suggestion-btn neon-shadow" style={{ backgroundColor: primaryColor, height: 'fit-content', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer' }} onClick={handleOpenAddModal}>
            <Plus size={18} /> Nova Sugestão
          </button>
        </div>
      </header>

      <div className="suggestions-layout mt-xl" style={{ marginTop: '30px' }}>
        <section className="active-suggestions-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-title">Alinhamentos Ativos</h2>
            <span style={{ fontSize: '13px', color: primaryColor, fontWeight: 600 }}>{activeAlignments.length} Registros</span>
          </div>
          
          <div className="suggestions-list">
            {activeAlignments.map(sug => (
              <div key={sug.id} className="suggestion-card glass animate-fade-in">
                <div className="suggestion-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="period-badge" style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} style={{ color: primaryColor }} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{formatDatePattern(sug.startDate)} — {formatDatePattern(sug.endDate)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ padding: '4px 12px', borderRadius: '8px', background: sug.type === 'Anotação' ? 'rgba(255,215,0,0.1)' : 'rgba(var(--primary-rgb),0.1)', color: sug.type === 'Anotação' ? '#ffd700' : primaryColor, fontSize: '11px', fontWeight: 700 }}>{sug.type || 'Sugestão'}</div>
                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(sug.id); }} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="suggestion-body" onClick={() => handleOpenEditModal(sug)}>
                  <div className="suggestion-icon-wrap" style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primaryColor }}>
                    <Target size={30} />
                  </div>
                  <div className="suggestion-content-main">
                    <h3>{sug.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>{sug.description}</p>
                    <div className="meta-tags" style={{ display: 'flex', gap: '10px' }}>
                        <span className="target-pill" style={{ background: `${primaryColor}22`, color: primaryColor }}>{sug.category}</span>
                        <span className="target-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}><User size={12} /> {sug.coach}</span>
                    </div>
                  </div>
                  <div className="chevron-icon">
                    <ChevronRight size={20} style={{ opacity: 0.3 }} />
                  </div>
                </div>

                <div className="suggestion-footer" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 25px', display: 'flex', gap: '20px' }}>
                  <button className="footer-stat clickable" onClick={() => { setSelectedSugForFeedback(sug); setIsFeedbackModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <MessageSquare size={14} />
                    <span>{sug.comments?.length || 0} feedbacks</span>
                  </button>
                </div>
              </div>
            ))}

            {activeAlignments.length === 0 && (
              <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px', opacity: 0.6 }}>
                <Plus size={40} style={{ margin: '0 auto 15px', display: 'block' }} />
                <p>Nenhuma sugestão ativa encontrada para este filtro.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="suggestion-history glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Clock size={18} style={{ color: primaryColor }} />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Histórico Recente</h3>
          </div>
          <div className="history-list">
            {historyAlignments.length > 0 ? historyAlignments.map(item => (
              <div key={item.id} className="history-item glass" style={{ marginBottom: '12px', padding: '15px', borderRadius: '15px', border: 'none', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }} onClick={() => handleOpenEditModal(item)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span className="h-theme" style={{ fontWeight: 700, fontSize: '14px' }}>{item.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.category}</span>
                </div>
                <div className="h-date" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Finalizado em {formatDatePattern(item.endDate)}</div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>Sem histórico recente.</div>
            )}
          </div>
        </aside>
      </div>
    </div>

    {/* Create/Edit Modal */}
    {isModalOpen && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '50px 20px', overflowY: 'auto' }}>
        <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '750px', padding: '40px', borderRadius: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
             <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{modalMode === 'add' ? 'Nova Sugestão / Anotação' : 'Editar Registro'}</h2>
             <button className="glass" onClick={() => setIsModalOpen(false)} style={{ padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
               <div className="form-group" style={{ gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Tipo de Registro</label>
                  <select className="glass-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="Sugestão">Sugestão</option>
                    <option value="Anotação">Anotação</option>
                  </select>
               </div>

               <div className="form-group" style={{ gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Título</label>
                  <input type="text" className="glass-input" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Ex: Pressão no bloco médio" />
               </div>

               <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Data de Início</label>
                  <input type="date" className="glass-input" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
               </div>

               <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Data de Fim</label>
                  <input type="date" className="glass-input" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
               </div>

               <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Categoria Alvo</label>
                  <select className="glass-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(cat => cat !== 'All' && <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>

               <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Treinador Responsável</label>
                  <select className="glass-select" value={formData.coach} onChange={(e) => setFormData({...formData, coach: e.target.value})}>
                    {coachesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
               </div>

               <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Observações / Notas (Max 800 caracteres)</label>
                  <textarea 
                    className="glass-input" 
                    rows="5" 
                    maxLength="800"
                    placeholder="Descreva aqui as orientações táticas, objetivos e notas extras..."
                    style={{ resize: 'none' }}
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                  ></textarea>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
                    {formData.note.length} / 800
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
               <button type="submit" className="submit-btn" style={{ flex: 1, padding: '18px', borderRadius: '15px', background: primaryColor, color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                 {modalMode === 'add' ? 'Registrar' : 'Salvar Alterações'}
               </button>
               <button type="button" className="glass" onClick={() => setIsModalOpen(false)} style={{ padding: '15px 30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Feedback/Comments Modal */}
    {isFeedbackModalOpen && selectedSugForFeedback && (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9500, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px 20px' }}>
        <div className="modal-content glass animate-scale-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', borderRadius: '28px', padding: 0, overflow: 'hidden' }}>
          <div className="modal-header" style={{ padding: '25px 30px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Feedbacks e Comentários</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{selectedSugForFeedback.title}</p>
            </div>
            <button className="glass" onClick={() => setIsFeedbackModalOpen(false)} style={{ padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          <div className="comments-list" style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
            {(selectedSugForFeedback.comments || []).length > 0 ? (
               selectedSugForFeedback.comments.map(comment => (
                 <div key={comment.id} className="comment-item glass" style={{ marginBottom: '20px', padding: '15px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <span style={{ fontWeight: 700, fontSize: '14px', color: primaryColor }}>{comment.author}</span>
                       <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{comment.time}</span>
                    </div>
                    <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{comment.text}</p>
                 </div>
               ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                 <MessageSquare size={32} style={{ margin: '0 auto 15px', display: 'block', opacity: 0.3 }} />
                 <p>Nenhum feedback ainda. Seja o primeiro a comentar!</p>
              </div>
            )}
          </div>

          <form onSubmit={handleAddComment} style={{ padding: '25px 30px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Escreva seu feedback técnico..." 
              style={{ flex: 1, borderRadius: '12px' }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" style={{ background: primaryColor, color: '#000', border: 'none', borderRadius: '12px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default Suggestions;
