import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio, AudioButton } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Play, Volume2, Pen, Check, Sparkles, Brain, Zap } from 'lucide-react';
import { HIRAGANA, KATAKANA } from '@/data/JapaneseData';

const KanaHub = () => {
  const { type } = useParams();
  const { progress, settings, markLearned, addXP } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const [activeTab, setActiveTab] = useState(type || 'hiragana');
  const [selectedKana, setSelectedKana] = useState(null);

  // Group kana by category and row for display
  const categorizeKana = (kanaList) => {
    const categories = {
      basic: { groups: {}, order: ['vowel', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'] },
      dakuten: { groups: {}, order: ['g', 'z', 'd', 'b'] },
      handakuten: { groups: {}, order: ['p'] }
    };

    kanaList.forEach(k => {
      let cat = 'basic';
      if (['g', 'z', 'd', 'b'].includes(k.row)) cat = 'dakuten';
      else if (k.row === 'p') cat = 'handakuten';

      if (!categories[cat].groups[k.row]) categories[cat].groups[k.row] = [];
      categories[cat].groups[k.row].push(k);
    });

    return categories;
  };

  const hiraganaCategorized = categorizeKana(HIRAGANA);
  const katakanaCategorized = categorizeKana(KATAKANA);

  const currentCategorized = activeTab === 'hiragana' ? hiraganaCategorized : katakanaCategorized;
  const learnedKey = `${activeTab}Learned`;
  const learnedCount = progress[learnedKey]?.length || 0;
  const totalCount = activeTab === 'hiragana' ? HIRAGANA.length : KATAKANA.length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  const handleKanaClick = (kana) => {
    initializeAudio();
    setSelectedKana(kana);
    speak(kana.char);
  };

  const markAsLearned = (kana) => {
    markLearned(activeTab, kana.char);
    addXP(5);
    playSound('correct');
  };

  const isLearned = (char) => progress[learnedKey]?.includes(char);

  const rowLabels = {
    vowel: 'CORE VOWELS',
    k: 'K-STREAM',
    s: 'S-STREAM',
    t: 'T-STREAM',
    n: 'N-STREAM',
    h: 'H-STREAM',
    m: 'M-STREAM',
    y: 'Y-STREAM',
    r: 'R-STREAM',
    w: 'W-STREAM',
    g: 'G-VOICE',
    z: 'Z-VOICE',
    d: 'D-VOICE',
    b: 'B-VOICE',
    p: 'P-VOICE'
  };

  return (
    <MainLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto">
        {/* Futuristic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-rose-500/10 shadow-2xl">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-500 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/20 rotate-2 md:rotate-3 hover:rotate-0 transition-transform">
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">KANA HUB</h1>
              <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                <span className="text-[8px] md:text-[10px] font-black text-rose-500 tracking-[0.2em] md:tracking-[0.3em] uppercase">Neural Registry</span>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>
          <Link to="/practice/writing" className="w-full md:w-auto">
            <Button className="h-12 md:h-14 w-full px-6 md:px-8 rounded-xl md:rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black italic tracking-tight shadow-xl shadow-rose-500/10 group">
              <Pen className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 group-hover:rotate-12 transition-transform" />
              NEURAL WRITING
            </Button>
          </Link>
        </div>

        {/* Progress Matrix */}
        <Card className="rounded-[2.5rem] border-rose-500/10 bg-slate-900 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black tracking-[0.4em] text-rose-500 uppercase">Synchronization Progress</h3>
                <p className="text-3xl font-black italic tracking-tighter text-white">SYSTEM UPLINK: {progressPercent}%</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black italic tracking-tighter text-rose-500">{learnedCount}</span>
                <span className="text-xl font-bold text-slate-500 italic"> / {totalCount} UNITS</span>
              </div>
            </div>
            <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-rose-500 shadow-[0_0_20px_#f43f5e] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-16 w-full max-w-md mx-auto bg-slate-200/50 dark:bg-slate-950/50 rounded-2xl p-1.5 border border-white/10 backdrop-blur-md mb-10">
            <TabsTrigger value="hiragana" className="h-full rounded-xl font-black italic tracking-tight transition-all data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              HIRAGANA ひらがな
            </TabsTrigger>
            <TabsTrigger value="katakana" className="h-full rounded-xl font-black italic tracking-tight transition-all data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              KATAKANA カタカナ
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-16">
            {/* Basic Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Basic Matrix</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
              </div>
              <div className="space-y-10">
                {currentCategorized.basic.order.map((row) => (
                  <div key={row} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase shrink-0">
                        {rowLabels[row]}
                      </h3>
                      <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-3">
                      {currentCategorized.basic.groups[row]?.map((kana, idx) => {
                        const learned = isLearned(kana.char);
                        const isSelected = selectedKana?.char === kana.char;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleKanaClick(kana)}
                            className={`group relative w-full sm:w-20 h-20 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all duration-300
                              ${isSelected
                                ? 'bg-rose-500 text-white scale-110 shadow-2xl shadow-rose-500/40 z-10'
                                : learned
                                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20'
                                  : 'bg-white/60 dark:bg-slate-900/60 border border-white/10 dark:hover:border-rose-500/50 hover:bg-rose-500/5'
                              }`}
                          >
                            <span className="text-3xl japanese-text font-black drop-shadow-sm">{kana.char}</span>
                            {settings.romajiMode !== 'off' && (
                              <span className={`text-[10px] font-bold tracking-widest uppercase opacity-60 ${isSelected ? 'text-white' : 'text-slate-500'}`}>{kana.romaji}</span>
                            )}
                            {learned && !isSelected && (
                              <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dakuten Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Voiced (Dakuten)</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
              </div>
              <div className="space-y-10">
                {currentCategorized.dakuten.order.map((row) => (
                  <div key={row} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black tracking-[0.3em] text-cyan-500 uppercase shrink-0">
                        {rowLabels[row]}
                      </h3>
                      <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-3">
                      {currentCategorized.dakuten.groups[row]?.map((kana, idx) => {
                        const learned = isLearned(kana.char);
                        const isSelected = selectedKana?.char === kana.char;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleKanaClick(kana)}
                            className={`group relative w-full sm:w-20 h-20 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all duration-300
                              ${isSelected
                                ? 'bg-cyan-500 text-white scale-110 shadow-2xl shadow-cyan-500/40 z-10'
                                : learned
                                  ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500/20'
                                  : 'bg-white/60 dark:bg-slate-900/60 border border-white/10 dark:hover:border-cyan-500/50 hover:bg-cyan-500/5'
                              }`}
                          >
                            <span className="text-3xl japanese-text font-black drop-shadow-sm">{kana.char}</span>
                            {settings.romajiMode !== 'off' && (
                              <span className={`text-[10px] font-bold tracking-widest uppercase opacity-60 ${isSelected ? 'text-white' : 'text-slate-500'}`}>{kana.romaji}</span>
                            )}
                            {learned && !isSelected && (
                              <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Handakuten Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">P-Sound (Handakuten)</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
              </div>
              <div className="space-y-10">
                {currentCategorized.handakuten.order.map((row) => (
                  <div key={row} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase shrink-0">
                        {rowLabels[row]}
                      </h3>
                      <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-3">
                      {currentCategorized.handakuten.groups[row]?.map((kana, idx) => {
                        const learned = isLearned(kana.char);
                        const isSelected = selectedKana?.char === kana.char;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleKanaClick(kana)}
                            className={`group relative w-full sm:w-20 h-20 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center transition-all duration-300
                              ${isSelected
                                ? 'bg-amber-500 text-white scale-110 shadow-2xl shadow-amber-500/40 z-10'
                                : learned
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20'
                                  : 'bg-white/60 dark:bg-slate-900/60 border border-white/10 dark:hover:border-amber-500/50 hover:bg-amber-500/5'
                              }`}
                          >
                            <span className="text-3xl japanese-text font-black drop-shadow-sm">{kana.char}</span>
                            {settings.romajiMode !== 'off' && (
                              <span className={`text-[10px] font-bold tracking-widest uppercase opacity-60 ${isSelected ? 'text-white' : 'text-slate-500'}`}>{kana.romaji}</span>
                            )}
                            {learned && !isSelected && (
                              <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Detailed Neural Viewer */}
        {selectedKana && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-sm rounded-[3rem] bg-white dark:bg-slate-900 border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.2)] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
              <CardContent className="p-10 text-center space-y-8">
                <div className="space-y-2">
                  <div className="text-9xl font-black japanese-text text-slate-900 dark:text-white drop-shadow-2xl">{selectedKana.char}</div>
                  <div className="inline-block px-6 py-2 bg-rose-500 text-white rounded-full font-black tracking-[0.2em] uppercase text-xl shadow-lg shadow-rose-500/20">
                    {selectedKana.romaji}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    className={`h-16 rounded-2xl font-black italic tracking-tighter text-lg shadow-xl shadow-rose-500/10 ${isLearned(selectedKana.char) ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}
                    onClick={() => markAsLearned(selectedKana)}
                    disabled={isLearned(selectedKana.char)}
                  >
                    {isLearned(selectedKana.char) ? (
                      <><Check className="w-6 h-6 mr-3" /> UNIT SYNCED</>
                    ) : (
                      <><Zap className="w-6 h-6 mr-3 animate-pulse" /> SYNC UNIT +5 XP</>
                    )}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-14 rounded-2xl font-bold border-rose-500/10 text-rose-500 hover:bg-rose-500/5"
                      onClick={() => speak(selectedKana.char)}
                    >
                      <Volume2 className="w-5 h-5 mr-2" /> REPLAY
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-14 rounded-2xl font-bold text-slate-400 hover:text-slate-600"
                      onClick={() => setSelectedKana(null)}
                    >
                      DISMISS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Neural Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
          <Link to="/quiz/kana" className="block group">
            <Card className="rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-rose-500/10 p-8 hover:border-rose-500/50 transition-all hover:translate-y-[-4px] shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <Play className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter">NEURAL QUIZ</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verify unit retention</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/practice/writing" className="block group">
            <Card className="rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-rose-500/10 p-8 hover:border-amber-500/50 transition-all hover:translate-y-[-4px] shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Pen className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter">MOTOR SYNC</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Master unit writing</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default KanaHub;
