import React from 'react';
import { 
  Moon, 
  Sun, 
  Palette, 
  Image as ImageIcon,
  Check,
  RefreshCcw,
  Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

const colorPresets = [
  '#5CE1E6', // Original Teal
  '#FF9500', // Orange
  '#FF2D55', // Pink/Red
  '#AF52DE', // Purple
  '#34C759', // Green
  '#007AFF'  // Blue
];

const Settings = () => {
  const { 
    primaryColor, 
    setPrimaryColor, 
    isDarkMode, 
    setIsDarkMode, 
    logo, 
    setLogo,
    institutionName,
    setInstitutionName,
    directorName,
    setDirectorName,
    directorPhoto,
    setDirectorPhoto
  } = useTheme();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetSettings = () => {
    setPrimaryColor('#5CE1E6');
    setIsDarkMode(true);
    setLogo(null);
    setInstitutionName('Nextrainers FC');
    setDirectorName('Coach');
    setDirectorPhoto(null);
  };

  const saveSettings = () => {
    // In a real app, this would persist to localStorage or an API
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="welcome-text">Settings</h1>
          <p className="subtitle">Customize your dashboard experience</p>
        </div>
        <div className="flex gap-sm">
          <button className="reset-btn glass" onClick={resetSettings}>
            <RefreshCcw size={18} />
            <span>Reset to Default</span>
          </button>
          <button 
            className="save-btn neon-shadow" 
            style={{ backgroundColor: primaryColor, color: 'black' }}
            onClick={saveSettings}
          >
            <Check size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      <div className="settings-container glass">
        <section className="settings-section">
          <div className="section-info">
            <Palette className="accent-text" size={24} />
            <div>
              <h3>Institution Name</h3>
              <p>Display your club's name prominently</p>
            </div>
          </div>
          <div className="name-input-container">
            <input 
              type="text" 
              className="glass name-input"
              value={institutionName} 
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="Enter institution name"
            />
          </div>
        </section>

        <section className="settings-section">
          <div className="section-info">
            <Palette className="accent-text" size={24} />
            <div>
              <h3>Theme Colors</h3>
              <p>Choose a primary accent color for your brand</p>
            </div>
          </div>
          <div className="color-grid">
            {colorPresets.map(color => (
              <button 
                key={color}
                className={`color-preset ${primaryColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setPrimaryColor(color)}
              >
                {primaryColor === color && <Check size={16} color="white" />}
              </button>
            ))}
            <div className="custom-color-input">
              <input 
                type="color" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)} 
              />
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-info">
            {isDarkMode ? <Moon className="accent-text" size={24} /> : <Sun className="accent-text" size={24} />}
            <div>
              <h3>Display Mode</h3>
              <p>Toggle between light and dark visual styles</p>
            </div>
          </div>
          <div className="toggle-container glass" onClick={() => setIsDarkMode(!isDarkMode)}>
            <div className={`toggle-slider ${isDarkMode ? 'dark' : 'light'}`}></div>
            <div className="toggle-labels">
              <span>Light</span>
              <span>Dark</span>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-info">
            <ImageIcon className="accent-text" size={24} />
            <div>
              <h3>Club Branding</h3>
              <p>Upload your official club logo to personalize the dashboard</p>
            </div>
          </div>
          <div className="logo-upload-container">
            <div className="current-logo-preview glass">
              {logo ? (
                <img src={logo} alt="Club Logo" />
              ) : (
                <div 
                  className="placeholder-logo" 
                  style={{ backgroundColor: primaryColor }}
                >
                  {institutionName ? institutionName.charAt(0) : 'N'}
                </div>
              )}
            </div>
            <label className="upload-btn neon-shadow" style={{ backgroundColor: primaryColor }}>
              <ImageIcon size={18} />
              Upload Logo
              <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-info">
            <Users className="accent-text" size={24} />
            <div>
              <h3>Coach Profile</h3>
              <p>Upload a profile photo and set your name</p>
            </div>
          </div>
          <div className="profile-settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
            <div className="name-input-container" style={{ width: '100%', maxWidth: '300px' }}>
              <input 
                type="text" 
                className="glass name-input"
                value={directorName} 
                onChange={(e) => setDirectorName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="logo-upload-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="current-logo-preview glass" style={{ borderRadius: '50%', width: '80px', height: '80px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {directorPhoto ? (
                  <img src={directorPhoto} alt="Coach Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div 
                    className="placeholder-logo" 
                    style={{ backgroundColor: primaryColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'black' }}
                  >
                    {directorName ? directorName.charAt(0) : 'C'}
                  </div>
                )}
              </div>
              <label className="upload-btn neon-shadow" style={{ backgroundColor: primaryColor }}>
                <ImageIcon size={18} />
                Upload Photo
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setDirectorPhoto(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
