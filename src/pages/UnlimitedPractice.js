import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Volume2, Check, X, ChevronRight, Zap, Target, Trophy, Flame, Clock } from 'lucide-react';
import { HIRAGANA, KATAKANA, N5_VOCABULARY, N5_KANJI, N5_GRAMMAR } from '@/data/CompleteJapaneseContent';

// Helper function for weighted random selection
const weightedRandom = (items, weights) => {
  if (items.length === 0) return 'kana';
  const totalWeight = items.reduce((sum, item) => sum + (weights[item] || 1), 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= weights[item] || 1;
    if (random <= 0) return item;
  }
  return items[0];
};

const UnlimitedPractice = () => {
  const { settings } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  // Use global difficulty setting, default to adaptive
  const globalDifficulty = settings?.difficulty || 'easy';

  const [questionType, setQuestionType] = useState('all'); // all, kana, vocab, kanji, grammar
  const [difficulty, setDifficulty] = useState(globalDifficulty === 'easy' ? 'adaptive' : globalDifficulty); // Use global setting
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(globalDifficulty === 'hard' ? 3 : globalDifficulty === 'medium' ? 2 : 1); // Start based on global difficulty
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0,
    xp: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0
  });
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Adaptive difficulty adjustment
  useEffect(() => {
    if (difficulty === 'adaptive') {
      // Increase difficulty after 3 correct in a row
      if (stats.consecutiveCorrect >= 3 && adaptiveDifficulty < 5) {
        setAdaptiveDifficulty(prev => Math.min(5, prev + 1));
        setStats(prev => ({ ...prev, consecutiveCorrect: 0 }));
      }
      // Decrease difficulty after 2 wrong in a row
      if (stats.consecutiveWrong >= 2 && adaptiveDifficulty > 1) {
        setAdaptiveDifficulty(prev => Math.max(1, prev - 1));
        setStats(prev => ({ ...prev, consecutiveWrong: 0 }));
      }
    }
  }, [stats.consecutiveCorrect, stats.consecutiveWrong, difficulty, adaptiveDifficulty]);

  // Timer
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current difficulty level
  const getCurrentDifficulty = useCallback(() => {
    if (difficulty !== 'adaptive') return difficulty;
    if (adaptiveDifficulty <= 2) return 'easy';
    if (adaptiveDifficulty <= 3) return 'medium';
    return 'hard';
  }, [difficulty, adaptiveDifficulty]);

  // Generate a random question based on difficulty
  const generateQuestion = useCallback(() => {
    const types = questionType === 'all'
      ? ['kana', 'vocab', 'kanji', 'grammar']
      : [questionType];

    // Adjust type weights based on difficulty
    const currentDiff = getCurrentDifficulty();
    let selectedType;

    if (currentDiff === 'easy') {
      // More kana/basic vocab
      const weights = { kana: 4, vocab: 3, kanji: 2, grammar: 1 };
      selectedType = weightedRandom(types.filter(t => weights[t]), weights);
    } else if (currentDiff === 'hard') {
      // More kanji/grammar
      const weights = { kana: 1, vocab: 2, kanji: 4, grammar: 3 };
      selectedType = weightedRandom(types.filter(t => weights[t]), weights);
    } else {
      selectedType = types[Math.floor(Math.random() * types.length)];
    }

    let question = null;

    switch (selectedType) {
      case 'kana': {
        const allKana = [...HIRAGANA, ...KATAKANA];
        const kana = allKana[Math.floor(Math.random() * allKana.length)];
        const isReverse = Math.random() > 0.5;

        // Generate wrong options
        const wrongOptions = allKana
          .filter(k => k.romaji !== kana.romaji)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => isReverse ? k.char : k.romaji);

        question = {
          type: 'kana',
          questionFormat: isReverse ? 'mcq' : Math.random() > 0.5 ? 'mcq' : 'input',
          prompt: isReverse ? kana.romaji : kana.char,
          answer: isReverse ? kana.char : kana.romaji,
          options: isReverse
            ? [kana.char, ...wrongOptions].sort(() => Math.random() - 0.5)
            : [kana.romaji, ...wrongOptions].sort(() => Math.random() - 0.5),
          hint: isReverse
            ? `The ${HIRAGANA.find(h => h.char === kana.char) ? 'hiragana' : 'katakana'} for "${kana.romaji}"`
            : `Romaji for this character`,
          audio: kana.romaji
        };
        break;
      }

      case 'vocab': {
        const vocab = N5_VOCABULARY[Math.floor(Math.random() * N5_VOCABULARY.length)];
        const questionTypes = ['meaning', 'reading', 'sentence'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        const wrongMeanings = N5_VOCABULARY
          .filter(v => v.id !== vocab.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(v => v.en);

        if (qType === 'meaning') {
          question = {
            type: 'vocab',
            subType: 'meaning',
            questionFormat: 'mcq',
            prompt: vocab.kanji || vocab.kana,
            subPrompt: vocab.kanji ? vocab.kana : null,
            answer: vocab.en,
            options: [vocab.en, ...wrongMeanings].sort(() => Math.random() - 0.5),
            hint: `Category: ${vocab.category}`,
            audio: vocab.kana
          };
        } else if (qType === 'reading') {
          question = {
            type: 'vocab',
            subType: 'reading',
            questionFormat: 'input',
            prompt: `What is the romaji for: ${vocab.kanji || vocab.kana}`,
            answer: vocab.romaji,
            hint: vocab.en,
            audio: vocab.kana
          };
        } else {
          question = {
            type: 'vocab',
            subType: 'sentence',
            questionFormat: 'mcq',
            prompt: vocab.sentence?.jp || vocab.kana,
            subPrompt: vocab.sentence?.romaji,
            answer: vocab.sentence?.en || vocab.en,
            options: [vocab.sentence?.en || vocab.en, ...wrongMeanings].sort(() => Math.random() - 0.5),
            hint: `Contains: ${vocab.en}`,
            audio: vocab.sentence?.jp || vocab.kana
          };
        }
        break;
      }

      case 'kanji': {
        const kanji = N5_KANJI[Math.floor(Math.random() * N5_KANJI.length)];
        const questionTypes = ['meaning', 'onyomi', 'kunyomi'];
        const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        const wrongMeanings = N5_KANJI
          .filter(k => k.char !== kanji.char)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.en);

        const wrongOn = N5_KANJI
          .filter(k => k.char !== kanji.char && k.on.length > 0)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.on[0]);

        const wrongKun = N5_KANJI
          .filter(k => k.char !== kanji.char && k.kun.length > 0)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(k => k.kun[0]);

        if (qType === 'meaning') {
          question = {
            type: 'kanji',
            subType: 'meaning',
            questionFormat: 'mcq',
            prompt: kanji.char,
            answer: kanji.en,
            options: [kanji.en, ...wrongMeanings].sort(() => Math.random() - 0.5),
            hint: `${kanji.strokes} strokes`,
            audio: kanji.on[0] || kanji.kun[0]?.replace('.', '') || kanji.en
          };
        } else if (qType === 'onyomi' && kanji.on.length > 0) {
          question = {
            type: 'kanji',
            subType: 'onyomi',
            questionFormat: 'mcq',
            prompt: `On'yomi for: ${kanji.char}`,
            subPrompt: `Meaning: ${kanji.en}`,
            answer: kanji.on[0],
            options: [kanji.on[0], ...wrongOn].sort(() => Math.random() - 0.5),
            hint: 'Chinese reading',
            audio: kanji.on[0]
          };
        } else if (kanji.kun.length > 0) {
          question = {
            type: 'kanji',
            subType: 'kunyomi',
            questionFormat: 'mcq',
            prompt: `Kun'yomi for: ${kanji.char}`,
            subPrompt: `Meaning: ${kanji.en}`,
            answer: kanji.kun[0],
            options: [kanji.kun[0], ...wrongKun].sort(() => Math.random() - 0.5),
            hint: 'Japanese reading',
            audio: kanji.kun[0]?.replace('.', '')
          };
        } else {
          // Fallback to meaning
          question = {
            type: 'kanji',
            subType: 'meaning',
            questionFormat: 'mcq',
            prompt: kanji.char,
            answer: kanji.en,
            options: [kanji.en, ...wrongMeanings].sort(() => Math.random() - 0.5),
            hint: `${kanji.strokes} strokes`,
            audio: kanji.en
          };
        }
        break;
      }

      case 'grammar': {
        const grammar = N5_GRAMMAR[Math.floor(Math.random() * N5_GRAMMAR.length)];
        const wrongMeanings = N5_GRAMMAR
          .filter(g => g.id !== grammar.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(g => g.meaning);

        const example = grammar.examples[Math.floor(Math.random() * grammar.examples.length)];

        question = {
          type: 'grammar',
          questionFormat: 'mcq',
          prompt: grammar.pattern,
          subPrompt: example?.jp,
          answer: grammar.meaning,
          options: [grammar.meaning, ...wrongMeanings].sort(() => Math.random() - 0.5),
          hint: example?.en,
          audio: example?.jp || grammar.pattern,
          explanation: grammar.explanation
        };
        break;
      }

      default:
        break;
    }

    return question;
  }, [questionType, getCurrentDifficulty]);

  // Load first question
  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [generateQuestion]);

  const loadNextQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
    setShowResult(false);
  };

  const handleSpeak = () => {
    initializeAudio();
    if (currentQuestion?.audio) {
      speak(currentQuestion.audio);
    }
  };

  const checkAnswer = (answer = userAnswer) => {
    if (!currentQuestion) return;

    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = currentQuestion.answer.toLowerCase().trim();

    const correct = normalizedAnswer === normalizedCorrect;

    setIsCorrect(correct);
    setShowResult(true);

    // Calculate XP based on difficulty and type
    let xpGained = 0;
    if (correct) {
      xpGained = currentQuestion.type === 'grammar' ? 15
        : currentQuestion.type === 'kanji' ? 10
          : currentQuestion.type === 'vocab' ? 8
            : 5;

      if (currentQuestion.questionFormat === 'input') xpGained += 5;
      if (stats.streak >= 5) xpGained = Math.round(xpGained * 1.5);
    }

    setStats(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (correct ? 1 : 0),
      streak: correct ? prev.streak + 1 : 0,
      maxStreak: correct ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
      xp: prev.xp + xpGained,
      consecutiveCorrect: correct ? prev.consecutiveCorrect + 1 : 0,
      consecutiveWrong: correct ? 0 : prev.consecutiveWrong + 1
    }));

    playSound(correct ? 'correct' : 'wrong');
  };

  const difficultyLabel = () => {
    const diff = getCurrentDifficulty();
    if (diff === 'easy') return { text: t('Easy', 'সহজ'), color: 'bg-green-500' };
    if (diff === 'medium') return { text: t('Medium', 'মাঝারি'), color: 'bg-yellow-500' };
    return { text: t('Hard', 'কঠিন'), color: 'bg-red-500' };
  };

  const typeIcons = {
    kana: '🔤',
    vocab: '📚',
    kanji: '漢',
    grammar: '📝'
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Stats Header */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">{t('Questions', 'প্রশ্ন')}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-success">{stats.correct}</div>
              <div className="text-xs text-muted-foreground">{t('Correct', 'সঠিক')}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">{stats.streak}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t('Streak', 'ধারা')}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold">{stats.xp}</span>
              </div>
              <div className="text-xs text-muted-foreground">XP</div>
            </CardContent>
          </Card>
        </div>

        {/* Time & Settings */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono">{formatTime(timeSpent)}</span>
            {difficulty === 'adaptive' && (
              <Badge className={`${difficultyLabel().color} text-white text-xs`}>
                {difficultyLabel().text} (Lv.{adaptiveDifficulty})
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="text-sm rounded-lg border bg-background px-2 py-1"
            >
              <option value="all">{t('All Types', 'সব ধরণ')}</option>
              <option value="kana">{t('Kana', 'কানা')}</option>
              <option value="vocab">{t('Vocabulary', 'শব্দভাণ্ডার')}</option>
              <option value="kanji">{t('Kanji', 'কাঞ্জি')}</option>
              <option value="grammar">{t('Grammar', 'ব্যাকরণ')}</option>
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="text-sm rounded-lg border bg-background px-2 py-1"
            >
              <option value="adaptive">{t('Adaptive', 'অভিযোজিত')}</option>
              <option value="easy">{t('Easy', 'সহজ')}</option>
              <option value="medium">{t('Medium', 'মাঝারি')}</option>
              <option value="hard">{t('Hard', 'কঠিন')}</option>
            </select>
          </div>
        </div>

        {/* Accuracy Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{t('Accuracy', 'সঠিকতা')}</span>
            <span>{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</span>
          </div>
          <Progress
            value={stats.total > 0 ? (stats.correct / stats.total) * 100 : 0}
            className="h-2 rounded-full"
          />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="rounded-3xl card-shadow mb-6">
            <CardContent className="p-6">
              {/* Question Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="capitalize">
                  {typeIcons[currentQuestion.type]} {currentQuestion.type}
                  {currentQuestion.subType && ` - ${currentQuestion.subType}`}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleSpeak}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Prompt */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold japanese-text mb-2">
                  {currentQuestion.prompt}
                </div>
                {currentQuestion.subPrompt && (
                  <p className="text-muted-foreground">{currentQuestion.subPrompt}</p>
                )}
              </div>

              {/* Answer Section */}
              {currentQuestion.questionFormat === 'mcq' ? (
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    let buttonClass = 'rounded-xl h-14 text-lg';
                    if (showResult) {
                      if (option === currentQuestion.answer) {
                        buttonClass += ' bg-success text-white';
                      } else if (userAnswer === option && !isCorrect) {
                        buttonClass += ' bg-destructive text-white';
                      } else {
                        buttonClass += ' opacity-50';
                      }
                    }

                    return (
                      <Button
                        key={idx}
                        variant={showResult ? 'default' : 'outline'}
                        className={buttonClass}
                        onClick={() => {
                          if (!showResult) {
                            setUserAnswer(option);
                            checkAnswer(option);
                          }
                        }}
                        disabled={showResult}
                      >
                        <span className={currentQuestion.type === 'kana' ? 'japanese-text' : ''}>
                          {option}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={t('Type your answer...', 'আপনার উত্তর লিখুন...')}
                    className="text-center text-lg h-14 rounded-xl"
                    onKeyDown={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
                    disabled={showResult}
                  />
                  {!showResult && (
                    <Button
                      className="w-full rounded-full bg-primary text-primary-foreground h-12"
                      onClick={() => checkAnswer()}
                      disabled={!userAnswer.trim()}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {t('Check', 'চেক করুন')}
                    </Button>
                  )}
                </div>
              )}

              {/* Result */}
              {showResult && (
                <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <Check className="h-6 w-6 text-success" />
                        <span className="text-lg font-bold text-success">
                          {t('Correct!', 'সঠিক!')} +{stats.streak >= 5 ? '🔥' : ''}{currentQuestion.type === 'grammar' ? 15 : currentQuestion.type === 'kanji' ? 10 : 8} XP
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-6 w-6 text-destructive" />
                        <span className="text-lg font-bold text-destructive">{t('Incorrect', 'ভুল')}</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-center">
                      <span className="font-medium">{t('Answer', 'উত্তর')}: </span>
                      <span className="font-bold">{currentQuestion.answer}</span>
                    </p>
                  )}
                  {currentQuestion.explanation && (
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Next Button */}
              {showResult && (
                <Button
                  className="w-full mt-4 rounded-full bg-primary text-primary-foreground h-14"
                  onClick={loadNextQuestion}
                >
                  {t('Next Question', 'পরবর্তী প্রশ্ন')}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Achievement Banner */}
        {stats.streak === 10 && (
          <Card className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p className="font-bold">{t('10 Streak! Amazing!', '১০ ধারা! চমৎকার!')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default UnlimitedPractice;
