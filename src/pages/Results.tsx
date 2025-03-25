
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
    testTitle: 'Introduction to Physics',
    date: '2023-05-10',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8.5,
    timeSpent: '45:22',
    testType: 'Final Exam',
    category: 'Physics',
  },
  {
    id: '2',
    testId: '2',
    testTitle: 'Organic Chemistry',
    date: '2023-04-15',
    score: 72,
    totalQuestions: 15,
    correctAnswers: 10.8,
    timeSpent: '52:16',
    testType: 'Midterm',
    category: 'Chemistry',
  },
  {
    id: '3',
    testId: '3',
    testTitle: 'Calculus Fundamentals',
    date: '2023-03-22',
    score: 91,
    totalQuestions: 12,
    correctAnswers: 10.9,
    timeSpent: '38:45',
    testType: 'Quiz',
    category: 'Mathematics',
  },
];

const TEACHER_RESULTS = [
  {
    id: '1',
    testId: '1',
    testTitle: 'Introduction to Physics',
    date: '2023-05-10',
    averageScore: 78,
    highestScore: 95,
    lowestScore: 62,
    participants: 24,
    passRate: 87,
    category: 'Physics',
  },
  {
    id: '2',
    testId: '2',
    testTitle: 'Advanced Calculus',
    date: '2023-04-15',
    averageScore: 71,
    highestScore: 92,
    lowestScore: 58,
    participants: 18,
    passRate: 72,
    category: 'Mathematics',
  },
];

const DETAILED_RESULT = {
  id: '1',
  testId: '1',
  testTitle: 'Introduction to Physics',
  date: '2023-05-10',
  score: 85,
  totalQuestions: 3,
  timeSpent: '45:22',
  questions: [
    {
      id: '1',
      text: 'Which of the following is a unit of force?',
      type: 'multiple-choice',
      userAnswer: 'Newton',
      correctAnswer: 'Newton',
      isCorrect: true,
    },
    {
      id: '2',
      text: 'Explain the concept of gravitational potential energy.',
      type: 'text',
      userAnswer: 'Energy stored in an object due to its height and mass in a gravitational field.',
      correctAnswer: 'Gravitational potential energy is the energy stored in an object due to its position in a gravitational field.',
      isCorrect: true,
      partialCredit: true,
    },
    {
      id: '3',
      text: 'Newton\'s first law states that an object will remain at rest or in uniform motion unless acted upon by an external force.',
      type: 'true-false',
      userAnswer: 'True',
      correctAnswer: 'True',
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
        <h1 className="text-3xl font-bold mb-2">Test Results</h1>
        <p className="text-muted-foreground mb-8">
          {isTeacher 
            ? "View and analyze student performance on your tests."
            : "Track your performance and review your test results."}
        </p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedResultId}>
            Detailed Results
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
                                <p className="text-sm text-muted-foreground">Average</p>
                                <p className={`text-lg font-medium ${getScoreColor(result.averageScore)}`}>
                                  {result.averageScore}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Pass Rate</p>
                                <p className={`text-lg font-medium ${getScoreColor(result.passRate)}`}>
                                  {result.passRate}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Students</p>
                                <p className="text-lg font-medium">{result.participants}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className={`text-lg font-medium ${getScoreColor(result.score)}`}>
                                  {result.score}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Correct</p>
                                <p className="text-lg font-medium">
                                  {result.correctAnswers}/{result.totalQuestions}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Time</p>
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
                          View Details
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
                  <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {isTeacher
                      ? "You haven't published any tests yet, or no students have taken your tests."
                      : "You haven't taken any tests yet."}
                  </p>
                  <Button onClick={() => navigate(isTeacher ? '/test-create' : '/test-take')}>
                    {isTeacher ? 'Create Test' : 'Take Tests'}
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
                Back to Overview
              </Button>
              
              <AnimatedCard>
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{DETAILED_RESULT.testTitle}</h2>
                    <p className="text-muted-foreground">Taken on {DETAILED_RESULT.date}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Final Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(DETAILED_RESULT.score)}`}>
                        {DETAILED_RESULT.score}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Time Spent</p>
                      <p className="text-3xl font-bold">{DETAILED_RESULT.timeSpent}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Question Breakdown</h3>
                  
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
                            <p className="font-medium">Question {index + 1}</p>
                            <p>{question.text}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Your Answer:</p>
                            <p className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.userAnswer}
                            </p>
                          </div>
                          
                          {!question.isCorrect && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Correct Answer:</p>
                              <p className="text-green-600">{question.correctAnswer}</p>
                            </div>
                          )}
                          
                          {question.partialCredit && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Note:</p>
                              <p className="text-blue-600">
                                Partial credit awarded. Your answer covered the main concept but missed some details.
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
