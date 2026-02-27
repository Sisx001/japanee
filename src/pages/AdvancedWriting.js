import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Trash2, Undo2, Redo2, Download, Pen, Eraser,
  Palette, Grid, Maximize2, Minimize2, Sparkles, Zap, Activity, Brain
} from 'lucide-react';

const AdvancedWriting = () => {
  const navigate = useNavigate();
  const { settings } = useProfile();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState('pen'); // pen, eraser
  const [strokeColor, setStrokeColor] = useState('#f43f5e'); // Neon Rose default
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Traditional Japanese Color palette
  const colors = [
    '#cc3333', // Shu-iro (Vermillion)
    '#223366', // Aizome (Indigo)
    '#cc9900', // Gold
    '#336633', // Tokiwa-iro (Evergreen)
    '#333333', // Sumi-iro (Ink)
    '#ffffff', // Global White
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);

    // Initial background if history is empty
    if (history.length === 0) {
      ctx.fillStyle = settings?.darkMode ? '#0f172a' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (showGrid) drawGrid(ctx, canvas.width, canvas.height);

      const imageData = canvas.toDataURL();
      setHistory([imageData]);
      setHistoryIndex(0);
    } else {
      // Restore content after resize
      restoreFromHistory(historyIndex);
    }
  }, [canvasSize, settings?.darkMode]);

  // Update canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth - 4;
        const height = isFullscreen ? window.innerHeight - 250 : 500;
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isFullscreen]);

  const drawGrid = (ctx, width, height) => {
    const gridSize = 50;
    ctx.save();
    ctx.strokeStyle = settings?.darkMode ? 'rgba(244, 63, 94, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;

    // Cross pattern grid
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    ctx.restore();
  };

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreFromHistory(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreFromHistory(newIndex);
    }
  };

  const restoreFromHistory = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !context || !history[index]) return;
    const img = new Image();
    img.onload = () => {
      // Clear and restore with scaling to fit new canvas size
      context.fillStyle = settings?.darkMode ? '#0f172a' : '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (showGrid) drawGrid(context, canvas.width, canvas.height);
    };
    img.src = history[index];
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    const coords = getCoordinates(e);
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    context.strokeStyle = tool === 'eraser' ? (settings?.darkMode ? '#0f172a' : '#ffffff') : strokeColor;
    // Eraser size is 2x for better precision, user reported brush issues
    context.lineWidth = tool === 'eraser' ? strokeWidth * 2 : strokeWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    // Update brush tip position
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      container.style.setProperty('--mouse-x', `${clientX}px`);
      container.style.setProperty('--mouse-y', `${clientY}px`);
    }

    if (!isDrawing) return;
    if (e.type === 'touchmove') e.preventDefault();
    const coords = getCoordinates(e);
    context.lineTo(coords.x, coords.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    context.fillStyle = settings?.darkMode ? '#0f172a' : '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (showGrid) drawGrid(context, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  const downloadCanvas = () => {
    const link = document.createElement('a');
    link.download = `zen-writing-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto" ref={containerRef}>
        {/* Neural Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-rose-500/10 shadow-2xl">
          <div className="flex items-center gap-5">
            <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Zen Whiteboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase">Traditional Ink Practice</span>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Focus Depth</span>
              <span className="text-sm font-black italic text-green-500">Infinite</span>
            </div>
            <Activity className="w-8 h-8 text-rose-500 opacity-20" />
          </div>
        </div>

        {/* Traditional Control Deck */}
        <Card className="rounded-[2.5rem] bg-slate-950 border-white/5 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
          <CardContent className="p-6 relative">
            <div className="flex flex-wrap items-center justify-between gap-6">
              {/* Tool Selection */}
              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                <Button
                  variant={tool === 'pen' ? 'default' : 'ghost'}
                  className={`h-12 w-12 rounded-xl transition-all ${tool === 'pen' ? 'bg-rose-500 shadow-lg shadow-rose-500/20' : 'text-slate-400'}`}
                  onClick={() => setTool('pen')}
                >
                  <Pen className="w-5 h-5" />
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'default' : 'ghost'}
                  className={`h-12 w-12 rounded-xl transition-all ${tool === 'eraser' ? 'bg-rose-500 shadow-lg shadow-rose-500/20' : 'text-slate-400'}`}
                  onClick={() => setTool('eraser')}
                >
                  <Eraser className="w-5 h-5" />
                </Button>
              </div>

              {/* Spectral Palette */}
              <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
                <Palette className="w-4 h-4 text-rose-500" />
                <div className="flex items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-lg transition-all hover:scale-125 hover:rotate-12 ${strokeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-125' : 'opacity-40 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => { setStrokeColor(color); setTool('pen'); }}
                    />
                  ))}
                </div>
              </div>

              {/* Dimension Slider */}
              <div className="flex items-center gap-6 flex-1 min-w-[200px] max-w-sm px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap italic">Brush Width</span>
                  <div className="mt-1 flex items-center justify-center h-4">
                    <div
                      className="rounded-full bg-rose-500"
                      style={{
                        width: `${Math.max(2, strokeWidth)}px`,
                        height: `${Math.max(2, strokeWidth)}px`
                      }}
                    />
                  </div>
                </div>
                <Slider
                  value={[strokeWidth]}
                  onValueChange={(v) => setStrokeWidth(v[0])}
                  min={1}
                  max={40}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xl font-black italic text-rose-500 w-8">{strokeWidth}</span>
              </div>

              {/* Operations */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                  <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-white" onClick={undo} disabled={historyIndex <= 0}>
                    <Undo2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-10 h-10 text-slate-400 hover:text-white" onClick={redo} disabled={historyIndex >= history.length - 1}>
                    <Redo2 className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-xl border border-white/5 ${showGrid ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400'}`}
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 hover:text-white" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/20" onClick={downloadCanvas}>
                  <Download className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all ml-4" onClick={clearCanvas}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canvas Area */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <Card className="rounded-[2rem] overflow-hidden border-none bg-white dark:bg-slate-950 relative">
            <CardContent className="p-0">
              <div className="relative overflow-hidden cursor-none">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="w-full touch-none transition-opacity duration-300"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!isDrawing && (
                  <div
                    className="fixed pointer-events-none rounded-full border border-rose-500/50 bg-rose-500/10 z-[100] transition-transform duration-75"
                    style={{
                      width: `${tool === 'eraser' ? strokeWidth * 2 : strokeWidth}px`,
                      height: `${tool === 'eraser' ? strokeWidth * 2 : strokeWidth}px`,
                      left: 0,
                      top: 0,
                      transform: `translate(calc(var(--mouse-x, 0) - 50%), calc(var(--mouse-y, 0) - 50%))`
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ambient HUD */}
          <div className="absolute bottom-6 left-6 pointer-events-none opacity-40">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase italic">Concentration Active</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 pointer-events-none opacity-40 flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase italic">Nihongo Zen // Whiteboard</span>
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-t border-rose-500/10">
          <div className="flex items-center gap-4">
            <Brain className="w-10 h-10 text-rose-500 opacity-20" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest max-w-sm">
              {t('Drawing memory in progress. Practice glyph construction freely.', 'ব্রেন মেমোরি সিঙ্ক্রোনাইজেশন চলছে। অবাধে অক্ষর বা ড্রয়িং প্র্যাকটিস করুন।')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-4 py-2 rounded-xl font-black italic">PURE MASTERY</Badge>
            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedWriting;
