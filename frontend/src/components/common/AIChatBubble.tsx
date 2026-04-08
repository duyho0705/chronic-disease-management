import { useState, useRef, useEffect } from 'react';
import { aiService } from '../../api/ai';
import { MessageSquare, Send, X, Bot } from 'lucide-react';

const AIChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await aiService.chat({ message: input });
            setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
        } catch (error) {
            console.error('Chat AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Có lỗi xảy ra, vui lòng thử lại sau.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white shadow-2xl rounded-2xl border border-emerald-100 overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
                    {/* Header */}
                    <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold text-sm">Trợ lý Sức khỏe AI</h3>
                                <p className="text-xs text-emerald-100 italic">Luôn hỗ trợ bạn</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 text-sm mt-10">
                                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20 text-emerald-600" />
                                <p>Hỏi tôi về lịch hẹn hoặc đơn thuốc của bạn!</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`p-2 rounded-lg ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-800'}`}>
                                        <p className="text-sm whitespace-pre-line">{m.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border p-2 rounded-lg animate-pulse text-xs text-gray-400">
                                    AI đang trả lời...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white flex gap-2">
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi tại đây..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-all"
            >
                {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
            </button>
        </div>
    );
};

export default AIChatBubble;
