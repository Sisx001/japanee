import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen, Volume2, Search, Check, Play,
  X, Sparkles, Languages, Info, BookText,
  Shapes, Zap, GraduationCap
} from 'lucide-react';
import { COMBINED_GRAMMAR } from '@/data/JapaneseData';

const GrammarHub = () => {
  const { progress, settings, markLearned, addXP } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [displayCount, setDisplayCount] = useState(80);

  const currentGrammar = COMBINED_GRAMMAR;

  const filteredGrammar = useMemo(() => {
    return currentGrammar.filter(pattern => {
      const q = searchQuery.toLowerCase();
      return q === '' ||
        pattern.pattern.toLowerCase().includes(q) ||
        pattern.meaning.toLowerCase().includes(q) ||
        (pattern.bn && pattern.bn.toLowerCase().includes(q)) ||
        (pattern.explanation && pattern.explanation.toLowerCase().includes(q)) ||
        (pattern.level && pattern.level.toLowerCase().includes(q));
    });
  }, [currentGrammar, searchQuery]);

  const learnedCount = useMemo(() => {
    return currentGrammar.filter(g => progress.grammarLearned?.includes(g.pattern)).length;
  }, [currentGrammar, progress.grammarLearned]);

  const totalCount = currentGrammar.length;

  const handlePatternClick = (pattern) => {
    initializeAudio();
    setSelectedPattern(pattern);
    speak(pattern.pattern.replace('〜', ''));
  };

  const markAsLearned = (pattern) => {
    markLearned('grammar', pattern.pattern);
    addXP(15);
    playSound('correct');
  };

  const isLearned = (pattern) => progress.grammarLearned?.includes(pattern);

  return (
    <MainLayout>
      <div className="space-y-8 pb-32 max-w-7xl mx-auto px-4">
        {/* Zen Header - More Compact */}
        <div className="relative pt-4 pb-1">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Shapes className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-0">
              <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
                Zen Grammar
              </h1>
              <p className="text-[8px] md:text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase">
                {learnedCount}/{totalCount} MASTERED • UNIFIED VOLUME
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar - Compact */}
        <div className="sticky top-20 z-30 pb-2">
          <div className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 dark:border-slate-800/50 shadow-xl max-w-xl mx-auto">
            <div className="relative group flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-blue-500/60 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search grammar or level (N5, N4)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 bg-transparent border-none font-medium text-sm placeholder:text-slate-400 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Grammar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGrammar.slice(0, displayCount).map((p, idx) => {
            const learned = progress.grammarLearned?.includes(p.pattern);
            return (
              <Card
                key={idx}
                className={`group rounded-[2.5rem] cursor-pointer transition-all duration-500 relative overflow-hidden flex flex-col p-8 border-0
                  ${learned
                    ? 'bg-blue-600/10 hover:bg-blue-600/20 border-blue-500/10'
                    : 'bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-sm hover:shadow-2xl hover:-translate-y-1'
                  }`}
                onClick={() => handlePatternClick(p)}
              >
                {/* Level Badge */}
                <div className="absolute top-6 left-6 flex gap-1 items-center">
                  {learned ? (
                    <div className="bg-blue-500 p-1.5 rounded-full shadow-lg shadow-blue-500/20">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 border-blue-500/20 text-blue-600 font-black">
                      {p.level}
                    </Badge>
                  )}
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>

                <div className="space-y-1 flex-1 mt-2">
                  <span className="text-2xl md:text-3xl font-black japanese-text text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-tight">{p.pattern}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-500/5 w-full">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 italic line-clamp-2 uppercase leading-snug">
                    {settings.languagePreference === 'bn' ? (p.bn || p.meaning) : p.meaning}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredGrammar.length > displayCount && (
          <div className="flex justify-center pt-10">
            <Button
              className="h-16 px-12 rounded-[2rem] bg-slate-900 text-white font-black italic tracking-[0.2em] hover:bg-blue-600 hover:scale-105 transition-all shadow-2xl"
              onClick={() => setDisplayCount(prev => prev + 50)}
            >
              UNRAVEL MORE ({filteredGrammar.length - displayCount} REMAINING)
            </Button>
          </div>
        )}

        {/* Zen Insight Panel (Refined Modal) */}
        {selectedPattern && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-0 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm z-10"
                onClick={() => setSelectedPattern(null)}
              >
                <X className="w-4 h-4" />
              </button>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Visual Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-blue-500 tracking-[0.3em] uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-3 h-3" /> Grammar Construct
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black japanese-text text-slate-900 dark:text-white uppercase italic tracking-tighter">{selectedPattern.pattern}</h2>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic uppercase tracking-widest">{selectedPattern.level} Level</Badge>
                    </div>
                  </div>
                  <Button
                    className="h-12 w-12 rounded-2xl bg-blue-600 text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                    onClick={() => speak(selectedPattern.pattern.replace('〜', ''))}
                  >
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </div>

                {/* Main Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                    <div className="flex items-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
                      <Languages className="w-3 h-3" /> Core Meaning
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white uppercase font-serif italic leading-tight">{selectedPattern.meaning}</p>
                    {selectedPattern.bn && (
                      <p className="text-lg font-black text-blue-500/60 leading-tight italic pt-2 border-t border-slate-200 dark:border-slate-700">{selectedPattern.bn}</p>
                    )}
                  </div>
                  <div className="p-6 rounded-3xl bg-blue-600/5 space-y-2 border border-blue-500/10">
                    <div className="flex items-center gap-2 text-blue-500 text-[9px] font-black uppercase tracking-widest">
                      <Info className="w-3 h-3" /> Logic Flow
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      {selectedPattern.explanation || "Essential construct for natural Japanese flow."}
                    </p>
                  </div>
                </div>

                {/* Examples Section */}
                {selectedPattern.examples?.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-blue-500 rounded-full" />
                      <h3 className="text-sm font-black tracking-tighter uppercase italic flex items-center gap-1.5">
                        <BookText className="w-4 h-4 text-blue-500" /> Syntactic Flow
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {selectedPattern.examples.map((ex, i) => (
                        <div key={i} className="group p-5 rounded-3xl bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5">
                              <p className="text-lg font-bold japanese-text group-hover:text-blue-500 transition-colors">{ex.jp}</p>
                              <div className="flex flex-wrap gap-2 text-[9px] font-black italic tracking-widest uppercase text-slate-400">
                                <span>{ex.romaji}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
                                {settings.languagePreference === 'bn' ? (ex.bn || ex.en) : ex.en}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all bg-blue-500/5 text-blue-600"
                              onClick={() => speak(ex.jp)}
                            >
                              <Volume2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    className={`flex-1 h-12 rounded-2xl text-sm font-black italic tracking-tighter shadow-xl transition-all
                      ${isLearned(selectedPattern.pattern)
                        ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]'
                      }`}
                    onClick={() => !isLearned(selectedPattern.pattern) && markAsLearned(selectedPattern)}
                  >
                    {isLearned(selectedPattern.pattern) ? (
                      <div className="flex items-center gap-2"><Check className="w-5 h-5" /> MASTERED</div>
                    ) : (
                      <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-pulse" /> MASTER +15 XP</div>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 px-6 rounded-2xl text-xs font-bold text-slate-400 hover:text-blue-500"
                    onClick={() => setSelectedPattern(null)}
                  >
                    CLOSE
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GrammarHub;
