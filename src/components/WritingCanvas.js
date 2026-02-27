import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eraser, RotateCcw, Check, Eye, EyeOff } from 'lucide-react';

const WritingCanvas = ({ 
  character, 
  romaji, 
  onComplete, 
  showGuide = true,
  size = 300 
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [showHint, setShowHint] = useState(showGuide);
  const [strokeCount, setStrokeCount] = useState(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    redrawCanvas();
  }, [size]);

  // Redraw canvas with all paths
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw hint character
    if (showHint && character) {
      ctx.font = `${size * 0.7}px "Noto Sans JP", sans-serif`;
      ctx.fillStyle = 'rgba(248, 180, 192, 0.2)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character, size / 2, size / 2);
    }
    
    // Draw all completed paths
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    paths.forEach(path => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
    
    // Draw current path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [paths, currentPath, showHint, character, size]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setCurrentPath([coords]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    setCurrentPath(prev => [...prev, coords]);
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    
    if (currentPath.length > 1) {
      setPaths(prev => [...prev, currentPath]);
      setStrokeCount(prev => prev + 1);
    }
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
    setStrokeCount(0);
  };

  const undoLastStroke = () => {
    if (paths.length > 0) {
      setPaths(prev => prev.slice(0, -1));
      setStrokeCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleSubmit = () => {
    // Calculate a simple score based on coverage
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    let darkPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Check if pixel is dark (part of stroke)
      if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) {
        darkPixels++;
      }
    }
    
    // Simple scoring: based on stroke count and coverage
    const coverageScore = Math.min(100, (darkPixels / (size * size * 0.1)) * 100);
    const score = Math.round(coverageScore);
    
    if (onComplete) {
      onComplete({
        score,
        strokeCount,
        character,
        romaji
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Character Display */}
      <div className="text-center">
        <div className="text-6xl font-bold japanese-text text-primary mb-1">
          {character}
        </div>
        <div className="text-lg text-muted-foreground">{romaji}</div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="writing-canvas bg-white rounded-2xl border-2 border-primary/30 cursor-crosshair"
          style={{ touchAction: 'none', width: size, height: size }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Stroke counter */}
        <div className="absolute top-2 right-2 bg-muted px-2 py-1 rounded-full text-xs font-medium">
          {strokeCount} strokes
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHint(!showHint)}
          className="rounded-full"
          title={showHint ? 'Hide hint' : 'Show hint'}
        >
          {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={undoLastStroke}
          className="rounded-full"
          disabled={paths.length === 0}
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={clearCanvas}
          className="rounded-full"
          title="Clear"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full bg-primary text-primary-foreground px-6"
          disabled={paths.length === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Submit
        </Button>
      </div>
    </div>
  );
};

export default WritingCanvas;
