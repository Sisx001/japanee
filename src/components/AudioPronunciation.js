import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

// Web Speech API based pronunciation
const AudioPronunciation = ({ 
  text, 
  language = 'ja-JP',
  rate = 0.8,
  pitch = 1,
  showButton = true,
  autoPlay = false,
  buttonSize = 'default',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    if (autoPlay && isSupported && text) {
      speak();
    }
  }, [text, autoPlay]);

  const speak = () => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!isSupported) {
    return null;
  }

  if (!showButton) {
    return null;
  }

  const sizeClass = buttonSize === 'sm' ? 'h-8 w-8' : buttonSize === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const iconSize = buttonSize === 'sm' ? 'h-4 w-4' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isPlaying ? stop : speak}
      className={`rounded-full ${sizeClass} ${className}`}
      title={isPlaying ? 'Stop' : 'Play pronunciation'}
    >
      {isPlaying ? (
        <VolumeX className={iconSize} />
      ) : (
        <Volume2 className={iconSize} />
      )}
    </Button>
  );
};

// Hook for programmatic audio playback
export const useAudioPronunciation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported || !text) return;

    const { 
      language = 'ja-JP', 
      rate = 0.8, 
      pitch = 1,
      onStart = () => {},
      onEnd = () => {}
    } = options;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setIsPlaying(true);
      onStart();
    };
    utterance.onend = () => {
      setIsPlaying(false);
      onEnd();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return { speak, stop, isPlaying, isSupported };
};

// Quick pronunciation utility function
export const pronounceJapanese = (text, rate = 0.8) => {
  if (!('speechSynthesis' in window) || !text) return;

  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  
  window.speechSynthesis.speak(utterance);
};

// Pronunciation button with character display
export const KanaPronunciationCard = ({ character, romaji, meaning, onSpeak }) => {
  const handleSpeak = () => {
    pronounceJapanese(character);
    if (onSpeak) onSpeak();
  };

  return (
    <div 
      className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-all"
      onClick={handleSpeak}
    >
      <span className="text-4xl font-bold japanese-text text-primary">{character}</span>
      <span className="text-sm text-muted-foreground mt-1">{romaji}</span>
      {meaning && <span className="text-xs text-muted-foreground">{meaning}</span>}
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-2 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          handleSpeak();
        }}
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AudioPronunciation;
