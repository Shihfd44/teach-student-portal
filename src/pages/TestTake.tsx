
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { motion } from '@/utils/transitions';
import { AlertTriangle, Clock } from 'lucide-react';

// Example test data (in a real app, this would come from an API)
const TEST_DATA = {
  id: '1',
  title: 'Введение в физику',
  description: 'Этот тест охватывает основные концепции физики, включая движение, энергию и силы.',
  timeLimit: 60, // in minutes
  questions: [
    {
      id: '1',
      text: 'Какая из следующих единиц измерения является единицей силы?',
      type: 'multiple-choice',
      options: [
        { id: '1a', text: 'Ньютон' },
        { id: '1b', text: 'Ватт' },
        { id: '1c', text: 'Джоуль' },
        { id: '1d', text: 'Ампер' },
      ],
    },
    {
      id: '2',
      text: 'Объясните концепцию гравитационной потенциальной энергии.',
      type: 'text',
    },
    {
      id: '3',
      text: 'Первый закон Ньютона гласит, что объект останется в состоянии покоя или равномерного движения, если на него не действуют внешние силы.',
      type: 'true-false',
      options: [
        { id: '3a', text: 'Верно' },
        { id: '3b', text: 'Неверно' },
      ],
    },
  ],
};

const TestTake = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [test, setTest] = useState(TEST_DATA);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Protect route
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Set up timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [test.questions[currentQuestionIndex].id]: value,
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsSubmitting(true);
    
    // Check if all questions are answered
    const unansweredCount = test.questions.filter(
      q => !answers[q.id]
    ).length;
    
    if (unansweredCount > 0 && !showConfirmSubmit) {
      setShowConfirmSubmit(true);
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Тест успешно отправлен",
      description: "Ваши ответы были записаны. Скоро вы сможете узнать результаты.",
    });
    
    navigate('/results');
  };
  
  const currentQuestion = test.questions[currentQuestionIndex];
  const progressPercentage = Math.floor(
    Object.keys(answers).length / test.questions.length * 100
  );
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
            <p className="text-muted-foreground">{test.description}</p>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className={`font-medium ${timeLeft < 300 ? 'text-destructive' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </motion.div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {Object.keys(answers).length} из {test.questions.length} вопросов отвечено
          </span>
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {showConfirmSubmit ? (
        <AnimatedCard className="bg-muted/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Подтвердите отправку</h2>
              <p className="text-muted-foreground">
                У вас есть {test.questions.length - Object.keys(answers).length} неотвеченных вопросов.
              </p>
            </div>
          </div>
          
          <p className="mb-6">
            Вы уверены, что хотите отправить свой тест прямо сейчас? После отправки вы не сможете внести изменения.
          </p>
          
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
            >
              Продолжить тест
            </Button>
            <Button
              onClick={handleSubmitTest}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Все равно отправить"}
            </Button>
          </div>
        </AnimatedCard>
      ) : (
        <>
          <AnimatedCard key={currentQuestion.id} className="mb-6">
            <div className="flex justify-between mb-4">
              <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                Вопрос {currentQuestionIndex + 1} из {test.questions.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {currentQuestion.type === 'multiple-choice' ? 'Множественный выбор' : 
                 currentQuestion.type === 'true-false' ? 'Верно/Неверно' : 'Текстовый ответ'}
              </span>
            </div>
            
            <h2 className="text-xl font-medium mb-6">{currentQuestion.text}</h2>
            
            {currentQuestion.type === 'text' ? (
              <Textarea
                placeholder="Введите свой ответ здесь..."
                rows={5}
                value={answers[currentQuestion.id] || ''}
                onChange={e => handleAnswerChange(e.target.value)}
              />
            ) : (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </AnimatedCard>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Предыдущий
            </Button>
            
            {currentQuestionIndex < test.questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>
                Следующий
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitTest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить тест"}
              </Button>
            )}
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-2">Навигация по вопросам</h3>
            <div className="flex flex-wrap gap-2">
              {test.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-primary-foreground'
                      : answers[q.id]
                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestTake;
