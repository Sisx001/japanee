import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Trophy, Target, Clock, Zap, Brain, Sparkles,
  ChevronRight, Volume2, ShieldAlert, ArrowLeft,
  CheckCircle2, AlertCircle, RefreshCcw
} from 'lucide-react';
import {
  N5_VOCABULARY, N4_VOCABULARY,
  N5_KANJI, N4_KANJI,
  N5_GRAMMAR, N4_GRAMMAR
} from '@/data/JapaneseData';

const MockTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addXP, settings } = useProfile();
  const { speak, playSound } = useAudio();

  // URL Params & Settings
  const level = searchParams.get('level') || 'N5';
  const difficulty = settings?.difficulty || 'medium';
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  // -- State Management --
  const [phase, setPhase] = useState('IDLE'); // IDLE, INTRO, TESTING, RESULTS
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { index: { chosen, correct } }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false); // Show correct/wrong after click

  // -- Configuration --
  const CONFIG = {
    easy: { timer: 0, hints: 3, xp: 0.8, passing: 50, label: 'KOUHAI (TRAINEE)' },
    medium: { timer: 1.0, hints: 2, xp: 1.0, passing: 70, label: 'SEMPAI (OPERATOR)' },
    hard: { timer: 0.7, hints: 0, xp: 1.5, passing: 85, label: 'SENSEI (ELITE)' }
  }[difficulty] || { timer: 1.0, hints: 2, xp: 1.0, passing: 70, label: 'SEMPAI' };

  const TEST_META = {
    N5: { name: 'N5 MOCK EXAM', time: 1500, count: 20 },
    N4: { name: 'N4 MOCK EXAM', time: 1800, count: 25 }
  }[level] || { name: 'JLPT MOCK EXAM', time: 1500, count: 20 };

  // -- Logic: Question Generation --
  const generateQuestions = useCallback(() => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const getOptions = (correct, all, field = 'meaning') => {
      const opts = [correct];
      const others = all.filter(item => {
        const val = item[field] || item.en || item.meaning || '';
        return val && val !== correct;
      });
      const shuffledOthers = shuffle(others);
      for (let i = 0; i < 3 && i < shuffledOthers.length; i++) {
        const val = shuffledOthers[i][field] || shuffledOthers[i].en || shuffledOthers[i].meaning || '???';
        opts.push(val);
      }
      return shuffle(opts.filter(Boolean));
    };

    try {
      // Pool data based on level
      const vocabPool = level === 'N5' ? N5_VOCABULARY : [...N5_VOCABULARY, ...N4_VOCABULARY];
      const kanjiPool = level === 'N5' ? N5_KANJI : [...N5_KANJI, ...N4_KANJI];
      const grammarPool = level === 'N5' ? N5_GRAMMAR : [...N5_GRAMMAR, ...N4_GRAMMAR];

      if (!vocabPool.length || !kanjiPool.length || !grammarPool.length) {
        throw new Error("Core data pool is empty");
      }

      // Mix types
      const mixed = [
        ...shuffle(vocabPool).slice(0, Math.floor(TEST_META.count * 0.4)).map(v => ({
          type: 'VOCAB',
          prompt: v.word || v.kanji || v.kana,
          sub: v.reading || v.romaji,
          answer: v.meaning || v.en,
          options: getOptions(v.meaning || v.en, vocabPool, 'meaning'),
          hint: v.reading || v.romaji
        })),
        ...shuffle(kanjiPool).slice(0, Math.floor(TEST_META.count * 0.3)).map(k => ({
          type: 'KANJI',
          prompt: k.kanji || k.char,
          sub: k.onyomi || k.on?.[0],
          answer: k.meaning || k.en,
          options: getOptions(k.meaning || k.en, kanjiPool, 'en'),
          hint: k.kunyomi || k.kun?.[0]
        })),
        ...shuffle(grammarPool).slice(0, Math.floor(TEST_META.count * 0.3)).map(g => ({
          type: 'GRAMMAR',
          prompt: g.pattern,
          sub: g.examples?.[0]?.jp,
          answer: g.meaning || g.en,
          options: getOptions(g.meaning || g.en, grammarPool, 'meaning'),
          hint: g.explanation?.slice(0, 40) + '...'
        }))
      ];

      setQuestions(shuffle(mixed).slice(0, TEST_META.count));
      setPhase('INTRO');
    } catch (err) {
      console.error("Test generation failed:", err);
      toast.error("DATA LINK FAILURE: Retrying initialization...");
      setTimeout(() => navigate('/practice'), 2000);
    }
  }, [level, TEST_META.count, navigate]);

  // -- Lifecycle: Init --
  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  // -- Lifecycle: Timer --
  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      finishTest();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // -- Actions --
  const startTest = () => {
    if (CONFIG.timer > 0) {
      setTimeLeft(Math.floor(TEST_META.time * CONFIG.timer));
      setIsTimerActive(true);
    }
    setPhase('TESTING');
    playSound('start');
  };

  const handleSelect = (option) => {
    if (isRevealed) return;
    const correct = option === questions[currentIdx].answer;
    setUserAnswers(prev => ({
      ...prev,
      [currentIdx]: { chosen: option, correct }
    }));
    setIsRevealed(true);
    playSound(correct ? 'correct' : 'wrong');
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setIsRevealed(false);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsTimerActive(false);
    setPhase('RESULTS');

    // Calculate final XP
    const correctCount = Object.values(userAnswers).filter(a => a.correct).length;
    const totalXP = Math.floor(correctCount * 15 * CONFIG.xp);
    addXP(totalXP);

    playSound(correctCount / questions.length >= CONFIG.passing / 100 ? 'levelup' : 'wrong');
  };

  // -- UI: Pattern --
  const pattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.57 13.43-30 30-30s30 13.43 30 30-13.43 30-30 30-30-13.43-30-30zm0 0c0 16.57-13.43 30-30 30S-30 46.57-30 30-16.57 0 0 0s30 13.43 30 30z' fill='%23f43f5e' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  // -- Rendering: Loading --
  if (phase === 'IDLE') {
    return (
      <MainLayout>
        <div className="flex h-[70vh] items-center justify-center flex-col space-y-6">
          <Brain className="w-16 h-16 text-rose-500 animate-bounce" />
          <h2 className="text-xl font-black italic tracking-widest text-slate-400 animate-pulse uppercase">Linking Neural Database...</h2>
        </div>
      </MainLayout>
    );
  }

  // -- Rendering: Intro --
  if (phase === 'INTRO') {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-4 py-1 rounded-full text-xs font-black tracking-[0.3em] uppercase italic bg-white/5 backdrop-blur-sm">System Protocol Active</Badge>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
              {t(TEST_META.name, TEST_META.name.replace('Mock Test', 'মক টেস্ট'))}
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] italic text-sm md:text-lg">
              {level} // {difficulty?.toUpperCase() || 'STANDARD'} // {questions.length} NODES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="glass relative overflow-hidden p-8 md:p-12 border-0 rounded-[3rem] shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: pattern }} />
              <div className="relative z-10 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 italic">Parameters</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-rose-500/5 pb-4">
                    <span className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest"><Clock className="w-4 h-4 text-rose-500" /> Time Window</span>
                    <span className="text-2xl font-black italic text-slate-900 dark:text-white">{CONFIG.timer === 0 ? '∞' : Math.floor((TEST_META.time * CONFIG.timer) / 60) + 'M'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-rose-500/5 pb-4">
                    <span className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest"><Zap className="w-4 h-4 text-amber-500" /> Pass Density</span>
                    <span className="text-2xl font-black italic text-slate-900 dark:text-white">{CONFIG.passing}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest"><Target className="w-4 h-4 text-indigo-500" /> Rank Title</span>
                    <span className="text-lg font-black italic text-indigo-500">{CONFIG.label}</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-8">
              <Card className="premium-gradient p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-rose-500/20 flex-1">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 italic mb-2">Resource Yield</h3>
                  <div className="text-5xl font-black italic leading-none">x{CONFIG.xp} XP</div>
                </div>
                <div className="flex items-center gap-4 mt-8 opacity-80 font-bold italic text-xs">
                  <Sparkles className="w-5 h-5" />
                  Performance multipliers are active.
                </div>
              </Card>
              <Button
                className="w-full h-24 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 text-3xl font-black italic tracking-tighter hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] group overflow-hidden relative"
                onClick={startTest}
              >
                <div className="absolute inset-0 bg-rose-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                INITIATE TEST
              </Button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/practice')}
              className="group flex items-center justify-center gap-2 mx-auto text-slate-400 hover:text-rose-500 transition-colors uppercase text-[10px] font-black tracking-widest italic"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Sanctuary
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // -- Rendering: Testing --
  if (phase === 'TESTING') {
    const q = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-12">
          {/* Header Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center font-black italic text-2xl text-rose-500 shadow-xl border-0">
                #{currentIdx + 1}
              </div>
              <div className="space-y-1">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 italic">{q.type} Protocol</h2>
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase italic tracking-widest">
                  Progress // <span className="text-slate-900 dark:text-white">{currentIdx + 1}/{questions.length} Nodes</span>
                </div>
              </div>
            </div>

            {CONFIG.timer > 0 && (
              <div className={`px-8 py-4 rounded-2xl font-mono text-2xl font-black italic shadow-2xl transition-all duration-500 ${timeLeft < 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}>
                {minutes}:{String(seconds).padStart(2, '0')}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full glass rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500 shadow-[0_0_20px_#f43f5e]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question Card */}
          <Card className="glass relative overflow-hidden p-12 md:p-20 border-0 rounded-[3rem] md:rounded-[5rem] shadow-[0_25px_80px_rgba(0,0,0,0.15)] flex flex-col items-center min-h-[500px] justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: pattern }} />

            <div className="relative z-10 space-y-8 w-full">
              <div className="space-y-4">
                <div className="text-6xl md:text-9xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none drop-shadow-2xl">
                  {q.prompt}
                </div>
                {q.sub && (
                  <p className="text-slate-400 font-black uppercase tracking-[0.4em] italic text-sm md:text-lg animate-in slide-in-from-bottom-2 duration-700">
                    {q.sub}
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-16 h-16 rounded-2xl glass border-rose-500/10 text-rose-500 hover:bg-rose-500/10 shadow-lg"
                  onClick={() => speak(q.prompt)}
                >
                  <Volume2 className="w-8 h-8" />
                </Button>
                {difficulty === 'easy' && (
                  <Button
                    variant="outline"
                    className="h-16 px-8 rounded-2xl glass border-amber-500/10 text-amber-500 font-black italic text-xs tracking-widest uppercase hover:bg-amber-500/10 shadow-lg"
                    onClick={() => toast.info(`Hint: ${q.hint}`)}
                  >
                    Neural hint
                  </Button>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-12">
                {q.options.map((opt, i) => {
                  const state = userAnswers[currentIdx];
                  const isChosen = state?.chosen === opt;
                  const isCorrect = opt === q.answer;

                  let style = "bg-white/5 border-rose-500/5 hover:border-rose-500/20 text-slate-700 dark:text-slate-200";
                  if (isRevealed) {
                    if (isCorrect) style = "bg-green-500 text-white border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.3)] scale-[1.02]";
                    else if (isChosen) style = "bg-rose-500 text-white border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.3)]";
                    else style = "opacity-30 blur-[1px]";
                  }

                  return (
                    <Button
                      key={i}
                      disabled={isRevealed}
                      className={`h-20 md:h-28 rounded-2xl md:rounded-[2rem] border-2 text-base md:text-xl font-black italic tracking-tight transition-all duration-300 ${style}`}
                      onClick={() => handleSelect(opt)}
                    >
                      {String(opt || '???').toUpperCase()}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Footer controls */}
          {isRevealed && (
            <div className="animate-in slide-in-from-bottom-6 duration-500">
              <Button
                className="w-full h-24 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 text-2xl font-black italic tracking-tighter hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-4"
                onClick={nextQuestion}
              >
                {currentIdx < questions.length - 1 ? 'PROCEED TO NEXT NODE' : 'EXECUTE FINAL PROTOCOL'}
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // -- Rendering: Results --
  if (phase === 'RESULTS') {
    const correctCount = Object.values(userAnswers).filter(a => a.correct).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= CONFIG.passing;
    const totalXP = Math.floor(correctCount * 15 * CONFIG.xp);

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 text-center space-y-16 animate-in zoom-in-95 duration-700">
          <div className="relative inline-block group">
            <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center border-8 shadow-[0_0_80px_rgba(244,63,94,0.2)] bg-card overflow-hidden relative ${passed ? 'border-green-500 text-green-500' : 'border-rose-500 text-rose-500'}`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: pattern }} />
              {passed ? <Trophy className="w-24 h-24 md:w-32 md:h-32 animate-bounce" /> : <ShieldAlert className="w-24 h-24 md:w-32 md:h-32" />}
            </div>
            {passed && <Sparkles className="w-12 h-12 text-amber-500 absolute -top-4 -right-4 animate-pulse" />}
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              {passed ? 'Efficiency Verified' : 'Buffer Required'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.5em] italic text-sm md:text-xl">
              Sync Rate: {score}% Precision // {correctCount}/{questions.length} Nodes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass p-12 rounded-[3.5rem] border-0 shadow-2xl flex flex-col justify-center items-center group hover:scale-[1.02] transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 italic mb-4">Neural Yield</div>
              <div className="text-7xl font-black italic text-slate-900 dark:text-white">+{totalXP}</div>
              <div className="mt-4 flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-widest uppercase italic">Experience Extracted</div>
            </Card>

            <Card className="glass p-12 rounded-[3.5rem] border-0 shadow-2xl flex flex-col justify-center items-center group hover:scale-[1.02] transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 italic mb-4">Rank Acquired</div>
              <div className="text-4xl md:text-5xl font-black italic text-indigo-500 break-words leading-tight">{passed ? CONFIG.label : 'RONIN'}</div>
              <div className="mt-4 flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-widest uppercase italic">Current Standing</div>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <Button
              className="h-24 md:w-80 rounded-[2.5rem] bg-rose-500 text-white border-0 text-xl font-black italic tracking-tighter hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl shadow-rose-500/30"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="w-6 h-6 mr-3" /> RETRY SIMULATION
            </Button>
            <Button
              variant="outline"
              className="h-24 md:w-80 rounded-[2.5rem] glass border-rose-500/10 text-slate-900 dark:text-white text-xl font-black italic tracking-tighter hover:bg-rose-500/5 transition-all shadow-xl"
              onClick={() => navigate('/practice')}
            >
              EXIT TO SANCTUARY
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return null;
};

export default MockTest;
