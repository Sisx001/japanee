import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Filter, LayoutGrid, Activity, Zap, Compass,
  Apple, MapPin, Clock, Users, Box,
  Leaf, Heart, MessageSquare, Palette,
  Cpu, Stethoscope, Briefcase, GraduationCap, Brush, Dumbbell, Shirt, Smile, MoreHorizontal
} from 'lucide-react';
import { ZEN_LEXICON, MASSIVE_SENTENCES } from '@/data/JapaneseData';

const VocabHub = () => {
  const { progress, settings, markLearned, addXP } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWord, setSelectedWord] = useState(null);
  const [displayCount, setDisplayCount] = useState(105);
  const [showCategoryHub, setShowCategoryHub] = useState(false);

  const currentVocab = ZEN_LEXICON;

  const categories = useMemo(() => {
    return ['all', ...new Set(currentVocab.map(v => v.category).filter(Boolean))];
  }, [currentVocab]);

  const filteredVocab = useMemo(() => {
    return currentVocab.filter(word => {
      const q = searchQuery.toLowerCase();

      // Support searching by kanji, kana, romaji, or meanings
      const matchesSearch = q === '' ||
        (word.kanji && word.kanji.toLowerCase().includes(q)) ||
        (word.word && word.word.toLowerCase().includes(q)) ||
        (word.kana && word.kana.toLowerCase().includes(q)) ||
        (word.romaji && word.romaji.toLowerCase().includes(q)) ||
        (word.en && word.en.toLowerCase().includes(q)) ||
        (word.bn && word.bn.toLowerCase().includes(q)) ||
        (word.level && word.level.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' ||
        (word.category && word.category.toLowerCase().startsWith(selectedCategory.toLowerCase().slice(0, 4)));
      return matchesSearch && matchesCategory;
    });
  }, [currentVocab, searchQuery, selectedCategory]);

  // Find examples for the selected word
  const wordExamples = useMemo(() => {
    if (!selectedWord) return [];
    const searchStr = selectedWord.word || selectedWord.kanji || selectedWord.kana;
    return MASSIVE_SENTENCES.filter(s =>
      s.jp.includes(searchStr)
    ).slice(0, 3);
  }, [selectedWord]);

  const learnedCount = useMemo(() => {
    return currentVocab.filter(v => progress.vocabLearned?.includes(v.word || v.kanji || v.kana)).length;
  }, [currentVocab, progress.vocabLearned]);

  const totalCount = currentVocab.length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  const handleWordClick = (word) => {
    initializeAudio();
    setSelectedWord(word);
    speak(word.word || word.kanji || word.kana);
  };

  const markAsLearned = (word) => {
    const wordKey = word.word || word.kanji || word.kana;
    markLearned('vocab', wordKey);
    addXP(10);
    playSound('correct');
  };

  const isLearned = (word) => progress.vocabLearned?.includes(word);

  const categoryConfig = {
    all: { label: 'All Units', icon: LayoutGrid, color: 'text-emerald-500' },
    verbs: { label: 'Actions', icon: Activity, color: 'text-blue-500' },
    adjectives: { label: 'Qualities', icon: Zap, color: 'text-amber-500' },
    food: { label: 'Cuisine', icon: Apple, color: 'text-rose-500' },
    place: { label: 'Locations', icon: MapPin, color: 'text-cyan-500' },
    time: { label: 'Chronos', icon: Clock, color: 'text-indigo-500' },
    people: { label: 'Society', icon: Users, color: 'text-violet-500' },
    objects: { label: 'Artifacts', icon: Box, color: 'text-slate-500' },
    nature: { label: 'Elements', icon: Leaf, color: 'text-green-500' },
    family: { label: 'Kinship', icon: Heart, color: 'text-pink-500' },
    expressions: { label: 'Phrases', icon: MessageSquare, color: 'text-teal-500' },
    body: { label: 'Anatomy', icon: Activity, color: 'text-orange-500' },
    colors: { label: 'Spectrum', icon: Palette, color: 'text-purple-500' },
    digital: { label: 'Digital', icon: Cpu, color: 'text-blue-400' },
    medical: { label: 'Medical', icon: Stethoscope, color: 'text-red-400' },
    business: { label: 'Business', icon: Briefcase, color: 'text-amber-700' },
    academic: { label: 'Academic', icon: GraduationCap, color: 'text-slate-700' },
    arts: { label: 'Arts', icon: Brush, color: 'text-pink-400' },
    sports: { label: 'Sports', icon: Dumbbell, color: 'text-emerald-400' },
    clothing: { label: 'Fashion', icon: Shirt, color: 'text-orange-300' },
    emotions: { label: 'Feelings', icon: Smile, color: 'text-yellow-400' },
    others: { label: 'General', icon: MoreHorizontal, color: 'text-slate-400' }
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-32 max-w-7xl mx-auto px-4">
        {/* Zen Header - More Compact */}
        <div className="relative pt-4 pb-1">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 rotate-3 hover:rotate-0 transition-transform duration-500">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-0">
              <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
                Zen Lexicon
              </h1>
              <p className="text-[8px] md:text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase">
                {learnedCount}/{totalCount} MASTERED • UNIFIED VOLUME
              </p>
            </div>
          </div>
        </div>

        {/* Zen Search & Category Hub Trigger */}
        <div className="sticky top-20 z-30 pb-2">
          <div className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 dark:border-slate-800/50 shadow-xl max-w-2xl mx-auto">
            <div className="relative group flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-emerald-500/60 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Search 5,000+ words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 bg-transparent border-none font-medium text-sm placeholder:text-slate-400 focus-visible:ring-0"
              />
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
              <Button
                variant="ghost"
                onClick={() => setShowCategoryHub(true)}
                className="h-9 px-3 gap-2 hover:bg-emerald-500/10 text-emerald-600 rounded-xl transition-all"
              >
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
                  {categoryConfig[selectedCategory]?.label || 'Categories'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {showCategoryHub && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
            onClick={() => setShowCategoryHub(false)}
          >
            <div
              className="w-[95%] max-w-xl max-h-[85vh] rounded-[2.5rem] bg-white dark:bg-slate-900 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 premium-gradient opacity-[0.05] pointer-events-none" />

              {/* Header with Close */}
              <div className="p-6 md:p-10 pb-2 flex justify-between items-start relative z-10 shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase">Context Hub</span>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Categories</h2>
                </div>
                <button
                  className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95"
                  onClick={() => setShowCategoryHub(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 md:p-10 pt-2 relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
                  {categories.map(cat => {
                    const config = categoryConfig[cat] || { label: cat, icon: LayoutGrid, color: 'text-slate-500' };
                    const Icon = config.icon;
                    const active = selectedCategory === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryHub(false);
                        }}
                        className={`group p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all duration-300 border cursor-pointer
                          ${active
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl scale-[1.02]'
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                          ${active ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 shadow-inner'}`}>
                          <Icon className={`w-6 h-6 ${active ? 'text-white' : config.color}`} />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-wider ${active ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                          {config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Word Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredVocab.slice(0, displayCount).map((word, idx) => {
            const learned = progress.vocabLearned?.includes(word.word || word.kanji || word.kana);
            const wordDisplay = word.word || word.kanji || word.kana;
            const readingDisplay = word.reading || word.kana;

            return (
              <Card
                key={idx}
                className={`group rounded-[2rem] cursor-pointer transition-all duration-500 relative overflow-hidden aspect-square flex flex-col items-center justify-center text-center p-6 border-0
                  ${learned
                    ? 'bg-emerald-600/10 hover:bg-emerald-600/20'
                    : 'bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-sm hover:shadow-2xl hover:-translate-y-1'
                  }`}
                onClick={() => handleWordClick(word)}
              >
                {/* Level Badge */}
                <div className="absolute top-4 left-4 flex gap-1 items-center">
                  {learned ? (
                    <div className="bg-emerald-500 p-1 rounded-full shadow-lg shadow-emerald-500/20">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-[8px] px-1.5 py-0 border-emerald-500/20 text-emerald-600 font-black">
                      {word.level}
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <Info className="w-5 h-5 text-emerald-500" />
                </div>

                <div className="space-y-1">
                  <span className="text-3xl md:text-4xl font-black japanese-text text-slate-900 dark:text-white line-clamp-1">{wordDisplay}</span>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic line-clamp-1">{readingDisplay}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredVocab.length > displayCount && (
          <div className="flex justify-center pt-10">
            <Button
              className="h-16 px-12 rounded-[2rem] bg-slate-900 text-white font-black italic tracking-[0.2em] hover:bg-emerald-600 hover:scale-105 transition-all shadow-2xl"
              onClick={() => setDisplayCount(prev => prev + 100)}
            >
              DESCEND DEEPER ({filteredVocab.length - displayCount} REMAINING)
            </Button>
          </div>
        )}

        {/* Zen Insight Panel (Refined Modal) */}
        {selectedWord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-0 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm z-10"
                onClick={() => setSelectedWord(null)}
              >
                <X className="w-4 h-4" />
              </button>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Visual Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-emerald-500 tracking-[0.3em] uppercase">Lexicon Entry</span>
                    <h2 className="text-4xl md:text-5xl font-black japanese-text text-slate-900 dark:text-white">{selectedWord.kanji || selectedWord.kana}</h2>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-black italic uppercase tracking-widest">{selectedWord.reading}</Badge>
                      <span className="text-slate-400 text-xs font-bold italic">({selectedWord.romaji})</span>
                    </div>
                  </div>
                  <Button
                    className="h-12 w-12 rounded-2xl bg-emerald-600 text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                    onClick={() => speak(selectedWord.kanji || selectedWord.kana)}
                  >
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </div>

                {/* Meanings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                    <div className="flex items-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
                      <Languages className="w-3 h-3" /> English
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white uppercase font-serif italic">{selectedWord.en}</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-emerald-600/5 space-y-2 border border-emerald-500/10">
                    <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" /> Bengali
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white italic">{selectedWord.bn || '---'}</p>
                  </div>
                </div>

                {/* Examples Section */}
                {wordExamples.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-emerald-500 rounded-full" />
                      <h3 className="text-sm font-black tracking-tighter uppercase italic flex items-center gap-1.5">
                        <BookText className="w-4 h-4 text-emerald-500" /> Usage Flow
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {wordExamples.map((ex, i) => (
                        <div key={i} className="group p-4 rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-base font-bold japanese-text">{ex.jp}</p>
                              <p className="text-[9px] font-bold text-slate-400 italic uppercase tracking-widest">{ex.romaji}</p>
                              <p className="text-xs font-medium text-slate-500">
                                {settings.languagePreference === 'bn' ? (ex.bn || ex.en) : ex.en}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => speak(ex.jp)}
                            >
                              <Volume2 className="w-4 h-4" />
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
                      ${isLearned(selectedWord.word)
                        ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]'
                      }`}
                    onClick={() => !isLearned(selectedWord.kanji || selectedWord.kana) && markAsLearned(selectedWord)}
                  >
                    {isLearned(selectedWord.kanji || selectedWord.kana) ? (
                      <div className="flex items-center gap-2"><Check className="w-5 h-5" /> MASTERED</div>
                    ) : (
                      <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-pulse" /> MEMORIZE +10 XP</div>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 px-6 rounded-2xl text-xs font-bold text-slate-400 hover:text-emerald-500"
                    onClick={() => setSelectedWord(null)}
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

export default VocabHub;
