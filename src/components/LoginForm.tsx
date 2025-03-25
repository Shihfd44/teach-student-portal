
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import AnimatedCard from './ui/AnimatedCard';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast({
          title: "Вход выполнен успешно",
          description: `Добро пожаловать, ${role === 'teacher' ? 'Преподаватель' : 'Студент'}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный email или пароль. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        description: "Не удалось войти. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedCard className="max-w-md w-full mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Добро пожаловать</h2>
          <p className="text-muted-foreground">Войдите в свой аккаунт</p>
        </div>

        <Tabs defaultValue="student" onValueChange={(value) => setRole(value as 'teacher' | 'student')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Студент</TabsTrigger>
            <TabsTrigger value="teacher">Преподаватель</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <div className="pt-4 text-sm text-muted-foreground">
              Войдите как студент, чтобы проходить тесты и просматривать свои результаты.
            </div>
          </TabsContent>
          <TabsContent value="teacher">
            <div className="pt-4 text-sm text-muted-foreground">
              Войдите как преподаватель, чтобы создавать тесты и просматривать результаты студентов.
            </div>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={role === 'teacher' ? "преподаватель@пример.рф" : "студент@пример.рф"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Забыли пароль?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Вход в систему..." : "Войти"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Для демонстрации используйте:
            <br />
            {role === 'teacher' ? (
              <span className="font-medium">teacher@example.com / password</span>
            ) : (
              <span className="font-medium">student@example.com / password</span>
            )}
          </p>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default LoginForm;
