
import { motion } from 'framer-motion';

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

// Page transition options
export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Staggered container animation for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Item animation for staggered lists
export const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

// Export the motion component for easy use
export { motion };
