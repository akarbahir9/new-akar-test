import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AIAssistantPage() {
  const { t } = useLanguage();
  const { user, hasPermission } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Hello ${user?.name}! I'm your AI assistant. I can help you with ${hasPermission('viewPosInsights') ? 'POS insights, ' : ''}${hasPermission('viewFinancialInsights') ? 'financial analysis, ' : ''}${hasPermission('viewLoanInsights') ? 'customer & loan data, ' : ''}and general questions. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: 'I understand your question. In a production system, I would provide intelligent insights based on your permissions and data access. This is a demo response.' }]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card animate-fade-in">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="w-5 h-5 text-primary" /></div>
        <div><h1 className="font-semibold text-foreground">{t('nav.aiAssistant')}</h1><p className="text-xs text-muted-foreground">Powered by AI</p></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary" /></div>}
            <div className={`max-w-[70%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{msg.content}</div>
            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0"><User className="w-4 h-4" /></div>}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border flex gap-3">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1" />
        <Button variant="primary" onClick={sendMessage}><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
