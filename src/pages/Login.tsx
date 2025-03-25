
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import { motion } from '@/utils/transitions';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default Login;
