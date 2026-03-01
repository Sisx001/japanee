import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RANDOM_NAMES, AVATAR_EMOJIS, LEVEL_TITLES, BADGES } from '@/data/JapaneseData';

const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Generate random profile for new users
const generateRandomProfile = () => {
  const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
  const randomAvatar = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const defaultVolume = isMobile ? 0.20 : 0.20;

  return {
    name: randomName,
    avatar: randomAvatar,
    createdAt: new Date().toISOString(),
    defaultVolume // Store for first-time setup
  };
};

// Initial progress state
const initialProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  badges: [],
  hiraganaLearned: [],
  katakanaLearned: [],
  kanjiLearned: [],
  vocabLearned: [],
  grammarLearned: [],
  quizHistory: [],
  totalCorrect: 0,
  totalQuestions: 0,
  lessonsCompleted: 0
};

const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const initialSettings = {
  romajiMode: 'on',
  furiganaMode: true,
  difficulty: 'easy',
  backgroundMusic: true,
  musicVolume: isMobileDevice ? 0.20 : 0.20,
  soundEffects: true,
  theme: 'light',
  dailyGoal: 15,
  languagePreference: 'en',
  cursorType: 'sakura'
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(initialProgress);
  const [settings, setSettings] = useState(initialSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('nihongo_profile');
    const savedProgress = localStorage.getItem('nihongo_progress');
    const savedSettings = localStorage.getItem('nihongo_settings');

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Create new profile
      const newProfile = generateRandomProfile();
      setProfile(newProfile);
      localStorage.setItem('nihongo_profile', JSON.stringify(newProfile));
    }

    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    if (savedSettings) {
      setSettings({ ...initialSettings, ...JSON.parse(savedSettings) });
    }

    setIsLoaded(true);
  }, []);

  // Save profile changes
  useEffect(() => {
    if (isLoaded && profile) {
      localStorage.setItem('nihongo_profile', JSON.stringify(profile));
    }
  }, [profile, isLoaded]);

  // Save progress changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nihongo_progress', JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  // Save settings changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nihongo_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Update profile name
  const updateName = useCallback((name) => {
    setProfile(prev => ({ ...prev, name }));
  }, []);

  // Update profile avatar
  const updateAvatar = useCallback((avatar) => {
    setProfile(prev => ({ ...prev, avatar }));
  }, []);

  // Add XP and handle level up
  const addXP = useCallback((amount) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;

      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  }, []);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();

    setProgress(prev => {
      if (prev.lastActiveDate === today) {
        return prev; // Already active today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasActiveYesterday = prev.lastActiveDate === yesterday.toDateString();

      return {
        ...prev,
        streak: wasActiveYesterday ? prev.streak + 1 : 1,
        lastActiveDate: today
      };
    });
  }, []);

  // Mark content as learned
  const markLearned = useCallback((type, id) => {
    setProgress(prev => {
      const key = `${type}Learned`;
      if (prev[key]?.includes(id)) return prev;

      return {
        ...prev,
        [key]: [...(prev[key] || []), id]
      };
    });
  }, []);

  // Record quiz result
  const recordQuizResult = useCallback((correct, total, category) => {
    setProgress(prev => ({
      ...prev,
      totalCorrect: prev.totalCorrect + correct,
      totalQuestions: prev.totalQuestions + total,
      quizHistory: [
        ...prev.quizHistory.slice(-99), // Keep last 100
        { correct, total, category, date: new Date().toISOString() }
      ]
    }));

    // Add XP based on performance
    const xpGained = correct * 5;
    addXP(xpGained);
    updateStreak();
  }, [addXP, updateStreak]);

  // Award badge
  const awardBadge = useCallback((badgeId) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId]
      };
    });
  }, []);

  // Check and award badges
  const checkBadges = useCallback(() => {
    const newBadges = [];

    // First lesson
    if (progress.lessonsCompleted >= 1 && !progress.badges.includes('first_lesson')) {
      newBadges.push('first_lesson');
    }

    // Hiragana master
    if (progress.hiraganaLearned.length >= 46 && !progress.badges.includes('hiragana_master')) {
      newBadges.push('hiragana_master');
    }

    // Katakana pro
    if (progress.katakanaLearned.length >= 46 && !progress.badges.includes('katakana_pro')) {
      newBadges.push('katakana_pro');
    }

    // Kana ninja
    if (progress.hiraganaLearned.length >= 46 && progress.katakanaLearned.length >= 46 && !progress.badges.includes('kana_ninja')) {
      newBadges.push('kana_ninja');
    }

    // Vocab 100
    if (progress.vocabLearned.length >= 100 && !progress.badges.includes('vocab_100')) {
      newBadges.push('vocab_100');
    }

    // Kanji 50
    if (progress.kanjiLearned.length >= 50 && !progress.badges.includes('kanji_50')) {
      newBadges.push('kanji_50');
    }

    // Streak 7
    if (progress.streak >= 7 && !progress.badges.includes('streak_7')) {
      newBadges.push('streak_7');
    }

    // Streak 30
    if (progress.streak >= 30 && !progress.badges.includes('streak_30')) {
      newBadges.push('streak_30');
    }

    newBadges.forEach(badge => awardBadge(badge));
    return newBadges;
  }, [progress, awardBadge]);

  // Get level title
  const getLevelTitle = useCallback((level) => {
    let title = 'Beginner';
    for (const [lvl, t] of Object.entries(LEVEL_TITLES)) {
      if (level >= parseInt(lvl)) {
        title = t;
      }
    }
    return title;
  }, []);

  // Update settings
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const setLanguagePreference = useCallback((lang) => {
    setSettings(prev => ({ ...prev, languagePreference: lang }));
  }, []);

  const addExperience = addXP; // Alias for compatibility

  // Reset progress (for testing)
  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
    localStorage.removeItem('nihongo_progress');
  }, []);

  const value = {
    // Profile
    profile,
    updateName,
    updateAvatar,

    // Progress
    progress,
    addXP,
    updateStreak,
    markLearned,
    recordQuizResult,
    awardBadge,
    checkBadges,
    getLevelTitle,
    resetProgress,

    // Settings
    settings,
    updateSettings,
    toggleTheme,
    setLanguagePreference,
    addExperience,

    // Loading state
    isLoaded
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
