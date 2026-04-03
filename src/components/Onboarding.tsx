import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age) {
      onComplete({ name: name.trim(), age: parseInt(age) });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transform rotate-[-6deg] mb-2"
          >
            <span className="text-5xl font-black">B</span>
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">Yo! I'm BINI 🚀</h1>
            <p className="text-muted-foreground font-medium">I'm your new AI bestie. Let's get to know each other!</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 p-8 rounded-[2rem] shadow-xl shadow-black/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="What should I call you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-secondary/30 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Age</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    placeholder="How many years young?"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-secondary/30 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    required
                    min="1"
                    max="120"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!name.trim() || !age}
              className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 transition-all shadow-lg"
            >
              Start Vibe Check <Sparkles className="h-5 w-5" />
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          BINI is ready to solve your problems 🧠
        </p>
      </motion.div>
    </div>
  );
}
