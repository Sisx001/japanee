import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Mic, MicOff, Volume2, ChevronRight, ChevronLeft,
    Sparkles, Target, Activity, Headphones,
    Brain, Zap, Trophy, RefreshCcw, Info
} from 'lucide-react';
import { MASSIVE_SENTENCES } from '@/data/JapaneseData';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { TranslateHelper } from '@/components/ui/TranslateHelper.jsx';

const ShadowingPractice = () => {
    const navigate = useNavigate();
    const { addXP, settings } = useProfile();
    const { speak, playSound, isPlaying } = useAudio();
    const language = settings?.languagePreference || 'en';
    const t = (en, bn) => language === 'bn' ? bn : en;

    // -- State --
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchScore, setMatchScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [sessionXP, setSessionXP] = useState(0);
    const [history, setHistory] = useState([]); // Array of { index, score }

    const {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        hasSupport
    } = useSpeechRecognition({ lang: 'ja-JP' });

    // -- Derived Data --
    const currentSentence = useMemo(() => {
        if (!MASSIVE_SENTENCES || !MASSIVE_SENTENCES.length) return null;
        return MASSIVE_SENTENCES[currentIndex];
    }, [currentIndex]);

    const rank = useMemo(() => {
        if (matchScore >= 90) return { label: 'S', color: 'text-rose-500', bg: 'bg-rose-500/10' };
        if (matchScore >= 75) return { label: 'A', color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
        if (matchScore >= 50) return { label: 'B', color: 'text-amber-500', bg: 'bg-amber-500/10' };
        return { label: 'C', color: 'text-slate-500', bg: 'bg-slate-500/10' };
    }, [matchScore]);

    // -- Actions --
    const calculateAccuracy = useCallback((spoken, target) => {
        const clean = (s) => s.replace(/[、。？！\s\.\,\!\?]/g, '').toLowerCase();
        const s1 = clean(spoken);
        const s2 = clean(target);

        if (!s1) return 0;

        let matches = 0;
        const tokens = s1.split('');
        tokens.forEach(char => {
            if (s2.includes(char)) matches++;
        });

        const baseScore = (matches / Math.max(s1.length, s2.length)) * 100;
        return Math.min(100, Math.round(baseScore + 10)); // Slight boost for "feeling" right
    }, []);

    useEffect(() => {
        if (transcript && !isListening && currentSentence) {
            const score = calculateAccuracy(transcript, currentSentence.jp);
            setMatchScore(score);
            setShowResult(true);

            const xp = Math.floor(score * 0.5);
            setSessionXP(p => p + xp);
            addXP(xp);

            playSound(score > 70 ? 'correct' : 'wrong');
            setHistory(p => [...p, { index: currentIndex, score }]);
        }
    }, [transcript, isListening, currentSentence, calculateAccuracy, addXP, playSound, currentIndex]);

    const handleNext = () => {
        if (currentIndex < MASSIVE_SENTENCES.length - 1) {
            setCurrentIndex(p => p + 1);
            setShowResult(false);
            setMatchScore(0);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(p => p - 1);
            setShowResult(false);
            setMatchScore(0);
        }
    };

    // -- UI Elements --
    const pattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm0 0c0 11-9 20-20 20S-20 31-20 20-11 0 0 0s20 9 20 20z' fill='%23f43f5e' fill-opacity='0.02'/%3E%3C/svg%3E")`;

    if (!hasSupport) {
        return (
            <MainLayout>
                <div className="flex h-[70vh] items-center justify-center flex-col space-y-4">
                    <AlertCircle className="w-16 h-16 text-rose-500" />
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">Speech Engine Missing</h2>
                    <p className="text-slate-500 font-bold italic uppercase tracking-widest text-xs">Chrome or Edge required for neural sync.</p>
                </div>
            </MainLayout>
        );
    }

    if (!currentSentence) {
        return (
            <MainLayout>
                <div className="flex h-[70vh] items-center justify-center">
                    <Brain className="w-12 h-12 text-rose-500 animate-spin" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-12 pb-32">

                {/* Cinematic Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left space-y-2">
                        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.3em] uppercase italic bg-white/5 backdrop-blur-sm">Neural Vocal Link</Badge>
                        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase flex items-center justify-center md:justify-start gap-4 text-slate-900 dark:text-white leading-none">
                            <Headphones className="w-10 h-10 md:w-16 md:h-16 text-rose-500" />
                            SHADOW SYNC
                        </h1>
                        <p className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-500 italic opacity-80">Phase {currentIndex + 1} // Calibrating Pronunciation</p>
                    </div>

                    <div className="flex gap-4">
                        <Card className="glass px-6 py-4 rounded-[2rem] border-0 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Total Yield</p>
                                <p className="text-2xl font-black italic text-rose-500">{sessionXP} XP</p>
                            </div>
                        </Card>
                        <Card className="glass px-6 py-4 rounded-[2rem] border-0 flex items-center gap-4 shadow-xl">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400">Sync Level</p>
                                <p className="text-2xl font-black italic text-indigo-500">{currentIndex + 1}/50</p>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Stage */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="glass relative overflow-hidden p-10 md:p-20 border-0 rounded-[3rem] md:rounded-[5rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center text-center group transition-all duration-700">
                            <div className="absolute inset-0 opacity-[0.04] pointer-events-none group-hover:opacity-[0.08] transition-opacity" style={{ backgroundImage: pattern }} />

                            {/* Listening Waves */}
                            {isListening && (
                                <div className="absolute top-12 flex items-center gap-1">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-8 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                    <span className="ml-4 text-rose-500 font-black text-xs tracking-[0.3em] italic uppercase">SYNCING...</span>
                                </div>
                            )}

                            <div className="relative z-10 w-full space-y-12">
                                <div className="space-y-6">
                                    <TranslateHelper
                                        romaji={currentSentence.romaji}
                                        english={currentSentence.en}
                                        bengali={currentSentence.bn}
                                        className="japanese-text-premium text-4xl md:text-8xl font-black leading-none tracking-tighter text-slate-900 dark:text-white drop-shadow-2xl"
                                    >
                                        {currentSentence.jp}
                                    </TranslateHelper>
                                    <p className="text-xl md:text-3xl font-black text-slate-400 italic tracking-[0.3em] uppercase opacity-70">
                                        {currentSentence.romaji}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-6 w-full px-4">
                                    <Button
                                        onClick={() => speak(currentSentence.jp)}
                                        disabled={isPlaying}
                                        className="h-20 px-8 rounded-[1.5rem] glass border-2 border-indigo-500/10 hover:bg-indigo-500/5 text-indigo-500 font-black italic text-2xl tracking-tighter shadow-xl transition-all w-full md:w-auto"
                                    >
                                        <Volume2 className={`w-8 h-8 mr-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                                        LISTEN
                                    </Button>

                                    <Button
                                        onClick={isListening ? stopListening : startListening}
                                        className={`h-24 px-12 rounded-[2rem] text-3xl font-black italic tracking-tighter border-0 transition-all duration-500 shadow-2xl active:scale-95 w-full md:w-auto
                      ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl'}`}
                                    >
                                        {isListening ? <MicOff className="w-10 h-10 mr-4" /> : <Mic className="w-10 h-10 mr-4" />}
                                        {isListening ? 'STOP' : 'REPEAT'}
                                    </Button>
                                </div>

                                {/* Result Reveal */}
                                {(transcript || showResult) && (
                                    <div className={`mt-12 p-8 md:p-12 rounded-[3rem] transition-all duration-1000 animate-in zoom-in-95 backdrop-blur-3xl border-2 shadow-2xl
                    ${showResult ? (matchScore > 75 ? 'bg-green-500/5 border-green-500/20' : 'bg-rose-500/5 border-rose-500/20') : 'glass'}`}>

                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <Activity className={`w-6 h-6 ${matchScore > 75 ? 'text-green-500' : 'text-rose-500'}`} />
                                                <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Neural Comparison</span>
                                            </div>
                                            {showResult && (
                                                <Badge className={`${rank.bg} ${rank.color} px-4 py-1 rounded-full font-black text-2xl italic border-0`}>RANK {rank.label}</Badge>
                                            )}
                                        </div>

                                        <div className="space-y-8">
                                            <p className="text-2xl md:text-4xl font-black italic bg-card/60 p-8 rounded-2xl md:rounded-[2.5rem] text-slate-700 dark:text-slate-200 border-0 shadow-inner">
                                                "{transcript || 'Receiving data stream...'}"
                                            </p>

                                            {showResult && (
                                                <div className="space-y-4">
                                                    <div className="h-4 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden p-1 shadow-inner">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${matchScore > 75 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]'}`}
                                                            style={{ width: `${matchScore}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm font-black italic uppercase tracking-widest px-2">
                                                        <span className="text-slate-500">Sync Precision</span>
                                                        <span className={matchScore > 75 ? 'text-green-500' : 'text-rose-500'}>{matchScore}%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex items-center justify-between px-8">
                            <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0} className="h-14 px-8 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 border-0 shadow-lg">
                                <ChevronLeft className="w-5 h-5 mr-3" /> PREVIOUS
                            </Button>
                            <div className="text-[10px] font-black italic text-slate-500 uppercase tracking-[0.5em]">SENTENCE NODE // {currentIndex + 1}</div>
                            <Button onClick={handleNext} className="h-14 px-8 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:scale-105 transition-all border-0 shadow-lg group">
                                NEXT NODE <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="glass rounded-[3rem] p-10 border-0 shadow-xl space-y-8">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                <Zap className="w-6 h-6 text-amber-500" />
                                SYNC TIPS
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { icon: Headphones, color: 'text-indigo-500', text: 'Listen to native pitch 3x before repeating.' },
                                    { icon: Target, color: 'text-rose-500', text: 'Focus on kinetic flow over word precision.' },
                                    { icon: Activity, color: 'text-green-500', text: 'Maintain consistent volume for neural capture.' }
                                ].map((tip, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                            <tip.icon className={`w-6 h-6 ${tip.color}`} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic leading-relaxed pt-1">
                                            {tip.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="glass rounded-[3rem] p-10 border-0 shadow-xl space-y-6 relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                                <Brain className="w-40 h-40 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Session Data</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-black uppercase text-slate-500">Current Accuracy</span>
                                    <span className="text-3xl font-black italic text-rose-500">{matchScore}%</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-[10px] font-black uppercase text-slate-500">Nodes Synced</span>
                                    <span className="text-3xl font-black italic text-indigo-500">{history.length}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-slate-500">Avg Rank</span>
                                    <span className="text-3xl font-black italic text-amber-500">
                                        {history.length > 0 ? (history.reduce((a, b) => a + b.score, 0) / history.length >= 75 ? 'A+' : 'B') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="premium-gradient p-10 rounded-[3rem] text-white space-y-4 shadow-[0_20px_60px_rgba(244,63,94,0.3)]">
                            <div className="flex items-center gap-3 opacity-60">
                                <Info className="w-4 h-4" />
                                <span className="text-[10px] font-black tracking-widest uppercase italic">Pro Protocol</span>
                            </div>
                            <p className="text-base font-black italic leading-tight uppercase">
                                Shadowing bridges the gap between neural recognition and vocal muscle memory.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ShadowingPractice;
