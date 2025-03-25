
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { motion } from '@/utils/transitions';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto px-4 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          University Learning Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A modern platform for teachers to create tests and students to enhance their learning experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="group"
          >
            Get Started 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4">
        <AnimatedCard delay={1} className="text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">For Students</h3>
          <p className="text-muted-foreground">Access tests, view your progress, and improve your academic performance.</p>
        </AnimatedCard>
        
        <AnimatedCard delay={2} className="text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">For Teachers</h3>
          <p className="text-muted-foreground">Create tests, assess student knowledge, and track class performance.</p>
        </AnimatedCard>
        
        <AnimatedCard delay={3} className="text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground">Visualize learning outcomes and identify areas for improvement.</p>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default Index;
