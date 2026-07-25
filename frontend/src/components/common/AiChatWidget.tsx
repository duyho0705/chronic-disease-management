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
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleAiChat', handleToggle);
    return () => window.removeEventListener('toggleAiChat', handleToggle);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      // Wait for animation to complete before focusing and scrolling
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 250);
    }
  }, [isOpen]);

  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

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
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[195] md:hidden"
        />
      )}

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[190] w-12 h-12 md:w-[60px] md:h-[60px] rounded-full text-white shadow-xl flex items-center justify-center transition-all bg-[#60c5fa] hover:bg-[#4ab0e4]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="DamDiep AI Assistant"
      >
        <motion.span
          className="material-symbols-outlined text-[24px] md:text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? 'close' : 'support_agent'}
        </motion.span>
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 bottom-3 md:bottom-[90px] md:right-6 md:left-auto z-[200] w-[calc(100%-24px)] md:w-[360px] h-[85vh] max-h-[580px] md:max-h-[600px] bg-[#f5f6f8] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-[#60c5fa] px-4 py-3 shrink-0 flex items-center justify-between rounded-t-xl">
              <div className="w-16"></div> {/* Spacer for centering */}
              <h3 className="font-bold text-[15px] text-white flex-1 text-center">
                Chat cùng DamDiep AI
              </h3>
              <div className="w-16 flex justify-end gap-1">
                <button className="text-white/90 hover:text-white hover:bg-white/20 p-1 rounded transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/90 hover:text-white hover:bg-white/20 p-1 rounded transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-h-[300px] max-h-[420px] ai-chat-scroll bg-[#f5f6f8]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.id === 0 ? (
                    // Special Welcome Card
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-[95%]">
                      <div className="bg-[#60c5fa] h-32 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                        <span className="material-symbols-outlined text-white text-[64px] z-10" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="flex items-center gap-1.5 mb-3 text-gray-800 font-bold text-[14px] justify-center">
                          <span className="material-symbols-outlined text-[18px] text-[#60c5fa]">auto_awesome</span>
                          Hỏi đáp cùng trợ lý AI
                        </div>
                        <div className="space-y-0">
                          {quickQuestions.map((q, idx) => (
                            <button 
                              key={idx}
                              onClick={() => {
                                setInput(q.text);
                                setTimeout(() => handleSend(), 50);
                              }}
                              className="w-full flex items-center justify-center gap-2 py-3 px-3 text-[13.5px] text-[#60c5fa] hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <span>{q.icon}</span> {q.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal Chat Bubbles
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-[1.6] ${
                      msg.role === 'user' 
                        ? 'bg-[#60c5fa] text-white rounded-br-sm shadow-sm' 
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                      <div className={`text-[10px] mt-1.5 opacity-70 ${msg.role === 'user' ? 'text-right text-white/80' : 'text-left text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white px-2 py-2.5 border-t border-gray-200 shrink-0">
              <div className="flex items-center gap-1">
                <button className="text-[#60c5fa] p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">menu</span>
                </button>
                <button className="text-[#60c5fa] p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">attach_file</span>
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn"
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-[14px] text-gray-800 outline-none placeholder-gray-400 py-1.5 min-w-0"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                    !input.trim() || isLoading ? 'text-gray-300' : 'text-[#60c5fa] hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: !input.trim() || isLoading ? "'FILL' 0" : "'FILL' 1" }}>send</span>
                </button>
              </div>
            </div>

            <style>{`
              .ai-chat-scroll::-webkit-scrollbar { width: 6px; }
              .ai-chat-scroll::-webkit-scrollbar-track { background: transparent; }
              .ai-chat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
              .ai-chat-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
