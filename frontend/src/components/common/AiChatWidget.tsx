import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { aiApi, type ChatMessage } from '../../api/ai';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiChatWidget() {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là **DamDiep AI** 🩺 — trợ lý sức khỏe thông minh của bạn.\n\nBạn có thể hỏi tôi về:\n- 💊 Thuốc và cách dùng\n- 🥗 Chế độ ăn uống\n- 🏃 Lối sống lành mạnh\n- 📊 Chỉ số sức khỏe\n\nHãy đặt câu hỏi nào!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history from previous messages (exclude the welcome message)
      const history: ChatMessage[] = messages
        .filter(m => m.id !== 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await aiApi.chat(userMessage.content, history);

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.success && response.reply
          ? response.reply
          : response.error || 'Xin lỗi, tôi không thể trả lời lúc này.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (!isOpen) setHasUnread(true);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '❌ Không thể kết nối đến AI. Vui lòng thử lại sau.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const quickQuestions = [
    { icon: '💊', text: 'Huyết áp cao nên ăn gì?' },
    { icon: '🩸', text: 'Tiểu đường type 2 là gì?' },
    { icon: '❤️', text: 'Cách giảm cholesterol?' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[200] w-[60px] h-[60px] rounded-2xl text-white shadow-2xl flex items-center justify-center transition-all"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(239,68,68,0.4)'
            : '0 8px 32px rgba(59,130,246,0.4)'
        }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.92 }}
        title="DamDiep AI Assistant"
      >
        <motion.span
          className="material-symbols-outlined text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? 'close' : 'smart_toy'}
        </motion.span>
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-[2.5px] border-white flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[100px] right-6 z-[200] w-[400px] max-h-[600px] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)'
            }}
          >
            {/* Header */}
            <div className="relative px-6 py-5 shrink-0 overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 40%, #8b5cf6 70%, #a855f7 100%)'
              }} />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)'
              }} />
              
              <div className="relative flex items-center gap-3.5">
                <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    neurology
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[15px] text-white tracking-tight">DamDiep AI</h3>
                  <p className="text-[12px] text-white/70 flex items-center gap-1.5 font-medium mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Trợ lý sức khỏe thông minh
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                >
                  <span className="material-symbols-outlined text-white/90 text-[18px]">keyboard_arrow_down</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 min-h-[280px] max-h-[380px] ai-chat-scroll">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                    }}>
                      <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        neurology
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[82%]">
                    <div
                      className={`px-4 py-3 text-[13.5px] leading-[1.7] ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-2xl rounded-bl-md border border-slate-100 dark:border-slate-800'
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                    />
                    <span className={`text-[10px] text-slate-400 font-medium px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                  }}>
                    <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      neurology
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3.5 rounded-2xl rounded-bl-md flex items-center gap-2 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium ml-1">Đang suy nghĩ...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-5 pb-3 flex gap-2 flex-wrap">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q.text);
                      setTimeout(() => handleSend(), 50);
                    }}
                    className="text-[12px] px-3.5 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:shadow-md hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    <span>{q.icon}</span>
                    {q.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3.5 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 rounded-2xl px-4 py-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi về sức khỏe..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[14px] text-slate-700 dark:text-white outline-none placeholder-slate-400 py-2 disabled:opacity-50 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-xl text-white flex items-center justify-center transition-all disabled:opacity-30 shrink-0 hover:shadow-lg hover:shadow-blue-500/25 active:scale-90"
                  style={{
                    background: isLoading || !input.trim()
                      ? '#cbd5e1'
                      : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isLoading ? 'progress_activity' : 'arrow_upward'}
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center font-medium tracking-wide">
                🩺 AI chỉ tư vấn chung, không thay thế bác sĩ chuyên khoa
              </p>
            </div>

            <style>{`
              .ai-chat-scroll::-webkit-scrollbar { width: 4px; }
              .ai-chat-scroll::-webkit-scrollbar-track { background: transparent; }
              .ai-chat-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
              .ai-chat-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
