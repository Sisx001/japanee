import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Volume2, Check, X, ChevronRight,
    Headphones, List, Type, HeadphonesIcon,
    RotateCcw, Trophy, Target, Sparkles,
    Volume1, VolumeX, Zap
} from 'lucide-react';
import { MASSIVE_SENTENCES } from '@/data/MassiveSentences';

const ListeningHub = () => {
    const { settings, addXP } = useProfile();
    const { speak, playSound, initializeAudio, isPlaying, stop } = useAudio();
    const language = settings?.languagePreference || 'en';
    const t = (en, bn) => language === 'bn' ? bn : en;

    const [mode, setMode] = useState('mcq'); // 'mcq', 'dictation'
    const [level, setLevel] = useState('N5');
    const [currentSentence, setCurrentSentence] = useState(null);
    const [options, setOptions] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [streak, setStreak] = useState(0);
    const [stats, setStats] = useState({ questions: 0, xp: 0 });

    // Filter sentences by level
    const filteredSentences = useMemo(() => {
        return MASSIVE_SENTENCES.filter(s => s.level === level);
    }, [level]);

    // Generate options for MCQ
    const generateOptions = useCallback((correctSentence) => {
        const others = filteredSentences
            .filter(s => s.id !== correctSentence.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        return [...others, correctSentence].sort(() => Math.random() - 0.5);
    }, [filteredSentences]);

    const loadNext = useCallback(() => {
        const sentence = filteredSentences[Math.floor(Math.random() * filteredSentences.length)];
        setCurrentSentence(sentence);
        setOptions(generateOptions(sentence));
        setUserInput('');
        setShowResult(false);
        setIsCorrect(false);
    }, [filteredSentences, generateOptions]);

    useEffect(() => {
        if (filteredSentences.length > 0) {
            loadNext();
        }
    }, [filteredSentences, loadNext]);

    const handleSpeak = (rate = 0.8) => {
        initializeAudio();
        speak(currentSentence?.jp, { rate });
    };

    const checkAnswer = (selectedId) => {
        if (showResult) return;

        const correct = selectedId === currentSentence.id;
        setIsCorrect(correct);
        setShowResult(true);
        setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
        setStats(prev => ({
            questions: prev.questions + 1,
            xp: prev.xp + (correct ? (level === 'N5' ? 10 : 15) : 0)
        }));

        if (correct) {
            setStreak(prev => prev + 1);
            playSound('correct');
            addXP(level === 'N5' ? 10 : 15);
        } else {
            setStreak(0);
            playSound('wrong');
        }
    };

    const handleDictationCheck = () => {
        if (showResult || !userInput.trim()) return;

        const input = userInput.trim().toLowerCase();
        const correct = input === currentSentence.jp ||
            input === currentSentence.romaji.toLowerCase().replace(/[.,!?]/g, '');

        setIsCorrect(correct);
        setShowResult(true);
        setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
        setStats(prev => ({
            questions: prev.questions + 1,
            xp: prev.xp + (correct ? (level === 'N5' ? 20 : 30) : 0)
        }));

        if (correct) {
            setStreak(prev => prev + 1);
            playSound('correct');
            addXP(level === 'N5' ? 20 : 30);
        } else {
            setStreak(0);
            playSound('wrong');
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header Stats */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl md:text-3xl font-black flex items-center justify-center sm:justify-start gap-3 italic tracking-tighter uppercase">
                            <Headphones className="w-8 h-8 text-rose-500" />
                            {t('Listening Hub', 'লিসেনিং হাব')}
                        </h1>
                        <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 italic">
                            {t('Refined Native Comprehension', 'নেটিভ টিটিএস-এর মাধ্যমে আপনার শ্রবণ দক্ষতা উন্নত করুন')}
                        </p>
                    </div>

                    <div className="flex gap-3 md:gap-4 w-full sm:w-auto">
                        <Card className="flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-2xl md:rounded-[2rem] bg-rose-500/5 border border-rose-500/10 shadow-xl backdrop-blur-xl">
                            <div className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest italic">{t('XP Earned', 'অর্জিত XP')}</div>
                            <div className="text-xl md:text-2xl font-black text-rose-500 flex items-center gap-1.5 mt-0.5 md:mt-1">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                                {stats.xp}
                            </div>
                        </Card>
                        <Card className="flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-2xl md:rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 shadow-xl backdrop-blur-xl">
                            <div className="text-[8px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest italic">{t('Accuracy', 'সঠিকতা')}</div>
                            <div className="text-xl md:text-2xl font-black text-indigo-500 mt-0.5 md:mt-1">
                                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl p-4 md:p-6 rounded-[2.5rem] md:rounded-[3rem] border border-rose-500/10 shadow-lg">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={level === 'N5' ? 'default' : 'outline'}
                            className={`cursor-pointer px-5 py-2 rounded-xl text-[10px] font-black tracking-widest italic transition-all ${level === 'N5' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'border-rose-500/20'}`}
                            onClick={() => { setLevel('N5'); setScore({ correct: 0, total: 0 }); }}
                        >
                            JLPT N5
                        </Badge>
                        <Badge
                            variant={level === 'N4' ? 'default' : 'outline'}
                            className={`cursor-pointer px-5 py-2 rounded-xl text-[10px] font-black tracking-widest italic transition-all ${level === 'N4' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'border-rose-500/20'}`}
                            onClick={() => { setLevel('N4'); setScore({ correct: 0, total: 0 }); }}
                        >
                            JLPT N4
                        </Badge>
                    </div>

                    <div className="flex p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-2xl border border-white/20 w-full md:w-auto">
                        <Button
                            variant={mode === 'mcq' ? 'default' : 'ghost'}
                            size="sm"
                            className={`flex-1 md:flex-none rounded-xl px-6 h-10 font-black text-[10px] tracking-widest transition-all ${mode === 'mcq' ? 'bg-rose-500 text-white shadow-lg' : 'hover:bg-rose-500/10'}`}
                            onClick={() => { setMode('mcq'); loadNext(); }}
                        >
                            <List className="w-4 h-4 mr-2" />
                            {t('MCQ', 'এমসিকিউ')}
                        </Button>
                        <Button
                            variant={mode === 'dictation' ? 'default' : 'ghost'}
                            size="sm"
                            className={`flex-1 md:flex-none rounded-xl px-6 h-10 font-black text-[10px] tracking-widest transition-all ${mode === 'dictation' ? 'bg-rose-500 text-white shadow-lg' : 'hover:bg-rose-500/10'}`}
                            onClick={() => { setMode('dictation'); loadNext(); }}
                        >
                            <Type className="w-4 h-4 mr-2" />
                            {t('Dictation', 'ডিক্টেশন')}
                        </Button>
                    </div>
                </div>

                {/* Practice Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="rounded-[2.5rem] overflow-hidden border-none card-shadow bg-background relative">
                            <div className="absolute top-0 right-0 p-6">
                                {streak > 2 && (
                                    <Badge className="bg-orange-500 text-white animate-bounce py-1 px-3 rounded-full">
                                        🔥 {streak} {t('Streak', 'স্ট্রিক')}
                                    </Badge>
                                )}
                            </div>

                            <CardContent className="p-8 sm:p-12 text-center">
                                <div className="mb-8">
                                    <div className={`w-32 h-32 mx-auto rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mb-6 transition-all scale-hover ${isPlaying ? 'ring-8 ring-rose-500/20 animate-pulse' : ''}`}>
                                        <div className="flex flex-col items-center gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-24 h-24 rounded-full"
                                                onClick={() => handleSpeak(0.8)}
                                            >
                                                <Volume2 className={`w-12 h-12 ${isPlaying ? 'text-rose-500' : 'text-rose-400'}`} />
                                            </Button>
                                            {isPlaying && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="rounded-full px-6 animate-in fade-in zoom-in"
                                                    onClick={stop}
                                                >
                                                    <VolumeX className="w-4 h-4 mr-2" />
                                                    {t('STOP', 'থামুন')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-3">
                                        <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleSpeak(0.5)}>
                                            <Volume1 className="w-4 h-4 mr-2" />
                                            {t('Slow', 'ধীর')}
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleSpeak(0.8)}>
                                            <Volume2 className="w-4 h-4 mr-2" />
                                            {t('Normal', 'স্বাভাবিক')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Question Type Specifics */}
                                <div className="space-y-6">
                                    {mode === 'mcq' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {options.map((opt, idx) => (
                                                <Button
                                                    key={opt.id}
                                                    variant={showResult && opt.id === currentSentence.id ? "default" : "outline"}
                                                    className={`h-auto py-5 md:py-6 px-6 md:px-8 rounded-[1.5rem] md:rounded-[2rem] text-left flex flex-col items-start gap-1 transition-all border-2
                            ${showResult && opt.id === currentSentence.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-white/40 dark:bg-slate-900/40 border-rose-500/10'}
                            ${showResult && opt.id !== currentSentence.id && isCorrect === false ? 'opacity-30' : ''}
                            hover:border-rose-500 hover:bg-rose-500/5 shadow-sm
                          `}
                                                    onClick={() => checkAnswer(opt.id)}
                                                    disabled={showResult}
                                                >
                                                    <span className="text-xs md:text-sm font-black italic tracking-tight">{language === 'bn' ? opt.bn : opt.en.toUpperCase()}</span>
                                                    <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Translation', 'অনুবাদ')}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4 md:space-y-6">
                                            <textarea
                                                className="w-full h-32 md:h-40 rounded-[2rem] md:rounded-[3rem] border-2 border-rose-500/10 bg-white/40 dark:bg-slate-900/40 p-6 md:p-8 text-center text-lg md:text-2xl japanese-text focus:border-rose-500 outline-none transition-all resize-none shadow-inner"
                                                placeholder={t('Type Japanese or Romaji...', 'জাপানি অথবা রোমাজি লিখুন...')}
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                disabled={showResult}
                                            />
                                            <Button
                                                className="w-full h-14 md:h-16 rounded-[1.5rem] md:rounded-[2rem] text-sm md:text-base font-black tracking-widest uppercase italic bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/20 transition-all duration-300"
                                                onClick={handleDictationCheck}
                                                disabled={showResult || !userInput.trim()}
                                            >
                                                {t('Submit Answer', 'উত্তর জমা দিন')}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Results Feedback */}
                                {showResult && (
                                    <div className={`mt-8 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden ${isCorrect ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}>
                                        <div className={`absolute top-0 left-0 w-full h-1 ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                                        <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
                                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-2xl ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                {isCorrect ? <Check className="w-6 h-6 md:w-8 md:h-8 text-white" /> : <X className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                                            </div>
                                            <div className="text-left leading-none">
                                                <span className={`text-xl md:text-3xl font-black italic tracking-tighter uppercase ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {isCorrect ? t('Perfect Clarity!', 'অসাধারণ স্পষ্টতা!') : t('Path of Zen...', 'অনুশীলন চালিয়ে যান')}
                                                </span>
                                                <div className="text-[10px] md:text-xs font-black text-slate-400 tracking-[0.3em] uppercase mt-1 italic">Synchronization {isCorrect ? 'COMPLETE' : 'ALIGNING'}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 md:space-y-6 bg-white/40 dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/20 shadow-inner">
                                            <div className="japanese-text text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">{currentSentence.jp}</div>
                                            <div className="text-xs md:text-sm text-rose-500 font-black tracking-[0.3em] uppercase italic">{currentSentence.romaji}</div>
                                            <div className="text-sm md:text-base font-black italic tracking-tight text-slate-600 dark:text-slate-300 border-t border-rose-500/10 pt-4 mt-2">
                                                {language === 'bn' ? currentSentence.bn : currentSentence.en.toUpperCase()}
                                            </div>
                                        </div>

                                        <Button
                                            className="mt-6 md:mt-10 w-full h-14 md:h-16 rounded-[1.5rem] md:rounded-[2rem] font-black tracking-widest uppercase italic bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl group transition-all"
                                            onClick={loadNext}
                                        >
                                            {t('Next Insight', 'চালিয়ে যান')}
                                            <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-[2.5rem] border-none card-shadow h-full">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    {t('Session History', 'সেশন ইতিহাস')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                                                <Target className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div className="text-sm font-medium">{t('Tasks Done', 'কাজ শেষ')}</div>
                                        </div>
                                        <div className="text-lg font-bold">{score.total}</div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm mb-1 px-1">
                                            <span className="font-medium">{t('Current Goal', 'বর্তমান লক্ষ্য')}</span>
                                            <span className="text-muted-foreground">{score.total}/20</span>
                                        </div>
                                        <Progress value={(score.total / 20) * 100} className="h-3 rounded-full" />
                                    </div>

                                    <div className="pt-4 border-t border-dashed">
                                        <h4 className="font-bold text-sm mb-3">{t('Quick Tips', 'টিপস')}</h4>
                                        <ul className="space-y-3">
                                            {[
                                                { icon: Volume1, text: t('Use headphones for clarity', 'স্পষ্টতার জন্য হেডফোন ব্যবহার করুন') },
                                                { icon: RotateCcw, text: t('Repeat out loud (Shadowing)', 'জোরে জোরে বলুন (শ্যাডোয়িং)') },
                                                { icon: Zap, text: t('Try slow speed for complex parts', 'কঠিন অংশের জন্য ধীর গতি ব্যবহার করুন') }
                                            ].map((item, i) => (
                                                <li key={i} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                                                    <item.icon className="w-4 h-4 shrink-0 text-rose-400" />
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ListeningHub;
