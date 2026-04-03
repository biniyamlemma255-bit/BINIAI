import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { Message } from '../types';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isBini = message.role === 'model';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-6 gap-3",
        isBini ? "justify-start" : "justify-end flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
        isBini ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        {isBini ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>

      <div
        className={cn(
          "max-w-[85%] px-4 py-3 rounded-2xl shadow-sm relative group transition-all duration-300",
          isBini 
            ? "bg-card text-card-foreground rounded-tl-none border border-border/50" 
            : "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <div className="relative my-3 group/code">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 rounded-t-lg border-b flex items-center px-3 justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{match ? match[1] : 'code'}</span>
                      <button
                        onClick={() => copyToClipboard(String(children))}
                        className="p-1 rounded-md hover:bg-background/50 transition-colors"
                      >
                        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <pre className="p-4 pt-10 rounded-lg bg-muted/30 overflow-x-auto text-[11px] font-mono border">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px] font-bold text-primary" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 mt-2 opacity-40 text-[9px] font-bold uppercase tracking-tighter",
          isBini ? "justify-start" : "justify-end"
        )}>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isBini && <span className="w-1 h-1 rounded-full bg-current" />}
          {isBini && <span>BINI AI</span>}
        </div>
      </div>
    </motion.div>
  );
}
