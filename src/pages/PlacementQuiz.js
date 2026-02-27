import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight, Check, X, Star, Sparkles, Target, Trophy,
  Volume2, GraduationCap, Zap, ArrowLeft, BookOpen
} from 'lucide-react';
import { HIRAGANA, KATAKANA, N5_VOCABULARY, N5_KANJI, N5_GRAMMAR } from '@/data/CompleteJapaneseContent';

// Questions organized by difficulty level
const PLACEMENT_QUESTIONS = {
  beginner: [
    // Hiragana recognition
    ...HIRAGANA.slice(0, 10).map(k => ({
      type: 'kana',
      level: 'beginner',
      prompt: k.char,
      answer: k.romaji,
      options: [k.romaji, ...HIRAGANA.filter(h => h.char !== k.char).slice(0, 3).map(h => h.romaji)].sort(() => Math.random() - 0.5),
      audio: k.char
    })),
    // Basic greetings
    { type: 'vocab', level: 'beginner', prompt: 'おはよう', answer: 'Good morning', options: ['Good morning', 'Good night', 'Thank you', 'Hello'].sort(() => Math.random() - 0.5), audio: 'おはよう' },
    { type: 'vocab', level: 'beginner', prompt: 'ありがとう', answer: 'Thank you', options: ['Thank you', 'Sorry', 'Please', 'Goodbye'].sort(() => Math.random() - 0.5), audio: 'ありがとう' },
  ],
  elementary: [
    // Katakana recognition
    ...KATAKANA.slice(0, 8).map(k => ({
      type: 'kana',
      level: 'elementary',
      prompt: k.char,
      answer: k.romaji,
      options: [k.romaji, ...KATAKANA.filter(h => h.char !== k.char).slice(0, 3).map(h => h.romaji)].sort(() => Math.random() - 0.5),
      audio: k.char
    })),
    // Basic vocabulary
    ...N5_VOCABULARY.slice(0, 5).map(v => ({
      type: 'vocab',
      level: 'elementary',
      prompt: v.word,
      answer: v.meaning,
      options: [v.meaning, ...N5_VOCABULARY.filter(x => x.word !== v.word).slice(0, 3).map(x => x.meaning)].sort(() => Math.random() - 0.5),
      audio: v.word
    })),
  ],
  intermediate: [
    // Kanji recognition
    ...N5_KANJI.slice(0, 8).map(k => ({
      type: 'kanji',
      level: 'intermediate',
      prompt: k.kanji,
      subPrompt: `(${k.onyomi || k.kunyomi})`,
      answer: k.meaning,
      options: [k.meaning, ...N5_KANJI.filter(x => x.kanji !== k.kanji).slice(0, 3).map(x => x.meaning)].sort(() => Math.random() - 0.5),
      audio: k.kanji
    })),
    // More advanced vocab
    ...N5_VOCABULARY.slice(30, 35).map(v => ({
      type: 'vocab',
      level: 'intermediate',
      prompt: v.word,
      answer: v.meaning,
      options: [v.meaning, ...N5_VOCABULARY.filter(x => x.word !== v.word).slice(0, 3).map(x => x.meaning)].sort(() => Math.random() - 0.5),
      audio: v.word
    })),
  ],
  advanced: [
    // Grammar patterns
    ...N5_GRAMMAR.slice(0, 5).map(g => ({
      type: 'grammar',
      level: 'advanced',
      prompt: g.pattern,
      subPrompt: g.examples?.[0]?.jp,
      answer: g.meaning,
      options: [g.meaning, ...N5_GRAMMAR.filter(x => x.pattern !== g.pattern).slice(0, 3).map(x => x.meaning)].sort(() => Math.random() - 0.5),
      audio: g.pattern
    })),
    // Complex kanji
    ...N5_KANJI.slice(15, 20).map(k => ({
      type: 'kanji',
      level: 'advanced',
      prompt: k.kanji,
      subPrompt: 'What is the meaning?',
      answer: k.meaning,
      options: [k.meaning, ...N5_KANJI.filter(x => x.kanji !== k.kanji).slice(0, 3).map(x => x.meaning)].sort(() => Math.random() - 0.5),
      audio: k.kanji
    })),
  ]
};

const PlacementQuiz = () => {
  const navigate = useNavigate();
  const { settings } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  const [quizState, setQuizState] = useState('intro'); // intro, quiz, results
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState({
    beginner: { correct: 0, total: 0 },
    elementary: { correct: 0, total: 0 },
    intermediate: { correct: 0, total: 0 },
    advanced: { correct: 0, total: 0 }
  });
  const [questionsPerLevel] = useState(5);
  const [questions, setQuestions] = useState([]);

  // Prepare questions for current level
  useEffect(() => {
    if (quizState === 'quiz') {
      const levelQuestions = PLACEMENT_QUESTIONS[currentLevel] || [];
      const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, questionsPerLevel));
      setCurrentQuestionIdx(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentLevel, quizState, questionsPerLevel]);

  const currentQuestion = questions[currentQuestionIdx];
  const totalQuestions = questionsPerLevel * 4; // 4 levels
  const overallProgress = () => {
    const levels = ['beginner', 'elementary', 'intermediate', 'advanced'];
    const currentLevelIndex = levels.indexOf(currentLevel);
    const questionsCompleted = currentLevelIndex * questionsPerLevel + currentQuestionIdx;
    return (questionsCompleted / totalQuestions) * 100;
  };

  const handleSpeak = () => {
    initializeAudio();
    if (currentQuestion?.audio) {
      speak(currentQuestion.audio);
    }
  };

  const handleAnswer = (answer) => {
    if (showResult) return;

    initializeAudio();
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.answer;
    playSound(isCorrect ? 'correct' : 'wrong');

    setResults(prev => ({
      ...prev,
      [currentLevel]: {
        correct: prev[currentLevel].correct + (isCorrect ? 1 : 0),
        total: prev[currentLevel].total + 1
      }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      // Next question in current level
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Move to next level or show results
      const levels = ['beginner', 'elementary', 'intermediate', 'advanced'];
      const currentLevelIndex = levels.indexOf(currentLevel);

      if (currentLevelIndex < levels.length - 1) {
        // Check if user is struggling
        const accuracy = results[currentLevel].correct / results[currentLevel].total;
        if (accuracy < 0.3 && currentLevel !== 'beginner') {
          // User is struggling, end early
          setQuizState('results');
        } else {
          // Move to next level
          setCurrentLevel(levels[currentLevelIndex + 1]);
        }
      } else {
        // All levels complete
        setQuizState('results');
      }
    }
  };

  const calculateRecommendedLevel = () => {
    const levels = ['beginner', 'elementary', 'intermediate', 'advanced'];
    let recommendedLevel = 'beginner';

    for (const level of levels) {
      const levelResults = results[level];
      if (levelResults.total > 0) {
        const accuracy = levelResults.correct / levelResults.total;
        if (accuracy >= 0.6) {
          recommendedLevel = level;
        }
      }
    }

    return recommendedLevel;
  };

  const getRecommendedPath = () => {
    const level = calculateRecommendedLevel();
    switch (level) {
      case 'beginner':
        return { path: '/kana', text: t('Start with Hiragana', 'হিরাগানা দিয়ে শুরু করুন') };
      case 'elementary':
        return { path: '/vocab', text: t('Build Vocabulary', 'শব্দভাণ্ডার তৈরি করুন') };
      case 'intermediate':
        return { path: '/kanji', text: t('Study Kanji', 'কাঞ্জি অধ্যয়ন করুন') };
      case 'advanced':
        return { path: '/practice', text: t('Practice for N5', 'N5 অনুশীলন করুন') };
      default:
        return { path: '/kana', text: t('Start Learning', 'শেখা শুরু করুন') };
    }
  };

  // Save placement result to localStorage
  useEffect(() => {
    if (quizState === 'results') {
      const recommendedLevel = calculateRecommendedLevel();
      localStorage.setItem('nihongo_placement_result', JSON.stringify({ recommendedLevel, results }));
    }
  }, [quizState]);

  const levelLabels = {
    beginner: { en: 'Beginner', bn: 'শুরুকারী', emoji: '🌱' },
    elementary: { en: 'Elementary', bn: 'প্রাথমিক', emoji: '🌿' },
    intermediate: { en: 'Intermediate', bn: 'মধ্যবর্তী', emoji: '🌳' },
    advanced: { en: 'Advanced', bn: 'উন্নত', emoji: '🌲' }
  };

  // Intro Screen
  if (quizState === 'intro') {
    return (
      <MainLayout>
        <div data-testid="placement-quiz-page" className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="rounded-3xl card-shadow overflow-hidden">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-purple-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{t('Placement Quiz', 'প্লেসমেন্ট কুইজ')}</h1>
              <p className="text-muted-foreground">
                {t('Find your starting point on the path to Japanese mastery', 'জাপানি দক্ষতার পথে আপনার শুরুর বিন্দু খুঁজুন')}
              </p>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold">{t('20 Questions', '২০টি প্রশ্ন')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Covering kana, vocabulary, kanji & grammar', 'কানা, শব্দভাণ্ডার, কাঞ্জি ও ব্যাকরণ নিয়ে')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <Sparkles className="w-8 h-8 text-accent shrink-0" />
                  <div>
                    <h3 className="font-bold">{t('Adaptive', 'অভিযোজিত')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Questions adjust to your level', 'প্রশ্ন আপনার স্তর অনুযায়ী পরিবর্তন হয়')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-success shrink-0" />
                  <div>
                    <h3 className="font-bold">{t('Personalized Path', 'ব্যক্তিগত পথ')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Get recommendations for your journey', 'আপনার যাত্রার জন্য সুপারিশ পান')}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full rounded-full bg-purple-500 text-white hover:bg-purple-600 h-14 text-lg"
                onClick={() => setQuizState('quiz')}
              >
                {t('Start Quiz', 'কুইজ শুরু করুন')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('Back to Dashboard', 'ড্যাশবোর্ডে ফিরে যান')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Results Screen
  if (quizState === 'results') {
    const recommendedLevel = calculateRecommendedLevel();
    const totalCorrect = Object.values(results).reduce((sum, r) => sum + r.correct, 0);
    const totalAnswered = Object.values(results).reduce((sum, r) => sum + r.total, 0);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const recommendedPath = getRecommendedPath();

    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="rounded-3xl card-shadow overflow-hidden">
            <div className="bg-gradient-to-br from-success/20 to-primary/20 p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">{t('Quiz Complete!', 'কুইজ সম্পূর্ণ!')}</h1>
              <Badge className="text-lg px-4 py-1 bg-success text-white">
                {accuracy}% {t('Accuracy', 'সঠিকতা')}
              </Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Recommended Level */}
              <div className="text-center p-6 bg-purple-500/10 rounded-2xl border-2 border-purple-500/20">
                <p className="text-sm text-muted-foreground mb-2">{t('Your Recommended Level', 'আপনার সুপারিশকৃত স্তর')}</p>
                <div className="text-4xl mb-2">{levelLabels[recommendedLevel].emoji}</div>
                <h2 className="text-2xl font-bold capitalize">
                  {language === 'bn' ? levelLabels[recommendedLevel].bn : levelLabels[recommendedLevel].en}
                </h2>
              </div>

              {/* Level Breakdown */}
              <div className="space-y-3">
                {Object.entries(results).map(([level, data]) => (
                  data.total > 0 && (
                    <div key={level} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span>{levelLabels[level].emoji}</span>
                        <span className="capitalize">
                          {language === 'bn' ? levelLabels[level].bn : levelLabels[level].en}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{data.correct}/{data.total}</span>
                        <Badge variant={data.correct / data.total >= 0.6 ? 'default' : 'secondary'}>
                          {Math.round((data.correct / data.total) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Recommended Action */}
              <Button
                className="w-full rounded-full bg-primary text-primary-foreground h-14 text-lg"
                onClick={() => navigate(recommendedPath.path)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {recommendedPath.text}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                {t('Go to Dashboard', 'ড্যাশবোর্ডে যান')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Quiz Screen
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="capitalize">
              {levelLabels[currentLevel].emoji} {language === 'bn' ? levelLabels[currentLevel].bn : levelLabels[currentLevel].en}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIdx + 1}/{questions.length}
            </span>
          </div>
          <Progress value={overallProgress()} className="h-2" />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="rounded-3xl card-shadow mb-6">
            <CardContent className="p-6">
              {/* Question Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="capitalize">
                  {currentQuestion.type}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleSpeak}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Prompt */}
              <div className="text-center py-6">
                <div className="text-5xl md:text-6xl japanese-text font-bold mb-3">
                  {currentQuestion.prompt}
                </div>
                {currentQuestion.subPrompt && (
                  <p className="text-muted-foreground">{currentQuestion.subPrompt}</p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.answer;

                  let buttonStyle = 'bg-background border-2';
                  if (showResult) {
                    if (isCorrect) buttonStyle = 'bg-success/10 border-success text-success';
                    else if (isSelected) buttonStyle = 'bg-destructive/10 border-destructive text-destructive';
                  } else if (isSelected) {
                    buttonStyle = 'bg-primary/10 border-primary';
                  }

                  return (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`w-full h-auto py-4 px-6 rounded-xl justify-start text-left ${buttonStyle}`}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                    >
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && <Check className="w-5 h-5 ml-2" />}
                      {showResult && isSelected && !isCorrect && <X className="w-5 h-5 ml-2" />}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        {showResult && (
          <Button
            className="w-full rounded-full bg-primary text-primary-foreground h-14"
            onClick={nextQuestion}
          >
            {currentQuestionIdx < questions.length - 1
              ? t('Next Question', 'পরবর্তী প্রশ্ন')
              : t('Continue', 'চালিয়ে যান')
            }
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default PlacementQuiz;
