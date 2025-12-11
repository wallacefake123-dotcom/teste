import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { User } from '../types';

interface HeaderProps {
  user?: User | null;
  onBecomeHostClick: () => void;
  onLogoClick: () => void;
  onHowItWorksClick?: () => void;
  onHelpCenterClick?: () => void; // New Prop
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogout?: () => void;
  onChatClick?: () => void;
  onDashboardClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user,
  onBecomeHostClick, 
  onLogoClick, 
  onHowItWorksClick, 
  onHelpCenterClick, // Destructure
  onLoginClick,
  onSignupClick,
  onLogout,
  onChatClick,
  onDashboardClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu on resize to prevent awkward states if switching to desktop
  useEffect(() => {
    const handleResize = () => setIsOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-white/30 backdrop-blur-[50px] border-b border-white/20 shadow-sm h-20 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo - Left Side */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none shrink-0" 
              onClick={() => {
                onLogoClick();
                setIsOpen(false);
              }}
            >
              <Logo className="h-8 w-auto sm:h-9 text-primary" />
              <span className="font-display font-medium text-lg sm:text-xl text-slate-900 tracking-tight">Cube Car</span>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-2 relative">
                {/* Desktop: List Your Car Button (Visible Shortcut) */}
                {!user && (
                    <button 
                        onClick={onBecomeHostClick}
                        className="hidden md:flex !text-[#3667AA] font-semibold hover:bg-white/50 px-5 py-2.5 rounded-full transition-colors text-base items-center gap-2 mr-2 border border-transparent hover:border-white/20"
                    >
                        <i className="fas fa-key !text-[#3667AA]"></i>
                        Liste seu carro
                    </button>
                )}

                {/* Hamburger Menu Toggle - Pill Shape */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-3 p-2 pl-5 pr-2 rounded-full border transition-all duration-200 hover:shadow-md border-gray-200 bg-white hover:border-gray-300 ${isOpen ? 'ring-2 ring-gray-100' : ''}`}
                >
                    <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-base text-slate-600 w-4`}></i>
                    <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center overflow-hidden relative">
                         {user ? (
                           user.avatarUrl ? (
                             <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                           ) : (
                             <span className="font-medium text-xs">{user.name.charAt(0)}</span>
                           )
                         ) : (
                           <i className="fas fa-user text-xs text-white"></i>
                         )}
                    </div>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* NAVIGATION DROPDOWN (DROP) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Transparent Overlay to close on click outside */}
            <div 
              className="fixed inset-0 z-[65]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu - Floating Card */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-24 right-4 sm:right-6 md:right-8 w-[calc(100%-2rem)] max-w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[70] overflow-hidden origin-top-right"
            >
              <div className="flex flex-col py-2">
                 {/* User Info Header in Dropdown if logged in */}
                 {user && (
                   <div className="px-5 py-4 border-b border-gray-100 mb-2">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden border border-white shadow-sm">
                            {user.avatarUrl ? (
                                 <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                               ) : (
                                 <span className="font-medium text-base flex items-center justify-center h-full text-gray-500">{user.name.charAt(0)}</span>
                               )}
                          </div>
                          <div className="flex flex-col min-w-0">
                             <h3 className="font-bold text-[#181824] truncate text-sm">{user.name}</h3>
                             <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                          </div>
                       </div>
                   </div>
                 )}

                 <div className="flex flex-col gap-1 px-2">
                     {!user ? (
                        // GUEST MENU LINKS (Order: Help -> List Car -> Signup -> Login)
                        <>
                            {/* 1. Central de Ajuda */}
                            <button 
                                onClick={() => { setIsOpen(false); if(onHelpCenterClick) onHelpCenterClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="far fa-circle-question text-gray-400 w-5"></i>
                                Central de Ajuda
                            </button>

                            <div className="h-px bg-gray-100 mx-3 my-1"></div>

                            {/* 2. Liste seu carro (Detailed with Text) */}
                            <div 
                                onClick={() => { setIsOpen(false); onBecomeHostClick(); }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-xl group"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <i className="fas fa-key text-[#3667AA] w-5 group-hover:scale-110 transition-transform"></i>
                                    <span className="text-sm font-semibold text-[#3667AA]">Liste seu carro</span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-snug pl-8 font-normal opacity-80">
                                    É rápido listar seu carro, compartilhar seu veículo e ganhar uma renda extra.
                                </p>
                            </div>
                            
                            <div className="h-px bg-gray-100 mx-3 my-1"></div>

                            {/* 3. Cadastre-se */}
                            <button 
                                onClick={() => { setIsOpen(false); if(onSignupClick) onSignupClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="fas fa-user-plus text-gray-400 w-5"></i>
                                Cadastre-se
                            </button>

                            {/* 4. Entrar */}
                            <button 
                                onClick={() => { setIsOpen(false); if(onLoginClick) onLoginClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="fas fa-sign-in-alt text-gray-400 w-5"></i>
                                Entrar
                            </button>
                        </>
                     ) : (
                        // LOGGED IN USER LINKS
                        <>
                            <button 
                                onClick={() => { setIsOpen(false); if(onDashboardClick) onDashboardClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="fas fa-route text-gray-400 w-5"></i>
                                Viagens
                            </button>
                            <button 
                                onClick={() => { setIsOpen(false); if(onChatClick) onChatClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 justify-between rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                  <i className="far fa-comment-alt text-gray-400 w-5"></i>
                                  Mensagens
                                </div>
                                {/* Unread Indicator Mock */}
                                <span className="w-2 h-2 bg-[#3667AA] rounded-full"></span>
                            </button>
                            <button 
                                onClick={() => { setIsOpen(false); if(onDashboardClick) onDashboardClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="far fa-heart text-gray-400 w-5"></i>
                                Favoritos
                            </button>

                            <button 
                                onClick={() => { setIsOpen(false); if(onDashboardClick) onDashboardClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="far fa-user text-gray-400 w-5"></i>
                                Conta
                            </button>

                            <div className="h-px bg-gray-100 mx-3 my-1"></div>

                            <button 
                                onClick={() => { setIsOpen(false); onBecomeHostClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="fas fa-key text-[#3667AA] w-5"></i>
                                Gerenciar anúncios
                            </button>

                            <div className="h-px bg-gray-100 mx-3 my-1"></div>

                            <button 
                                onClick={() => { setIsOpen(false); if(onHelpCenterClick) onHelpCenterClick(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="far fa-circle-question text-gray-400 w-5"></i>
                                Central de Ajuda
                            </button>

                            <button 
                                onClick={() => { setIsOpen(false); if(onLogout) onLogout(); }}
                                className="text-left px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-xl"
                            >
                                <i className="fas fa-sign-out-alt text-gray-400 w-5"></i>
                                Sair
                            </button>
                        </>
                     )}
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;