import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export default function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="p-2 rounded-full bg-secondary text-secondary-foreground hover:opacity-80 transition-all"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </motion.button>
  );
}
