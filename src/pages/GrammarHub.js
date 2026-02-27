import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText, Volume2, Check, Play, ChevronDown, ChevronUp
} from 'lucide-react';
import { N5_GRAMMAR, N4_GRAMMAR } from '@/data/JapaneseData';

const GrammarHub = () => {
  const { progress, markLearned, addXP } = useProfile();
  const { speak, playSound, initializeAudio } = useAudio();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { settings } = useProfile();
  const lang = settings.languagePreference || 'en';

  const [selectedLevel, setSelectedLevel] = useState('N5');

  const currentGrammar = selectedLevel === 'N5' ? N5_GRAMMAR : N4_GRAMMAR;

  const learnedCount = progress.grammarLearned?.length || 0;
  const totalCount = currentGrammar.length;
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  const handlePatternClick = (pattern, idx) => {
    initializeAudio();
    speak(pattern.pattern);
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const markAsLearned = (pattern) => {
    markLearned('grammar', pattern.pattern);
    addXP(10);
    playSound('correct');
  };

  const isLearned = (pattern) => progress.grammarLearned?.includes(pattern);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              Grammar Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedLevel} Grammar Patterns
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === 'N5' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => { setSelectedLevel('N5'); setExpandedIndex(null); }}
            >
              N5
            </Button>
            <Button
              variant={selectedLevel === 'N4' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => { setSelectedLevel('N4'); setExpandedIndex(null); }}
            >
              N4
            </Button>
          </div>
          <Link to="/quiz/grammar">
            <Button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="w-4 h-4 mr-2" />
              Quiz
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <Card className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Grammar Progress</span>
              <span className="text-sm text-muted-foreground">{learnedCount}/{totalCount}</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </CardContent>
        </Card>

        {/* Grammar List */}
        <div className="space-y-3">
          {currentGrammar.map((pattern, idx) => {
            const learned = isLearned(pattern.pattern);
            const isExpanded = expandedIndex === idx;

            return (
              <Card
                key={idx}
                className={`rounded-xl transition-all ${isExpanded ? 'ring-2 ring-blue-500' : ''
                  } ${learned ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handlePatternClick(pattern, idx)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl japanese-text font-bold">{pattern.pattern}</span>
                      {learned && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); initializeAudio(); speak(pattern.pattern); }}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {lang === 'bn' ? (pattern.bn || pattern.meaning) : pattern.meaning}
                  </p>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {pattern.explanation && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Explanation</h4>
                          <p className="text-sm text-muted-foreground">{pattern.explanation}</p>
                        </div>
                      )}

                      {pattern.examples?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Examples</h4>
                          <div className="space-y-2">
                            {pattern.examples.map((ex, i) => (
                              <div
                                key={i}
                                className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                                onClick={() => { initializeAudio(); speak(ex.jp); }}
                              >
                                <div className="flex items-start sm:items-center justify-between gap-2">
                                  <span className="japanese-text font-medium break-words">{ex.jp}</span>
                                  <Volume2 className="w-4 h-4 text-muted-foreground shrink-0 mt-1 sm:mt-0" />
                                </div>
                                {ex.romaji && (
                                  <p className="text-xs text-muted-foreground break-words">{ex.romaji}</p>
                                )}
                                <p className="text-sm break-words">
                                  {lang === 'bn' ? (ex.bn || ex.en) : ex.en}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => markAsLearned(pattern)}
                        disabled={learned}
                      >
                        {learned ? 'Already Learned' : 'Mark as Learned +10 XP'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default GrammarHub;
