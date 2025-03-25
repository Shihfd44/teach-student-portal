
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { motion, staggerContainer, itemVariant } from '@/utils/transitions';
import { MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return null;
  }
  
  const isTeacher = user.role === 'teacher';
  
  // Mock data
  const recentTests = isTeacher 
    ? [
        { id: 1, title: 'Введение в физику', status: 'published', date: '2023-05-10', submissions: 24 },
        { id: 2, title: 'Продвинутая математика', status: 'draft', date: '2023-05-15', submissions: 0 },
      ]
    : [
        { id: 1, title: 'Введение в физику', status: 'completed', score: '85%', date: '2023-05-10' },
        { id: 2, title: 'Органическая химия', status: 'pending', score: '-', date: '2023-05-20' },
      ];
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {user.name}</h1>
        <p className="text-muted-foreground mb-8">
          {isTeacher 
            ? "Управляйте тестами и просматривайте результаты студентов на вашей панели управления."
            : "Отслеживайте свой прогресс и проходите тесты на вашей студенческой панели."}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatedCard className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Быстрая статистика</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {isTeacher ? (
                <>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Созданные тесты</p>
                    <p className="text-2xl font-semibold">12</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Активные студенты</p>
                    <p className="text-2xl font-semibold">48</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Пройдено тестов</p>
                    <p className="text-2xl font-semibold">8</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Средний балл</p>
                    <p className="text-2xl font-semibold">76%</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => navigate(isTeacher ? '/test-create' : '/test-take')} className="flex-1">
              {isTeacher ? 'Создать новый тест' : 'Пройти доступные тесты'}
            </Button>
            <Button 
              onClick={() => navigate('/chat')} 
              variant="outline" 
              className="flex-1"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Перейти в чат
            </Button>
          </div>
        </AnimatedCard>
        
        <AnimatedCard delay={1}>
          <h2 className="text-xl font-semibold mb-4">Предстоящие события</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="min-w-[60px] text-center">
                <p className="text-sm font-medium bg-primary/10 rounded-md py-1">25 МАЯ</p>
              </div>
              <div>
                <h3 className="font-medium">{isTeacher ? 'Срок сдачи семестровых работ' : 'Физика, промежуточный тест'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isTeacher ? 'Срок подачи оценок' : 'Не забудьте подготовиться к тесту'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="min-w-[60px] text-center">
                <p className="text-sm font-medium bg-primary/10 rounded-md py-1">10 ИЮН</p>
              </div>
              <div>
                <h3 className="font-medium">Начало экзаменов</h3>
                <p className="text-sm text-muted-foreground">
                  {isTeacher ? 'Подготовьте материалы для тестов' : 'Доступна сессия для подготовки'}
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemVariant}>
          <h2 className="text-xl font-semibold mb-4">
            {isTeacher ? 'Недавние тесты' : 'Мои тесты'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Название</th>
                  <th className="text-left py-3 px-4 font-medium">Дата</th>
                  <th className="text-left py-3 px-4 font-medium">Статус</th>
                  <th className="text-left py-3 px-4 font-medium">
                    {isTeacher ? 'Ответы' : 'Балл'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test) => (
                  <tr key={test.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">{test.title}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{test.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        test.status === 'published' || test.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : test.status === 'draft' || test.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {test.status === 'published' ? 'Опубликован' :
                         test.status === 'draft' ? 'Черновик' :
                         test.status === 'completed' ? 'Завершен' :
                         test.status === 'pending' ? 'Ожидает' : test.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isTeacher ? test.submissions : (test as any).score}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(isTeacher 
                          ? `/test-create?edit=${test.id}` 
                          : test.status === 'pending' 
                            ? `/test-take?id=${test.id}` 
                            : `/results?test=${test.id}`
                        )}
                      >
                        {isTeacher 
                          ? 'Редактировать' 
                          : test.status === 'pending' 
                            ? 'Пройти тест' 
                            : 'Просмотр результатов'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariant}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {isTeacher ? 'Прогресс студентов' : 'Мой прогресс'}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/results')}>
              Показать все
            </Button>
          </div>
          
          <AnimatedCard className="bg-muted/50">
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-muted-foreground text-center mb-2">
                {isTeacher 
                  ? 'Здесь будет отображаться подробная аналитика и прогресс студентов.'
                  : 'Здесь будет отображаться ваш прогресс обучения и аналитика.'}
              </p>
              <div className="w-full h-12 bg-muted rounded-md animate-pulse"></div>
            </div>
          </AnimatedCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
