
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, staggerContainer, itemVariant } from '@/utils/transitions';
import { ArrowRight, FileText, CheckCircle, XCircle } from 'lucide-react';

// Mock data
const STUDENT_RESULTS = [
  {
    id: '1',
    testId: '1',
    testTitle: 'Введение в физику',
    date: '2023-05-10',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8.5,
    timeSpent: '45:22',
    testType: 'Итоговый экзамен',
    category: 'Физика',
  },
  {
    id: '2',
    testId: '2',
    testTitle: 'Органическая химия',
    date: '2023-04-15',
    score: 72,
    totalQuestions: 15,
    correctAnswers: 10.8,
    timeSpent: '52:16',
    testType: 'Промежуточный',
    category: 'Химия',
  },
  {
    id: '3',
    testId: '3',
    testTitle: 'Основы математического анализа',
    date: '2023-03-22',
    score: 91,
    totalQuestions: 12,
    correctAnswers: 10.9,
    timeSpent: '38:45',
    testType: 'Тест',
    category: 'Математика',
  },
];

const TEACHER_RESULTS = [
  {
    id: '1',
    testId: '1',
    testTitle: 'Введение в физику',
    date: '2023-05-10',
    averageScore: 78,
    highestScore: 95,
    lowestScore: 62,
    participants: 24,
    passRate: 87,
    category: 'Физика',
  },
  {
    id: '2',
    testId: '2',
    testTitle: 'Высшая математика',
    date: '2023-04-15',
    averageScore: 71,
    highestScore: 92,
    lowestScore: 58,
    participants: 18,
    passRate: 72,
    category: 'Математика',
  },
];

const DETAILED_RESULT = {
  id: '1',
  testId: '1',
  testTitle: 'Введение в физику',
  date: '2023-05-10',
  score: 85,
  totalQuestions: 3,
  timeSpent: '45:22',
  questions: [
    {
      id: '1',
      text: 'Какая из следующих единиц измерения является единицей силы?',
      type: 'multiple-choice',
      userAnswer: 'Ньютон',
      correctAnswer: 'Ньютон',
      isCorrect: true,
    },
    {
      id: '2',
      text: 'Объясните концепцию гравитационной потенциальной энергии.',
      type: 'text',
      userAnswer: 'Энергия, хранящаяся в объекте из-за его высоты и массы в гравитационном поле.',
      correctAnswer: 'Гравитационная потенциальная энергия - это энергия, хранящаяся в объекте из-за его положения в гравитационном поле.',
      isCorrect: true,
      partialCredit: true,
    },
    {
      id: '3',
      text: 'Первый закон Ньютона гласит, что объект останется в состоянии покоя или равномерного движения, если на него не действуют внешние силы.',
      type: 'true-false',
      userAnswer: 'Верно',
      correctAnswer: 'Верно',
      isCorrect: true,
    },
  ],
};

const Results = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedResultId, setSelectedResultId] = React.useState<string | null>(null);
  
  // Check if we need to show a specific test result
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const testId = params.get('test');
    
    if (testId) {
      setSelectedResultId(testId);
      setActiveTab('detail');
    }
  }, [location]);
  
  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const isTeacher = user?.role === 'teacher';
  const results = isTeacher ? TEACHER_RESULTS : STUDENT_RESULTS;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const handleViewDetail = (resultId: string) => {
    setSelectedResultId(resultId);
    setActiveTab('detail');
  };
  
  const handleBackToOverview = () => {
    setSelectedResultId(null);
    setActiveTab('overview');
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Результаты тестов</h1>
        <p className="text-muted-foreground mb-8">
          {isTeacher 
            ? "Просматривайте и анализируйте успеваемость студентов на ваших тестах."
            : "Отслеживайте свою успеваемость и просматривайте результаты тестов."}
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedResultId}>
            Подробные результаты
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {results.length > 0 ? (
              results.map((result) => (
                <motion.div key={result.id} variants={itemVariant}>
                  <AnimatedCard className="hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{result.testTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {result.date} · {result.category}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex flex-wrap gap-4">
                          {isTeacher ? (
                            <>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Средний</p>
                                <p className={`text-lg font-medium ${getScoreColor(result.averageScore)}`}>
                                  {result.averageScore}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Успешность</p>
                                <p className={`text-lg font-medium ${getScoreColor(result.passRate)}`}>
                                  {result.passRate}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Студенты</p>
                                <p className="text-lg font-medium">{result.participants}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Балл</p>
                                <p className={`text-lg font-medium ${getScoreColor(result.score)}`}>
                                  {result.score}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Правильно</p>
                                <p className="text-lg font-medium">
                                  {result.correctAnswers}/{result.totalQuestions}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Время</p>
                                <p className="text-lg font-medium">{result.timeSpent}</p>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="md:self-center shrink-0"
                          onClick={() => handleViewDetail(result.id)}
                        >
                          Посмотреть детали
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))
            ) : (
              <AnimatedCard className="py-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Пока нет результатов</h3>
                  <p className="text-muted-foreground mb-4">
                    {isTeacher
                      ? "Вы еще не опубликовали тесты, или ни один студент не прошел ваши тесты."
                      : "Вы еще не прошли ни одного теста."}
                  </p>
                  <Button onClick={() => navigate(isTeacher ? '/test-create' : '/test-take')}>
                    {isTeacher ? 'Создать тест' : 'Пройти тесты'}
                  </Button>
                </div>
              </AnimatedCard>
            )}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="detail">
          {selectedResultId && (
            <div className="space-y-6">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleBackToOverview}
                className="mb-4"
              >
                Вернуться к обзору
              </Button>
              
              <AnimatedCard>
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{DETAILED_RESULT.testTitle}</h2>
                    <p className="text-muted-foreground">Пройден {DETAILED_RESULT.date}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Финальный балл</p>
                      <p className={`text-3xl font-bold ${getScoreColor(DETAILED_RESULT.score)}`}>
                        {DETAILED_RESULT.score}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Затраченное время</p>
                      <p className="text-3xl font-bold">{DETAILED_RESULT.timeSpent}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Анализ вопросов</h3>
                  
                  <div className="space-y-6">
                    {DETAILED_RESULT.questions.map((question, index) => (
                      <div key={question.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                            question.isCorrect 
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {question.isCorrect 
                              ? <CheckCircle className="h-4 w-4" />
                              : <XCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">Вопрос {index + 1}</p>
                            <p>{question.text}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Ваш ответ:</p>
                            <p className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.userAnswer}
                            </p>
                          </div>
                          
                          {!question.isCorrect && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Правильный ответ:</p>
                              <p className="text-green-600">{question.correctAnswer}</p>
                            </div>
                          )}
                          
                          {question.partialCredit && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Примечание:</p>
                              <p className="text-blue-600">
                                Начислены частичные баллы. Ваш ответ охватывает основную концепцию, но упущены некоторые детали.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
