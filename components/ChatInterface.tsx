import React, { useState, useEffect, useRef } from 'react';
import { User, Conversation, Message } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  currentUser: User;
  onBack: () => void;
}

// Mock Data for Conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    otherUser: {
      id: 'user_1',
      name: 'Cláudia Dias',
      avatar: 'https://i.pravatar.cc/150?u=claudia',
      isOnline: true,
    },
    carRelated: {
      make: 'Tesla',
      model: 'Model 3',
      imageUrl: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=100&q=80'
    },
    lastMessage: 'Perfeito! Te encontro às 10h.',
    lastMessageTime: '10:41 am',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'u_wallace_123', text: 'Olá Cláudia, tudo bem? Tenho interesse no Tesla.', timestamp: '10:30 am', isRead: true },
      { id: 'm2', senderId: 'user_1', text: 'Olá Wallace! Tudo ótimo. O carro está disponível sim.', timestamp: '10:32 am', isRead: true },
      { id: 'm3', senderId: 'u_wallace_123', text: 'O carregamento está completo?', timestamp: '10:35 am', isRead: true },
      { id: 'm4', senderId: 'user_1', text: 'Sim, entrego com 100% de bateria.', timestamp: '10:37 am', isRead: true },
      { id: 'm5', senderId: 'user_1', text: 'Esta é uma foto do painel agora:', timestamp: '10:37 am', isRead: true, type: 'image', metadata: { src: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=600&q=80' } },
      { id: 'm6', senderId: 'u_wallace_123', text: 'Maravilha! Vou fechar a reserva.', timestamp: '10:40 am', isRead: true },
      { id: 'm7', senderId: 'user_1', text: 'Perfeito! Te encontro às 10h.', timestamp: '10:41 am', isRead: true },
    ]
  },
  {
    id: 'c2',
    otherUser: {
      id: 'user_2',
      name: 'Ricardo Silva',
      avatar: 'https://i.pravatar.cc/150?u=ricardo',
      isOnline: false,
      lastSeen: '5m atrás'
    },
    lastMessage: 'Está digitando...',
    lastMessageTime: 'Agora',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u_wallace_123', text: 'Oi Ricardo, o Bronco aguenta estrada de terra?', timestamp: 'Ontem', isRead: true },
    ]
  },
  {
    id: 'c3',
    otherUser: {
      id: 'user_3',
      name: 'Fernanda Costa',
      avatar: 'https://i.pravatar.cc/150?u=fernanda',
      isOnline: true,
    },
    lastMessage: 'Agradeço o contato.',
    lastMessageTime: 'Segunda',
    unreadCount: 0,
    messages: []
  }
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser, onBack }) => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  // Changed: Initialize as null to show empty state by default
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeChatId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage.text,
          lastMessageTime: newMessage.timestamp
        };
      }
      return conv;
    }));

    setInputText('');
  };

  return (
    // Changed container to w-full and removed max-w/padding to fill screen
    <div className="flex h-[calc(100vh-80px)] bg-white w-full">
      
      {/* Sidebar - Contacts List */}
      <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] flex-col bg-white border-r border-gray-100 overflow-hidden z-10`}>
        
        {/* Sidebar Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-display font-bold text-[#181824]">Mensagens</h2>
          </div>
          
          {/* Search */}
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full bg-gray-50 text-sm py-3 pl-10 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-[#3667AA]/20 transition-all text-[#181824]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">
          {conversations.length > 0 ? (
            conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveChatId(conv.id)}
              className={`p-3 rounded-2xl flex gap-3 cursor-pointer transition-all ${
                activeChatId === conv.id ? 'bg-[#3667AA]/5 border border-[#3667AA]/10' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
               <div className="relative shrink-0">
                 <img src={conv.otherUser.avatar} alt={conv.otherUser.name} className="w-12 h-12 rounded-full object-cover" />
                 {conv.otherUser.isOnline && (
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                 )}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                     <h3 className={`font-bold text-sm truncate ${activeChatId === conv.id ? 'text-[#3667AA]' : 'text-[#181824]'}`}>
                       {conv.otherUser.name}
                     </h3>
                     <span className="text-[10px] text-gray-400 shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-[#181824]' : 'text-gray-500'}`}>
                    {conv.carRelated && activeChatId !== conv.id && (
                       <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-[10px] mr-1 text-gray-600 font-medium">
                         {conv.carRelated.model}
                       </span>
                    )}
                    {conv.lastMessage}
                  </p>
               </div>
               {conv.unreadCount > 0 && (
                 <div className="shrink-0 flex flex-col items-end justify-center">
                    <div className="w-5 h-5 bg-[#3667AA] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow">
                      {conv.unreadCount}
                    </div>
                 </div>
               )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400 text-sm mt-10">
            Nenhuma conversa encontrada.
          </div>
        )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${!activeChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#F8F9FB] relative w-full`}>
        
        {activeConversation ? (
          <div className="flex-1 flex flex-col h-full">
             {/* Chat Header */}
             <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm border-b border-gray-100 shrink-0 z-20">
                <div className="flex items-center gap-3">
                   <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 -ml-2 text-gray-500">
                      <i className="fas fa-arrow-left"></i>
                   </button>
                   <div className="relative">
                      <img src={activeConversation.otherUser.avatar} alt={activeConversation.otherUser.name} className="w-10 h-10 rounded-full object-cover" />
                      {activeConversation.otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                   </div>
                   <div>
                      <h3 className="font-bold text-[#181824] text-sm">{activeConversation.otherUser.name}</h3>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        {activeConversation.otherUser.isOnline ? (
                          <>
                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Online
                          </>
                        ) : activeConversation.otherUser.lastSeen}
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-4">
                   {/* Car Context Widget */}
                   {activeConversation.carRelated && (
                     <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                        <img src={activeConversation.carRelated.imageUrl} className="w-8 h-8 rounded-lg object-cover" alt="Car" />
                        <div className="text-xs">
                           <p className="font-bold text-[#181824]">{activeConversation.carRelated.make}</p>
                           <p className="text-gray-500">{activeConversation.carRelated.model}</p>
                        </div>
                     </div>
                   )}
                   <button className="p-2 text-gray-400 hover:text-[#3667AA] transition-colors"><i className="fas fa-ellipsis-v"></i></button>
                </div>
             </div>

             {/* Messages Area - Full width/height */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative">
                
                {/* Date Separator Example */}
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-200/50 px-3 py-1 rounded-full">Hoje</span>
                </div>

                {activeConversation.messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser.id;
                  const isLast = idx === activeConversation.messages.length - 1;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                         
                         {msg.type === 'image' ? (
                           <div className="mb-1 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                              <img src={msg.metadata.src} alt="Attachment" className="w-64 h-auto object-cover" />
                           </div>
                         ) : (
                           <div 
                            className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group
                              ${isMe 
                                ? 'bg-[#3667AA] text-white rounded-br-none' 
                                : 'bg-white border border-gray-100 text-[#181824] rounded-bl-none'
                              }`}
                           >
                              {msg.text}
                           </div>
                         )}
                         
                         <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                            {isMe && (
                              <i className={`fas fa-check-double text-[10px] ${msg.isRead ? 'text-green-500' : 'text-gray-300'}`}></i>
                            )}
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-5xl mx-auto w-full">
                   
                   <div className="flex-1 bg-gray-50 rounded-[1.5rem] px-5 py-3 border border-transparent focus-within:border-[#3667AA]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#3667AA]/5 transition-all flex items-center gap-2">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Escreva uma mensagem..." 
                        className="flex-1 bg-transparent outline-none text-sm text-[#181824] placeholder-gray-400"
                      />
                   </div>

                   <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-12 h-12 bg-[#3667AA] text-white rounded-full flex items-center justify-center hover:opacity-90 disabled:bg-gray-300 disabled:opacity-100 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                   >
                     <i className="fas fa-paper-plane text-sm translate-x-[-1px] translate-y-[1px]"></i>
                   </button>
                </form>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 h-full">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#3667AA] mb-6 shadow-sm animate-bounce-slow">
                <i className="fas fa-comments text-4xl"></i>
             </div>
             {conversations.length > 0 ? (
               <>
                 <h2 className="text-2xl font-bold text-[#181824] mb-2">Nenhuma conversa selecionada</h2>
                 <p className="text-gray-500 max-w-sm">Envie mensagens e tire dúvidas antes de compartilhar um carro.</p>
               </>
             ) : (
               <>
                 <h2 className="text-2xl font-bold text-[#181824] mb-2">Ainda não há conversas aqui.</h2>
                 <p className="text-gray-500 max-w-sm">Comece uma reserva para conversar com o proprietário ou motorista.</p>
               </>
             )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatInterface;