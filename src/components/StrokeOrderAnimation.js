import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Volume2 } from 'lucide-react';

// Stroke order data for common kanji (simplified paths for animation)
const STROKE_DATA = {
  '一': [{ type: 'horizontal', path: 'M 10,50 H 90' }],
  '二': [
    { type: 'horizontal', path: 'M 15,35 H 85' },
    { type: 'horizontal', path: 'M 10,65 H 90' }
  ],
  '三': [
    { type: 'horizontal', path: 'M 20,25 H 80' },
    { type: 'horizontal', path: 'M 15,50 H 85' },
    { type: 'horizontal', path: 'M 10,75 H 90' }
  ],
  '十': [
    { type: 'horizontal', path: 'M 10,50 H 90' },
    { type: 'vertical', path: 'M 50,10 V 90' }
  ],
  '日': [
    { type: 'vertical', path: 'M 25,15 V 85' },
    { type: 'horizontal', path: 'M 25,15 H 75' },
    { type: 'vertical', path: 'M 75,15 V 85' },
    { type: 'horizontal', path: 'M 25,50 H 75' },
    { type: 'horizontal', path: 'M 25,85 H 75' }
  ],
  '月': [
    { type: 'vertical', path: 'M 30,10 V 90 L 40,95' },
    { type: 'horizontal', path: 'M 30,10 H 70' },
    { type: 'vertical', path: 'M 70,10 V 90' },
    { type: 'horizontal', path: 'M 35,40 H 65' },
    { type: 'horizontal', path: 'M 35,65 H 65' }
  ],
  '火': [
    { type: 'curve', path: 'M 20,60 Q 30,45 35,25' },
    { type: 'curve', path: 'M 80,60 Q 70,45 65,25' },
    { type: 'vertical', path: 'M 50,15 V 55' },
    { type: 'curve', path: 'M 50,55 Q 30,75 15,90' },
    { type: 'curve', path: 'M 50,55 Q 70,75 85,90' }
  ],
  '水': [
    { type: 'vertical', path: 'M 50,10 V 90' },
    { type: 'curve', path: 'M 50,35 Q 25,50 10,70' },
    { type: 'curve', path: 'M 50,35 Q 75,50 90,70' },
    { type: 'curve', path: 'M 30,20 Q 50,30 55,35' }
  ],
  '木': [
    { type: 'horizontal', path: 'M 10,30 H 90' },
    { type: 'vertical', path: 'M 50,10 V 90' },
    { type: 'curve', path: 'M 50,50 Q 25,70 10,90' },
    { type: 'curve', path: 'M 50,50 Q 75,70 90,90' }
  ],
  '金': [
    { type: 'curve', path: 'M 50,10 L 20,35' },
    { type: 'curve', path: 'M 50,10 L 80,35' },
    { type: 'horizontal', path: 'M 15,45 H 85' },
    { type: 'horizontal', path: 'M 25,60 H 75' },
    { type: 'horizontal', path: 'M 30,75 H 70' },
    { type: 'vertical', path: 'M 50,45 V 95' },
    { type: 'curve', path: 'M 35,60 L 25,90' },
    { type: 'curve', path: 'M 65,60 L 75,90' }
  ],
  '土': [
    { type: 'horizontal', path: 'M 15,30 H 85' },
    { type: 'vertical', path: 'M 50,30 V 85' },
    { type: 'horizontal', path: 'M 10,85 H 90' }
  ],
  '大': [
    { type: 'horizontal', path: 'M 10,35 H 90' },
    { type: 'curve', path: 'M 50,35 Q 25,65 10,95' },
    { type: 'curve', path: 'M 50,35 Q 75,65 90,95' }
  ],
  '小': [
    { type: 'vertical', path: 'M 50,10 V 90' },
    { type: 'curve', path: 'M 20,40 Q 35,50 50,55' },
    { type: 'curve', path: 'M 80,40 Q 65,50 50,55' }
  ],
  '中': [
    { type: 'vertical', path: 'M 25,15 V 85' },
    { type: 'vertical', path: 'M 75,15 V 85' },
    { type: 'horizontal', path: 'M 25,15 H 75' },
    { type: 'horizontal', path: 'M 25,85 H 75' },
    { type: 'vertical', path: 'M 50,15 V 95' }
  ],
  '人': [
    { type: 'curve', path: 'M 50,10 Q 35,50 10,95' },
    { type: 'curve', path: 'M 45,35 Q 70,60 90,95' }
  ],
  '山': [
    { type: 'vertical', path: 'M 25,95 V 35' },
    { type: 'vertical', path: 'M 50,95 V 10' },
    { type: 'vertical', path: 'M 75,95 V 35' }
  ],
  '川': [
    { type: 'vertical', path: 'M 25,10 V 90 Q 25,95 30,95' },
    { type: 'vertical', path: 'M 50,15 V 90 Q 50,95 55,95' },
    { type: 'vertical', path: 'M 75,10 V 90 Q 75,95 80,95' }
  ]
};

// Audio pronunciation using Web Speech API
const speakJapanese = (text, rate = 0.8) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

const StrokeOrderAnimation = ({ 
  character, 
  size = 200, 
  strokeWidth = 4,
  animationSpeed = 800,
  showControls = true,
  autoPlay = false,
  onComplete = () => {}
}) => {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const svgRef = useRef(null);
  const animationRef = useRef(null);

  const strokes = STROKE_DATA[character] || [];
  const totalStrokes = strokes.length;

  useEffect(() => {
    setCurrentStroke(0);
    setProgress(0);
    setIsPlaying(autoPlay);
  }, [character, autoPlay]);

  useEffect(() => {
    if (isPlaying && currentStroke < totalStrokes) {
      animationRef.current = setTimeout(() => {
        setProgress(0);
        setCurrentStroke(prev => prev + 1);
        
        if (currentStroke + 1 >= totalStrokes) {
          setIsPlaying(false);
          onComplete();
        }
      }, animationSpeed);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStroke, totalStrokes, animationSpeed, onComplete]);

  const handlePlay = () => {
    if (currentStroke >= totalStrokes) {
      setCurrentStroke(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStroke(0);
    setProgress(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStroke(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStroke(prev => Math.min(totalStrokes, prev + 1));
  };

  const handlePronounce = () => {
    speakJapanese(character);
  };

  // Generate strokes with animation
  const renderStrokes = () => {
    if (strokes.length === 0) {
      // Fallback: Display character as text if no stroke data
      return (
        <text
          x="50"
          y="55"
          fontSize="60"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          className="japanese-text"
        >
          {character}
        </text>
      );
    }

    return strokes.map((stroke, index) => {
      const isCompleted = index < currentStroke;
      const isCurrent = index === currentStroke;
      
      return (
        <path
          key={index}
          d={stroke.path}
          fill="none"
          stroke={isCompleted ? '#1e293b' : isCurrent ? '#F8B4C0' : '#e2e8f0'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isCurrent && isPlaying ? 'animate-draw-stroke' : ''}
          style={{
            strokeDasharray: isCurrent ? '200' : 'none',
            strokeDashoffset: isCurrent && isPlaying ? '200' : '0',
            animation: isCurrent && isPlaying 
              ? `drawStroke ${animationSpeed}ms ease-out forwards` 
              : 'none'
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Canvas */}
      <div 
        className="relative bg-white rounded-2xl border-2 border-primary/30 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* Grid lines */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="absolute inset-0"
        >
          {/* Guide lines */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#e5e7eb" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeDasharray="2,2" />
          
          {/* Strokes */}
          {renderStrokes()}
        </svg>

        {/* Stroke counter */}
        <div className="absolute top-2 right-2 bg-primary/10 px-2 py-1 rounded-full text-xs font-medium">
          {currentStroke}/{totalStrokes}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePronounce}
            className="rounded-full"
            title="Pronounce"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="rounded-full"
            disabled={currentStroke === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          {isPlaying ? (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePause}
              className="rounded-full"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handlePlay}
              className="rounded-full bg-primary text-primary-foreground"
              disabled={currentStroke >= totalStrokes && !isPlaying}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="rounded-full"
            disabled={currentStroke >= totalStrokes}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* CSS for stroke animation */}
      <style jsx>{`
        @keyframes drawStroke {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StrokeOrderAnimation;
export { speakJapanese, STROKE_DATA };
