import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export function AITutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Olá! Sou seu Tutor IA de Enfermagem. Como posso te ajudar com seus estudos hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<any>(null);

  const getAI = () => {
    if (aiRef.current) return aiRef.current;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY não configurada.");
      return null;
    }
    
    aiRef.current = new GoogleGenAI({ apiKey });
    return aiRef.current;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const ai = getAI();
    if (!ai) {
      setMessages(prev => [...prev, { role: 'ai', content: "O Tutor IA está temporariamente indisponível (Chave de API não configurada)." }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "Você é um Tutor IA especialista em Enfermagem para alunos de curso técnico. Suas respostas devem ser baseadas em manuais técnicos de enfermagem, protocolos do Ministério da Saúde e COFEN. Seja didático, profissional e incentive o estudo. Use terminologia técnica correta e explique-a quando necessário. Se a pergunta não for relacionada a enfermagem ou saúde, gentilmente redirecione o aluno para o foco dos estudos."
        }
      });

      const text = response.text || "Desculpe, não consegui gerar uma resposta.";

      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      console.error("Erro no Tutor IA:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Desculpe, tive um problema técnico. Pode repetir a pergunta?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-[#E31E24] text-white rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center gap-2 group"
      >
        <Bot className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">
          Tutor IA 24h
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-sm shadow-2xl z-50 flex flex-col border border-gray-200 transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="p-4 bg-[#E31E24] text-white flex justify-between items-center rounded-t-sm">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-bold text-sm">Tutor IA Enfermagem</span>
          <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1 rounded">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#E31E24] text-white' 
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-sm border border-gray-100 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#E31E24]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tire sua dúvida técnica..."
                className="flex-1 p-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#E31E24]"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-[#E31E24] text-white rounded-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Respostas baseadas em protocolos técnicos de enfermagem.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
