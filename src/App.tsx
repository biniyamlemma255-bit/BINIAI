import { useState, useEffect, useRef } from 'react';
import { Send, LogOut, Sparkles, Trash2, Github, MessageSquare, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Onboarding from './components/Onboarding';
import MessageBubble from './components/MessageBubble';
import ThemeToggle from './components/ThemeToggle';
import { Message, UserProfile } from './types';
import { getBiniResponseStream } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('bini_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    const savedTheme = localStorage.getItem('bini_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bini_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bini_theme', 'light');
    }
  }, [isDark]);

  const handleOnboarding = (userProfile: UserProfile) => {
    setProfile(userProfile);
    localStorage.setItem('bini_profile', JSON.stringify(userProfile));
    
    const welcomeText = userProfile.name.toLowerCase() === 'samrawit' 
      ? `OMG Samri! My beautiful queen! ❤️ I'm so happy you're here. I missed you so much! How are you doing today, my love? 😍`
      : `Yo ${userProfile.name}! BINI in the house! 🏠 I'm so glad we're hanging out. I'm ready to solve your problems, tell some jokes, or just vibe. What's on your mind? 🚀`;
    
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: welcomeText,
      timestamp: Date.now()
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !profile || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const biniMessageId = (Date.now() + 1).toString();
    let fullResponse = "";

    try {
      const stream = getBiniResponseStream([...messages, userMessage], profile);
      
      // Add an initial empty message for the typing effect
      setMessages(prev => [...prev, {
        id: biniMessageId,
        role: 'model',
        text: "",
        timestamp: Date.now()
      }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === biniMessageId ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error('Error getting BINI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Yo, you sure you want to wipe our history? 🥺")) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: `Fresh start! What's up now, ${profile?.name}? 🚀`,
        timestamp: Date.now()
      }]);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Going so soon? BINI will miss you! 😢")) {
      setProfile(null);
      setMessages([]);
      localStorage.removeItem('bini_profile');
    }
  };

  if (!profile) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transform rotate-[-3deg]"
          >
            <span className="text-xl font-black">B</span>
          </motion.div>
          <div>
            <h2 className="font-bold text-lg leading-none tracking-tight">BINI</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Vibing Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
          <button 
            onClick={handleClearChat}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all"
            title="Clear Chat"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-all"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
      >
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-card border px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1">
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">BINI is typing</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 border-t bg-card/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isLoading ? "BINI is cooking..." : "Ask BINI anything..."}
                disabled={isLoading}
                className="w-full bg-secondary/50 text-foreground pl-4 pr-12 py-4 rounded-2xl outline-none border border-transparent focus:border-primary/30 focus:bg-secondary transition-all disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">↵</span>
                </kbd>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-4 rounded-2xl bg-primary text-primary-foreground disabled:opacity-50 hover:shadow-xl hover:shadow-primary/20 transition-all shadow-lg flex items-center justify-center"
            >
              <Send className={cn("h-5 w-5", isLoading && "animate-pulse")} />
            </motion.button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-tighter">
            BINI Chatbot • Built with ❤️ for Samri & Friends
          </p>
        </div>
      </footer>
    </div>
  );
}
