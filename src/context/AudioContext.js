import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved !== null ? parseFloat(saved) : 0.01;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [voices, setVoices] = useState([]);
  const [japaneseVoice, setJapaneseVoice] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => Math.floor(Math.random() * 5));

  const BACKGROUND_TRACKS = [
    'https://cdn.pixabay.com/audio/2023/03/26/audio_1d5c4319b7.mp3',
    'https://cdn.pixabay.com/audio/2025/03/16/audio_5b558f8091.mp3',
    'https://cdn.pixabay.com/audio/2025/06/13/audio_06dd0dd326.mp3',
    'https://cdn.pixabay.com/audio/2024/11/15/audio_157298f798.mp3',
    'https://cdn.pixabay.com/audio/2024/03/18/audio_f9f5488280.mp3'
  ];

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem('musicVolume', musicVolume.toString());
  }, [musicVolume]);

  const audioContextRef = useRef(null);
  const musicRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);
      const jpVoice = availableVoices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
      if (jpVoice) setJapaneseVoice(jpVoice);
    };
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    const audio = new Audio(BACKGROUND_TRACKS[currentTrackIndex]);
    audio.volume = musicVolume;
    const handleEnded = () => setCurrentTrackIndex(prev => (prev + 1) % BACKGROUND_TRACKS.length);
    audio.addEventListener('ended', handleEnded);
    musicRef.current = audio;
    if (musicPlaying) audio.play().catch(console.warn);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = musicVolume;
  }, [musicVolume]);

  const startMusic = useCallback(() => {
    if (musicEnabled && !musicPlaying && musicRef.current) {
      musicRef.current.play().then(() => setMusicPlaying(true)).catch(console.warn);
    }
  }, [musicEnabled, musicPlaying]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) musicRef.current.pause();
    setMusicPlaying(false);
  }, []);

  const toggleMusic = useCallback((enabled) => {
    setMusicEnabled(enabled);
    if (enabled) {
      if (musicRef.current && !musicPlaying) musicRef.current.play().then(() => setMusicPlaying(true)).catch(console.warn);
    } else {
      if (musicRef.current) musicRef.current.pause();
      setMusicPlaying(false);
    }
  }, [musicPlaying]);

  const initializeAudio = useCallback(async () => {
    if (!isInitialized || (audioContextRef.current && audioContextRef.current.state === 'suspended')) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
      }
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const isEnabledRef = useRef(isEnabled);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  const toggleSound = useCallback((enabled) => {
    setIsEnabled(enabled);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setIsPlaying(false);
      }, 50);
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!isEnabledRef.current || !window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();

    setTimeout(() => {
      // Final check if it was muted during the 10ms delay
      if (!isEnabledRef.current) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      if (japaneseVoice) utterance.voice = japaneseVoice;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }, 10);
  }, [japaneseVoice]);

  const playSound = useCallback((type) => {
    if (!isEnabled) return;
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      switch (type) {
        case 'correct':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(783.99, audioContext.currentTime + 0.1);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'wrong':
          oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(220, audioContext.currentTime + 0.2);
          oscillator.type = 'triangle';
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'click':
          oscillator.frequency.value = 800; oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
        case 'levelup':
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain); gain.connect(audioContext.destination);
            osc.frequency.value = freq; osc.type = 'sine';
            gain.gain.setValueAtTime(0.25, audioContext.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.4);
            osc.start(audioContext.currentTime + i * 0.1);
            osc.stop(audioContext.currentTime + i * 0.1 + 0.4);
          });
          break;
        default: break;
      }
    } catch (e) { console.warn('Sound effect failed:', e); }
  }, [isEnabled]);

  const value = {
    isEnabled, setIsEnabled, toggleSound, isPlaying, speak, stop, voices, initializeAudio, isInitialized, playSound,
    musicEnabled, musicPlaying, toggleMusic, musicVolume, setMusicVolume, startMusic, stopMusic
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const AudioButton = ({ text, size = 'default', variant = 'ghost', className = '', showText = false, label = 'Listen' }) => {
  const { speak, isPlaying, initializeAudio } = useAudio();
  const handleClick = (e) => { e.stopPropagation(); initializeAudio(); speak(text); };
  const sizeClasses = { xs: 'h-6 w-6 p-0', sm: 'h-8 w-8 p-0', default: 'h-10 w-10 p-0', lg: 'h-12 w-12 p-0' };
  const iconSizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', default: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <button onClick={handleClick} className={`inline-flex items-center justify-center rounded-full transition-all ${variant === 'ghost' ? 'hover:bg-muted text-muted-foreground hover:text-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'} ${showText ? 'px-3 gap-2' : sizeClasses[size]} ${isPlaying ? 'animate-pulse text-rose-500' : ''} ${className}`}>
      <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
      {showText && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
};

export const SpeakableText = ({ text, children, className = '', buttonSize = 'xs', buttonPosition = 'right', as: Component = 'span' }) => {
  const { speak, initializeAudio } = useAudio();
  const handleClick = () => { initializeAudio(); speak(text); };
  if (buttonPosition === 'none') return <Component className={`cursor-pointer hover:text-rose-500 transition-colors ${className}`} onClick={handleClick}>{children || text}</Component>;
  return (
    <Component className={`inline-flex items-center gap-1 ${className}`}>
      {buttonPosition === 'left' && <AudioButton text={text} size={buttonSize} />}
      <span className="cursor-pointer hover:text-rose-500 transition-colors" onClick={handleClick}>{children || text}</span>
      {buttonPosition === 'right' && <AudioButton text={text} size={buttonSize} />}
    </Component>
  );
};

export default AudioProvider;
