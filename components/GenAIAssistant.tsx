import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, Loader2, X } from 'lucide-react';
import { ChatMessage, Language, Translation } from '../types';

interface GenAIAssistantProps {
  translation: Translation;
  lang: Language;
  onClose: () => void;
}

const GenAIAssistant: React.FC<GenAIAssistantProps> = ({ translation, lang, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: translation.aiAssistant + " - " + translation.askAi }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
            systemInstruction: `You are a helpful assistant for Zirng Flow Hub. The user is speaking in language code: ${lang}. Reply in that language. Keep responses concise and relevant to workflow automation.`
        }
      });
      
      const text = response.text || "No response";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to Gemini." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-bold">{translation.aiAssistant}</span>
        </div>
        <button onClick={onClose} className="hover:bg-primary-700 p-1 rounded-full transition">
            <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-bg/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-primary-500 text-white rounded-tr-none' 
                : 'bg-white dark:bg-dark-surface text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
             <div className="flex justify-start">
             <div className="bg-white dark:bg-dark-surface p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
               <span className="text-xs text-gray-500">{translation.typing}</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={translation.askAi}
                className="flex-1 bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default GenAIAssistant;
