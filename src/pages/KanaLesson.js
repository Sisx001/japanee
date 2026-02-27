import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Volume2, ChevronRight, Star } from 'lucide-react';
import { HIRAGANA, KATAKANA } from '@/data/CompleteJapaneseContent';

const KanaLesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { addXP, markLearned, updateStreak } = useProfile();
  const { t, showRomaji } = useSettings();

  const [content, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('learn'); // learn, quiz, complete
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Load local kana content based on lessonId
    let kanaData = [];
    if (lessonId?.includes('katakana')) {
      kanaData = KATAKANA.slice(0, 20);
    } else {
      // default hiragana
      kanaData = HIRAGANA.slice(0, 20);
    }

    const lessonContent = kanaData.map((k, i) => ({
      id: k.char || `kana_${i}`,
      character: k.char,
      romaji: k.romaji,
      kana_type: lessonId?.includes('katakana') ? 'katakana' : 'hiragana',
      group: k.row || k.romaji?.charAt(0) || 'a'
    }));

    setContent(lessonContent);
    setLoading(false);
  }, [lessonId]);

  const currentKana = content[currentIndex];
  const progressValue = content.length > 0 ? ((currentIndex + 1) / content.length) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else if (phase === 'learn') {
      setPhase('quiz');
      setCurrentIndex(0);
      setShowAnswer(false);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const handleQuizAnswer = (answer) => {
    const isCorrect = answer.toLowerCase() === currentKana.romaji.toLowerCase();
    setQuizAnswers(prev => ({
      ...prev,
      [currentKana.id]: { answer, correct: isCorrect }
    }));
    setShowAnswer(true);
  };

  const handleComplete = () => {
    const correctCount = Object.values(quizAnswers).filter(a => a.correct).length;
    const xpGained = 15 + correctCount * 2;
    addXP(xpGained);
    updateStreak();
    // Mark kana as learned
    content.forEach(k => markLearned('hiragana', k.id));
    setPhase('complete');
    toast.success('Lesson completed! 🎉');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-center">
            <div className="text-4xl mb-2 japanese-text">あ</div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Completion Screen
  if (phase === 'complete') {
    const correctCount = Object.values(quizAnswers).filter(a => a.correct).length;
    const totalQuestions = content.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const xpGained = 15 + correctCount * 2;

    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-12 animate-bounce-in">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-4">{t('Lesson Complete!', 'পাঠ সম্পূর্ণ!')}</h1>
          <p className="text-muted-foreground mb-8 capitalize">{currentKana?.kana_type} Lesson</p>

          <Card className="rounded-3xl card-shadow mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{xpGained}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">{correctCount}/{totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-info">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Link to="/kana">
              <Button className="w-full rounded-full bg-primary text-primary-foreground btn-3d">
                {t('Continue Learning', 'শেখা চালিয়ে যান')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="w-full rounded-full">
                {t('Back to Dashboard', 'ড্যাশবোর্ডে ফিরুন')}
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Quiz Phase
  if (phase === 'quiz') {
    const options = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko',
      'sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to',
      'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho',
      'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo',
      'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n'];

    const correctAnswer = currentKana?.romaji || '';
    let quizOptions = [correctAnswer];
    const filtered = options.filter(o => o !== correctAnswer);
    while (quizOptions.length < 4 && filtered.length > 0) {
      const idx = Math.floor(Math.random() * filtered.length);
      quizOptions.push(filtered.splice(idx, 1)[0]);
    }
    quizOptions = quizOptions.sort(() => Math.random() - 0.5);

    const currentAnswer = quizAnswers[currentKana?.id];

    return (
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/kana')} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Exit', 'বের হন')}
            </Button>
            <span className="text-sm text-muted-foreground">
              Quiz: {currentIndex + 1}/{content.length}
            </span>
          </div>

          <Progress value={progressValue} className="h-2 rounded-full mb-8" />

          <Card className="rounded-3xl card-shadow mb-6">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {t('What is the romaji for this kana?', 'এই কানার রোমাজি কী?')}
              </p>
              <div className="kana-char text-primary mb-8">
                {currentKana?.character}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {quizOptions.map((option) => {
                  let buttonClass = 'rounded-2xl h-14 text-lg font-medium';
                  if (showAnswer) {
                    if (option === correctAnswer) {
                      buttonClass += ' bg-success text-white';
                    } else if (currentAnswer?.answer === option && !currentAnswer?.correct) {
                      buttonClass += ' bg-destructive text-white';
                    } else {
                      buttonClass += ' bg-muted';
                    }
                  }

                  return (
                    <Button
                      key={option}
                      variant={showAnswer ? 'default' : 'outline'}
                      className={buttonClass}
                      onClick={() => !showAnswer && handleQuizAnswer(option)}
                      disabled={showAnswer}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {showAnswer && (
            <Button
              className="w-full rounded-full bg-primary text-primary-foreground btn-3d h-14"
              onClick={handleNext}
            >
              {currentIndex < content.length - 1 ? t('Next', 'পরবর্তী') : t('Finish', 'শেষ করুন')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </MainLayout>
    );
  }

  // Learn Phase
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/kana')} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Exit', 'বের হন')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{content.length}
          </span>
        </div>

        <Progress value={progressValue} className="h-2 rounded-full mb-8" />

        <Card className="rounded-3xl card-shadow mb-6 overflow-hidden">
          <div className="bg-primary/5 p-8 text-center">
            <div className="kana-char text-primary mb-4">
              {currentKana?.character}
            </div>
            <div className="text-2xl font-bold text-foreground">
              {currentKana?.romaji}
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                <Volume2 className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('Tap to hear pronunciation', 'উচ্চারণ শুনতে ট্যাপ করুন')}
              </span>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('Type', 'প্রকার')}</span>
                <span className="text-sm font-medium capitalize">{currentKana?.kana_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('Group', 'গ্রুপ')}</span>
                <span className="text-sm font-medium">{currentKana?.group}-row</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full h-14"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Previous', 'পূর্ববর্তী')}
          </Button>
          <Button
            className="flex-1 rounded-full bg-primary text-primary-foreground btn-3d h-14"
            onClick={handleNext}
          >
            {currentIndex < content.length - 1 ? t('Next', 'পরবর্তী') : t('Start Quiz', 'কুইজ শুরু')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default KanaLesson;
