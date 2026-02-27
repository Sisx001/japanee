import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  romaji_mode: 'on',
  furigana_mode: 'on',
  kid_mode: false,
  daily_goal_minutes: 15,
  theme: 'light',
  language: 'en'
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nihongo_app_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const loading = false;

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('nihongo_app_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const toggleRomaji = () => {
    const modes = ['on', 'off', 'auto-hide'];
    setSettings(prev => {
      const currentIndex = modes.indexOf(prev.romaji_mode);
      return { ...prev, romaji_mode: modes[(currentIndex + 1) % modes.length] };
    });
  };

  const showRomaji = settings.romaji_mode === 'on';
  const showFurigana = settings.furigana_mode === 'on';
  const isKidMode = settings.kid_mode;
  const language = settings.language;

  // Translation helper
  const t = (en, bn) => language === 'bn' ? bn : en;

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings,
      toggleTheme,
      toggleRomaji,
      showRomaji,
      showFurigana,
      isKidMode,
      language,
      t
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
