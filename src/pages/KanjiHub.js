import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio, AudioButton } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  FileText, Volume2, Search, Check, Play, ChevronRight, Brush, BookOpen, Activity, Info
} from 'lucide-react';
import { N5_KANJI, N4_KANJI } from '@/data/JapaneseData';

const KanjiHub = () => {
  const { progress, settings, markLearned, addXP } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeLevel, setActiveLevel] = useState('N5');
  const [selectedKanji, setSelectedKanji] = useState(null);

  const kanjiList = activeLevel === 'N5' ? N5_KANJI : N4_KANJI;

  // Filter kanji
  const filteredKanji = useMemo(() => {
    if (!searchQuery) return kanjiList;

    return kanjiList.filter(k =>
      k.kanji.includes(searchQuery) ||
      k.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.onyomi?.includes(searchQuery) ||
      k.kunyomi?.includes(searchQuery)
    );
  }, [searchQuery, kanjiList]);

  const learnedCount = progress.kanjiLearned?.length || 0;
  const totalCount = N5_KANJI.length + N4_KANJI.length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  const handleKanjiClick = (kanji) => {
    initializeAudio();
    setSelectedKanji(kanji);
    speak(kanji.kanji);
  };

  const markAsLearned = (kanji) => {
    markLearned('kanji', kanji.kanji);
    addXP(15);
    playSound('correct');
  };

  const isLearned = (kanji) => progress.kanjiLearned?.includes(kanji);

  return (
    <MainLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto">
        {/* Futuristic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-rose-500/10 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-500/10 -rotate-3 hover:rotate-0 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Kanji Hub</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase">Visual Character Mastery</span>
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              </div>
            </div>
          </div>
          <Link to="/quiz/kanji">
            <Button className="h-14 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black italic tracking-tight shadow-xl shadow-rose-500/10 group">
              <Play className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" />
              START ASSESSMENT
            </Button>
          </Link>
        </div>

        {/* Progress Matrix */}
        <Card className="rounded-[2.5rem] border-rose-500/10 bg-slate-950 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black tracking-[0.4em] text-rose-400 uppercase">Mastery Progress</h3>
                <p className="text-3xl font-black italic tracking-tighter text-white uppercase">Learning Path: {progressPercent}%</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black italic tracking-tighter text-rose-500">{learnedCount}</span>
                <span className="text-xl font-bold text-slate-500 italic uppercase"> / {totalCount} Kanji</span>
              </div>
            </div>
            <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_20px_#f43f5e] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Control Panel */}
          <div className="w-full md:w-64 space-y-6 shrink-0">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-4 rounded-[2rem] border border-rose-500/10 shadow-xl">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase mb-4 px-2">Knowledge Level</h3>
              <Tabs value={activeLevel} onValueChange={setActiveLevel} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl p-1 h-12">
                  <TabsTrigger value="N5" className="rounded-lg font-black italic h-full data-[state=active]:bg-rose-600 data-[state=active]:text-white">N5</TabsTrigger>
                  <TabsTrigger value="N4" className="rounded-lg font-black italic h-full data-[state=active]:bg-rose-600 data-[state=active]:text-white">N4</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-4 rounded-[2rem] border border-rose-500/10 shadow-xl">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase mb-4 px-2">Rapid Search</h3>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <Input
                  placeholder="Search Kanji..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 pr-4 bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl font-bold placeholder:text-slate-400 text-sm focus-visible:ring-1 focus-visible:ring-rose-500/50"
                />
              </div>
            </div>
          </div>

          {/* Neural Matrix Grid */}
          <div className="flex-1 w-full bg-white/20 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-rose-500/10 shadow-xl min-h-[600px]">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {filteredKanji.map((kanji, idx) => {
                const learned = isLearned(kanji.kanji);
                const isSelected = selectedKanji?.kanji === kanji.kanji;

                return (
                  <button
                    key={idx}
                    onClick={() => handleKanjiClick(kanji)}
                    className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                                ${isSelected
                        ? 'bg-rose-600 text-white scale-110 shadow-2xl shadow-rose-500/40 z-10'
                        : learned
                          ? 'bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20'
                          : 'bg-white/60 dark:bg-slate-800/40 border border-white/5 dark:hover:border-rose-500/50 hover:bg-rose-500/5'
                      }`}
                  >
                    <span className="text-3xl japanese-text font-black drop-shadow-sm">{kanji.kanji}</span>
                    {learned && !isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]" />
                      </div>
                    )}
                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-rose-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity pointer-events-none" />
                  </button>
                );
              })}
            </div>
            {filteredKanji.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                <Activity className="w-12 h-12 mb-4 opacity-20 animate-pulse" />
                <p className="font-black italic uppercase tracking-widest opacity-40 text-sm">No Glyphs Located</p>
              </div>
            )}
          </div>
        </div>

        {/* Neural Analysis Panel */}
        {selectedKanji && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <Card className="w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] bg-white dark:bg-slate-950 border-rose-500/20 shadow-[0_0_80px_rgba(244,63,94,0.15)] relative my-auto overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
              <CardContent className="p-5 md:p-10">
                <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-center md:items-start mb-6 md:mb-10">
                  <div className="relative group text-center md:text-left">
                    <div className="text-7xl md:text-[12rem] font-black japanese-text leading-none text-slate-900 dark:text-white drop-shadow-[0_0_30px_rgba(244,63,94,0.2)]">{selectedKanji.kanji}</div>
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 bg-rose-600 hover:bg-rose-600 text-white px-4 py-1 rounded-lg font-black italic">{selectedKanji.level}</Badge>
                  </div>

                  <div className="flex-1 space-y-3 md:space-y-6 text-center md:text-left pt-1 md:pt-6">
                    <div>
                      <h3 className="text-[10px] font-black tracking-[0.4em] text-rose-400 uppercase mb-1 md:mb-2 italic">Meaning</h3>
                      <p className="text-xl md:text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
                        {settings.languagePreference === 'bn' ? (selectedKanji.bn || selectedKanji.meaning) : selectedKanji.meaning.toUpperCase()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic">On-Reading</span>
                        <p className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-300 japanese-text break-words">{selectedKanji.onyomi || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic">Kun-Reading</span>
                        <p className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-300 japanese-text break-words">{selectedKanji.kunyomi || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedKanji.examples?.length > 0 && (
                  <div className="mb-6 md:mb-10 space-y-3 md:space-y-4">
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic">Vocabulary Context</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedKanji.examples.slice(0, 6).map((ex, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 md:p-4 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-rose-500/10 transition-colors cursor-pointer group/item"
                          onClick={(e) => { e.stopPropagation(); speak(ex.word); }}
                        >
                          <div className="text-left">
                            <p className="font-bold text-rose-500 japanese-text">{ex.word}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{ex.reading}</p>
                          </div>
                          <Volume2 className="w-4 h-4 text-slate-400 group-hover/item:text-rose-500 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 md:gap-3">
                  <Button
                    className={`h-14 md:h-16 rounded-[1.5rem] md:rounded-[2rem] font-black italic tracking-tighter text-base md:text-lg shadow-2xl ${isLearned(selectedKanji.kanji) ? 'bg-slate-200 dark:bg-white/5 text-slate-400' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'}`}
                    onClick={() => markAsLearned(selectedKanji)}
                    disabled={isLearned(selectedKanji.kanji)}
                  >
                    {isLearned(selectedKanji.kanji) ? (
                      <><Check className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" /> SYNCED</>
                    ) : (
                      <><Check className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-pulse" /> MARK LEARNED +15 XP</>
                    )}
                  </Button>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <Button
                      variant="outline"
                      className="h-10 md:h-14 rounded-xl md:rounded-2xl font-bold border-rose-500/20 text-rose-500 hover:bg-rose-500/5 transition-all text-xs md:text-sm"
                      onClick={() => speak(selectedKanji.kanji)}
                    >
                      <Volume2 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> PRONOUNCE
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-10 md:h-14 rounded-xl md:rounded-2xl font-bold text-rose-500 hover:text-rose-600 text-xs md:text-sm"
                      onClick={() => setSelectedKanji(null)}
                    >
                      CLOSE
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Neural Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
          <Link to="/practice/whiteboard" className="block group">
            <Card className="rounded-[2.5rem] bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl border-rose-500/10 p-10 hover:border-rose-500/50 transition-all hover:translate-y-[-4px] shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-8 relative z-10 text-slate-900 dark:text-white">
                <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center text-white transition-all shadow-xl shadow-rose-500/20">
                  <Brush className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">Zen Whiteboard</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] italic">Freeform character training</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/quiz/kanji" className="block group">
            <Card className="rounded-[2.5rem] bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl border-rose-500/10 p-10 hover:border-indigo-500/50 transition-all hover:translate-y-[-4px] shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-8 relative z-10 text-slate-900 dark:text-white">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white transition-all shadow-xl shadow-indigo-500/20">
                  <Play className="w-10 h-10 ml-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">Mastery Test</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] italic">Knowledge verification</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default KanjiHub;
