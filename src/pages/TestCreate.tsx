
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { motion } from '@/utils/transitions';
import { Plus, Trash, Save } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'true-false';
  options: { id: string; text: string; isCorrect: boolean }[];
  correctAnswer?: string;
}

interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  status: 'draft' | 'published';
}

// Mock data
const SAMPLE_TEST: Test = {
  id: '1',
  title: 'Введение в физику',
  description: 'Этот тест охватывает базовые концепции физики, включая движение, энергию и силы.',
  timeLimit: 60,
  status: 'published',
  questions: [
    {
      id: '1',
      text: 'Какая из следующих единиц измерения является единицей силы?',
      type: 'multiple-choice',
      options: [
        { id: '1a', text: 'Ньютон', isCorrect: true },
        { id: '1b', text: 'Ватт', isCorrect: false },
        { id: '1c', text: 'Джоуль', isCorrect: false },
        { id: '1d', text: 'Ампер', isCorrect: false },
      ],
    },
    {
      id: '2',
      text: 'Объясните концепцию гравитационной потенциальной энергии.',
      type: 'text',
      options: [],
      correctAnswer: 'Гравитационная потенциальная энергия - это энергия, хранящаяся в объекте из-за его положения в гравитационном поле.',
    },
    {
      id: '3',
      text: 'Первый закон Ньютона гласит, что объект останется в состоянии покоя или равномерного движения, если на него не действуют внешние силы.',
      type: 'true-false',
      options: [
        { id: '3a', text: 'Верно', isCorrect: true },
        { id: '3b', text: 'Неверно', isCorrect: false },
      ],
    },
  ],
};

const TestCreate = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [test, setTest] = useState<Test>({
    id: crypto.randomUUID(),
    title: '',
    description: '',
    timeLimit: 60,
    questions: [],
    status: 'draft',
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  
  // Check if we're editing a test
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    
    if (editId === '1') {
      setTest(SAMPLE_TEST);
    }
  }, [location]);
  
  // Protect route
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'teacher') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: '',
      type: 'multiple-choice',
      options: [
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
      ],
    };
    
    setTest(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    
    setCurrentQuestionIndex(test.questions.length);
  };
  
  const removeQuestion = (index: number) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    
    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(null);
    } else if (currentQuestionIndex !== null && currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const updateQuestionText = (index: number, text: string) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, text } : q
      ),
    }));
  };
  
  const updateQuestionType = (index: number, type: Question['type']) => {
    setTest(prev => {
      const updatedQuestions = [...prev.questions];
      
      if (type === 'multiple-choice') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          type,
          options: [
            { id: crypto.randomUUID(), text: '', isCorrect: false },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
            { id: crypto.randomUUID(), text: '', isCorrect: false },
          ],
        };
      } else if (type === 'true-false') {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          type,
          options: [
            { id: crypto.randomUUID(), text: 'Верно', isCorrect: false },
            { id: crypto.randomUUID(), text: 'Неверно', isCorrect: false },
          ],
        };
      } else {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          type,
          options: [],
          correctAnswer: '',
        };
      }
      
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };
  
  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIdx) => 
        qIdx === questionIndex 
          ? {
              ...q,
              options: q.options.map((o, oIdx) => 
                oIdx === optionIndex ? { ...o, text } : o
              ),
            }
          : q
      ),
    }));
  };
  
  const updateCorrectOption = (questionIndex: number, optionIndex: number) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIdx) => 
        qIdx === questionIndex 
          ? {
              ...q,
              options: q.options.map((o, oIdx) => 
                ({ ...o, isCorrect: oIdx === optionIndex })
              ),
            }
          : q
      ),
    }));
  };
  
  const updateCorrectAnswer = (questionIndex: number, answer: string) => {
    setTest(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIdx) => 
        qIdx === questionIndex ? { ...q, correctAnswer: answer } : q
      ),
    }));
  };
  
  const saveTest = (status: 'draft' | 'published') => {
    // Validation
    if (!test.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, добавьте название для вашего теста",
        variant: "destructive",
      });
      return;
    }
    
    if (test.questions.length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, добавьте хотя бы один вопрос в ваш тест",
        variant: "destructive",
      });
      return;
    }
    
    // Check each question
    for (let i = 0; i < test.questions.length; i++) {
      const q = test.questions[i];
      
      if (!q.text.trim()) {
        toast({
          title: "Ошибка",
          description: `В вопросе ${i + 1} отсутствует текст`,
          variant: "destructive",
        });
        return;
      }
      
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        const hasCorrectOption = q.options.some(o => o.isCorrect);
        if (!hasCorrectOption) {
          toast({
            title: "Ошибка",
            description: `В вопросе ${i + 1} не отмечен правильный ответ`,
            variant: "destructive",
          });
          return;
        }
        
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].text.trim()) {
            toast({
              title: "Ошибка",
              description: `Вариант ${j + 1} в вопросе ${i + 1} пуст`,
              variant: "destructive",
            });
            return;
          }
        }
      } else if (q.type === 'text' && !q.correctAnswer?.trim()) {
        toast({
          title: "Ошибка",
          description: `В вопросе ${i + 1} нет правильного ответа`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Save the test
    setTest(prev => ({ ...prev, status }));
    
    toast({
      title: `Тест ${status === 'published' ? 'опубликован' : 'сохранен'}`,
      description: status === 'published' 
        ? "Ваш тест теперь доступен для студентов"
        : "Ваш тест сохранен как черновик",
    });
    
    navigate('/dashboard');
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          {test.id === SAMPLE_TEST.id ? 'Редактирование теста' : 'Создание нового теста'}
        </h1>
        <p className="text-muted-foreground mb-8">
          Создайте свой тест, добавляя вопросы и устанавливая правильные ответы.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AnimatedCard className="sticky top-20">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Название теста</Label>
                <Input
                  id="title"
                  value={test.title}
                  onChange={e => setTest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введите название теста"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={test.description}
                  onChange={e => setTest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Введите описание теста"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="timeLimit">Ограничение по времени (минуты)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min={5}
                  max={180}
                  value={test.timeLimit}
                  onChange={e => setTest(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Вопросы</h3>
                {test.questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Вопросы еще не добавлены</p>
                ) : (
                  <ul className="space-y-2">
                    {test.questions.map((q, i) => (
                      <li key={q.id}>
                        <button
                          className={`text-left w-full p-2 rounded-md text-sm transition-colors ${
                            currentQuestionIndex === i 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setCurrentQuestionIndex(i)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Вопрос {i + 1}</span>
                            <span className="text-xs capitalize">
                              {q.type === 'multiple-choice' ? 'Множественный выбор' :
                               q.type === 'true-false' ? 'Верно/Неверно' : 'Текстовый ответ'}
                            </span>
                          </div>
                          <p className="truncate text-xs mt-1">
                            {q.text || '(Текст вопроса отсутствует)'}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={addQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить вопрос
                </Button>
              </div>
              
              <div className="border-t pt-4 mt-4 flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => saveTest('draft')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить черновик
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => saveTest('published')}
                >
                  Опубликовать
                </Button>
              </div>
            </div>
          </AnimatedCard>
        </div>
        
        <div className="md:col-span-2">
          {currentQuestionIndex !== null ? (
            <AnimatedCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Вопрос {currentQuestionIndex + 1}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(currentQuestionIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="questionText">Текст вопроса</Label>
                  <Textarea
                    id="questionText"
                    value={test.questions[currentQuestionIndex].text}
                    onChange={e => updateQuestionText(currentQuestionIndex, e.target.value)}
                    placeholder="Введите свой вопрос здесь"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType">Тип вопроса</Label>
                  <Select
                    value={test.questions[currentQuestionIndex].type}
                    onValueChange={(value: Question['type']) => updateQuestionType(currentQuestionIndex, value)}
                  >
                    <SelectTrigger id="questionType">
                      <SelectValue placeholder="Выберите тип вопроса" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Множественный выбор</SelectItem>
                      <SelectItem value="true-false">Верно/Неверно</SelectItem>
                      <SelectItem value="text">Текстовый ответ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {test.questions[currentQuestionIndex].type === 'text' ? (
                  <div>
                    <Label htmlFor="correctAnswer">Правильный ответ</Label>
                    <Textarea
                      id="correctAnswer"
                      value={test.questions[currentQuestionIndex].correctAnswer || ''}
                      onChange={e => updateCorrectAnswer(currentQuestionIndex, e.target.value)}
                      placeholder="Введите правильный ответ"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Варианты ответов</Label>
                    <div className="space-y-2 mt-2">
                      {test.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`option-${optionIndex}`}
                            name={`correct-option-${currentQuestionIndex}`}
                            checked={option.isCorrect}
                            onChange={() => updateCorrectOption(currentQuestionIndex, optionIndex)}
                            className="h-4 w-4"
                          />
                          <Input
                            value={option.text}
                            onChange={e => updateOption(currentQuestionIndex, optionIndex, e.target.value)}
                            placeholder={`Вариант ${optionIndex + 1}`}
                            disabled={test.questions[currentQuestionIndex].type === 'true-false'}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Выберите радиокнопку рядом с правильным ответом
                    </p>
                  </div>
                )}
              </div>
            </AnimatedCard>
          ) : (
            <AnimatedCard className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Вопрос не выбран</h2>
                <p className="text-muted-foreground mb-4">
                  Выберите вопрос из боковой панели или добавьте новый, чтобы начать
                </p>
                <Button onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить первый вопрос
                </Button>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCreate;
