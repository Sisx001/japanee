import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume2, Check, X, RotateCcw, ChevronRight, Sparkles, Target, Lightbulb } from 'lucide-react';
import { READING_PASSAGES, N5_VOCABULARY } from '@/data/CompleteJapaneseContent';

const SentencePractice = () => {
  const { settings } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  const [mode, setMode] = useState('romaji-to-kana'); // romaji-to-kana, kana-to-meaning, listen-write
  const [currentSentence, setCurrentSentence] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Generate sentences from vocabulary
  const generateSentences = useCallback(() => {
    const sentences = [];

    // Get sentences from vocabulary
    N5_VOCABULARY.forEach(vocab => {
      if (vocab.sentence) {
        sentences.push({
          id: vocab.id,
          japanese: vocab.sentence.jp,
          romaji: vocab.sentence.romaji,
          english: vocab.sentence.en,
          word: vocab.kana,
          wordKanji: vocab.kanji,
          wordMeaning: vocab.en
        });
      }
    });

    // Add sentences from reading passages
    READING_PASSAGES.forEach(passage => {
      passage.paragraphs.forEach((para, idx) => {
        sentences.push({
          id: `${passage.id}_${idx}`,
          japanese: para.jp,
          romaji: para.romaji,
          english: para.en,
          level: passage.level
        });
      });
    });

    return sentences;
  }, []);

  const [sentences] = useState(generateSentences);

  const getRandomSentence = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  }, [sentences]);

  const loadNextSentence = useCallback(() => {
    setCurrentSentence(getRandomSentence());
    setUserInput('');
    setShowResult(false);
    setShowHint(false);
  }, [getRandomSentence]);

  useEffect(() => {
    loadNextSentence();
  }, [loadNextSentence]);

  const handleSpeak = () => {
    initializeAudio();
    speak(currentSentence?.japanese);
  };

  const checkAnswer = () => {
    if (!currentSentence || !userInput.trim()) return;

    let correct = false;
    const input = userInput.trim().toLowerCase();

    switch (mode) {
      case 'romaji-to-kana':
        // Check if user wrote correct Japanese
        correct = input === currentSentence.japanese ||
          input === currentSentence.romaji.toLowerCase().replace(/\s/g, '');
        break;
      case 'kana-to-meaning':
        // Check if user understood the meaning
        correct = input.includes(currentSentence.english.toLowerCase().split(' ')[0]) ||
          currentSentence.english.toLowerCase().includes(input);
        break;
      case 'listen-write':
        // Check if user wrote what they heard
        correct = input === currentSentence.japanese ||
          input === currentSentence.romaji.toLowerCase();
        break;
      default:
        break;
    }

    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));

    if (correct) {
      setStreak(prev => prev + 1);
      playSound('correct');
    } else {
      setStreak(0);
      playSound('wrong');
    }
  };

  const getPrompt = () => {
    if (!currentSentence) return '';

    switch (mode) {
      case 'romaji-to-kana':
        return currentSentence.romaji;
      case 'kana-to-meaning':
        return currentSentence.japanese;
      case 'listen-write':
        return '🎧 Listen and write';
      default:
        return '';
    }
  };

  const getExpectedAnswer = () => {
    if (!currentSentence) return '';

    switch (mode) {
      case 'romaji-to-kana':
        return currentSentence.japanese;
      case 'kana-to-meaning':
        return currentSentence.english;
      case 'listen-write':
        return currentSentence.japanese;
      default:
        return '';
    }
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'romaji-to-kana':
        return t('Type in Japanese...', 'জাপানিতে লিখুন...');
      case 'kana-to-meaning':
        return t('Type the meaning...', 'অর্থ লিখুন...');
      case 'listen-write':
        return t('Type what you hear...', 'যা শুনছেন তা লিখুন...');
      default:
        return '';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('Sentence Practice', 'বাক্য অনুশীলন')}</h1>
            <p className="text-muted-foreground">{t('Master Japanese sentences', 'জাপানি বাক্য আয়ত্ত করুন')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{score.correct}/{score.total}</div>
            {streak > 2 && (
              <Badge variant="secondary" className="animate-bounce">
                🔥 {streak} streak
              </Badge>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'romaji-to-kana', label: t('Romaji → Japanese', 'রোমাজি → জাপানি'), icon: '🔤' },
            { id: 'kana-to-meaning', label: t('Japanese → English', 'জাপানি → ইংরেজি'), icon: '📖' },
            { id: 'listen-write', label: t('Listen & Write', 'শুনুন ও লিখুন'), icon: '🎧' },
          ].map(m => (
            <Button
              key={m.id}
              variant={mode === m.id ? 'default' : 'outline'}
              onClick={() => { setMode(m.id); loadNextSentence(); }}
              className="rounded-full whitespace-nowrap"
            >
              {m.icon} {m.label}
            </Button>
          ))}
        </div>

        {/* Main Practice Card */}
        <Card className="rounded-3xl card-shadow mb-6">
          <CardContent className="p-6">
            {/* Prompt */}
            <div className="text-center mb-6">
              <div className={`text-xl sm:text-2xl font-bold mb-4 break-words ${mode !== 'listen-write' ? 'japanese-text' : ''}`}>
                {getPrompt()}
              </div>

              <Button
                variant="ghost"
                size="lg"
                className="rounded-full"
                onClick={handleSpeak}
              >
                <Volume2 className="h-6 w-6 mr-2" />
                {t('Listen', 'শুনুন')}
              </Button>
            </div>

            {/* Input */}
            <div className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={getPlaceholder()}
                className="text-center text-lg h-14 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && !showResult && checkAnswer()}
                disabled={showResult}
              />

              {/* Hint Button */}
              {!showResult && !showHint && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="w-full"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {t('Show Hint', 'ইঙ্গিত দেখুন')}
                </Button>
              )}

              {showHint && !showResult && (
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    {mode === 'romaji-to-kana' && currentSentence?.english}
                    {mode === 'kana-to-meaning' && currentSentence?.romaji}
                    {mode === 'listen-write' && `First word: ${currentSentence?.japanese.charAt(0)}...`}
                  </p>
                </div>
              )}
            </div>

            {/* Result */}
            {showResult && (
              <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {isCorrect ? (
                    <>
                      <Check className="h-6 w-6 text-success" />
                      <span className="text-lg font-bold text-success">{t('Correct!', 'সঠিক!')}</span>
                    </>
                  ) : (
                    <>
                      <X className="h-6 w-6 text-destructive" />
                      <span className="text-lg font-bold text-destructive">{t('Not quite', 'আবার চেষ্টা করুন')}</span>
                    </>
                  )}
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-base sm:text-lg japanese-text font-bold break-words">{currentSentence?.japanese}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">{currentSentence?.romaji}</p>
                  <p className="text-xs sm:text-sm text-primary break-words">{currentSentence?.english}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6">
              {!showResult ? (
                <Button
                  className="w-full rounded-full bg-primary text-primary-foreground h-14"
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                >
                  <Target className="h-5 w-5 mr-2" />
                  {t('Check Answer', 'উত্তর দেখুন')}
                </Button>
              ) : (
                <Button
                  className="w-full rounded-full bg-primary text-primary-foreground h-14"
                  onClick={loadNextSentence}
                >
                  {t('Next Sentence', 'পরবর্তী বাক্য')}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('Accuracy', 'সঠিকতা')}</span>
            <span>{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</span>
          </div>
          <Progress
            value={score.total > 0 ? (score.correct / score.total) * 100 : 0}
            className="h-2 rounded-full"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default SentencePractice;
