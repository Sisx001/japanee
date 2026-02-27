import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Volume2, Bookmark, X, Filter, Sparkles, Languages, ArrowRight } from 'lucide-react';
import {
  HIRAGANA, KATAKANA, N5_KANJI, N4_KANJI,
  N5_VOCABULARY, N4_VOCABULARY, N5_GRAMMAR, N4_GRAMMAR
} from '@/data/JapaneseData';
import { MASSIVE_N5_VOCAB } from '@/data/MassiveN5Vocab';
import { MASSIVE_N4_VOCAB } from '@/data/MassiveN4Vocab';
import { fuzzyMatch } from '@/lib/searchUtils';

const Dictionary = () => {
  const { profile } = useProfile();
  const { playWord } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const allData = useMemo(() => {
    const vocab = [
      ...N5_VOCABULARY.map(item => ({ ...item, type: 'vocabulary', display: item.kanji || item.kana, reading: item.kana, meaning: item.en, bn: item.bn })),
      ...N4_VOCABULARY.map(item => ({ ...item, type: 'vocabulary', display: item.kanji || item.kana, reading: item.kana, meaning: item.en, bn: item.bn })),
      ...(MASSIVE_N5_VOCAB || []).map(item => ({ ...item, type: 'vocabulary', display: item.kanji || item.kana, reading: item.kana, meaning: item.en, bn: item.bn })),
      ...(MASSIVE_N4_VOCAB || []).map(item => ({ ...item, type: 'vocabulary', display: item.kanji || item.kana, reading: item.kana, meaning: item.en, bn: item.bn }))
    ];

    const kanji = [
      ...N5_KANJI.map(item => ({ ...item, type: 'kanji', display: item.char, reading: item.kun?.join(', ') || item.on?.join(', '), meaning: item.en })),
      ...(N4_KANJI || []).map(item => ({ ...item, type: 'kanji', display: item.char, reading: item.kun?.join(', ') || item.on?.join(', '), meaning: item.en }))
    ];

    const grammar = [
      ...N5_GRAMMAR.map(item => ({ ...item, type: 'grammar', display: item.pattern, reading: '', meaning: item.meaning })),
      ...(N4_GRAMMAR || []).map(item => ({ ...item, type: 'grammar', display: item.pattern, reading: '', meaning: item.meaning }))
    ];

    return [...vocab, ...kanji, ...grammar];
  }, []);

  const results = useMemo(() => {
    if (!searchQuery.trim() && activeTab === 'all') return [];

    let filtered = allData;
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab || (activeTab === 'vocabulary' && item.type === 'vocabulary'));
    }

    if (!searchQuery.trim()) return filtered.slice(0, 50);

    return filtered
      .map(item => ({ ...item, score: fuzzyMatch(item, searchQuery) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }, [allData, searchQuery, activeTab]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-32 px-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[3rem] p-8 md:p-16 text-center space-y-6">
          <div className="absolute inset-0 premium-gradient opacity-10 blur-3xl -z-10 animate-pulse"></div>
          <div className="space-y-4">
            <Badge variant="outline" className="glass text-rose-500 border-rose-200 px-6 py-2 uppercase tracking-[0.2em] font-black text-[10px] animate-slide-up">
              Master the Language
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none animate-slide-up" style={{ animationDelay: '100ms' }}>
              Universal <span className="premium-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">Dictionary</span>
            </h1>
            <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
              Instant results for <span className="text-rose-500">3000+</span> Kanji, Vocabulary, and Grammar entries.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative group pt-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="absolute -inset-2 premium-gradient rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass rounded-[2.5rem] p-3 flex items-center shadow-2xl border-white/40">
              <div className="pl-6 text-rose-500">
                <Search className="w-7 h-7" />
              </div>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kanji, Romaji, English..."
                className="border-0 focus-visible:ring-0 text-2xl font-black bg-transparent h-16 placeholder:text-muted-foreground/30 px-6"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="rounded-full h-12 w-12 hover:bg-rose-500/10 text-rose-500 transition-all"
                >
                  <X className="w-6 h-6" />
                </Button>
              )}
              <Button size="lg" className="rounded-[2rem] h-14 px-10 premium-gradient font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-lg hidden md:flex">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="glass p-1.5 rounded-[2rem] h-16 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['all', 'vocabulary', 'kanji', 'grammar'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-[1.5rem] px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:premium-gradient data-[state=active]:text-white h-full transition-all duration-500"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button variant="outline" className="glass rounded-[2rem] h-16 px-8 font-black uppercase tracking-widest text-[10px] gap-3 border-rose-200/50 hover:bg-rose-500/5 transition-all w-full md:w-auto">
            <Filter className="w-4 h-4 text-rose-500" />
            Advanced Filters
          </Button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
          {results.length > 0 ? (
            results.map((item, index) => (
              <Card
                key={`${item.type}-${index}`}
                className="glass rounded-[2.5rem] border-0 hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)] transition-all duration-500 group overflow-hidden border border-white/20 active:scale-95 cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-24 h-24 premium-gradient rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:rotate-6 transition-transform duration-500 japanese-text-premium p-4 text-center break-all">
                        {item.display}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-rose-500/10 text-rose-500 border-rose-200 font-black px-3 py-1 text-[9px] uppercase tracking-tighter rounded-full">
                          {item.type}
                        </Badge>
                        {item.reading && (
                          <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-2xl h-12 w-12 glass hover:premium-gradient hover:text-white transition-all shadow-lg"
                            onClick={(e) => { e.stopPropagation(); playWord(item.display); }}
                          >
                            <Volume2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.reading && (
                        <p className="text-muted-foreground font-black text-xs uppercase tracking-widest japanese-text">
                          {item.reading}
                        </p>
                      )}
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-rose-500 transition-colors uppercase leading-tight">
                        {item.meaning}
                      </h3>
                      {item.bn && profile?.preferredLanguage === 'bn' && (
                        <div className="pt-2 flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
                          <Languages className="w-4 h-4" />
                          <span>{item.bn}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-8 pb-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full border-2 border-white glass flex items-center justify-center">
                        <Bookmark className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <Button variant="ghost" className="rounded-full text-rose-500 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-rose-500/5">
                      Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-rose-500/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-rose-500/10 animate-floating">
                <Search className="w-12 h-12 text-rose-500/30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-muted-foreground/40 italic tracking-tighter">
                  {searchQuery ? "No entries match your search" : "The library is waiting..."}
                </h3>
                {searchQuery && (
                  <p className="text-muted-foreground font-bold">Try searching for Kanji, Romaji, or English keywords.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pro Features Teaser */}
        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <Card className="glass rounded-[3rem] border-0 bg-blue-500/5 p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 premium-gradient opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="p-0 flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black tracking-tight text-blue-600">Smart Suggestions</h4>
                  <p className="text-muted-foreground font-bold leading-relaxed">Our AI-powered fuzzy matching helps you find exactly what you're looking for, even with typos.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass rounded-[3rem] border-0 bg-rose-500/5 p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 premium-gradient opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="p-0 flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                  <Languages className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black tracking-tight text-rose-600">Native Context</h4>
                  <p className="text-muted-foreground font-bold leading-relaxed">Switch to Bengali translation in settings to see localized meanings for 90% of our database.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dictionary;

