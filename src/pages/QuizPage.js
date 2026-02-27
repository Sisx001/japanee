import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight, Check, X, Volume2, RotateCcw, Trophy, ArrowLeft, Sparkles
} from 'lucide-react';
import { HIRAGANA, KATAKANA, N5_KANJI, N5_VOCABULARY, N5_GRAMMAR } from '@/data/JapaneseData';

// Helper functions (moved outside to prevent re-renders)
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
const getRandomItems = (arr, count) => {
  const shuffled = shuffleArray(arr);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

const QuizPage = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { progress, settings, recordQuizResult, addXP, markLearned } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizComplete, setQuizComplete] = useState(false);

  const totalQuestions = 10;
  const difficulty = settings.difficulty || 'easy';

  // Generate questions based on type and difficulty
  const generateQuestions = useCallback(() => {
    let sourceData = [];
    let questionGenerator;

    switch (type) {
      case 'kana':
        sourceData = [...HIRAGANA.slice(0, 46), ...KATAKANA.slice(0, 46)];
        questionGenerator = (item, allItems) => ({
          prompt: item.char,
          answer: item.romaji,
          options: shuffleArray([
            item.romaji,
            ...getRandomItems(allItems.filter(i => i.romaji !== item.romaji), 3).map(i => i.romaji)
          ]),
          audio: item.char,
          type: 'kana'
        });
        break;

      case 'kanji':
        sourceData = N5_KANJI;
        questionGenerator = (item, allItems) => ({
          prompt: item.kanji,
          subPrompt: `(${item.onyomi || item.kunyomi})`,
          answer: item.meaning,
          options: shuffleArray([
            item.meaning,
            ...getRandomItems(allItems.filter(i => i.meaning !== item.meaning), 3).map(i => i.meaning)
          ]),
          audio: item.kanji,
          type: 'kanji'
        });
        break;

      case 'vocab':
        sourceData = N5_VOCABULARY;
        questionGenerator = (item, allItems) => ({
          prompt: item.word,
          subPrompt: item.reading,
          answer: item.meaning,
          options: shuffleArray([
            item.meaning,
            ...getRandomItems(allItems.filter(i => i.meaning !== item.meaning), 3).map(i => i.meaning)
          ]),
          audio: item.word,
          type: 'vocab'
        });
        break;

      case 'grammar':
        sourceData = N5_GRAMMAR;
        questionGenerator = (item, allItems) => ({
          prompt: item.pattern,
          subPrompt: item.examples?.[0]?.jp,
          answer: item.meaning,
          options: shuffleArray([
            item.meaning,
            ...getRandomItems(allItems.filter(i => i.meaning !== item.meaning), 3).map(i => i.meaning)
          ]),
          audio: item.pattern,
          type: 'grammar'
        });
        break;

      default:
        sourceData = HIRAGANA.slice(0, 46);
        questionGenerator = (item, allItems) => ({
          prompt: item.char,
          answer: item.romaji,
          options: shuffleArray([
            item.romaji,
            ...getRandomItems(allItems.filter(i => i.romaji !== item.romaji), 3).map(i => i.romaji)
          ]),
          audio: item.char,
          type: 'kana'
        });
    }

    // Adjust question count based on difficulty
    let count = totalQuestions;
    if (difficulty === 'hard') count = 15;
    if (difficulty === 'easy') count = 8;

    // Shuffle and select items
    const shuffled = shuffleArray([...sourceData]);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Generate questions
    const generatedQuestions = selected.map(item => questionGenerator(item, sourceData));
    setQuestions(generatedQuestions);
  }, [type, difficulty]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    if (showResult) return;

    initializeAudio();
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.answer;

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      playSound('correct');
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      playSound('wrong');
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      const xpEarned = score.correct * 10;
      recordQuizResult(score.correct, questions.length, type);
      setQuizComplete(true);
      playSound('complete');
    }
  };

  const restartQuiz = () => {
    generateQuestions();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, wrong: 0 });
    setQuizComplete(false);
  };

  const handleSpeak = () => {
    initializeAudio();
    if (currentQuestion?.audio) {
      speak(currentQuestion.audio);
    }
  };

  const typeLabels = {
    kana: 'Kana Quiz',
    kanji: 'Kanji Quiz',
    vocab: 'Vocabulary Quiz',
    grammar: 'Grammar Quiz'
  };

  // Quiz Complete Screen
  if (quizComplete) {
    const accuracy = Math.round((score.correct / questions.length) * 100);
    const xpEarned = score.correct * 10;

    return (
      <MainLayout>
        <div className="max-w-xl mx-auto text-center space-y-6">
          <Card className="rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-orange-400 p-8 text-white">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <Badge className="bg-white/20 text-white text-lg px-4 py-1">
                {accuracy}% Accuracy
              </Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{score.correct}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{score.wrong}</div>
                  <div className="text-sm text-muted-foreground">Wrong</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">+{xpEarned}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={restartQuiz}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => navigate('/practice')}
                >
                  Back to Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/practice')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <Badge variant="outline">{typeLabels[type] || 'Quiz'}</Badge>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Question {currentIndex + 1}/{questions.length}</span>
            <span className="font-medium text-green-500">{score.correct} correct</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="rounded-3xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-5xl sm:text-6xl japanese-text font-bold">
                    {currentQuestion.prompt}
                  </span>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSpeak}>
                    <Volume2 className="w-5 h-5" />
                  </Button>
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

                  let buttonStyle = 'bg-background border-2 hover:border-rose-300';
                  if (showResult) {
                    if (isCorrect) buttonStyle = 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700';
                    else if (isSelected) buttonStyle = 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700';
                  } else if (isSelected) {
                    buttonStyle = 'bg-rose-100 dark:bg-rose-900/30 border-rose-500';
                  }

                  return (
                    <Button
                      key={idx}
                      variant="outline"
                      className={`w-full h-auto py-4 rounded-xl justify-between ${buttonStyle}`}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                    >
                      <span className="text-left break-words text-sm sm:text-base">{option}</span>
                      {showResult && isCorrect && <Check className="w-5 h-5 text-green-500 shrink-0 ml-2" />}
                      {showResult && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500 shrink-0 ml-2" />}
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
            className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white h-14"
            onClick={nextQuestion}
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default QuizPage;
