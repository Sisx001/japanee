import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Volume2, BookOpen, Clock, Star } from 'lucide-react';
import { N5_VOCABULARY, N4_VOCABULARY } from '@/data/JapaneseData';
import { useAudio } from '@/context/AudioContext';

const WordBank = () => {
    const { settings } = useProfile();
    const { speak } = useAudio();
    const [searchTerm, setSearchTerm] = useState('');
    const [level, setLevel] = useState('N5');

    const vocabulary = useMemo(() => {
        return level === 'N5' ? N5_VOCABULARY : N4_VOCABULARY;
    }, [level]);

    const filteredVocab = useMemo(() => {
        return vocabulary.filter(v =>
            v.word.includes(searchTerm) ||
            v.reading.includes(searchTerm) ||
            v.meaning.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vocabulary, searchTerm]);

    return (
        <MainLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">VOCABULARY</h1>
                        <p className="text-slate-500 font-medium">Classic Lexicon Repository // {level} Protocol</p>
                    </div>
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Button
                            variant={level === 'N5' ? 'default' : 'ghost'}
                            className="rounded-xl h-10 px-6 font-bold"
                            onClick={() => setLevel('N5')}
                        >N5 Units</Button>
                        <Button
                            variant={level === 'N4' ? 'default' : 'ghost'}
                            className="rounded-xl h-10 px-6 font-bold"
                            onClick={() => setLevel('N4')}
                        >N4 Units</Button>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    <Input
                        placeholder="SEARCH DATA STREAM..."
                        className="h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-rose-500 dark:focus:border-rose-500 text-lg font-bold tracking-wide transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filteredVocab.map((item, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300"
                        >
                            <div className="flex items-center gap-6">
                                <div className="text-3xl font-bold japanese-text group-hover:text-rose-500 transition-colors">
                                    {item.word}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">{item.reading}</span>
                                    <span className="text-lg font-black text-slate-700 dark:text-slate-200">
                                        {settings?.languagePreference === 'bn' ? (item.bn || item.meaning) : item.meaning}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                                    onClick={() => speak(item.word)}
                                >
                                    <Volume2 className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-500/10"
                                >
                                    <Star className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Decorative line */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-rose-500 transition-all duration-300 group-hover:h-8 rounded-r-full" />
                        </div>
                    ))}
                </div>

                {filteredVocab.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="text-slate-300 dark:text-slate-700 font-black text-6xl mb-4 italic tracking-tighter opacity-50">NO DATA FOUND</div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">The registry does not contain the requested entry.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default WordBank;
