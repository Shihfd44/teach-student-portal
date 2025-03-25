
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/utils/transitions';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} University Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
