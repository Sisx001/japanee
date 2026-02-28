import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume2, BookOpen, ChevronRight, ChevronLeft, Check, X, Sparkles, Brain, Zap } from 'lucide-react';
import { READING_PASSAGES } from '@/data/CompleteJapaneseContent';
import { TranslateHelper } from '@/components/ui/TranslateHelper';

const ReadingPractice = () => {
  const { settings } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showRomaji, setShowRomaji] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  const [isAutoFlow, setIsAutoFlow] = useState(false);
  const [autoFlowTimer, setAutoFlowTimer] = useState(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  // Pattern SVG for card backgrounds
  const asanohaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath fill='%236366f1' fill-opacity='0.05' d='M40 0l40 40-40 40L0 40z'/%3E%3C/svg%3E")`;

  const currentPassage = READING_PASSAGES[currentPassageIndex];
  const currentParagraph = currentPassage?.paragraphs[currentParagraphIndex];
  const totalParagraphs = currentPassage?.paragraphs.length || 0;
  const currentQuestion = currentPassage?.questions?.[currentQuestionIndex];

  const handleSpeak = (text) => {
    initializeAudio();
    speak(text);
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentParagraphIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  // Auto-Flow Logic
  useEffect(() => {
    if (isAutoFlow && !showQuiz) {
      const timer = setTimeout(() => {
        if (currentParagraphIndex < totalParagraphs - 1) {
          setCurrentParagraphIndex(prev => prev + 1);
        } else {
          setShowQuiz(true);
          setIsAutoFlow(false);
        }
      }, 5000); // 5 seconds per paragraph
      return () => clearTimeout(timer);
    }
  }, [isAutoFlow, currentParagraphIndex, totalParagraphs, showQuiz]);

  useEffect(() => {
    if (emblaApi && !showQuiz) {
      emblaApi.scrollTo(currentParagraphIndex);
    }
  }, [currentParagraphIndex, emblaApi, showQuiz]);

  const nextParagraph = () => {
    if (currentParagraphIndex < totalParagraphs - 1) {
      setCurrentParagraphIndex(prev => prev + 1);
    } else {
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
    }
  };

  const prevParagraph = () => {
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex(prev => prev - 1);
    }
  };

  const selectAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentQuestion.answer;
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    playSound(isCorrect ? 'correct' : 'wrong');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentPassage?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      if (currentPassageIndex < READING_PASSAGES.length - 1) {
        setCurrentPassageIndex(prev => prev + 1);
        setCurrentParagraphIndex(0);
        setShowQuiz(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        playSound('complete');
      }
    }
  };

  if (!currentPassage) return <MainLayout><div className="h-[50vh] flex items-center justify-center text-slate-500 font-black uppercase tracking-widest">Registry Empty</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-10 py-6 md:py-10 pb-32">

        {/* Cinematic Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-1">Reading Practice</h1>
            <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 italic opacity-80">Japanese Studies // {currentPassage.level} Verification</p>
          </div>
          <div className="flex items-center gap-4 glass px-5 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl shadow-xl w-full md:w-auto justify-center">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black italic text-rose-500">{score.correct}/{score.total}</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Score</div>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
            <div className="text-center">
              <div className="text-xl md:text-2xl font-black italic text-indigo-500">{currentPassageIndex + 1}/{READING_PASSAGES.length}</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Progress</div>
            </div>
          </div>
        </div>

        {/* Progress System */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">
              {showQuiz ? 'COMPREHENSION TEST' : 'LOADING LESSON DATA'}
            </span>
            <span className="text-xs font-black italic text-slate-400">
              {showQuiz ? `NODE ${currentQuestionIndex + 1}/${currentPassage.questions?.length}` : `SEGMENT ${currentParagraphIndex + 1}/${totalParagraphs}`}
            </span>
          </div>
          <div className="h-2 w-full glass rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_#f43f5e]"
              style={{ width: `${showQuiz ? ((currentQuestionIndex + 1) / (currentPassage.questions?.length || 1)) * 100 : ((currentParagraphIndex + 1) / totalParagraphs) * 100}%` }}
            />
          </div>
        </div>

        {!showQuiz ? (
          /* Reading Interface */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="glass rounded-[3.5rem] border-0 overflow-hidden relative group">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none transition-opacity group-hover:opacity-[0.05]" style={{ backgroundImage: asanohaPattern }} />
              <CardHeader className="p-6 md:p-10 pb-0">
                <div className="flex justify-between items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white drop-shadow-sm leading-tight">{currentPassage.title_jp}</h2>
                  <Button variant="ghost" onClick={() => handleSpeak(currentPassage.paragraphs.map(p => p.jp).join('。'))} className="rounded-xl md:rounded-2xl h-10 w-10 md:h-14 md:w-14 glass hover:bg-rose-500/10 text-rose-500 shrink-0">
                    <Volume2 className="w-5 h-5 md:w-7 md:h-7" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-10 space-y-6 md:space-y-10">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {currentPassage.paragraphs.map((para, idx) => (
                      <div key={idx} className="flex-[0_0_100%] min-w-0 pl-1">
                        <div className="glass-light p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-rose-500/5 group/text transition-all hover:bg-white/40 dark:hover:bg-slate-900/60" onClick={() => handleSpeak(para.jp)}>
                          <div className="text-xl md:text-3xl font-black japanese-text leading-relaxed text-slate-800 dark:text-slate-100 drop-shadow-sm">
                            <TranslateHelper romaji={para?.romaji} bengali={para?.bn} english={para?.en} className="japanese-text-premium text-2xl md:text-3xl">{para?.jp}</TranslateHelper>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant={isAutoFlow ? 'default' : 'ghost'} onClick={() => setIsAutoFlow(!isAutoFlow)} className={`h-16 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all ${isAutoFlow ? 'bg-amber-500 text-white shadow-lg animate-pulse' : 'glass text-slate-400'}`}>
                    <Zap className={`w-4 h-4 mr-2 ${isAutoFlow ? 'animate-bounce' : ''}`} />
                    Zen Auto-Flow
                  </Button>
                  <Button variant={showRomaji ? 'default' : 'ghost'} onClick={() => setShowRomaji(!showRomaji)} className={`h-16 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all ${showRomaji ? 'bg-rose-500 text-white shadow-lg' : 'glass text-slate-400'}`}>Show Romaji</Button>
                  <Button variant={showTranslation ? 'default' : 'ghost'} onClick={() => setShowTranslation(!showTranslation)} className={`h-16 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all ${showTranslation ? 'bg-indigo-500 text-white shadow-lg' : 'glass text-slate-400'}`}>Show Translation</Button>
                </div>

                {(showRomaji || showTranslation) && (
                  <div className="p-8 glass rounded-[2.5rem] mt-6 animate-in zoom-in-95 space-y-4">
                    {showRomaji && <p className="text-sm font-black italic text-slate-500 tracking-widest">{currentParagraph?.romaji}</p>}
                    {showTranslation && <p className="text-lg font-black text-indigo-500 drop-shadow-sm italic">"{language === 'bn' ? currentParagraph?.bn : currentParagraph?.en}"</p>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                  <Button variant="ghost" onClick={prevParagraph} disabled={currentParagraphIndex === 0} className="flex-1 h-14 md:h-20 rounded-xl md:rounded-[2rem] glass font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 text-[10px] md:text-base">
                    <ChevronLeft className="mr-2 w-5 h-5 md:w-6 md:h-6" /> PREVIOUS
                  </Button>
                  <Button onClick={nextParagraph} className="flex-1 h-14 md:h-20 rounded-xl md:rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic shadow-2xl hover:scale-105 transition-all text-[10px] md:text-base">
                    {currentParagraphIndex === totalParagraphs - 1 ? 'START QUIZ' : 'NEXT SEGMENT'} <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Quiz Interface */
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <Card className="glass rounded-[3.5rem] border-0 overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: asanohaPattern }} />
              <CardHeader className="p-12 text-center pb-0">
                <h2 className="text-xl font-black uppercase tracking-[0.3em] text-rose-500 italic mb-4">Logic Verification</h2>
                <p className="text-3xl font-black japanese-text text-slate-900 dark:text-white mb-4 leading-tight">{currentQuestion?.q_jp}</p>
                <p className="text-sm font-black text-slate-400 italic uppercase tracking-widest">"{language === 'bn' ? currentQuestion?.q_bn : currentQuestion?.q_en}"</p>
              </CardHeader>
              <CardContent className="p-12 space-y-10">
                <div className="grid grid-cols-1 gap-4">
                  {currentPassage.paragraphs.slice(0, 4).map((para, idx) => {
                    const isCorrect = currentQuestion?.answer && para.jp.includes(currentQuestion.answer);
                    const isSelected = selectedAnswer === para.jp;
                    let style = "glass hover:border-rose-500/50";
                    if (showResult) {
                      if (isCorrect) style = "bg-green-500 text-white border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.02]";
                      else if (isSelected) style = "bg-rose-500 text-white border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]";
                      else style = "opacity-40 grayscale";
                    }
                    return (
                      <Button key={idx} variant="ghost" className={`h-20 md:h-24 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all duration-300 text-left justify-start ${style}`} onClick={() => !showResult && selectAnswer(para.jp)} disabled={showResult}>
                        <span className="font-black japanese-text text-base md:text-lg block truncate">{para.jp}</span>
                      </Button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className={`p-10 rounded-[2.5rem] text-center space-y-4 animate-in slide-in-from-top-4 ${selectedAnswer?.includes(currentQuestion?.answer) ? 'bg-green-500/10 border border-green-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
                    <div className="flex items-center justify-center gap-3">
                      {selectedAnswer?.includes(currentQuestion?.answer) ? <><Check className="w-8 h-8 text-green-500" /><span className="text-2xl font-black text-green-500 italic uppercase tracking-tighter">Sync Verified</span></> : <><X className="w-8 h-8 text-rose-500" /><span className="text-2xl font-black text-rose-500 italic uppercase tracking-tighter">Link Failure</span></>}
                    </div>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{t('Correct Answer', 'সঠিক উত্তর')}: <span className="text-indigo-500 font-bold">{currentQuestion?.answer}</span></p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {showResult && (
                    <Button className="w-full h-20 md:h-24 rounded-[1.5rem] md:rounded-[2.5rem] bg-rose-500 text-white text-xl md:text-2xl font-black italic tracking-tighter shadow-2xl shadow-rose-500/20 hover:scale-105 transition-all" onClick={nextQuestion}>
                      {currentQuestionIndex < (currentPassage.questions?.length || 0) - 1 ? 'NEXT QUESTION' : 'LESSON COMPLETE'} <ChevronRight className="ml-2 w-5 h-5 md:w-7 md:h-7" />
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => setShowQuiz(false)} className="h-16 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 italic">Review Stream History</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ReadingPractice;
