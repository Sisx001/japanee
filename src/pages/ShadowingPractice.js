import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Mic, MicOff, Volume2, ChevronRight, ChevronLeft,
    Target, Sparkles, Trophy, Headphones, Zap,
    CheckCircle2, AlertCircle, RefreshCcw, Brain, Activity
} from 'lucide-react';
import { MASSIVE_SENTENCES } from '@/data/JapaneseData';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { TranslateHelper } from '@/components/ui/TranslateHelper.jsx';

const ShadowingPractice = () => {
    const { profile, settings, addExperience } = useProfile();
    const { speak, playSound, initializeAudio, isPlaying } = useAudio();
    const language = settings?.languagePreference || 'en';
    const t = (en, bn) => language === 'bn' ? bn : en;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [matchScore, setMatchScore] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [sessionStats, setSessionStats] = useState({ mastered: 0, total: 0, xp: 0 });

    const currentSentence = useMemo(() => MASSIVE_SENTENCES[currentIndex], [currentIndex]);

    // Pattern SVG for card backgrounds
    const seigaihaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Cpath fill='%23f43f5e' fill-opacity='0.05' d='M0 30c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM12.5 15c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM0 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z'/%3E%3C/svg%3E")`;

    const {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        hasSupport
    } = useSpeechRecognition({ lang: 'ja-JP' });

    useEffect(() => {
        if (transcript && !isListening && currentSentence) {
            calculateMatch(transcript, currentSentence.jp);
        }
    }, [transcript, isListening, currentSentence, calculateMatch]);

    const calculateMatch = useCallback((spoken, target) => {
        const s1 = spoken.replace(/[、。？！\s]/g, '');
        const s2 = target.replace(/[、।？！\s]/g, '');
        let matches = 0;
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        if (longer.length === 0) return;

        for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) matches++;
        }
        const score = Math.round((matches / longer.length) * 100);

        setAccuracy(score);
        setMatchScore(score);
        setShowAnalysis(true);

        if (score > 80) {
            setFeedback(t('Excellent Pronunciation!', 'চমৎকার উচ্চারণ!'));
            playSound('correct');
            if (!showAnalysis) {
                setSessionStats(prev => ({ ...prev, mastered: prev.mastered + 1, total: prev.total + 1, xp: prev.xp + 25 }));
                addExperience(25);
            }
        } else if (score > 50) {
            setFeedback(t('Good effort, keep trying!', 'ভালো চেষ্টা, চালিয়ে যান!'));
            if (!showAnalysis) {
                setSessionStats(prev => ({ ...prev, total: prev.total + 1, xp: prev.xp + 10 }));
                addExperience(10);
            }
        } else {
            setFeedback(t('Try again for better accuracy', 'আরও ভালো করার জন্য আবার চেষ্টা করুন'));
        }
    }, [currentSentence.jp, playSound, showAnalysis, t, addExperience]);

    const handleListen = () => {
        if (!currentSentence) return;
        initializeAudio();
        speak(currentSentence.jp, { rate: 0.8 });
    };

    const handleNext = () => {
        if (currentIndex < MASSIVE_SENTENCES.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnalysis(false);
            setFeedback('');
            setMatchScore(0);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setShowAnalysis(false);
            setFeedback('');
            setMatchScore(0);
        }
    };

    if (!hasSupport) return <MainLayout><div className="flex flex-col items-center justify-center h-[50vh] space-y-4"><AlertCircle className="w-16 h-16 text-rose-500" /><h1 className="text-2xl font-black">{t('SPEECH API NOT DETECTED', 'স্পিচ এপিআই সনাক্ত করা যায়নি')}</h1></div></MainLayout>;
    if (!currentSentence || !MASSIVE_SENTENCES || MASSIVE_SENTENCES.length === 0) return <MainLayout><div className="flex h-[50vh] items-center justify-center"><Brain className="animate-spin w-12 h-12 text-rose-500" /></div></MainLayout>;

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 md:space-y-12 pb-32">

                {/* Cinematic Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="text-center md:text-left space-y-1 md:space-y-2">
                        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase italic">Vocal Sync Protocol</Badge>
                        <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase flex items-center justify-center md:justify-start gap-3 md:gap-4">
                            <Headphones className="w-8 h-8 md:w-12 md:h-12 text-rose-500 animate-pulse" />
                            {t('Neural Shadow', 'নিউরাল শ্যাডো')}
                        </h1>
                        <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-500 italic opacity-80">{t('Calibrate your neural accent modules', 'আপনার অ্যাকসেন্ট মডিউল ক্যালিব্রেট করুন')}</p>
                    </div>

                    <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                        <Card className="flex-1 md:flex-none glass px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[2.5rem] border-0 flex items-center gap-3 md:gap-5 shadow-2xl">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-rose-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                                <Trophy className="w-5 h-5 md:w-7 md:h-7 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Yield</p>
                                <p className="text-xl md:text-3xl font-black italic text-rose-500 leading-tight">{sessionStats.xp} XP</p>
                            </div>
                        </Card>
                        <Card className="flex-1 md:flex-none glass px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[2.5rem] border-0 flex items-center gap-3 md:gap-5 shadow-2xl">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                                <Target className="w-5 h-5 md:w-7 md:h-7 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Syncs</p>
                                <p className="text-xl md:text-3xl font-black italic text-indigo-500 leading-tight">{sessionStats.mastered}/{sessionStats.total}</p>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                    {/* Primary Practice Interface */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        <Card className="glass rounded-[2.5rem] md:rounded-[4rem] border-0 overflow-hidden relative group shadow-2xl">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity" style={{ backgroundImage: seigaihaPattern }} />

                            <CardContent className="p-6 md:p-20 text-center space-y-10 md:space-y-16 relative z-10 flex flex-col justify-center min-h-[300px] md:min-h-[500px]">
                                {isListening && (
                                    <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 md:gap-3">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-rose-500 rounded-full animate-ping" />
                                        <span className="text-rose-500 font-black text-[8px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] italic">RECV DATA...</span>
                                    </div>
                                )}

                                <div className="space-y-6 md:space-y-8">
                                    <div className="flex flex-col items-center gap-4 md:gap-6">
                                        <TranslateHelper
                                            romaji={currentSentence.romaji}
                                            bengali={currentSentence.bn}
                                            english={currentSentence.en}
                                            className="japanese-text-premium text-3xl md:text-7xl font-black leading-tight tracking-tighter drop-shadow-2xl text-slate-900 dark:text-white"
                                        >
                                            {currentSentence.jp}
                                        </TranslateHelper>
                                        <div className="w-20 md:w-32 h-1 md:h-1.5 bg-rose-500/20 rounded-full" />
                                        <p className="text-lg md:text-3xl font-black text-slate-400 italic tracking-widest opacity-60 uppercase">
                                            {currentSentence.romaji}
                                        </p>
                                    </div>

                                    <p className="text-xl md:text-3xl font-black italic text-indigo-500 drop-shadow-sm leading-tight uppercase tracking-tighter">
                                        "{language === 'bn' ? currentSentence.bn : currentSentence.en}"
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 pt-4 md:pt-8 w-full">
                                    <Button onClick={handleListen} disabled={isPlaying} className="h-16 md:h-24 px-6 md:px-12 rounded-[1.5rem] md:rounded-[2.5rem] glass border-2 border-rose-500/10 hover:bg-rose-500/5 transition-all group overflow-hidden w-full sm:w-auto">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all ${isPlaying ? 'animate-pulse' : ''}`}>
                                            <Volume2 className="w-5 h-5 md:w-7 md:h-7" />
                                        </div>
                                        <span className="ml-3 md:ml-4 text-sm md:text-2xl font-black italic uppercase tracking-tighter text-slate-700 dark:text-slate-300">Listen</span>
                                    </Button>

                                    <Button
                                        onClick={isListening ? stopListening : startListening}
                                        className={`h-20 md:h-28 px-10 md:px-16 rounded-[2rem] md:rounded-[3rem] font-black text-2xl md:text-3xl italic tracking-tighter shadow-2xl transition-all hover:scale-105 active:scale-95 border-0 w-full sm:w-auto
                                            ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'}`}
                                    >
                                        {isListening ? <MicOff className="w-8 h-8 md:w-10 md:h-10 mr-3 md:mr-4" /> : <Mic className="w-8 h-8 md:w-10 md:h-10 mr-3 md:mr-4" />}
                                        {isListening ? 'STOP' : 'REPEAT'}
                                    </Button>
                                </div>

                                {(transcript || showAnalysis) && (
                                    <div className={`p-10 rounded-[3rem] transition-all duration-700 animate-in slide-in-from-top-8
                                        ${showAnalysis ? (matchScore > 80 ? 'bg-green-500/10 border-2 border-green-500/20' : 'bg-rose-500/10 border-2 border-rose-500/20') : 'glass'}`}>
                                        <div className="flex items-center justify-between mb-6 px-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Accuracy Results</span>
                                            {showAnalysis && <div className="flex items-center gap-3"><Activity className={`w-5 h-5 ${matchScore > 80 ? 'text-green-500' : 'text-rose-500'}`} /><span className={`text-2xl font-black italic ${matchScore > 80 ? 'text-green-500' : 'text-rose-500'}`}>{matchScore}% SYNC</span></div>}
                                        </div>

                                        <p className="japanese-text text-2xl md:text-4xl font-black italic bg-white/50 dark:bg-slate-950/50 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] mb-6 shadow-inner text-slate-900 dark:text-white">
                                            "{transcript || '...'}"
                                        </p>

                                        {showAnalysis && (
                                            <div className="space-y-6">
                                                <div className="h-3 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden p-0.5">
                                                    <div className={`h-full rounded-full transition-all duration-1000 ${matchScore > 80 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} style={{ width: `${matchScore}%` }} />
                                                </div>
                                                <p className="text-xl font-black italic flex items-center justify-center gap-3 uppercase tracking-tighter">
                                                    {matchScore > 80 ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : <RefreshCcw className="w-7 h-7 text-rose-500 animate-spin-slow" />}
                                                    {feedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between gap-6 px-10">
                            <Button variant="ghost" onClick={handlePrevious} disabled={currentIndex === 0} className="rounded-xl h-12 md:h-16 px-4 md:px-8 glass font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 text-[10px] md:text-base">
                                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 mr-2" /> PREV
                            </Button>
                            <div className="text-[10px] md:text-sm font-black italic text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">UNIT {currentIndex + 1} // {MASSIVE_SENTENCES.length}</div>
                            <Button onClick={handleNext} disabled={currentIndex === MASSIVE_SENTENCES.length - 1} className="rounded-xl h-12 md:h-16 px-4 md:px-8 glass font-black uppercase tracking-widest text-indigo-500 hover:scale-110 transition-all border-2 border-indigo-500/20 text-[10px] md:text-base">
                                NEXT <ChevronRight className="w-4 h-4 md:w-6 md:h-6 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Pro Tips Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="glass rounded-[3rem] border-0 shadow-xl overflow-hidden group">
                            <CardHeader className="p-8 border-b border-rose-500/10">
                                <CardTitle className="text-xl font-black italic flex items-center gap-3 uppercase tracking-tighter">
                                    <Sparkles className="w-6 h-6 text-rose-500 animate-pulse" />
                                    Speaking Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                {[
                                    { icon: Headphones, text: t('Iterate listening 3x before vocal bridge initialization.', 'বলার আগে অন্তত ৩ বার বাক্যটি শুনুন।'), color: 'text-indigo-500' },
                                    { icon: Mic, text: t('Fuzzy match mimics native spectral profile and speed.', 'কণ্ঠস্বরের পিচ এবং গতি হুবহু নকল করার চেষ্টা করুন।'), color: 'text-rose-500' },
                                    { icon: Zap, text: t('Daily sync builds robust neural linguistic circuits.', 'নিয়মিত শ্যাডোয়িং নেটিভ উচ্চারণ রপ্ত করার দ্রুততম উপায়।'), color: 'text-amber-500' }
                                ].map((tip, i) => (
                                    <div key={i} className="flex gap-5 group/tip">
                                        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0 group-hover/tip:scale-110 transition-all">
                                            <tip.icon className={`w-6 h-6 ${tip.color}`} />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 leading-relaxed italic">
                                            {tip.text}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="glass rounded-[3rem] border-0 shadow-xl p-10 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Brain className="w-20 h-20 text-rose-500" /></div>
                            <h3 className="text-lg font-black uppercase tracking-[0.3em] italic">Session Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-slate-500">Sync Efficiency</span>
                                    <span className="text-2xl font-black italic text-indigo-500">{sessionStats.total > 0 ? Math.round((sessionStats.mastered / sessionStats.total) * 100) : 0}%</span>
                                </div>
                                <div className="h-3 glass rounded-full overflow-hidden p-0.5"><div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${sessionStats.total > 0 ? (sessionStats.mastered / sessionStats.total) * 100 : 0}%` }} /></div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic leading-relaxed border-t border-white/5 pt-6">
                                Mastering native phonetics bridges the gap between neural theory and kinetic production.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ShadowingPractice;
