import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft, ChevronRight, Check, X, Clock, Trophy,
  Target, AlertCircle, BookOpen, FileText, Volume2, Sparkles, Brain, Zap, ShieldAlert
} from 'lucide-react';
import { N5_VOCABULARY, N5_KANJI, N5_GRAMMAR, N4_KANJI } from '@/data/CompleteJapaneseContent';

const MockTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addXP, settings, markLearned } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;
  const difficulty = settings?.difficulty || 'easy';

  const level = searchParams.get('level') || 'N5';

  const [phase, setPhase] = useState('intro'); // intro, test, results
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Pattern SVG for card backgrounds
  const seigaihaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Cpath fill='%23f43f5e' fill-opacity='0.05' d='M0 30c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM12.5 15c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM0 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z'/%3E%3C/svg%3E")`;

  // Difficulty configurations (Same as original but with themed labels)
  const DIFFICULTY_RULES = {
    easy: { timerMultiplier: 0, hintsAllowed: Infinity, passingThreshold: 50, xpMultiplier: 0.8, label: 'TRAINEE' },
    medium: { timerMultiplier: 1.0, hintsAllowed: 3, passingThreshold: 65, xpMultiplier: 1.0, label: 'OPERATOR' },
    hard: { timerMultiplier: 0.7, hintsAllowed: 0, passingThreshold: 85, xpMultiplier: 1.5, label: 'ELITE' }
  };

  const rules = DIFFICULTY_RULES[difficulty];

  const TEST_CONFIG = {
    N5: { name: 'JLPT N5 COLLECTIVE EXAM', name_bn: 'JLPT N5 কালেক্টিভ এক্সাম', baseTime: 25 * 60, sections: [{ type: 'vocab', name: 'VOCABULARY', questions: 10 }, { type: 'kanji', name: 'KANJI HUB', questions: 8 }, { type: 'grammar', name: 'GRAMMAR', questions: 7 }] },
    N4: { name: 'JLPT N4 COLLECTIVE EXAM', name_bn: 'JLPT N4 কালেক্টিভ এক্সাম', baseTime: 30 * 60, sections: [{ type: 'vocab', name: 'VOCABULARY', questions: 12 }, { type: 'kanji', name: 'KANJI HUB', questions: 10 }, { type: 'grammar', name: 'GRAMMAR', questions: 8 }] }
  };

  const config = TEST_CONFIG[level];

  // (Effect hooks and helper functions remain logically same)
  useEffect(() => {
    const generateOptions = (correct, all) => {
      const opts = [correct];
      const filtered = [...new Set(all)].filter(o => o !== correct && o);
      while (opts.length < 4 && filtered.length > 0) {
        opts.push(filtered.splice(Math.floor(Math.random() * filtered.length), 1)[0]);
      }
      return opts.sort(() => Math.random() - 0.5);
    };

    const generateQuestions = () => {
      const data = [];
      const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
      for (const section of config.sections) {
        let qs = [];
        const count = difficulty === 'easy' ? Math.max(3, Math.floor(section.questions * 0.7)) :
          difficulty === 'hard' ? Math.floor(section.questions * 1.3) : section.questions;

        if (section.type === 'vocab') {
          qs = shuffle(N5_VOCABULARY).slice(0, count).map(v => ({ id: v.id, prompt: v.kanji || v.kana, sub: v.romaji, ans: v.en, type: 'vocab', options: generateOptions(v.en, N5_VOCABULARY.map(x => x.en)), audio: v.kana, hint: v.kana }));
        } else if (section.type === 'kanji') {
          const kData = level === 'N5' ? N5_KANJI : [...N5_KANJI, ...N4_KANJI];
          qs = shuffle(kData).slice(0, count).map(k => ({ id: k.char, prompt: k.char, sub: null, ans: k.en, type: 'kanji', options: generateOptions(k.en, kData.map(x => x.en)), audio: k.char, hint: k.on?.[0] || k.kun?.[0] }));
        } else if (section.type === 'grammar') {
          qs = shuffle(N5_GRAMMAR).slice(0, count).map(g => ({ id: g.id, prompt: g.pattern, sub: g.examples[0]?.jp, ans: g.meaning, type: 'grammar', options: generateOptions(g.meaning, N5_GRAMMAR.map(x => x.meaning)), audio: g.pattern, hint: g.explanation?.substring(0, 30) + "..." }));
        }
        data.push({ ...section, questions: qs });
      }
      setSections(data);
      setLoading(false);
    };
    generateQuestions();
  }, [level, difficulty, config.sections]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0 || rules?.timerMultiplier === 0) return;
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) {
        setTimerActive(false);
        toast.error("TIME EXPIRED: SIMULATION ENDED.");
        calculateResults();
        return 0;
      }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [timerActive, timeLeft, rules?.timerMultiplier, calculateResults]);

  const calculateResults = useCallback(() => {
    setTimerActive(false);
    let correctCount = 0;
    sections.forEach((s, sI) => { s.questions.forEach((_, qI) => { if (answers[`${sI}-${qI}`]?.correct) correctCount++; }); });
    const totalQs = sections.reduce((sum, s) => sum + s.questions.length, 0);
    const passed = Math.round((correctCount / totalQs) * 100) >= rules.passingThreshold;
    addXP(Math.floor(correctCount * 10 * rules.xpMultiplier + (passed ? 50 : 0)));
    playSound(passed ? 'levelup' : 'wrong');
    setPhase('results');
  }, [sections, answers, rules, addXP, playSound]);



  const startTest = () => {
    setPhase('test');
    if (rules?.timerMultiplier > 0 && config?.baseTime) {
      setTimeLeft(Math.floor(config.baseTime * rules.timerMultiplier));
      setTimerActive(true);
    }
  };
  const handleAnswer = (ans) => {
    const isCorrect = ans === currentQuestion.ans;
    setAnswers(p => ({ ...p, [`${currentSectionIndex}-${currentQuestionIndex}`]: { ans, correct: isCorrect } }));
    setShowResult(true);
    setShowHint(false);
  };

  const handleNext = () => {
    if (!currentSection) return;
    setShowResult(false);
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(p => p + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(p => p + 1);
      setCurrentQuestionIndex(0);
    } else {
      calculateResults();
    }
  };

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions?.[currentQuestionIndex];
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const questionsDone = sections.slice(0, currentSectionIndex).reduce((sum, s) => sum + s.questions.length, 0) + currentQuestionIndex + 1;
  const progress = (questionsDone / totalQuestions) * 100;

  if (loading) return <MainLayout><div className="flex h-[50vh] items-center justify-center"><Brain className="animate-spin w-12 h-12 text-rose-500" /></div></MainLayout>;

  if (phase === 'intro') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-8 md:space-y-10 py-6 md:py-10 px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">{t(config.name, config.name_bn)}</h1>
            <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 md:px-4 py-1 rounded-full font-black text-[8px] md:text-xs tracking-[0.2em] italic uppercase">{rules.label} TRADITION ACTIVE</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: seigaihaPattern }} />
              <div className="relative z-10 space-y-4 md:space-y-6">
                <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-rose-500 italic">Parameters</h3>
                {[
                  { label: 'Time Limit', val: rules.timerMultiplier === 0 ? 'INF.' : Math.floor((config.baseTime * rules.timerMultiplier) / 60) + 'M' },
                  { label: 'Neural Hints', val: rules.hintsAllowed === Infinity ? 'MAX' : rules.hintsAllowed },
                  { label: 'Sync Target', val: rules.passingThreshold + '%' }
                ].map((p, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-[10px] md:text-xs font-black uppercase text-slate-500">{p.label}</span>
                    <span className="text-base md:text-lg font-black italic">{p.val}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="premium-gradient rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-60 italic">Reward Uplink</h3>
                <div className="text-3xl md:text-5xl font-black italic mt-1 md:mt-2">x{rules.xpMultiplier} XP</div>
              </div>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-80 mt-4 italic">Multiplier active for this session.</p>
            </Card>
          </div>

          <div className="space-y-4 pt-4">
            <Button className="w-full h-16 md:h-24 rounded-2xl md:rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 text-lg md:text-2xl font-black italic tracking-tighter hover:scale-[1.02] transition-all shadow-2xl" onClick={startTest}>
              INITIATE NEURAL LINK
            </Button>
            <Link to="/practice" className="block text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors uppercase italic">Abort Simulation</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (phase === 'results') {
    let correctCount = 0;
    sections.forEach((s, sI) => { s.questions.forEach((_, qI) => { if (answers[`${sI}-${qI}`]?.correct) correctCount++; }); });
    const totalQs = sections.reduce((sum, s) => sum + s.questions.length, 0);
    const score = Math.round((correctCount / totalQs) * 100);
    const passed = score >= rules.passingThreshold;

    return (
      <MainLayout>
        <div className="max-w-xl mx-auto py-20 text-center space-y-12">
          <div className="relative inline-block">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${passed ? 'border-green-500 text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'border-rose-500 text-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]'} bg-white dark:bg-slate-900`}>
              {passed ? <Trophy className="w-20 h-20" /> : <ShieldAlert className="w-20 h-20" />}
            </div>
            {passed && <Sparkles className="w-10 h-10 text-amber-500 absolute -top-4 -right-4 animate-pulse" />}
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase">{passed ? 'Mastery Achieved' : 'Practice Incomplete'}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Traditional Harmony: {score}% Efficiency</p>
          </div>

          <Card className="glass rounded-[3rem] p-12 grid grid-cols-2 gap-8 border-0">
            <div className="text-center space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-500">Precision</div>
              <div className="text-5xl font-black italic">{score}%</div>
            </div>
            <div className="text-center space-y-2 border-l border-white/10">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">XP Earned</div>
              <div className="text-5xl font-black italic">+{Math.floor(correctCount * 10 * rules.xpMultiplier)}</div>
            </div>
          </Card>

          <div className="space-y-4">
            <Button className="w-full h-20 rounded-[2.5rem] bg-rose-500 text-white text-xl font-black italic shadow-2xl shadow-rose-500/20 hover:scale-[1.02] transition-all" onClick={() => window.location.reload()}>RETRY EXAM</Button>
            <Link to="/practice" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors italic">Return to Sanctuary</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center font-black italic text-rose-500 shadow-lg">#{questionsDone}</div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">{currentSection.name}</h2>
              <p className="text-[10px] font-black uppercase text-slate-500 italic">Topic Active // {questionsDone}/{totalQuestions}</p>
            </div>
          </div>
          {rules.timerMultiplier > 0 && (
            <div className={`px-6 py-3 rounded-2xl font-mono text-xl font-black italic ${timeLeft < 60 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="h-2 w-full glass rounded-full overflow-hidden p-0.5">
          <div className="h-full bg-rose-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_#f43f5e]" style={{ width: `${progress}%` }} />
        </div>

        <Card className="glass rounded-[2rem] md:rounded-[3.5rem] min-h-[350px] md:min-h-[450px] border-0 flex flex-col justify-center relative overflow-hidden mx-4">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: seigaihaPattern }} />


          <CardContent className="p-8 md:p-12 text-center relative z-10 flex flex-col items-center">
            {/* Safe Prompt Container */}
            <div className="w-full flex flex-col items-center justify-center py-2 md:py-10 mb-2 md:mb-8 min-h-[120px] md:min-h-[250px] space-y-2 md:space-y-8">
              <span className="text-3xl sm:text-5xl md:text-9xl font-black italic japanese-text text-slate-900 dark:text-white drop-shadow-2xl leading-none px-2 break-words text-center">
                {currentQuestion.prompt}
              </span>
              {currentQuestion.sub && (
                <p className="text-[8px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-slate-400 italic mt-2 md:mt-6">
                  {currentQuestion.sub}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 md:h-16 md:w-16 rounded-2xl glass hover:bg-rose-500/10 text-rose-500 border-rose-500/20 mb-12 shadow-lg"
              onClick={() => speak(currentQuestion.audio)}
            >
              <Volume2 className="w-7 h-7 md:w-8 md:h-8" />
            </Button>

            {/* Hint Toggle - Distinct container */}
            {rules.hintsAllowed > 0 && !showResult && (
              <div className="w-full flex justify-center mb-12">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-black text-xs tracking-widest uppercase border border-amber-500/30 hover:bg-amber-500/20 rounded-full h-12 px-8 shadow-xl backdrop-blur-md"
                  onClick={() => { if (hintsUsed < rules.hintsAllowed) { setHintsUsed(p => p + 1); setShowHint(true); } }}
                >
                  <Zap className="w-4 h-4 mr-2" /> NEURAL HINT [{hintsUsed}/{rules.hintsAllowed}]
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {currentQuestion.options.map((opt, i) => {
                const isCorrect = opt === currentQuestion.ans;
                const isChosen = answers[`${currentSectionIndex}-${currentQuestionIndex}`]?.ans === opt;
                let style = "bg-white/40 dark:bg-slate-900/40 border-rose-500/10 hover:border-rose-500/50";
                if (showResult) {
                  if (isCorrect) style = "bg-green-500 text-white border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.05]";
                  else if (isChosen) style = "bg-rose-500 text-white border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]";
                  else style = "opacity-40 grayscale";
                }
                return (
                  <Button key={i} className={`h-16 md:h-24 rounded-xl md:rounded-[1.5rem] text-sm md:text-xl font-black italic tracking-tight border-2 transition-all duration-300 ${style}`} onClick={() => !showResult && handleAnswer(opt)} disabled={showResult}>
                    {opt.toUpperCase()}
                  </Button>
                );
              })}
            </div>
          </CardContent>

        </Card>

        {showHint && !showResult && (
          <div className="glass-light p-6 rounded-[2rem] border border-amber-500/20 text-center animate-in zoom-in-95">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2 block">Aide Active</span>
            <p className="text-xl font-black italic text-amber-600 dark:text-amber-400">"{currentQuestion.hint}"</p>
          </div>
        )}

        {showResult && (
          <div className="px-4">
            <Button className="w-full h-16 md:h-24 rounded-xl md:rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 text-lg md:text-2xl font-black italic tracking-tighter animate-in slide-in-from-top-4 duration-500 shadow-2xl" onClick={handleNext}>
              {questionsDone === totalQuestions ? 'COMPLETE EXAM' : 'NEXT QUESTION'}
              <ChevronRight className="ml-2 w-6 h-6 md:w-7 md:h-7" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MockTest;
