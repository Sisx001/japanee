import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, Trophy, Zap, Clock, Target, Check, X, ChevronRight, Star, Flame } from 'lucide-react';
import { HIRAGANA, N5_VOCABULARY, N5_KANJI } from '@/data/CompleteJapaneseContent';

const DailyChallenge = () => {
  const navigate = useNavigate();
  const { progress, addXP, updateStreak } = useProfile();
  const { t, language } = useSettings();

  const [challenges, setChallenges] = useState([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const generateOptions = (correct, pool) => {
    const options = [correct];
    const filtered = [...new Set(pool)].filter(o => o !== correct);
    while (options.length < 4 && filtered.length > 0) {
      const idx = Math.floor(Math.random() * filtered.length);
      options.push(filtered.splice(idx, 1)[0]);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    // Build challenges from local data
    const kanaPool = [...HIRAGANA].sort(() => Math.random() - 0.5).slice(0, 10);
    const kanaRomajiPool = HIRAGANA.map(h => h.romaji);
    const kanaQuestions = kanaPool.map(k => ({
      id: k.char,
      type: 'kana',
      prompt: k.char,
      answer: k.romaji,
      options: generateOptions(k.romaji, kanaRomajiPool)
    }));

    const vocabPool = [...N5_VOCABULARY].sort(() => Math.random() - 0.5).slice(0, 15);
    const vocabMeanings = N5_VOCABULARY.map(v => v.meaning);
    const vocabQuestions = vocabPool.map(v => ({
      id: v.word,
      type: 'vocab',
      prompt: v.word,
      answer: v.meaning,
      options: generateOptions(v.meaning, vocabMeanings)
    }));

    const kanjiPool = [...N5_KANJI].sort(() => Math.random() - 0.5).slice(0, 10);
    const kanjiMeanings = N5_KANJI.map(k => k.meaning);
    const kanjiQuestions = kanjiPool.map(k => ({
      id: k.kanji,
      type: 'kanji',
      prompt: k.kanji,
      answer: k.meaning,
      options: generateOptions(k.meaning, kanjiMeanings)
    }));

    setChallenges([
      { type: 'kana_speed', title: t('Kana Speed Round', 'কানা স্পিড রাউন্ড'), icon: '⚡', timeLimit: 60, xpBonus: 25, questions: kanaQuestions },
      { type: 'vocab_flashcard', title: t('Vocabulary Flash', 'শব্দভান্ডার ফ্ল্যাশ'), icon: '📚', timeLimit: 0, xpBonus: 30, questions: vocabQuestions },
      { type: 'kanji_meaning', title: t('Kanji Meanings', 'কাঞ্জি অর্থ'), icon: '漢', timeLimit: 0, xpBonus: 35, questions: kanjiQuestions }
    ]);
    setLoading(false);
  }, [language]);

  // Timer
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          toast.info(t("Time's up!", 'সময় শেষ!'));
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const currentChallenge = challenges[currentChallengeIndex];
  const currentQuestion = currentChallenge?.questions?.[currentQuestionIndex];

  const handleStartChallenge = () => {
    if (currentChallenge?.timeLimit > 0) {
      setTimeLeft(currentChallenge.timeLimit);
      setTimerActive(true);
    }
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.answer;
    const key = `${currentChallengeIndex}-${currentQuestionIndex}`;
    setAnswers(prev => ({ ...prev, [key]: { answer, correct: isCorrect } }));
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentQuestionIndex < currentChallenge.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTimerActive(false);
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        handleAllComplete();
      }
    }
  };

  const handleAllComplete = () => {
    let correctCount = 0;
    Object.values(answers).forEach(a => { if (a.correct) correctCount++; });
    const baseXP = challenges.reduce((sum, c) => sum + c.xpBonus, 0);
    const bonusXP = Math.round(correctCount * 2);
    const totalXP = baseXP + bonusXP;
    addXP(totalXP);
    updateStreak();
    setChallengeComplete(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-accent" />
            <p className="text-muted-foreground">{t('Loading challenges...', 'চ্যালেঞ্জ লোড হচ্ছে...')}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (challengeComplete) {
    let correctCount = 0, totalQuestions = 0;
    Object.values(answers).forEach(a => { totalQuestions++; if (a.correct) correctCount++; });
    const baseXP = challenges.reduce((sum, c) => sum + c.xpBonus, 0);
    const bonusXP = Math.round(correctCount * 2);
    const totalXP = baseXP + bonusXP;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-12 animate-bounce-in">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-3xl font-bold mb-4">{t('Daily Challenge Complete!', 'দৈনিক চ্যালেঞ্জ সম্পূর্ণ!')}</h1>

          <Card className="rounded-3xl card-shadow mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 text-center mb-6">
                <div>
                  <div className="text-4xl font-bold text-primary">{totalXP}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-success">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
              <div className="flex justify-center gap-2">
                {challenges.map((c, idx) => (
                  <div key={idx} className="text-center px-4 py-2 bg-muted rounded-xl">
                    <div className="text-2xl">{c.icon}</div>
                    <div className="text-xs font-medium mt-1">+{c.xpBonus} XP</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-streak" />
              <span className="font-bold">
                {t(`Streak: ${(progress.streak || 0) + 1} days!`, `স্ট্রিক: ${(progress.streak || 0) + 1} দিন!`)}
              </span>
            </div>
          </div>

          <Link to="/dashboard">
            <Button className="w-full rounded-full bg-primary text-primary-foreground btn-3d">
              {t('Back to Dashboard', 'ড্যাশবোর্ডে ফিরুন')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Challenge intro (no current question yet / before start)
  if (!currentQuestion) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/practice')} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Exit', 'বের হন')}
            </Button>
            <span className="text-sm text-muted-foreground">
              Challenge {currentChallengeIndex + 1}/{challenges.length}
            </span>
          </div>

          <Card className="rounded-3xl card-shadow mb-6 text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">{currentChallenge?.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{currentChallenge?.title}</h2>
              <p className="text-muted-foreground mb-6">{currentChallenge?.questions?.length} questions</p>

              <div className="flex justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentChallenge?.questions?.length}</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                {currentChallenge?.timeLimit > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">{currentChallenge.timeLimit}s</div>
                    <div className="text-xs text-muted-foreground">Time Limit</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-foreground">+{currentChallenge?.xpBonus}</div>
                  <div className="text-xs text-muted-foreground">XP Bonus</div>
                </div>
              </div>

              <Button
                className="rounded-full bg-primary text-primary-foreground btn-3d px-8"
                onClick={handleStartChallenge}
              >
                {t('Start Challenge', 'চ্যালেঞ্জ শুরু করুন')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Question view
  const challengeProgress = ((currentQuestionIndex + 1) / currentChallenge.questions.length) * 100;
  const currentAnswer = answers[`${currentChallengeIndex}-${currentQuestionIndex}`];

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentChallenge.icon}</span>
            <span className="font-medium">{currentChallenge.title}</span>
          </div>
          {timerActive && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${timeLeft <= 10 ? 'bg-destructive/20 text-destructive' : 'bg-info/20 text-info'
              }`}>
              <Clock className="w-4 h-4" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          )}
        </div>

        <Progress value={challengeProgress} className="h-2 rounded-full mb-6" />

        <Card className="rounded-3xl card-shadow mb-6">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {currentQuestion.type === 'kana'
                ? t('What is the romaji?', 'রোমাজি কী?')
                : t('What is the meaning?', 'অর্থ কী?')}
            </p>

            <div className="text-6xl font-bold japanese-text text-primary mb-2">
              {currentQuestion.prompt}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {currentQuestion.options.map((option, idx) => {
                let buttonClass = 'rounded-2xl h-14 text-base font-medium transition-all';
                if (showResult) {
                  if (option === currentQuestion.answer) {
                    buttonClass += ' bg-success text-white';
                  } else if (currentAnswer?.answer === option && !currentAnswer?.correct) {
                    buttonClass += ' bg-destructive text-white';
                  } else {
                    buttonClass += ' bg-muted opacity-50';
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant={showResult ? 'default' : 'outline'}
                    className={buttonClass}
                    onClick={() => !showResult && handleAnswer(option)}
                    disabled={showResult}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            {showResult && (
              <div className={`mt-6 p-4 rounded-2xl ${currentAnswer?.correct ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <div className="flex items-center justify-center gap-2">
                  {currentAnswer?.correct ? (
                    <>
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-bold text-success">{t('Correct!', 'সঠিক!')}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-destructive" />
                      <span className="font-bold text-destructive">
                        {t('Answer:', 'উত্তর:')} {currentQuestion.answer}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {showResult && (
          <Button
            className="w-full rounded-full bg-primary text-primary-foreground btn-3d h-14"
            onClick={handleNext}
          >
            {t('Next', 'পরবর্তী')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default DailyChallenge;
