
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
  title: 'Introduction to Physics',
  description: 'This test covers basic physics concepts including motion, energy, and forces.',
  timeLimit: 60,
  status: 'published',
  questions: [
    {
      id: '1',
      text: 'Which of the following is a unit of force?',
      type: 'multiple-choice',
      options: [
        { id: '1a', text: 'Newton', isCorrect: true },
        { id: '1b', text: 'Watt', isCorrect: false },
        { id: '1c', text: 'Joule', isCorrect: false },
        { id: '1d', text: 'Ampere', isCorrect: false },
      ],
    },
    {
      id: '2',
      text: 'Explain the concept of gravitational potential energy.',
      type: 'text',
      options: [],
      correctAnswer: 'Gravitational potential energy is the energy stored in an object due to its position in a gravitational field.',
    },
    {
      id: '3',
      text: 'Newton\'s first law states that an object will remain at rest or in uniform motion unless acted upon by an external force.',
      type: 'true-false',
      options: [
        { id: '3a', text: 'True', isCorrect: true },
        { id: '3b', text: 'False', isCorrect: false },
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
            { id: crypto.randomUUID(), text: 'True', isCorrect: false },
            { id: crypto.randomUUID(), text: 'False', isCorrect: false },
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
        title: "Error",
        description: "Please add a title for your test",
        variant: "destructive",
      });
      return;
    }
    
    if (test.questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question to your test",
        variant: "destructive",
      });
      return;
    }
    
    // Check each question
    for (let i = 0; i < test.questions.length; i++) {
      const q = test.questions[i];
      
      if (!q.text.trim()) {
        toast({
          title: "Error",
          description: `Question ${i + 1} is missing text`,
          variant: "destructive",
        });
        return;
      }
      
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        const hasCorrectOption = q.options.some(o => o.isCorrect);
        if (!hasCorrectOption) {
          toast({
            title: "Error",
            description: `Question ${i + 1} doesn't have a correct answer marked`,
            variant: "destructive",
          });
          return;
        }
        
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].text.trim()) {
            toast({
              title: "Error",
              description: `Option ${j + 1} in question ${i + 1} is empty`,
              variant: "destructive",
            });
            return;
          }
        }
      } else if (q.type === 'text' && !q.correctAnswer?.trim()) {
        toast({
          title: "Error",
          description: `Question ${i + 1} doesn't have a correct answer`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Save the test
    setTest(prev => ({ ...prev, status }));
    
    toast({
      title: `Test ${status === 'published' ? 'published' : 'saved'}`,
      description: status === 'published' 
        ? "Your test is now available to students"
        : "Your test has been saved as a draft",
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
          {test.id === SAMPLE_TEST.id ? 'Edit Test' : 'Create New Test'}
        </h1>
        <p className="text-muted-foreground mb-8">
          Design your test by adding questions and setting the correct answers.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AnimatedCard className="sticky top-20">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={test.title}
                  onChange={e => setTest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter test title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={test.description}
                  onChange={e => setTest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter test description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
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
                <h3 className="font-medium mb-2">Questions</h3>
                {test.questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No questions added yet</p>
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
                            <span className="font-medium">Question {i + 1}</span>
                            <span className="text-xs capitalize">{q.type}</span>
                          </div>
                          <p className="truncate text-xs mt-1">
                            {q.text || '(No question text)'}
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
                  Add Question
                </Button>
              </div>
              
              <div className="border-t pt-4 mt-4 flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => saveTest('draft')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => saveTest('published')}
                >
                  Publish
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
                  Question {currentQuestionIndex + 1}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(currentQuestionIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="questionText">Question Text</Label>
                  <Textarea
                    id="questionText"
                    value={test.questions[currentQuestionIndex].text}
                    onChange={e => updateQuestionText(currentQuestionIndex, e.target.value)}
                    placeholder="Enter your question here"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    value={test.questions[currentQuestionIndex].type}
                    onValueChange={(value: Question['type']) => updateQuestionType(currentQuestionIndex, value)}
                  >
                    <SelectTrigger id="questionType">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="text">Text Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {test.questions[currentQuestionIndex].type === 'text' ? (
                  <div>
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Textarea
                      id="correctAnswer"
                      value={test.questions[currentQuestionIndex].correctAnswer || ''}
                      onChange={e => updateCorrectAnswer(currentQuestionIndex, e.target.value)}
                      placeholder="Enter the correct answer"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Answer Options</Label>
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
                            placeholder={`Option ${optionIndex + 1}`}
                            disabled={test.questions[currentQuestionIndex].type === 'true-false'}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
                )}
              </div>
            </AnimatedCard>
          ) : (
            <AnimatedCard className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Question Selected</h2>
                <p className="text-muted-foreground mb-4">
                  Select a question from the sidebar or add a new one to get started
                </p>
                <Button onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Question
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
