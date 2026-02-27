import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, X, ChevronRight, Volume2, GripVertical } from 'lucide-react';

// Audio pronunciation helper using Web Speech API
const speakJapanese = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
};

// Multiple Choice Question Component
const MultipleChoiceQuestion = ({ question, onAnswer, showResult, userAnswer }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="text-5xl font-bold japanese-text text-primary mb-2">
          {question.prompt}
        </div>
        {question.subPrompt && (
          <p className="text-muted-foreground japanese-text">{question.subPrompt}</p>
        )}
        {question.audioEnabled && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => speakJapanese(question.prompt)}
            className="mt-2"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, idx) => {
          let buttonClass = 'rounded-2xl h-14 text-lg font-medium transition-all';
          if (showResult) {
            if (option === question.answer) {
              buttonClass += ' bg-success text-white';
            } else if (userAnswer === option && userAnswer !== question.answer) {
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
              onClick={() => !showResult && onAnswer(option)}
              disabled={showResult}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

// Fill in the Blank Question Component
const FillBlankQuestion = ({ question, onAnswer, showResult, userAnswer }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">{question.instruction || 'Fill in the blank'}</p>
        <div className="text-2xl japanese-text p-4 bg-muted/50 rounded-xl">
          {question.sentence.split('___').map((part, idx) => (
            <React.Fragment key={idx}>
              <span>{part}</span>
              {idx < question.sentence.split('___').length - 1 && (
                <span className="inline-block min-w-[80px] border-b-2 border-primary mx-2">
                  {showResult ? (
                    <span className={userAnswer?.toLowerCase() === question.answer.toLowerCase() ? 'text-success' : 'text-destructive'}>
                      {userAnswer || '___'}
                    </span>
                  ) : (
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="inline-block w-24 h-8 text-center border-none bg-transparent focus:ring-0"
                      placeholder="?"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      disabled={showResult}
                    />
                  )}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
        {question.hint && !showResult && (
          <p className="text-sm text-muted-foreground mt-3">Hint: {question.hint}</p>
        )}
      </div>
      
      {!showResult && (
        <Button 
          className="w-full rounded-full bg-primary text-primary-foreground"
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
        >
          Check Answer
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {showResult && (
        <div className={`p-4 rounded-xl ${userAnswer?.toLowerCase() === question.answer.toLowerCase() ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <div className="flex items-center justify-center gap-2">
            {userAnswer?.toLowerCase() === question.answer.toLowerCase() ? (
              <>
                <Check className="w-5 h-5 text-success" />
                <span className="font-bold text-success">Correct!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-destructive" />
                <span className="text-destructive">
                  Answer: <span className="font-bold japanese-text">{question.answer}</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Matching Question Component
const MatchingQuestion = ({ question, onAnswer, showResult, userAnswer }) => {
  const [selected, setSelected] = useState({ left: null, right: null });
  const [matches, setMatches] = useState({});
  const [matchedRight, setMatchedRight] = useState(new Set());

  const handleLeftClick = (item) => {
    if (showResult || matches[item]) return;
    setSelected(prev => ({ ...prev, left: item }));
  };

  const handleRightClick = (item) => {
    if (showResult || matchedRight.has(item)) return;
    
    if (selected.left) {
      const newMatches = { ...matches, [selected.left]: item };
      setMatches(newMatches);
      setMatchedRight(new Set([...matchedRight, item]));
      setSelected({ left: null, right: null });
      
      // Check if all matched
      if (Object.keys(newMatches).length === question.pairs.length) {
        onAnswer(newMatches);
      }
    } else {
      setSelected(prev => ({ ...prev, right: item }));
    }
  };

  const isCorrectMatch = (left, right) => {
    const correctPair = question.pairs.find(p => p.left === left);
    return correctPair?.right === right;
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-4">{question.instruction || 'Match the pairs'}</p>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-2">
          {question.pairs.map((pair, idx) => {
            const isMatched = matches[pair.left];
            const isSelected = selected.left === pair.left;
            let bgClass = 'bg-muted/50';
            
            if (showResult && isMatched) {
              bgClass = isCorrectMatch(pair.left, matches[pair.left]) ? 'bg-success/20' : 'bg-destructive/20';
            } else if (isMatched) {
              bgClass = 'bg-primary/20';
            } else if (isSelected) {
              bgClass = 'bg-info/20 ring-2 ring-info';
            }
            
            return (
              <Button
                key={`left-${idx}`}
                variant="ghost"
                className={`w-full h-14 rounded-xl justify-start text-lg japanese-text ${bgClass}`}
                onClick={() => handleLeftClick(pair.left)}
                disabled={showResult || isMatched}
              >
                {pair.left}
              </Button>
            );
          })}
        </div>
        
        {/* Right column */}
        <div className="space-y-2">
          {question.shuffledRight.map((item, idx) => {
            const isMatched = matchedRight.has(item);
            const isSelected = selected.right === item;
            let bgClass = 'bg-muted/50';
            
            if (showResult && isMatched) {
              const leftMatch = Object.keys(matches).find(k => matches[k] === item);
              bgClass = isCorrectMatch(leftMatch, item) ? 'bg-success/20' : 'bg-destructive/20';
            } else if (isMatched) {
              bgClass = 'bg-primary/20';
            } else if (isSelected) {
              bgClass = 'bg-info/20 ring-2 ring-info';
            }
            
            return (
              <Button
                key={`right-${idx}`}
                variant="ghost"
                className={`w-full h-14 rounded-xl justify-start text-lg ${bgClass}`}
                onClick={() => handleRightClick(item)}
                disabled={showResult || isMatched}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className={`p-4 rounded-xl ${
          question.pairs.every(p => isCorrectMatch(p.left, matches[p.left])) 
            ? 'bg-success/10' : 'bg-destructive/10'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {question.pairs.every(p => isCorrectMatch(p.left, matches[p.left])) ? (
              <>
                <Check className="w-5 h-5 text-success" />
                <span className="font-bold text-success">All Correct!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-destructive" />
                <span className="text-destructive">Some matches were incorrect</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Drag Order Question Component (simplified with button clicks)
const DragOrderQuestion = ({ question, onAnswer, showResult, userAnswer }) => {
  const [order, setOrder] = useState([...question.shuffledItems]);

  const moveItem = (fromIndex, direction) => {
    if (showResult) return;
    
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= order.length) return;
    
    const newOrder = [...order];
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    onAnswer(order);
  };

  const isCorrect = JSON.stringify(order) === JSON.stringify(question.correctOrder);

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-4">{question.instruction || 'Arrange in correct order'}</p>
      
      <div className="space-y-2">
        {order.map((item, idx) => {
          let bgClass = 'bg-muted/50';
          if (showResult) {
            bgClass = order[idx] === question.correctOrder[idx] ? 'bg-success/20' : 'bg-destructive/20';
          }
          
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-4 rounded-xl ${bgClass}`}
            >
              <span className="text-muted-foreground w-8">{idx + 1}.</span>
              <span className="flex-1 text-lg japanese-text">{item}</span>
              {!showResult && (
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                  >
                    ▲
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === order.length - 1}
                  >
                    ▼
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResult && (
        <Button 
          className="w-full rounded-full bg-primary text-primary-foreground mt-4"
          onClick={handleSubmit}
        >
          Check Order
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {showResult && (
        <div className={`p-4 rounded-xl ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <div className="flex items-center justify-center gap-2">
            {isCorrect ? (
              <>
                <Check className="w-5 h-5 text-success" />
                <span className="font-bold text-success">Perfect Order!</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-destructive" />
                <span className="text-destructive">
                  Correct: {question.correctOrder.join(' → ')}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Quiz Engine Component
const QuizEngine = ({ 
  questions, 
  onComplete,
  showProgress = true,
  title = 'Quiz'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    let isCorrect = false;
    
    switch (currentQuestion.type) {
      case 'multiple_choice':
        isCorrect = answer === currentQuestion.answer;
        break;
      case 'fill_blank':
        isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase();
        break;
      case 'matching':
        isCorrect = currentQuestion.pairs.every(p => answer[p.left] === p.right);
        break;
      case 'drag_order':
        isCorrect = JSON.stringify(answer) === JSON.stringify(currentQuestion.correctOrder);
        break;
      default:
        isCorrect = answer === currentQuestion.answer;
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { answer, correct: isCorrect }
    }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
    } else {
      const correctCount = Object.values(answers).filter(a => a.correct).length;
      setIsComplete(true);
      if (onComplete) {
        onComplete({
          correctCount,
          totalQuestions: questions.length,
          answers
        });
      }
    }
  };

  const renderQuestion = () => {
    const userAnswer = answers[currentQuestion.id]?.answer;
    
    switch (currentQuestion.type) {
      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />
        );
      case 'drag_order':
        return (
          <DragOrderQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />
        );
      case 'multiple_choice':
      default:
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            showResult={showResult}
            userAnswer={userAnswer}
          />
        );
    }
  };

  if (isComplete) {
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="text-center py-8 animate-bounce-in">
        <div className="text-6xl mb-6">
          {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {accuracy >= 80 ? 'Excellent!' : accuracy >= 50 ? 'Good Job!' : 'Keep Practicing!'}
        </h2>
        <Card className="rounded-3xl card-shadow mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-success">{correctCount}/{questions.length}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-info">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{title}</span>
            <span>{currentIndex + 1}/{questions.length}</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      )}

      {/* Question Card */}
      <Card className="rounded-3xl card-shadow mb-6">
        <CardContent className="p-6">
          <Badge variant="secondary" className="mb-4 capitalize">{currentQuestion.type.replace('_', ' ')}</Badge>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Next Button */}
      {showResult && currentQuestion.type === 'multiple_choice' && (
        <Button 
          className="w-full rounded-full bg-primary text-primary-foreground btn-3d h-14"
          onClick={handleNext}
        >
          {currentIndex < questions.length - 1 ? 'Next' : 'See Results'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {showResult && currentQuestion.type !== 'multiple_choice' && (
        <Button 
          className="w-full rounded-full bg-primary text-primary-foreground btn-3d h-14 mt-4"
          onClick={handleNext}
        >
          {currentIndex < questions.length - 1 ? 'Next' : 'See Results'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default QuizEngine;
export { speakJapanese, MultipleChoiceQuestion, FillBlankQuestion, MatchingQuestion, DragOrderQuestion };
