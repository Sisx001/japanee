import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronRight, ChevronLeft, RotateCcw, Volume2, Check,
  Trash2, Pen, Eye, EyeOff, Sparkles, Undo2
} from 'lucide-react';
import { HIRAGANA, KATAKANA } from '@/data/JapaneseData';

const WritingPractice = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { progress, markLearned, addXP, settings } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState(type || 'hiragana');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);

  const kanaList = activeTab === 'hiragana' ? HIRAGANA.slice(0, 46) : KATAKANA.slice(0, 46);
  const currentKana = kanaList[currentIndex];

  // Draw guide character
  const drawGuide = useCallback((ctx, width, height) => {
    if (!showGuide || !currentKana) return;

    ctx.save();
    ctx.font = 'bold 180px "Inter", sans-serif';
    ctx.fillStyle = settings?.theme === 'dark' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.05)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentKana.char, width / 2, height / 2);
    ctx.restore();
  }, [showGuide, currentKana, settings?.theme]);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw guide
    drawGuide(ctx, canvas.width, canvas.height);

    // Redraw strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#f43f5e'; // Rose 500

    // Add neon glow to lines
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';

    strokes.forEach(stroke => {
      if (stroke.length > 0) {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        stroke.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });

    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      currentStroke.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [strokes, currentStroke, drawGuide]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Clear canvas
  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  // Undo last stroke
  const undo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  // Get position from event
  const getPosition = (e) => {
    const canvas = canvasRef.current;
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

  // Drawing handlers
  const startDrawing = (e) => {
    e.preventDefault();
    initializeAudio();
    setIsDrawing(true);
    const pos = getPosition(e);
    setCurrentStroke([pos]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPosition(e);
    setCurrentStroke(prev => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  // Navigation
  const goToNext = () => {
    if (currentIndex < kanaList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      clearCanvas();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      clearCanvas();
    }
  };

  // Mark as practiced
  const markPracticed = () => {
    if (currentKana) {
      markLearned(activeTab, currentKana.char);
      addXP(5);
      playSound('correct');
    }
  };

  const speakKana = () => {
    initializeAudio();
    if (currentKana) {
      speak(currentKana.char);
    }
  };

  const isPracticed = progress[`${activeTab}Learned`]?.includes(currentKana?.char);

  return (
    <MainLayout>
      <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Traditional Header */}
        <div className="flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-rose-500/10 p-6 rounded-[2rem] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Pen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t('Shodo Practice', 'শোদো প্র্যাকটিস')}</h1>
              <p className="text-[10px] font-bold text-rose-500/60 tracking-widest uppercase">{activeTab} // PRACTICE ACTIVE</p>
            </div>
          </div>
          <Badge variant="outline" className="h-8 rounded-xl px-4 font-black border-rose-500/20 text-rose-500">
            {currentIndex + 1} / {kanaList.length} UNITS
          </Badge>
        </div>

        {/* Tabs - Traditional */}
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setCurrentIndex(0); clearCanvas(); }}>
          <TabsList className="h-14 w-full bg-slate-200/50 dark:bg-slate-950/50 rounded-2xl p-1.5 border border-white/10 backdrop-blur-md">
            <TabsTrigger value="hiragana" className="h-full rounded-xl font-black transition-all data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
              {t('HIRAGANA', 'হিরাগানা')}
            </TabsTrigger>
            <TabsTrigger value="katakana" className="h-full rounded-xl font-black transition-all data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg">
              {t('KATAKANA', 'কাতাকানা')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Ink Practice Area */}
        {currentKana && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

            {/* Left Info Panel */}
            <div className="md:col-span-4 space-y-4">
              <Card className="rounded-[2rem] overflow-hidden border-rose-500/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
                <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                  <div className="text-8xl font-black japanese-text text-slate-900 dark:text-white drop-shadow-2xl">{currentKana.char}</div>
                  {showRomaji && (
                    <div className="px-4 py-1 bg-rose-500/10 text-rose-500 rounded-full font-black tracking-widest uppercase text-sm">
                      {currentKana.romaji}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-12 h-12 hover:bg-rose-500/10 text-rose-500"
                    onClick={speakKana}
                  >
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className={`h-14 rounded-2xl justify-start px-6 font-bold border border-rose-500/5 ${showGuide ? 'bg-rose-500 text-white' : 'bg-white/40 dark:bg-slate-900/40'}`}
                  onClick={() => setShowGuide(!showGuide)}
                >
                  {showGuide ? <EyeOff className="w-5 h-5 mr-3" /> : <Eye className="w-5 h-5 mr-3" />}
                  {showGuide ? 'HIDE KANA HUD' : 'SHOW KANA HUD'}
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl justify-start px-6 font-bold bg-white/40 dark:bg-slate-900/40 border-rose-500/5 hover:bg-rose-500/10 hover:text-rose-500"
                  onClick={() => setShowRomaji(!showRomaji)}
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  TOGGLE ROMAJI
                </Button>
              </div>
            </div>

            {/* Right Canvas Panel */}
            <Card className="md:col-span-8 rounded-[2.5rem] overflow-hidden border-rose-500/10 bg-slate-950 shadow-2xl relative shadow-rose-500/5">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="w-full h-full cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />

                  {/* Grid Hud */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-rose-500" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rose-500" />
                  </div>

                  {/* Control Overlays */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                      onClick={undo}
                      disabled={strokes.length === 0}
                      title="Undo Stroke"
                    >
                      <Undo2 className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white hover:bg-red-500 hover:text-white transition-all shadow-xl"
                      onClick={clearCanvas}
                      title="Clear Canvas"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="h-16 w-16 rounded-2xl bg-white/40 dark:bg-slate-900/40 border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shrink-0 shadow-lg"
            onClick={goToPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            className={`h-16 rounded-2xl flex-1 font-black text-lg transition-all duration-500 shadow-xl ${isPracticed ? 'bg-green-500 shadow-green-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}
            onClick={markPracticed}
          >
            {isPracticed ? (
              <>
                <Check className="w-6 h-6 mr-3" />
                UNIT MASTERED
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                {t('PRACTICE PROGRESS +5 XP', 'প্র্যাকটিস প্রগ্রেস +৫ XP')}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="h-16 w-16 rounded-2xl bg-white/40 dark:bg-slate-900/40 border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shrink-0 shadow-lg"
            onClick={goToNext}
            disabled={currentIndex === kanaList.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Mastery Matrix */}
        <Card className="rounded-[2.5rem] border-rose-500/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          <CardHeader className="p-8 border-b border-rose-500/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-black tracking-[0.3em] text-rose-500 uppercase">
                Mastery Progress Matrix // {activeTab}
              </CardTitle>
              <div className="text-xs font-black text-muted-foreground">
                {progress[`${activeTab}Learned`]?.length || 0} / 46 KANA MASTERED
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-x-2 gap-y-3">
              {kanaList.map((kana, idx) => {
                const isLearned = progress[`${activeTab}Learned`]?.includes(kana.char);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={idx}
                    className={`aspect-square rounded-xl text-lg font-bold japanese-text flex items-center justify-center transition-all duration-300 ${isCurrent
                      ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-110 z-10'
                      : isLearned
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20'
                        : 'bg-slate-200/50 dark:bg-slate-950/50 text-slate-400 border border-white/5 hover:border-rose-500/30 font-medium'
                      }`}
                    onClick={() => { setCurrentIndex(idx); clearCanvas(); }}
                  >
                    {kana.char}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WritingPractice;
