import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, AlertTriangle, Check, X, Shuffle, Eye } from 'lucide-react';

// Confusion pairs data - commonly confused characters
const CONFUSION_PAIRS = {
  hiragana: [
    { pair: ['し', 'ち'], romaji: ['shi', 'chi'], hint_en: 'し has a longer vertical stroke', hint_bn: 'し এর লম্বা উল্লম্ব স্ট্রোক আছে' },
    { pair: ['つ', 'す'], romaji: ['tsu', 'su'], hint_en: 'つ curves more sharply', hint_bn: 'つ আরও তীক্ষ্ণভাবে বাঁকে' },
    { pair: ['ぬ', 'め'], romaji: ['nu', 'me'], hint_en: 'ぬ has a loop at bottom', hint_bn: 'ぬ এর নিচে একটি লুপ আছে' },
    { pair: ['わ', 'れ'], romaji: ['wa', 're'], hint_en: 'れ has an extra stroke on left', hint_bn: 'れ এর বাম দিকে অতিরিক্ত স্ট্রোক আছে' },
    { pair: ['ね', 'れ'], romaji: ['ne', 're'], hint_en: 'ね loops at the end', hint_bn: 'ね শেষে লুপ করে' },
    { pair: ['は', 'ほ'], romaji: ['ha', 'ho'], hint_en: 'ほ has more strokes on right', hint_bn: 'ほ এর ডানে বেশি স্ট্রোক আছে' },
    { pair: ['る', 'ろ'], romaji: ['ru', 'ro'], hint_en: 'る has a tail, ろ is open', hint_bn: 'る এর লেজ আছে, ろ খোলা' },
    { pair: ['さ', 'き'], romaji: ['sa', 'ki'], hint_en: 'き has two horizontal strokes', hint_bn: 'き এর দুটি অনুভূমিক স্ট্রোক আছে' },
  ],
  katakana: [
    { pair: ['シ', 'ツ'], romaji: ['shi', 'tsu'], hint_en: 'シ strokes go up-left, ツ strokes go down', hint_bn: 'シ স্ট্রোক উপর-বামে যায়, ツ নিচে যায়' },
    { pair: ['ソ', 'ン'], romaji: ['so', 'n'], hint_en: 'ソ is more vertical, ン more horizontal', hint_bn: 'ソ বেশি উল্লম্ব, ン বেশি অনুভূমিক' },
    { pair: ['ノ', 'メ'], romaji: ['no', 'me'], hint_en: 'メ has a crossing stroke', hint_bn: 'メ এর ক্রসিং স্ট্রোক আছে' },
    { pair: ['ウ', 'ワ'], romaji: ['u', 'wa'], hint_en: 'ワ has shorter top', hint_bn: 'ワ এর উপরটা ছোট' },
    { pair: ['ク', 'ケ'], romaji: ['ku', 'ke'], hint_en: 'ケ has extra stroke on right', hint_bn: 'ケ এর ডানে অতিরিক্ত স্ট্রোক আছে' },
    { pair: ['フ', 'ワ'], romaji: ['fu', 'wa'], hint_en: 'フ is simpler, ワ has more curves', hint_bn: 'フ সহজ, ワ এ বেশি বাঁক আছে' },
    { pair: ['コ', 'ユ'], romaji: ['ko', 'yu'], hint_en: 'コ is a box, ユ has diagonal', hint_bn: 'コ একটি বাক্স, ユ এ তির্যক আছে' },
    { pair: ['チ', 'テ'], romaji: ['chi', 'te'], hint_en: 'チ has a hook, テ is straighter', hint_bn: 'チ এ হুক আছে, テ সোজা' },
  ]
};

const ConfusionPairs = () => {
  const navigate = useNavigate();
  const { addXP, markLearned, settings } = useProfile();
  const { playSound } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  const [mode, setMode] = useState(null); // 'hiragana', 'katakana', 'mixed'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generateQuestions = (selectedMode) => {
    let pairs = [];
    if (selectedMode === 'hiragana') {
      pairs = CONFUSION_PAIRS.hiragana;
    } else if (selectedMode === 'katakana') {
      pairs = CONFUSION_PAIRS.katakana;
    } else {
      pairs = [...CONFUSION_PAIRS.hiragana, ...CONFUSION_PAIRS.katakana];
    }

    // Create questions from pairs
    const generatedQuestions = [];
    pairs.forEach((pairData, idx) => {
      // For each pair, create 2 questions (one for each character)
      pairData.pair.forEach((char, charIdx) => {
        generatedQuestions.push({
          id: `confusion_${idx}_${charIdx}`,
          character: char,
          correctRomaji: pairData.romaji[charIdx],
          wrongRomaji: pairData.romaji[1 - charIdx],
          hint: language === 'bn' ? pairData.hint_bn : pairData.hint_en,
          pairCharacter: pairData.pair[1 - charIdx],
          type: selectedMode === 'mixed'
            ? (CONFUSION_PAIRS.hiragana.includes(pairData) ? 'hiragana' : 'katakana')
            : selectedMode
        });
      });
    });

    // Shuffle and limit
    return generatedQuestions.sort(() => Math.random() - 0.5).slice(0, 15);
  };

  const startPractice = (selectedMode) => {
    setMode(selectedMode);
    setQuestions(generateQuestions(selectedMode));
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setShowHint(false);
    setIsComplete(false);
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (selectedRomaji) => {
    const isCorrect = selectedRomaji === currentQuestion.correctRomaji;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { answer: selectedRomaji, correct: isCorrect }
    }));

    // Mark as learned if correct
    if (isCorrect) {
      markLearned('kana', currentQuestion.character);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setShowHint(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const xpEarned = correctCount * 3;

    if (xpEarned > 0) {
      addXP(xpEarned);
    }
    playSound('complete');
    setIsComplete(true);
  };

  // Mode selection screen
  if (!mode) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/practice')} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back', 'ফিরে যান')}
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-2">{t('Confusion Pairs Drill', 'বিভ্রান্তিকর জোড়া ড্রিল')}</h1>
            <p className="text-muted-foreground">
              {t('Master commonly confused characters', 'সাধারণত বিভ্রান্তিকর অক্ষরগুলো আয়ত্ত করুন')}
            </p>
          </div>

          <div className="space-y-4">
            <Card
              className="rounded-3xl card-shadow cursor-pointer hover:border-primary/20 border-2 border-transparent transition-all"
              onClick={() => startPractice('hiragana')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl japanese-text font-bold">しち</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t('Hiragana Pairs', 'হিরাগানা জোড়া')}</h3>
                    <p className="text-sm text-muted-foreground">
                      し/ち, つ/す, ぬ/め, {t('and more', 'এবং আরো')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="rounded-3xl card-shadow cursor-pointer hover:border-primary/20 border-2 border-transparent transition-all"
              onClick={() => startPractice('katakana')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-info/10 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl japanese-text font-bold">シツ</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t('Katakana Pairs', 'কাতাকানা জোড়া')}</h3>
                    <p className="text-sm text-muted-foreground">
                      シ/ツ, ソ/ン, ノ/メ, {t('and more', 'এবং আরো')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="rounded-3xl card-shadow cursor-pointer hover:border-primary/20 border-2 border-transparent transition-all"
              onClick={() => startPractice('mixed')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center">
                    <Shuffle className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{t('Mixed Challenge', 'মিশ্র চ্যালেঞ্জ')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Both hiragana and katakana', 'হিরাগানা ও কাতাকানা উভয়ই')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info card */}
          <Card className="rounded-2xl bg-warning/10 mt-6">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium">{t('Why this matters', 'কেন এটা গুরুত্বপূর্ণ')}</p>
                <p className="text-muted-foreground">
                  {t(
                    'These pairs are the most common mistakes for Japanese learners. Mastering them will significantly improve your reading accuracy!',
                    'এই জোড়াগুলো জাপানি শিক্ষার্থীদের সবচেয়ে সাধারণ ভুল। এগুলো আয়ত্ত করলে আপনার পড়ার সঠিকতা উল্লেখযোগ্যভাবে উন্নত হবে!'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Complete screen
  if (isComplete) {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const xpEarned = correctCount * 3;

    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-12 animate-bounce-in">
          <div className="text-6xl mb-6">
            {accuracy >= 80 ? '🎯' : accuracy >= 50 ? '👀' : '🔍'}
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {accuracy >= 80
              ? t('Sharp Eyes!', 'তীক্ষ্ণ চোখ!')
              : accuracy >= 50
                ? t('Getting Better!', 'উন্নতি হচ্ছে!')
                : t('Keep Practicing!', 'অনুশীলন চালিয়ে যান!')}
          </h1>

          <Card className="rounded-3xl card-shadow mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{xpEarned}</div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">{correctCount}/{questions.length}</div>
                  <div className="text-sm text-muted-foreground">{t('Correct', 'সঠিক')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-info">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">{t('Accuracy', 'সঠিকতা')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => startPractice(mode)}
              className="w-full rounded-full bg-primary text-primary-foreground btn-3d"
            >
              {t('Practice Again', 'আবার অনুশীলন')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setMode(null)}
              className="w-full rounded-full"
            >
              {t('Try Different Mode', 'ভিন্ন মোড চেষ্টা করুন')}
            </Button>
            <Link to="/practice">
              <Button variant="ghost" className="w-full rounded-full">
                {t('Back to Practice', 'অনুশীলনে ফিরুন')}
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Quiz screen
  const currentAnswer = answers[currentQuestion?.id];
  const options = [currentQuestion.correctRomaji, currentQuestion.wrongRomaji].sort(() => Math.random() - 0.5);

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setMode(null)} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Exit', 'বের হন')}
          </Button>
          <Badge variant="secondary" className="capitalize">{mode}</Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2 rounded-full mb-8" />

        {/* Question Card */}
        <Card className="rounded-3xl card-shadow mb-6">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('Which romaji is correct for this character?', 'এই অক্ষরের জন্য কোন রোমাজি সঠিক?')}
            </p>

            {/* Character display */}
            <div className="text-8xl font-bold japanese-text text-primary mb-2">
              {currentQuestion.character}
            </div>

            {/* Pair comparison */}
            <div className="flex items-center justify-center gap-4 mb-6 text-muted-foreground">
              <span className="text-sm">{t('Not to confuse with:', 'এর সাথে গুলিয়ে ফেলবেন না:')}</span>
              <span className="text-2xl japanese-text">{currentQuestion.pairCharacter}</span>
            </div>

            {/* Hint button */}
            {!showResult && (
              <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => setShowHint(!showHint)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showHint ? t('Hide Hint', 'হিন্ট লুকান') : t('Show Hint', 'হিন্ট দেখুন')}
              </Button>
            )}

            {showHint && !showResult && (
              <div className="bg-info/10 rounded-xl p-3 mb-6 text-sm">
                💡 {currentQuestion.hint}
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option) => {
                let buttonClass = 'rounded-2xl h-16 text-xl font-bold transition-all';
                if (showResult) {
                  if (option === currentQuestion.correctRomaji) {
                    buttonClass += ' bg-success text-white';
                  } else if (currentAnswer?.answer === option && !currentAnswer?.correct) {
                    buttonClass += ' bg-destructive text-white';
                  } else {
                    buttonClass += ' bg-muted opacity-50';
                  }
                }

                return (
                  <Button
                    key={option}
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

            {/* Feedback */}
            {showResult && (
              <div className={`mt-6 p-4 rounded-2xl ${currentAnswer?.correct ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {currentAnswer?.correct ? (
                    <>
                      <Check className="w-5 h-5 text-success" />
                      <span className="font-bold text-success">{t('Correct!', 'সঠিক!')}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-destructive" />
                      <span className="font-bold text-destructive">{t('Incorrect', 'ভুল')}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.character} = {currentQuestion.correctRomaji}
                </p>
                {!currentAnswer?.correct && (
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 {currentQuestion.hint}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Button */}
        {showResult && (
          <Button
            className="w-full rounded-full bg-primary text-primary-foreground btn-3d h-14"
            onClick={handleNext}
          >
            {currentIndex < questions.length - 1 ? t('Next', 'পরবর্তী') : t('See Results', 'ফলাফল দেখুন')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default ConfusionPairs;
