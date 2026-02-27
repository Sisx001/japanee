import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ChevronRight, Check, X, RefreshCw, Book } from 'lucide-react';

// Verb conjugation data
const VERB_DATA = {
  ichidan: [
    { dictionary: '食べる', stem: '食べ', romaji: 'taberu', meaning_en: 'to eat', meaning_bn: 'খাওয়া' },
    { dictionary: '見る', stem: '見', romaji: 'miru', meaning_en: 'to see', meaning_bn: 'দেখা' },
    { dictionary: '起きる', stem: '起き', romaji: 'okiru', meaning_en: 'to wake up', meaning_bn: 'জাগা' },
    { dictionary: '寝る', stem: '寝', romaji: 'neru', meaning_en: 'to sleep', meaning_bn: 'ঘুমানো' },
    { dictionary: '開ける', stem: '開け', romaji: 'akeru', meaning_en: 'to open', meaning_bn: 'খোলা' },
  ],
  godan: [
    { dictionary: '書く', stem: '書', romaji: 'kaku', meaning_en: 'to write', meaning_bn: 'লেখা', ending: 'く' },
    { dictionary: '話す', stem: '話', romaji: 'hanasu', meaning_en: 'to speak', meaning_bn: 'বলা', ending: 'す' },
    { dictionary: '読む', stem: '読', romaji: 'yomu', meaning_en: 'to read', meaning_bn: 'পড়া', ending: 'む' },
    { dictionary: '行く', stem: '行', romaji: 'iku', meaning_en: 'to go', meaning_bn: 'যাওয়া', ending: 'く' },
    { dictionary: '飲む', stem: '飲', romaji: 'nomu', meaning_en: 'to drink', meaning_bn: 'পান করা', ending: 'む' },
    { dictionary: '買う', stem: '買', romaji: 'kau', meaning_en: 'to buy', meaning_bn: 'কেনা', ending: 'う' },
    { dictionary: '待つ', stem: '待', romaji: 'matsu', meaning_en: 'to wait', meaning_bn: 'অপেক্ষা করা', ending: 'つ' },
  ],
  irregular: [
    { dictionary: 'する', romaji: 'suru', meaning_en: 'to do', meaning_bn: 'করা' },
    { dictionary: '来る', romaji: 'kuru', meaning_en: 'to come', meaning_bn: 'আসা' },
  ]
};

// Conjugation rules
const CONJUGATIONS = {
  masu: {
    name_en: 'Polite (ます)',
    name_bn: 'বিনয়ী (ます)',
    ichidan: (stem) => `${stem}ます`,
    godan: {
      'く': (stem) => `${stem}きます`,
      'す': (stem) => `${stem}します`,
      'む': (stem) => `${stem}みます`,
      'う': (stem) => `${stem}います`,
      'つ': (stem) => `${stem}ちます`,
      'る': (stem) => `${stem}ります`,
      'ぬ': (stem) => `${stem}にます`,
      'ぶ': (stem) => `${stem}びます`,
      'ぐ': (stem) => `${stem}ぎます`,
    },
    irregular: { 'する': 'します', '来る': '来ます' }
  },
  masen: {
    name_en: 'Polite Negative (ません)',
    name_bn: 'বিনয়ী নেতিবাচক (ません)',
    ichidan: (stem) => `${stem}ません`,
    godan: {
      'く': (stem) => `${stem}きません`,
      'す': (stem) => `${stem}しません`,
      'む': (stem) => `${stem}みません`,
      'う': (stem) => `${stem}いません`,
      'つ': (stem) => `${stem}ちません`,
      'る': (stem) => `${stem}りません`,
      'ぬ': (stem) => `${stem}にません`,
      'ぶ': (stem) => `${stem}びません`,
      'ぐ': (stem) => `${stem}ぎません`,
    },
    irregular: { 'する': 'しません', '来る': '来ません' }
  },
  mashita: {
    name_en: 'Polite Past (ました)',
    name_bn: 'বিনয়ী অতীত (ました)',
    ichidan: (stem) => `${stem}ました`,
    godan: {
      'く': (stem) => `${stem}きました`,
      'す': (stem) => `${stem}しました`,
      'む': (stem) => `${stem}みました`,
      'う': (stem) => `${stem}いました`,
      'つ': (stem) => `${stem}ちました`,
      'る': (stem) => `${stem}りました`,
      'ぬ': (stem) => `${stem}にました`,
      'ぶ': (stem) => `${stem}びました`,
      'ぐ': (stem) => `${stem}ぎました`,
    },
    irregular: { 'する': 'しました', '来る': '来ました' }
  },
  te: {
    name_en: 'Te-form (て)',
    name_bn: 'তে-ফর্ম (て)',
    ichidan: (stem) => `${stem}て`,
    godan: {
      'く': (stem) => `${stem}いて`,
      'す': (stem) => `${stem}して`,
      'む': (stem) => `${stem}んで`,
      'う': (stem) => `${stem}って`,
      'つ': (stem) => `${stem}って`,
      'る': (stem) => `${stem}って`,
      'ぬ': (stem) => `${stem}んで`,
      'ぶ': (stem) => `${stem}んで`,
      'ぐ': (stem) => `${stem}いで`,
    },
    irregular: { 'する': 'して', '来る': '来て' }
  },
  nai: {
    name_en: 'Plain Negative (ない)',
    name_bn: 'সাধারণ নেতিবাচক (ない)',
    ichidan: (stem) => `${stem}ない`,
    godan: {
      'く': (stem) => `${stem}かない`,
      'す': (stem) => `${stem}さない`,
      'む': (stem) => `${stem}まない`,
      'う': (stem) => `${stem}わない`,
      'つ': (stem) => `${stem}たない`,
      'る': (stem) => `${stem}らない`,
      'ぬ': (stem) => `${stem}なない`,
      'ぶ': (stem) => `${stem}ばない`,
      'ぐ': (stem) => `${stem}がない`,
    },
    irregular: { 'する': 'しない', '来る': '来ない' }
  }
};

const ConjugationTrainer = () => {
  const navigate = useNavigate();
  const { addXP, settings } = useProfile();
  const { playSound } = useAudio();
  const language = settings?.languagePreference || 'en';
  const t = (en, bn) => language === 'bn' ? bn : en;

  const [mode, setMode] = useState(null); // 'learn', 'practice'
  const [selectedConjugation, setSelectedConjugation] = useState('masu');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generateConjugation = (verb, verbType, conjugationType) => {
    const conjugation = CONJUGATIONS[conjugationType];

    if (verbType === 'irregular') {
      return conjugation.irregular[verb.dictionary];
    } else if (verbType === 'ichidan') {
      return conjugation.ichidan(verb.stem);
    } else {
      return conjugation.godan[verb.ending](verb.stem);
    }
  };

  const generateQuestions = () => {
    const allVerbs = [];

    // Add ichidan verbs
    VERB_DATA.ichidan.forEach(verb => {
      allVerbs.push({ ...verb, type: 'ichidan' });
    });

    // Add godan verbs
    VERB_DATA.godan.forEach(verb => {
      allVerbs.push({ ...verb, type: 'godan' });
    });

    // Add irregular verbs
    VERB_DATA.irregular.forEach(verb => {
      allVerbs.push({ ...verb, type: 'irregular' });
    });

    // Generate questions for selected conjugation
    const generated = allVerbs.map((verb, idx) => {
      const correctAnswer = generateConjugation(verb, verb.type, selectedConjugation);

      // Generate wrong options
      const wrongOptions = [];
      const otherConjugations = Object.keys(CONJUGATIONS).filter(c => c !== selectedConjugation);
      otherConjugations.forEach(c => {
        wrongOptions.push(generateConjugation(verb, verb.type, c));
      });

      const options = [correctAnswer, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        id: `conj_${idx}`,
        verb: verb.dictionary,
        meaning: language === 'bn' ? verb.meaning_bn : verb.meaning_en,
        romaji: verb.romaji,
        type: verb.type,
        correctAnswer,
        options
      };
    });

    return generated.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  const startPractice = () => {
    setMode('practice');
    setQuestions(generateQuestions());
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setIsComplete(false);
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { answer, correct: isCorrect }
    }));

    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const xpEarned = correctCount * 4;

    if (xpEarned > 0) {
      addXP(xpEarned);
    }
    playSound('complete');
    setIsComplete(true);
  };

  // Mode selection / Learn mode
  if (!mode || mode === 'learn') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/practice')} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back', 'ফিরে যান')}
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-2xl font-bold mb-2">{t('Conjugation Trainer', 'ক্রিয়া রূপ প্রশিক্ষক')}</h1>
            <p className="text-muted-foreground">
              {t('Master Japanese verb conjugations', 'জাপানি ক্রিয়ার রূপ আয়ত্ত করুন')}
            </p>
          </div>

          {/* Conjugation selector */}
          <Card className="rounded-3xl card-shadow mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">{t('Select Conjugation Type', 'ক্রিয়ার রূপ নির্বাচন করুন')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(CONJUGATIONS).map(([key, conj]) => (
                  <Button
                    key={key}
                    variant={selectedConjugation === key ? 'default' : 'outline'}
                    className={`rounded-xl h-auto py-3 ${selectedConjugation === key ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSelectedConjugation(key)}
                  >
                    <div className="text-center">
                      <div className="font-bold">{language === 'bn' ? conj.name_bn : conj.name_en}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reference Table */}
          <Card className="rounded-3xl card-shadow mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Book className="w-5 h-5" />
                {t('Conjugation Reference', 'ক্রিয়ার রূপ রেফারেন্স')}
              </h3>

              <Tabs defaultValue="ichidan">
                <TabsList className="grid w-full grid-cols-3 rounded-xl mb-4">
                  <TabsTrigger value="ichidan" className="rounded-lg">Ichidan (る)</TabsTrigger>
                  <TabsTrigger value="godan" className="rounded-lg">Godan (う)</TabsTrigger>
                  <TabsTrigger value="irregular" className="rounded-lg">Irregular</TabsTrigger>
                </TabsList>

                <TabsContent value="ichidan" className="space-y-2">
                  {VERB_DATA.ichidan.slice(0, 3).map((verb, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div>
                        <span className="font-bold japanese-text">{verb.dictionary}</span>
                        <span className="text-sm text-muted-foreground ml-2">({verb.romaji})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium japanese-text text-primary">
                          {generateConjugation(verb, 'ichidan', selectedConjugation)}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="godan" className="space-y-2">
                  {VERB_DATA.godan.slice(0, 3).map((verb, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div>
                        <span className="font-bold japanese-text">{verb.dictionary}</span>
                        <span className="text-sm text-muted-foreground ml-2">({verb.romaji})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium japanese-text text-primary">
                          {generateConjugation(verb, 'godan', selectedConjugation)}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="irregular" className="space-y-2">
                  {VERB_DATA.irregular.map((verb, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div>
                        <span className="font-bold japanese-text">{verb.dictionary}</span>
                        <span className="text-sm text-muted-foreground ml-2">({verb.romaji})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium japanese-text text-primary">
                          {generateConjugation(verb, 'irregular', selectedConjugation)}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Start Practice Button */}
          <Button
            className="w-full rounded-full bg-primary text-primary-foreground btn-3d h-14"
            onClick={startPractice}
          >
            {t('Start Practice', 'অনুশীলন শুরু করুন')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Complete screen
  if (isComplete) {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const xpEarned = correctCount * 4;

    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-12 animate-bounce-in">
          <div className="text-6xl mb-6">
            {accuracy >= 80 ? '🏆' : accuracy >= 50 ? '📝' : '💪'}
          </div>
          <h1 className="text-3xl font-bold mb-4">
            {accuracy >= 80
              ? t('Excellent!', 'চমৎকার!')
              : accuracy >= 50
                ? t('Good Progress!', 'ভালো অগ্রগতি!')
                : t('Keep Learning!', 'শেখা চালিয়ে যান!')}
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
              onClick={startPractice}
              className="w-full rounded-full bg-primary text-primary-foreground btn-3d"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('Practice Again', 'আবার অনুশীলন')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setMode(null)}
              className="w-full rounded-full"
            >
              {t('Change Conjugation', 'রূপ পরিবর্তন করুন')}
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

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setMode(null)} className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('Exit', 'বের হন')}
          </Button>
          <Badge variant="secondary">
            {language === 'bn' ? CONJUGATIONS[selectedConjugation].name_bn : CONJUGATIONS[selectedConjugation].name_en}
          </Badge>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2 rounded-full mb-8" />

        {/* Question Card */}
        <Card className="rounded-3xl card-shadow mb-6">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t('Conjugate this verb:', 'এই ক্রিয়াটি রূপান্তর করুন:')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {CONJUGATIONS[selectedConjugation].name_en}
            </p>

            <div className="text-5xl font-bold japanese-text text-primary mb-2">
              {currentQuestion.verb}
            </div>
            <p className="text-muted-foreground mb-6">
              {currentQuestion.meaning} ({currentQuestion.romaji})
            </p>
            <Badge variant="outline" className="mb-6 capitalize">{currentQuestion.type}</Badge>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
                let buttonClass = 'rounded-2xl h-14 text-lg font-medium japanese-text transition-all';
                if (showResult) {
                  if (option === currentQuestion.correctAnswer) {
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

            {/* Feedback */}
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
                        {t('Answer:', 'উত্তর:')} <span className="japanese-text">{currentQuestion.correctAnswer}</span>
                      </span>
                    </>
                  )}
                </div>
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

export default ConjugationTrainer;
