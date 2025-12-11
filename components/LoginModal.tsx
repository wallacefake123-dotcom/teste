import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Alert from './Alert';
import { User } from '../types';

interface LoginModalProps {
  onClose: () => void;
  initialView?: 'login' | 'signup';
  onLogin?: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, initialView = 'login', onLogin }) => {
  // Main View State: 'login', 'signup', or 'forgotPassword'
  const [view, setView] = useState<'login' | 'signup' | 'forgotPassword'>(initialView);
  
  // Signup Step State: 'selection' (Welcome/Choose Method) or 'form' (Enter Details)
  const [signupStep, setSignupStep] = useState<'selection' | 'form'>('selection');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  
  // Signup Checkboxes
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const isLogin = view === 'login';

  const handleSwitchView = (newView: 'login' | 'signup' | 'forgotPassword') => {
    setView(newView);
    setError(null);
    setFieldErrors({});
    setShowPassword(false); // Reset password visibility on view switch
    // Reset signup step when switching main views
    if (newView === 'signup') setSignupStep('selection');
  };

  const handleBack = () => {
    setError(null);
    setFieldErrors({});
    setShowPassword(false);
    if (view === 'signup' && signupStep === 'form') {
      setSignupStep('selection');
    } else if (view === 'forgotPassword') {
      setView('login');
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const newFieldErrors: Record<string, boolean> = {};
    let hasError = false;

    // Validation
    if (!email) {
      newFieldErrors.email = true;
      hasError = true;
    }
    
    // Only check password if not in forgot password flow
    if (view !== 'forgotPassword') {
      if (!password) {
        newFieldErrors.password = true;
        hasError = true;
      } else if (password.length < 6) {
        newFieldErrors.password = true;
        setError("A senha deve ter pelo menos 6 caracteres.");
        hasError = true;
      }
    }

    // Name validation for signup
    if (view === 'signup' && signupStep === 'form') {
      if (!firstName) {
        newFieldErrors.firstName = true;
        hasError = true;
      }
      if (!lastName) {
        newFieldErrors.lastName = true;
        hasError = true;
      }
    }

    setFieldErrors(newFieldErrors);

    if (hasError) {
      if (!error && (newFieldErrors.email || newFieldErrors.password || newFieldErrors.firstName || newFieldErrors.lastName)) {
         setError("Por favor, verifique os campos destacados.");
      }
      return;
    }

    // SIMULATE LOGIN for Wallace França
    // Regardless of what is typed (as long as it passes validation), log in as Wallace
    if (onLogin) {
      onLogin({
        id: 'u_wallace_123',
        name: 'Wallace França',
        email: 'wallace@hotmail.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=wallace',
        isHost: true
      });
    }
  };

  const getHeaderTitle = () => {
    if (view === 'forgotPassword') return 'Recuperar';
    if (view === 'login') return 'Bem-vindo';
    if (view === 'signup') return 'Criar conta';
    return 'Bem-vindo';
  };

  // Styles based on the uploaded image reference - Rounded-2xl inputs
  const getInputClass = (fieldName: string) => {
    return `w-full border rounded-2xl px-4 py-3 outline-none transition-all text-slate-900 font-medium placeholder-slate-400 bg-white/60
      ${fieldErrors[fieldName] 
        ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
        : 'border-white/60 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm'}`;
  };

  // Updated label class to match the uppercase gray style in reference
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 tracking-wide";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       {/* Backdrop */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.2 }}
         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
         onClick={onClose}
       />

       {/* Modal Content - Premium Silver Theme */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.9, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.9, y: 20 }}
         transition={{ 
            type: "spring", 
            stiffness: 350, 
            damping: 25,
            mass: 0.8 
         }}
         className="relative w-full max-w-md h-auto max-h-[95vh] bg-premium-silver rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden font-sans border border-white/50"
       >
          
          {/* Header Section */}
          <div className="pt-8 pb-8 px-6 shrink-0 relative">
             {/* Back/Close Button */}
             <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm absolute top-6 left-6 z-20"
             >
                <i className="fas fa-chevron-left text-xs"></i>
                <span>Voltar</span>
             </button>

             {/* Title Centered */}
             <div className="text-center mt-4 mb-2">
                {/* CHANGED: font-bold to font-medium */}
                <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight">
                   {getHeaderTitle()}
                </h1>
                {view === 'forgotPassword' && (
                  <p className="text-slate-500 text-sm mt-2">Recupere seu acesso</p>
                )}
             </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto custom-scrollbar">
             
             {/* Display Global Errors */}
             {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                   <Alert type="error" title="Atenção" onClose={() => setError(null)}>
                      {error}
                   </Alert>
                </motion.div>
             )}

             {/* --- VIEW: FORGOT PASSWORD --- */}
             {view === 'forgotPassword' && (
               <motion.form 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 flex-1 flex flex-col" 
                  onSubmit={handleSubmit}
               >
                  <div>
                     <label className={labelClass}>EMAIL</label>
                     <input 
                        type="email" 
                        placeholder="Digite seu email"
                        className={getInputClass('email')}
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) setFieldErrors({...fieldErrors, email: false});
                        }}
                     />
                     {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">Email é obrigatório</p>}
                  </div>
                  
                  <div className="mt-auto pt-4 space-y-3">
                    <button className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20">
                       Enviar código
                    </button>
                    <button 
                        type="button"
                        onClick={() => setView('login')}
                        className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                  </div>
               </motion.form>
             )}

             {/* --- VIEW: LOGIN --- */}
             {isLogin && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
               >
                 
                 {/* Social Buttons */}
                 <div className="flex justify-center gap-4 sm:gap-6 mb-6">
                    <button className="w-14 h-14 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex items-center justify-center hover:scale-105 transition-transform hover:shadow-glass backdrop-blur-sm">
                       <i className="fab fa-facebook-f text-[#1877F2] text-xl"></i>
                    </button>
                    <button className="w-14 h-14 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex items-center justify-center hover:scale-105 transition-transform hover:shadow-glass backdrop-blur-sm">
                       <i className="fab fa-apple text-slate-900 text-xl"></i>
                    </button>
                    <button className="w-14 h-14 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex items-center justify-center hover:scale-105 transition-transform hover:shadow-glass backdrop-blur-sm">
                       <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                       <div className="w-full border-t border-slate-300/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                       <span className="px-4 text-slate-400 font-bold text-xs uppercase bg-transparent">ou</span>
                    </div>
                 </div>

                 <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                       <label className={labelClass}>EMAIL</label>
                       <input 
                          type="email" 
                          placeholder="Digite seu email"
                          className={getInputClass('email')}
                          value={email}
                          onChange={e => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors({...fieldErrors, email: false});
                          }}
                       />
                       {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">Email é obrigatório</p>}
                    </div>
                    <div>
                       <label className={labelClass}>SENHA</label>
                       <div className="relative">
                         <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            className={getInputClass('password')}
                            value={password}
                            onChange={e => {
                              setPassword(e.target.value);
                              if (fieldErrors.password) setFieldErrors({...fieldErrors, password: false});
                            }}
                         />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                         >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                         </button>
                       </div>
                       {fieldErrors.password && <p className="text-xs text-red-500 mt-1 ml-1">Senha é obrigatória</p>}
                    </div>
                    
                    <div className="flex justify-end pt-1">
                       <button 
                          type="button"
                          onClick={() => setView('forgotPassword')}
                          className="text-primary text-xs font-bold hover:underline"
                       >
                          Esqueceu a senha?
                       </button>
                    </div>

                    <div className="pt-4">
                        <button className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20">
                           Entrar
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-sm text-slate-600 font-medium">
                                Não tem uma conta?{' '}
                                <button 
                                    type="button"
                                    onClick={() => handleSwitchView('signup')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Cadastre-se
                                </button>
                            </p>
                        </div>
                    </div>
                 </form>
               </motion.div>
             )}

             {/* --- VIEW: SIGNUP - STEP 1: SELECTION --- */}
             {view === 'signup' && signupStep === 'selection' && (
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full justify-between"
               >
                 <div className="text-center space-y-2 mb-6">
                    <p className="text-slate-600 font-medium">Escolha como deseja se cadastrar</p>
                 </div>

                 <div className="space-y-3">
                    <button className="w-full bg-[#1877F2] text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-3">
                       <i className="fab fa-facebook-f text-lg"></i>
                       <span>Continuar com Facebook</span>
                    </button>
                    <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-3">
                       <i className="fab fa-apple text-lg"></i>
                       <span>Continuar com Apple</span>
                    </button>
                    <button className="w-full bg-white border border-slate-200 text-slate-900 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3">
                       <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-5 h-5" />
                       <span>Continuar com Google</span>
                    </button>
                    
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-slate-300/50"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                           <span className="px-4 text-slate-400 font-bold text-xs uppercase bg-transparent">ou</span>
                        </div>
                     </div>

                    <button 
                      onClick={() => setSignupStep('form')}
                      className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20"
                    >
                       Cadastrar com email
                    </button>
                 </div>

                 <div className="mt-6 text-center">
                     <p className="text-sm text-slate-600 font-medium">
                         Já tem uma conta?{' '}
                         <button 
                            type="button"
                            onClick={() => handleSwitchView('login')}
                            className="text-primary font-bold hover:underline"
                         >
                            Entrar
                         </button>
                     </p>
                 </div>
               </motion.div>
             )}

             {/* --- VIEW: SIGNUP - STEP 2: FORM --- */}
             {view === 'signup' && signupStep === 'form' && (
                <motion.form 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3 flex-1 flex flex-col" 
                  onSubmit={handleSubmit}
                >
                    
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className={labelClass}>NOME</label>
                          <input 
                                type="text" 
                                className={getInputClass('firstName')}
                                value={firstName}
                                onChange={e => {
                                  setFirstName(e.target.value);
                                  if(fieldErrors.firstName) setFieldErrors({...fieldErrors, firstName: false});
                                }}
                          />
                      </div>
                      <div>
                          <label className={labelClass}>SOBRENOME</label>
                          <input 
                                type="text" 
                                className={getInputClass('lastName')}
                                value={lastName}
                                onChange={e => {
                                  setLastName(e.target.value);
                                  if(fieldErrors.lastName) setFieldErrors({...fieldErrors, lastName: false});
                                }}
                          />
                      </div>
                    </div>
                    {/* CNH Helper Text */}
                    <p className="text-slate-400 text-xs font-medium -mt-1 mb-1">
                      Digite seu nome como aparece na CNH.
                    </p>

                    <div>
                       <label className={labelClass}>EMAIL</label>
                       <input 
                          type="email" 
                          placeholder=""
                          className={getInputClass('email')}
                          value={email}
                          onChange={e => {
                            setEmail(e.target.value);
                            if(fieldErrors.email) setFieldErrors({...fieldErrors, email: false});
                          }}
                       />
                       {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">Email é obrigatório</p>}
                    </div>

                    <div>
                       <label className={labelClass}>SENHA</label>
                       <div className="relative">
                         <input 
                            type={showPassword ? "text" : "password"}
                            placeholder=""
                            className={getInputClass('password')}
                            value={password}
                            onChange={e => {
                              setPassword(e.target.value);
                              if(fieldErrors.password) setFieldErrors({...fieldErrors, password: false});
                            }}
                         />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                         >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                         </button>
                       </div>
                       {fieldErrors.password && <p className="text-xs text-red-500 mt-1 ml-1">Senha é obrigatória</p>}
                    </div>

                    <div className="pt-2">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox" 
                              className="peer sr-only"
                              checked={marketingOptIn}
                              onChange={(e) => setMarketingOptIn(e.target.checked)}
                            />
                            <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                            <i className="fas fa-check text-white text-xs absolute left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                          </div>
                          <span className="text-xs text-slate-600 font-medium">
                            Receber promoções por email.
                          </span>
                       </label>
                    </div>

                    <div className="pt-3 space-y-3 mt-auto">
                        <button className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20">
                           Confirmar cadastro
                        </button>
                        
                        <div className="text-center pt-1">
                            <p className="text-sm text-slate-600 font-medium">
                                Já tem uma conta?{' '}
                                <button 
                                    type="button"
                                    onClick={() => handleSwitchView('login')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Entrar
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.form>
             )}
             
             {/* Footer Legal Text (Always visible at bottom) */}
             <div className="text-center pt-6 pb-2">
                <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-medium">
                    Ao continuar, você concorda com os <a href="#" className="underline hover:text-slate-600">Termos de Serviço</a> e a <a href="#" className="underline hover:text-slate-600">Política de Privacidade</a> da Cube Car.
                </p>
             </div>
          </div>
       </motion.div>
    </div>
  )
}

export default LoginModal;