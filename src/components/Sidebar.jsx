import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  LogOut,
  Users2,
  FolderOpen,
  ClipboardCheck,
  Lightbulb,
  Settings,
  BookOpen
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { primaryColor, logo, institutionName } = useTheme();

  const navItems = [
    { icon: <BarChart3 size={24} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={24} />, label: 'Coaches', path: '/coaches' },
    { icon: <Users2 size={24} />, label: 'Players', path: '/players' },
    { icon: <FolderOpen size={24} />, label: 'Training Library', path: '/library' },
    { icon: <BookOpen size={24} />, label: 'Principles', path: '/principles' },
    { icon: <ClipboardCheck size={24} />, label: 'Training Sessions', path: '/sessions' },
    { icon: <Lightbulb size={24} />, label: 'Suggestions', path: '/suggestions' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
  ];


  const getInitials = (name) => {
    if (!name) return 'NT';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div 
      className={`sidebar glass ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          {logo ? (
            <img src={logo} alt="Club Logo" className="club-logo" />
          ) : (
            <div className="default-logo" style={{ backgroundColor: primaryColor }}>
              {getInitials(institutionName)}
            </div>
          )}
        </div>
        {isExpanded && <span className="logo-text">{institutionName}</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-wrapper">{item.icon}</div>
            {isExpanded && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item logout">
          <div className="icon-wrapper"><LogOut size={24} /></div>
          {isExpanded && <span className="nav-label">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
