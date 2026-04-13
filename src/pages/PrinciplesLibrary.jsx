import React, { useState } from 'react';
import { BookOpen, FileText, Activity, Shield, Shuffle, Key, Edit2, Plus, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './PrinciplesLibrary.css';

import { initialPrinciplesData } from '../data/principlesData';

const PrinciplesLibrary = () => {
  const [data, setData] = useState(initialPrinciplesData);
  const [activeCategory, setActiveCategory] = useState(initialPrinciplesData[0].type);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [formData, setFormData] = useState({ 
    categoryType: '', 
    subCategory: '', 
    name: '', 
    description: '' 
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentEdit(item);
      setFormData({
        categoryType: item.categoryType,
        subCategory: item.subCategory,
        name: item.name,
        description: item.description,
        originalName: item.name 
      });
    } else {
      setCurrentEdit(null);
      const activeData = data.find(c => c.type === activeCategory);
      setFormData({
        categoryType: activeCategory,
        subCategory: activeData?.items[0]?.subCategory || '',
        name: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const { primaryColor } = useTheme();

  const handleSave = (e) => {
    e.preventDefault();
    const newData = [...data];
    const catIndex = newData.findIndex(c => c.type === formData.categoryType);
    
    if (catIndex > -1) {
      const cat = newData[catIndex];
      let subCatIndex = cat.items.findIndex(s => s.subCategory === formData.subCategory);
      
      if (currentEdit) {
        // Edit
        if (subCatIndex > -1) {
           const pIndex = cat.items[subCatIndex].principles.findIndex(p => p.name === currentEdit.originalName);
           if (pIndex > -1) {
             cat.items[subCatIndex].principles[pIndex] = {
               name: formData.name,
               description: formData.description
             };
           }
        }
      } else {
        // Add
        const newPrinciple = { name: formData.name, description: formData.description };
        if (subCatIndex > -1) {
          cat.items[subCatIndex].principles.push(newPrinciple);
        } else {
          cat.items.push({
            subCategory: formData.subCategory || 'General',
            principles: [newPrinciple]
          });
        }
      }
      setData(newData);
    }
    setIsModalOpen(false);
  };

  const selectedCategoryData = data.find(c => c.type === formData.categoryType) || data[0];
  const uniqueSubcategories = selectedCategoryData.items.map(i => i.subCategory);

  return (
    <div className="principles-container page-enter">
      <div className="principles-header">
        <div className="header-icon-wrapper">
          <BookOpen className="header-icon" size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">Principles Library</h1>
          <p className="page-subtitle">Guide to established tactical and technical principles</p>
        </div>
        <button 
          className="add-new-btn" 
          style={{ backgroundColor: primaryColor }}
          onClick={() => handleOpenModal(null)}
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="principles-content">
        <div className="principles-tabs glass-panel">
          {data.map((cat) => (
            <button
              key={cat.type}
              className={`tab-btn ${activeCategory === cat.type ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.type)}
            >
              <div className="tab-icon">{cat.icon}</div>
              <span>{cat.category}</span>
            </button>
          ))}
        </div>

        <div className="principles-list-container">
          {data.map((cat) => {
            if (activeCategory !== cat.type) return null;
            return (
              <div key={cat.type} className="principles-category-content slide-up">
                <h2 className="category-title">{cat.category}</h2>
                <div className="principles-grid">
                  {cat.items.map((subItem, idx) => (
                    <div key={idx} className="sub-category-card glass-card">
                      <h3 className="sub-category-title">{subItem.subCategory}</h3>
                      <ul className="principles-list">
                        {subItem.principles.map((principle, pIdx) => (
                          <li key={pIdx} className="principle-item">
                            <div className="principle-bullet"></div>
                            <div className="principle-text">
                              <strong>
                                {principle.name}
                                <button 
                                  className="edit-principle-btn" 
                                  title="Edit Principle"
                                  onClick={() => handleOpenModal({
                                    categoryType: cat.type,
                                    subCategory: subItem.subCategory,
                                    name: principle.name,
                                    description: principle.description
                                  })}
                                >
                                  <Edit2 size={14} />
                                </button>
                              </strong>
                              <p>{principle.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay slide-up">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{currentEdit ? 'Edit Principle' : 'Add New Principle'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Category (Phase)</label>
                <select 
                  className="form-input" 
                  value={formData.categoryType}
                  onChange={(e) => {
                    const newCat = data.find(c => c.type === e.target.value);
                    setFormData({
                      ...formData, 
                      categoryType: e.target.value,
                      subCategory: newCat?.items[0]?.subCategory || ''
                    });
                  }}
                  disabled={!!currentEdit}
                >
                  {data.map(c => (
                    <option key={c.type} value={c.type}>{c.category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subcategory</label>
                <input 
                  type="text"
                  className="form-input"
                  list="subcategories"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                  placeholder="e.g. Collective, Individual..."
                  required
                  disabled={!!currentEdit}
                />
                <datalist id="subcategories">
                  {uniqueSubcategories.map((sub, i) => (
                    <option key={i} value={sub} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Principle Name</label>
                <input 
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Width"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the principle..."
                  rows={4}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" style={{ backgroundColor: primaryColor }}>
                  {currentEdit ? 'Save Changes' : 'Add New'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinciplesLibrary;
