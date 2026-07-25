import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, HeartPulse, FileText, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_MESSAGE = {
  id: 1,
  type: 'bot',
  content: "Hello. I am the Jarurat AI Clinical Trial Matchmaker. To help you find the most suitable oncology trials, could you please tell me a bit about the patient's diagnosis or medical condition?",
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call the real Gemini API via our secure backend
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', content: "I'm sorry, I encountered an error connecting to the AI system. Please verify your connection." }]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-500 hover:text-brand-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="bg-brand-100 p-2 rounded-lg">
              <HeartPulse className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Jarurat AI Matchmaker</h1>
              <p className="text-xs text-green-600 font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
          <Info className="h-5 w-5" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Prominent Medical Disclaimer Banner */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-red-800">IMPORTANT MEDICAL DISCLAIMER</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>
                    This AI is a guide, not a doctor. <strong>Do not</strong> use this tool for medical diagnoses. 
                    Any clinical trial suggestions or guidance must be independently verified on official registries like 
                    <a href="https://ctri.nic.in" className="underline font-semibold ml-1">CTRI (ctri.nic.in)</a> or discussed directly with your oncologist before taking any action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[85%] sm:max-w-[75%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    msg.type === 'user' ? 'bg-gray-900 text-white' : 'bg-brand-600 text-white shadow-md'
                  }`}>
                    {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className={`p-4 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gray-900 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed text-[15px] whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Render Trial Cards if any */}
                    {msg.cards && (
                      <div className="flex flex-col gap-3 mt-2">
                        {msg.cards.map((card, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            key={idx} 
                            className="bg-white border border-brand-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">{card.title}</h4>
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                {card.eligibility}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-3">
                              <FileText className="h-4 w-4 mr-1.5" />
                              {card.location}
                            </div>
                            <button className="mt-4 w-full py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-semibold hover:bg-brand-100 transition-colors">
                              View Trial Details
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-end space-x-2">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the medical condition or ask a question..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-[15px]"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors flex items-center justify-center"
            >
              {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <p className="text-center text-xs text-red-600 font-medium mt-3">
            Warning: AI can hallucinate. Always verify clinical trials via official CTRI registry.
          </p>
        </div>
      </footer>
    </div>
  );
}
