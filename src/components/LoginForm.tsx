
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
          title: "Login successful",
          description: `Welcome back, ${role === 'teacher' ? 'Professor' : 'Student'}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Failed to login. Please try again later.",
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
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Tabs defaultValue="student" onValueChange={(value) => setRole(value as 'teacher' | 'student')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <div className="pt-4 text-sm text-muted-foreground">
              Log in as a student to take tests and view your results.
            </div>
          </TabsContent>
          <TabsContent value="teacher">
            <div className="pt-4 text-sm text-muted-foreground">
              Log in as a teacher to create tests and view student results.
            </div>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={role === 'teacher' ? "teacher@example.com" : "student@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            For demo purposes, use:
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
