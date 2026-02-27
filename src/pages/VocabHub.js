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
  BookOpen, Volume2, Search, Check, Play, ChevronRight, Star
} from 'lucide-react';
import { N5_VOCABULARY, N4_VOCABULARY } from '@/data/JapaneseData';

const VocabHub = () => {
  const { progress, settings, markLearned, addXP } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWord, setSelectedWord] = useState(null);
  const [displayCount, setDisplayCount] = useState(100);

  const currentVocab = useMemo(() => {
    return selectedLevel === 'N5' ? N5_VOCABULARY : N4_VOCABULARY;
  }, [selectedLevel]);

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(currentVocab.map(v => v.category).filter(Boolean))];
  }, [currentVocab]);

  // Filter vocabulary
  const filteredVocab = useMemo(() => {
    return currentVocab.filter(word => {
      const matchesSearch = searchQuery === '' ||
        word.word.includes(searchQuery) ||
        word.reading.includes(searchQuery) ||
        word.meaning.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [currentVocab, searchQuery, selectedCategory]);

  const learnedCount = progress.vocabLearned?.length || 0;
  const totalCount = currentVocab.length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  const handleWordClick = (word) => {
    initializeAudio();
    setSelectedWord(word);
    speak(word.word);
  };

  const markAsLearned = (word) => {
    markLearned('vocab', word.word);
    addXP(10);
    playSound('correct');
  };

  const isLearned = (word) => progress.vocabLearned?.includes(word);

  const categoryLabels = {
    all: 'All',
    greetings: 'Greetings',
    basic: 'Basic',
    verb: 'Verbs',
    adjective: 'Adjectives',
    time: 'Time',
    place: 'Places',
    pronoun: 'Pronouns',
    people: 'People',
    thing: 'Things',
    food: 'Food & Drink'
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-emerald-500/10 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/10 -rotate-3 hover:rotate-0 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Vocabulary Hub</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase">{selectedLevel} Lexicon Mastery</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl flex">
              <button
                className={`px-4 py-2 rounded-lg font-black italic transition-all ${selectedLevel === 'N5' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => { setSelectedLevel('N5'); setSelectedCategory('all'); setDisplayCount(50); }}
              >
                N5
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-black italic transition-all ${selectedLevel === 'N4' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => { setSelectedLevel('N4'); setSelectedCategory('all'); setDisplayCount(50); }}
              >
                N4
              </button>
            </div>
            <Link to="/quiz/vocab">
              <Button className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black italic tracking-tight shadow-xl shadow-emerald-500/10 group">
                <Play className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                START TEST
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 rounded-[2.5rem] border-emerald-500/10 bg-slate-950 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
            <CardContent className="p-8 relative">
              <div className="flex justify-between items-end mb-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-black tracking-[0.4em] text-emerald-400 uppercase">Fluency Path</h3>
                  <div className="text-3xl font-black italic tracking-tighter text-white">CURRENT PROGRESS: {progressPercent}%</div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black italic tracking-tighter text-emerald-500">{learnedCount}</span>
                  <span className="text-lg font-bold text-slate-500 italic uppercase"> / {totalCount} Words</span>
                </div>
              </div>
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-emerald-500/10 shadow-xl flex flex-col justify-center">
            <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase mb-4 px-2 text-center">Rapid Filter</h3>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              <Input
                placeholder="Lookup Word..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-2xl font-bold placeholder:text-slate-400 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* Category List */}
        <div className="flex flex-wrap gap-2 px-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white/40 dark:bg-slate-900/40 text-slate-500 hover:text-emerald-500 border border-emerald-500/5 hover:border-emerald-500/20'
                }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Word Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.slice(0, displayCount).map((word, idx) => {
            const learned = isLearned(word.word);
            const isSelected = selectedWord?.word === word.word;

            return (
              <Card
                key={idx}
                className={`group rounded-3xl cursor-pointer transition-all duration-500 relative overflow-hidden h-32
                  ${isSelected
                    ? 'ring-2 ring-emerald-500 bg-white dark:bg-slate-900 shadow-2xl scale-[1.02] z-10'
                    : learned
                      ? 'bg-emerald-600/5 border-emerald-500/10 hover:border-emerald-500/30'
                      : 'bg-white/40 dark:bg-slate-900/40 border-emerald-500/5 hover:border-emerald-500/30'
                  }`}
                onClick={() => handleWordClick(word)}
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                  <BookOpen className="w-12 h-12" />
                </div>
                <CardContent className="p-6 h-full flex flex-col justify-center relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-2xl japanese-text font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{word.word}</span>
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic leading-none">{word.reading}</span>
                    </div>
                    {learned && (
                      <div className="bg-emerald-500/20 p-1 rounded-lg">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 italic truncate max-w-[120px]">
                      {settings.languagePreference === 'bn' ? (word.bn || word.meaning) : word.meaning.toUpperCase()}
                    </span>
                    <Badge variant="ghost" className="text-[8px] font-black uppercase tracking-tighter text-slate-400">
                      {word.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredVocab.length > displayCount && (
            <div className="flex justify-center py-10 pb-32">
              <Button
                variant="outline"
                className="rounded-full h-14 px-10 border-emerald-500/20 text-emerald-500 font-black italic tracking-widest hover:bg-emerald-500/10"
                onClick={() => setDisplayCount(prev => prev + 200)}
              >
                LOAD MORE UNITS ({filteredVocab.length - displayCount} REMAINING)
              </Button>
            </div>
          )}
        </div>

        {/* Word Insight Panel */}
        {selectedWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <Card className="w-full max-w-md rounded-[2.5rem] md:rounded-[3.5rem] bg-white dark:bg-slate-950 border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative my-auto">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              <CardContent className="p-6 md:p-10">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-black japanese-text text-slate-900 dark:text-white drop-shadow-sm">{selectedWord.word}</h2>
                    <p className="text-[10px] md:text-sm font-black tracking-[0.3em] text-emerald-500 uppercase italic ml-1">{selectedWord.reading}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 md:h-14 md:w-14 rounded-2xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 transition-all shadow-lg"
                    onClick={() => speak(selectedWord.word)}
                  >
                    <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </div>

                <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                  <div>
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase mb-1 md:mb-2 italic">Semantic Insight</h3>
                    <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                      {settings.languagePreference === 'bn' ? (selectedWord.bn || selectedWord.meaning) : selectedWord.meaning.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-0 px-3 py-1 rounded-lg font-black uppercase text-[10px] tracking-widest italic">{selectedWord.category}</Badge>
                    <Badge variant="outline" className="px-3 py-1 rounded-lg font-black italic text-[10px]">{selectedLevel}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  <Button
                    className={`h-14 md:h-16 rounded-[1.5rem] md:rounded-[2rem] font-black italic tracking-tighter text-base md:text-lg shadow-2xl transition-all ${isLearned(selectedWord.word) ? 'bg-slate-100 dark:bg-white/5 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'}`}
                    onClick={() => markAsLearned(selectedWord)}
                    disabled={isLearned(selectedWord.word)}
                  >
                    {isLearned(selectedWord.word) ? (
                      <><Check className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" /> ARCHIVED</>
                    ) : (
                      <><Check className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-pulse" /> MEMORIZE +10 XP</>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 md:h-14 rounded-xl md:rounded-2xl font-bold text-slate-400 hover:text-emerald-500 text-xs md:text-sm"
                    onClick={() => setSelectedWord(null)}
                  >
                    RETURN TO LEXICON
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
