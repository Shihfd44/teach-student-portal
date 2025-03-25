
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { motion, staggerContainer, itemVariant } from '@/utils/transitions';

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
        { id: 1, title: 'Introduction to Physics', status: 'published', date: '2023-05-10', submissions: 24 },
        { id: 2, title: 'Advanced Calculus', status: 'draft', date: '2023-05-15', submissions: 0 },
      ]
    : [
        { id: 1, title: 'Introduction to Physics', status: 'completed', score: '85%', date: '2023-05-10' },
        { id: 2, title: 'Organic Chemistry', status: 'pending', score: '-', date: '2023-05-20' },
      ];
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mb-8">
          {isTeacher 
            ? "Manage your tests and view student results from your dashboard."
            : "Track your progress and take tests from your student dashboard."}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatedCard className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {isTeacher ? (
                <>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Tests Created</p>
                    <p className="text-2xl font-semibold">12</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Active Students</p>
                    <p className="text-2xl font-semibold">48</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Tests Completed</p>
                    <p className="text-2xl font-semibold">8</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-semibold">76%</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Button onClick={() => navigate(isTeacher ? '/test-create' : '/test-take')} className="w-full">
            {isTeacher ? 'Create New Test' : 'Take Available Tests'}
          </Button>
        </AnimatedCard>
        
        <AnimatedCard delay={1}>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="min-w-[60px] text-center">
                <p className="text-sm font-medium bg-primary/10 rounded-md py-1">MAY 25</p>
              </div>
              <div>
                <h3 className="font-medium">{isTeacher ? 'Midterm Deadline' : 'Physics Midterm'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isTeacher ? 'Grades submission deadline' : 'Remember to prepare for your test'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="min-w-[60px] text-center">
                <p className="text-sm font-medium bg-primary/10 rounded-md py-1">JUN 10</p>
              </div>
              <div>
                <h3 className="font-medium">Final Exams Begin</h3>
                <p className="text-sm text-muted-foreground">
                  {isTeacher ? 'Prepare test materials' : 'Study session available'}
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
            {isTeacher ? 'Recent Tests' : 'My Tests'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">
                    {isTeacher ? 'Submissions' : 'Score'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
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
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
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
                          ? 'Edit' 
                          : test.status === 'pending' 
                            ? 'Take Test' 
                            : 'View Results'}
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
              {isTeacher ? 'Student Progress' : 'My Progress'}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/results')}>
              View All
            </Button>
          </div>
          
          <AnimatedCard className="bg-muted/50">
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-muted-foreground text-center mb-2">
                {isTeacher 
                  ? 'Detailed analytics and student progress will be displayed here.'
                  : 'Your learning progress and analytics will be displayed here.'}
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
