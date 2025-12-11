import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User } from '../types';
import { processPayment } from '../services/paymentService';
import Alert from './Alert';

interface CheckoutProps {
  user: User | null;
  car: Car;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  onBack: () => void;
  onSuccess: () => void;
  onLoginClick: () => void;
  onLogin?: (user: User) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const totalMinutes = i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

const Checkout: React.FC<CheckoutProps> = ({ user, car, startDate, endDate, startTime, endTime, onBack, onSuccess, onLoginClick }) => {
  // Step 1 = Login/Auth, Step 2 = Payment, Step 3 = Review
  const [currentStep, setCurrentStep] = useState(user ? 2 : 1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  
  // Local Booking State for Editing
  const [booking, setBooking] = useState({
    startDate,
    endDate,
    startTime,
    endTime
  });
  const [isEditDateModalOpen, setIsEditDateModalOpen] = useState(false);
  // Temp state for modal inputs
  const [tempBooking, setTempBooking] = useState(booking);
  
  // Calendar State for Edit Modal
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  
  const [cardData, setCardData] = useState({
    name: '',
    surname: '',
    cpf: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Watch for user login changes to advance steps
  useEffect(() => {
    if (user && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [user, currentStep]);

  // Global Click Listener to Close Dropdowns (UX Improvement)
  useEffect(() => {
    // This function closes the dropdown if a click happens anywhere in the document
    // We prevent this from firing when clicking the trigger buttons using e.stopPropagation()
    const handleGlobalClick = () => {
      setActiveDropdown(null);
    };

    if (isEditDateModalOpen) {
      // Use 'click' instead of 'mousedown' to align with React's synthetic event system
      document.addEventListener("click", handleGlobalClick);
    }
    
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [isEditDateModalOpen]);

  // Calculate Costs based on dates (using local state)
  const start = new Date(`${booking.startDate}T${booking.startTime}`);
  const end = new Date(`${booking.endDate}T${booking.endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const daysDiff = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  
  const rentalCost = car.pricePerDay * daysDiff;
  const serviceFee = rentalCost * 0.10; // 10% service fee
  const insurance = 0; // Removed insurance cost
  const total = rentalCost + serviceFee + insurance;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }); 
  };
  
  const formatDateFull = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }); 
  };

  const handlePayment = async () => {
    setError(null);
    if (!paymentMethod) {
      setError("Por favor, selecione uma forma de pagamento para continuar.");
      return;
    }

    if (paymentMethod === 'credit_card' && (!cardData.cardNumber || !cardData.cvc || !cardData.expiry)) {
        setError("Preencha todos os dados do cartão de crédito.");
        return;
    }

    setIsProcessing(true);
    const result = await processPayment({
      cardNumber: paymentMethod === 'credit_card' ? (cardData.cardNumber || '0000') : 'PIX',
      cardName: cardData.name, 
      expiry: cardData.expiry,
      cvc: cardData.cvc,
      amount: total
    });

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || "Ocorreu um erro ao processar o pagamento. Verifique seus dados e tente novamente.");
      setIsProcessing(false);
    }
  };

  const handleMobileAction = () => {
    if (currentStep === 1) {
      if (user) {
        setCurrentStep(2);
      } else {
        onLoginClick();
      }
    } else if (currentStep === 2) {
      if (paymentMethod) {
        setCurrentStep(3);
      } else {
        setError("Selecione um método de pagamento.");
      }
    } else if (currentStep === 3) {
      handlePayment();
    }
  };

  const getMobileButtonText = () => {
    if (currentStep === 3) return isProcessing ? "Processando..." : "Confirmar e pagar";
    return "Próximo";
  };

  const handleSaveDates = () => {
    if (!tempBooking.startDate || !tempBooking.endDate) return;
    if (new Date(tempBooking.startDate) > new Date(tempBooking.endDate)) {
        alert("A data de início não pode ser depois da data de fim.");
        return;
    }
    setBooking(tempBooking);
    setIsEditDateModalOpen(false);
  };

  const handleClearDates = () => {
    setTempBooking({
        startDate: '',
        endDate: '',
        startTime: '10:00',
        endTime: '10:00'
    });
    setActiveDropdown(null);
  };

  const openEditModal = () => {
      setTempBooking(booking);
      // Initialize viewDate based on current start date
      if (booking.startDate) {
          const [y, m, d] = booking.startDate.split('-').map(Number);
          setViewDate(new Date(y, m - 1, d));
      }
      setIsEditDateModalOpen(true);
  };

  // --- CALENDAR HELPERS FOR MODAL ---
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const handleDateClick = (e: React.MouseEvent, type: 'start' | 'end') => {
    e.stopPropagation(); // Prevent global click listener from firing
    const key = type === 'start' ? 'start-date' : 'end-date';
    if (activeDropdown !== key) {
        // Set view date to currently selected date if exists
        const currentVal = type === 'start' ? tempBooking.startDate : tempBooking.endDate;
        if (currentVal) {
            const [y, m, d] = currentVal.split('-').map(Number);
            setViewDate(new Date(y, m - 1, d));
        }
        setActiveDropdown(key);
    } else {
        setActiveDropdown(null);
    }
  };

  const handleTimeClick = (e: React.MouseEvent, type: 'start' | 'end') => {
    e.stopPropagation(); // Prevent global click listener from firing
    const key = type === 'start' ? 'start-time' : 'end-time';
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const selectDate = (date: Date) => {
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (activeDropdown === 'start-date') {
        setTempBooking(prev => ({ ...prev, startDate: formatted }));
        setActiveDropdown('start-time');
      } else {
        if (tempBooking.startDate && formatted < tempBooking.startDate) {
            alert("A data de devolução não pode ser anterior à data de retirada.");
            return;
        }
        setTempBooking(prev => ({ ...prev, endDate: formatted }));
        setActiveDropdown('end-time');
      }
  };

  const selectTime = (time: string) => {
      if (activeDropdown === 'start-time') {
          setTempBooking(prev => ({ ...prev, startTime: time }));
      } else {
          setTempBooking(prev => ({ ...prev, endTime: time }));
      }
      setActiveDropdown(null);
  };

  const renderCalendar = (type: 'start' | 'end') => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const currentStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      const isSelected = type === 'start' 
        ? tempBooking.startDate === currentStr
        : tempBooking.endDate === currentStr;
      
      const isPast = currentDate < today;
      const isToday = new Date().toDateString() === currentDate.toDateString();

      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={(e) => {
            e.stopPropagation();
            selectDate(currentDate);
          }}
          className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 text-[#484848]'}
            ${isSelected ? 'bg-[#3667AA] text-white shadow-md hover:bg-[#3667AA]' : ''}
            ${isToday && !isSelected && !isPast ? 'border border-[#3667AA] text-[#3667AA]' : ''}
          `}
        >
          {d}
        </button>
      );
    }

    return (
      <div 
        className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[80] w-[300px] left-0`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="font-medium text-slate-900 text-sm">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 justify-items-center">
          {days}
        </div>
      </div>
    );
  };

  const renderTimeDropdown = () => {
    return (
      <div 
        className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-56 overflow-y-auto w-32 z-[90] right-0 custom-scrollbar`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => selectTime(time)}
              className={`w-full text-center py-2 text-sm font-medium hover:bg-blue-50 transition-colors text-[#484848]`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Reusable Form Content
  const renderPaymentForm = () => (
    <div className="space-y-4 mt-2">
      {/* Toggle Buttons inside Payment Accordion */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          onClick={() => setPaymentMethod('credit_card')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
            paymentMethod === 'credit_card' 
              ? 'border-[#3667AA] bg-blue-50/50 ring-1 ring-[#3667AA]' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ 
            color: paymentMethod === 'credit_card' ? '#3667AA' : '#3A4150',
            borderColor: paymentMethod === 'credit_card' ? '#3667AA' : '#D1D5DB'
          }}
        >
          <i className="far fa-credit-card"></i>
          <span className="font-medium text-sm">Cartão de Crédito</span>
        </button>
        <button 
          onClick={() => setPaymentMethod('pix')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
            paymentMethod === 'pix' 
              ? 'border-[#3667AA] bg-blue-50/50 ring-1 ring-[#3667AA]' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ 
            color: paymentMethod === 'pix' ? '#3667AA' : '#3A4150',
            borderColor: paymentMethod === 'pix' ? '#3667AA' : '#D1D5DB'
          }}
        >
          <i className="fas fa-qrcode"></i>
          <span className="font-medium text-sm">Pix</span>
        </button>
      </div>

      {paymentMethod === 'credit_card' && (
        <div className="animate-fade-in space-y-4">
          <div className="border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#3667AA] focus-within:border-[#3667AA] transition-all bg-white relative">
            <label className="text-xs font-bold uppercase block mb-1 tracking-wide" style={{ color: '#6F7684' }}>Número do cartão</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                className="w-full outline-none font-medium bg-transparent text-base"
                style={{ color: '#1C2230' }}
                value={cardData.cardNumber}
                onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
              />
              <i className="fas fa-lock absolute right-0 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9BA1AE' }}></i>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#3667AA] focus-within:border-[#3667AA] transition-all bg-white">
              <label className="text-xs font-bold uppercase block mb-1 tracking-wide" style={{ color: '#6F7684' }}>Validade</label>
              <input 
                  type="text" 
                  placeholder="MM/AA"
                  className="w-full outline-none font-medium bg-transparent text-base"
                  style={{ color: '#1C2230' }}
                  value={cardData.expiry}
                  onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                />
            </div>
            <div className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#3667AA] focus-within:border-[#3667AA] transition-all bg-white">
              <label className="text-xs font-bold uppercase block mb-1 tracking-wide" style={{ color: '#6F7684' }}>CVV</label>
              <input 
                type="text" 
                placeholder="123"
                className="w-full outline-none font-medium bg-transparent text-base"
                style={{ color: '#1C2230' }}
                value={cardData.cvc}
                onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'pix' && (
        <div className="animate-fade-in bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
           <p className="text-base" style={{ color: '#3A4150' }}>O código QR Code para pagamento será gerado na próxima tela após a confirmação.</p>
        </div>
      )}

      <button 
        onClick={() => {
            if (paymentMethod) setCurrentStep(3);
            else setError("Selecione um método de pagamento.");
        }}
        disabled={!paymentMethod}
        className="w-full bg-[#3667AA] text-white font-bold py-4 rounded-xl hover:opacity-95 transition-all mt-6 disabled:bg-gray-300 text-lg hidden lg:block"
      >
        Continuar para revisão
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans animate-fade-in flex flex-col relative selection:bg-blue-100 selection:text-blue-900 pb-24 lg:pb-0">
      
      {/* Ambient Background (Same as CarDetails) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER DESKTOP */}
      <header className="hidden lg:block sticky top-0 z-40 shrink-0 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-4"
          >
            <i className="fas fa-chevron-left text-lg" style={{ color: '#1C2230' }}></i>
          </button>
          {/* UPDATED: Decreased Desktop Title size to 3xl (approx 30px) */}
          <h1 className="text-3xl font-display font-bold" style={{ color: '#1C2230' }}>Confirmar e pagar</h1>
        </div>
      </header>

      {/* HEADER MOBILE */}
      <header className="lg:hidden sticky top-0 z-40 shrink-0 border-b border-gray-100 p-4 flex items-center justify-between bg-white/80 backdrop-blur-md">
         <h1 className="text-xl font-display font-bold text-[#1C2230]">Confirmar e pagar</h1>
         <button onClick={onBack} className="text-[#1C2230] p-2">
           <i className="fas fa-times text-lg"></i>
         </button>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full relative z-10">
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: STEPS (VISIBLE ON MOBILE NOW) */}
          <div className="flex-1 space-y-8">

            {/* ERROR DISPLAY */}
            {error && (
               <div className="mb-6">
                  <Alert type="error" title="Atenção" onClose={() => setError(null)}>
                     {error}
                  </Alert>
               </div>
            )}
            
            {/* STEP 1: LOGIN/REGISTER - STANDARDIZED CARD DESIGN */}
            <div 
                className={`bg-white transition-all duration-300 ${currentStep === 1 ? 'rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.1)]' : 'border border-gray-200 rounded-2xl'} ${currentStep !== 1 ? 'hidden lg:block' : ''}`}
            >
               <div className={`${currentStep === 1 ? 'p-8' : 'p-5'} hidden lg:flex justify-between items-center`}>
                  <div className="flex-1">
                     {/* UPDATED: Decreased H2 to 24px (text-2xl) */}
                     <h2 className="text-2xl font-display font-medium" style={{ color: currentStep === 1 ? '#1C2230' : '#9BA1AE' }}>
                        1. Entrar ou cadastrar-se
                     </h2>
                     {currentStep === 1 && !user && (
                        <p className="text-base sm:text-lg mt-3 max-w-md hidden sm:block font-normal leading-relaxed" style={{ color: '#3A4150' }}>
                           Entre ou cadastre-se para continuar sua reserva. É rápido e seus dados estarão seguros.
                        </p>
                     )}
                  </div>
                  
                  {!user && (
                      <button 
                         onClick={onLoginClick}
                         className="bg-[#3667AA] text-white px-12 py-4 rounded-xl font-bold hover:opacity-95 transition-all text-lg shrink-0 ml-6 shadow-lg shadow-blue-200 hidden lg:block"
                      >
                         Continuar
                      </button>
                  )}
                  {user && currentStep > 1 && (
                     <button onClick={() => setCurrentStep(1)} className="text-base font-medium underline ml-4" style={{ color: '#1C2230' }}>Editar</button>
                  )}
               </div>
               
               <AnimatePresence>
                 {currentStep === 1 && user && (
                    <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden px-8 pb-8 pt-8 lg:pt-0"
                    >
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-[#3667AA] text-white flex items-center justify-center font-bold text-lg">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-lg font-bold" style={{ color: '#1C2230' }}>Conectado como {user.name}</p>
                                <p className="text-sm" style={{ color: '#6F7684' }}>{user.email}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => setCurrentStep(2)}
                                className="bg-[#3667AA] text-white px-12 py-4 rounded-xl font-bold hover:opacity-95 transition-all text-lg shadow-lg shadow-blue-200 hidden lg:block"
                            >
                                Continuar
                            </button>
                        </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* STEP 2: PAYMENT METHOD */}
            <div 
                className={`bg-white border rounded-2xl transition-all duration-300 ${currentStep === 2 ? 'border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)]' : 'border-gray-200'} ${currentStep !== 2 ? 'hidden lg:block' : ''}`}
                style={{ 
                    boxShadow: currentStep === 2 ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none'
                }}
            >
               <div className="p-5 hidden lg:flex justify-between items-start">
                  {/* UPDATED: Decreased H2 to 24px (text-2xl) */}
                  <h2 className="text-2xl font-display font-medium" style={{ color: currentStep === 2 ? '#1C2230' : '#9BA1AE' }}>
                     2. Adicione uma forma de pagamento
                  </h2>
                  {currentStep > 2 && (
                     <button onClick={() => setCurrentStep(2)} className="text-base font-medium underline ml-4" style={{ color: '#1C2230' }}>Editar</button>
                  )}
               </div>

               <AnimatePresence>
                 {currentStep === 2 && (
                    <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden px-5 pb-5 pt-5 lg:pt-0"
                    >
                       {renderPaymentForm()}
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* STEP 3: REVIEW & CONFIRM */}
            <div 
                className={`bg-white border rounded-2xl transition-all duration-300 ${currentStep === 3 ? 'border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)]' : 'border-gray-200'} ${currentStep !== 3 ? 'hidden lg:block' : ''}`}
                style={{ 
                    boxShadow: currentStep === 3 ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' : 'none'
                }}
            >
               <div className="p-5 hidden lg:flex justify-between items-start">
                  {/* UPDATED: Decreased H2 to 24px (text-2xl) */}
                  <h2 className="text-2xl font-display font-medium" style={{ color: currentStep === 3 ? '#1C2230' : '#9BA1AE' }}>
                     3. Revise sua reserva
                  </h2>
               </div>

               <AnimatePresence>
                 {currentStep === 3 && (
                    <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden px-5 pb-5 pt-5 lg:pt-0"
                    >
                       <p className="text-lg leading-relaxed mb-8 font-normal" style={{ color: '#3A4150' }}>
                          Ao clicar no botão abaixo, concordo com as <span className="underline cursor-pointer" style={{ color: '#1C2230' }}>Regras da Locadora</span>, <span className="underline cursor-pointer" style={{ color: '#1C2230' }}>Regras básicas para os clientes</span> e a <span className="underline cursor-pointer" style={{ color: '#1C2230' }}>Política de Reembolso</span>.
                       </p>

                       <button 
                         onClick={handlePayment}
                         disabled={isProcessing}
                         // UPDATED: Font style decreased to text-xl (20px)
                         className="w-full bg-[#3667AA] text-white font-display font-bold text-xl px-8 py-4 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-blue-100 disabled:bg-gray-300 justify-center items-center gap-3 hidden lg:flex"
                       >
                          {isProcessing ? (
                            <>
                              <svg className="loader-container h-6 w-6" viewBox="25 25 50 50" style={{ width: '1.5em', height: '1.5em' }}>
                                 <circle className="loader-svg loader-white" cx="50" cy="50" r="20"></circle>
                              </svg>
                              <span>Processando...</span>
                            </>
                          ) : 'Confirmar e pagar'}
                       </button>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

          </div>

          {/* RIGHT COLUMN: CAR SUMMARY CARD (Sticky on Desktop, Full Width on Mobile) */}
          <div className="w-full lg:w-[400px]">
            <div 
                className="lg:sticky lg:top-32 bg-white border border-gray-200 rounded-2xl p-4 lg:p-6"
                style={{ 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' // 3D effect shadow
                }}
            >
               
               {/* Car Header */}
               <div className="flex gap-4 lg:gap-5 pb-4 lg:pb-6 border-b border-gray-100">
                  <img src={car.imageUrl} alt={car.model} className="w-20 h-20 lg:w-28 lg:h-24 object-cover rounded-xl bg-gray-100 shrink-0" />
                  <div className="flex flex-col justify-center lg:justify-start">
                     <p className="hidden lg:block text-xs font-bold uppercase tracking-wide text-[#6F7684] mb-2">Espaçoso e pronto para aventura</p>

                     {/* UPDATED: Decreased size to text-xl (20px) consistent with H3 guideline */}
                     <h3 className="font-display font-bold text-xl leading-tight text-slate-600">{car.make} {car.model} {car.year}</h3>
                     <div className="flex items-center gap-1.5 text-base lg:text-lg mt-1">
                        <i className="fas fa-star text-xs" style={{ color: '#1C2230' }}></i>
                        <span className="font-bold" style={{ color: '#1C2230' }}>{car.rating}</span>
                        <span style={{ color: '#6F7684' }} className="text-sm">({car.trips} avaliações)</span>
                     </div>
                     
                     {car.ownerDetails?.isSuperhost && (
                        <div className="hidden lg:flex items-center gap-1 text-sm text-[#6F7684] mt-1">
                            <i className="fas fa-medal text-[#E11D48]"></i>
                            <span>Superhost</span>
                        </div>
                     )}
                  </div>
               </div>

               {/* RESTORED DESKTOP Cancelamento Section (Hidden on Mobile) */}
               <div className="hidden lg:block py-6 border-b border-gray-100">
                   <div className="mb-5">
                       {/* UPDATED: Darker Gray (slate-600) */}
                       <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wide mb-2">Política de cancelamento</h4>
                       {/* INLINE STYLE FIX */}
                       <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-700" style={{ color: '#3A4150' }}>
                           Cancelamento gratuito até 48h antes da retirada. <span className="underline font-bold cursor-pointer" style={{ color: '#1C2230' }}>Política completa</span>
                       </p>
                   </div>
               </div>

               {/* NEW: Mobile Cancellation Section (Moved Above Dates) */}
               <div className="py-4 lg:hidden border-b border-gray-100">
                   {/* UPDATED: Darker Gray (slate-600) */}
                   <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wide mb-2">Política de cancelamento</h4>
                   {/* INLINE STYLE FIX */}
                   <p className="text-sm text-slate-700 leading-relaxed font-medium" style={{ color: '#3A4150' }}>
                       Cancelamento gratuito até 48h antes. <span className="underline font-bold cursor-pointer" style={{ color: '#1C2230' }}>Política completa</span>
                   </p>
               </div>

               {/* Dates Section: Responsive Padding - UNIFIED MOBILE/DESKTOP CONTENT */}
               <div className="py-4 lg:py-6 border-b border-gray-100 flex justify-between items-start lg:items-center">
                   <div className="flex-1">
                       {/* UPDATED: Darker Gray (slate-600) */}
                       <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wide mb-2">Datas</h4>
                       <div className="flex flex-col gap-1 text-base font-medium text-slate-700">
                           <p><span className="text-gray-400 font-normal">Retirada:</span> {formatDate(booking.startDate)}, {booking.startTime}</p>
                           <p><span className="text-gray-400 font-normal">Devolução:</span> {formatDate(booking.endDate)}, {booking.endTime}</p>
                       </div>
                   </div>
                   <button 
                     onClick={openEditModal} 
                     className="bg-gray-100 hover:bg-gray-200 text-[#1C2230] text-xs font-bold px-4 py-2 rounded-lg transition-colors shrink-0 ml-4"
                   >
                     Alterar
                   </button>
               </div>

               {/* Price Section: Responsive Layout */}
               
               {/* MOBILE: Compact Single Line (Hidden on Desktop) */}
               <div className="pt-4 lg:hidden flex justify-between items-center">
                  <div>
                      {/* UPDATED: Darker Gray (slate-600) */}
                      <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wide">Preço total</h4>
                      {/* UPDATED: Increased size to text-base to match dates */}
                      <p className="font-medium text-base text-[#3A4150] mt-1">R${total.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => setShowPriceDetails(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-[#1C2230] text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Informações
                  </button>
               </div>

               {/* DESKTOP: Restored Detailed Breakdown (Hidden on Mobile) */}
               <div className="hidden lg:block pt-6">
                  {/* UPDATED: Darker Gray (slate-600) for header */}
                  <h3 className="font-bold text-xs text-slate-600 uppercase tracking-wide mb-5">Resumo do preço</h3>
                  <div className="space-y-4 text-sm font-medium text-slate-600">
                      <div className="flex justify-between">
                         <span className="underline decoration-gray-300 decoration-dotted underline-offset-4">{daysDiff} diárias x R${car.pricePerDay}</span>
                         <span>R${rentalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="underline decoration-gray-300 decoration-dotted underline-offset-4">Taxa de serviço</span>
                         <span>R${serviceFee.toFixed(2)}</span>
                      </div>
                  </div>
                  <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between items-center">
                     {/* UPDATED: Smaller label for 'Total' */}
                     <span className="font-bold text-sm text-[#1C2230] uppercase">Total</span>
                     {/* UPDATED: Increased size to text-base to match dates */}
                     <span className="font-medium text-base text-[#3A4150]">R${total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 text-right">
                      <button 
                        onClick={() => setShowPriceDetails(true)} 
                        className="text-xs font-bold underline cursor-pointer hover:text-gray-700 text-gray-400" 
                      >
                        Detalhamento do preço
                      </button>
                  </div>
               </div>
               
            </div>
          </div>
          
        </div>
      </main>

      {/* Simplified Footer - Stays at bottom due to flex-grow on main - HIDDEN ON MOBILE */}
      <footer className="hidden lg:block border-t border-gray-200 bg-gray-50 py-8 shrink-0 mt-auto relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: '#3A4150' }}>© 2024 Cube Car. Todos os direitos reservados.</p>
            <div className="flex space-x-6 text-gray-400">
               <i className="fab fa-twitter cursor-pointer hover:text-[#3667AA] transition-colors"></i>
               <i className="fab fa-instagram cursor-pointer hover:text-[#3667AA] transition-colors"></i>
               <i className="fab fa-linkedin cursor-pointer hover:text-[#3667AA] transition-colors"></i>
            </div>
         </div>
      </footer>

      {/* MOBILE FIXED FOOTER BUTTON */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
         {/* Steps Progress Bar */}
         <div className="flex w-full gap-2 mb-3">
            {[1, 2].map((step) => (
                <div 
                    key={step} 
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        currentStep >= step ? 'bg-[#1C2230]' : 'bg-gray-200'
                    }`}
                ></div>
            ))}
         </div>
         <button 
           onClick={handleMobileAction}
           disabled={isProcessing || (currentStep === 2 && !paymentMethod)}
           className="w-full bg-[#3667AA] text-white font-bold py-4 rounded-xl shadow-lg disabled:bg-gray-300 disabled:shadow-none text-lg flex justify-center items-center gap-2"
         >
           {isProcessing && currentStep === 3 ? (
              <>
                <svg className="loader-container h-5 w-5" viewBox="25 25 50 50" style={{ width: '1.25em', height: '1.25em' }}>
                   <circle className="loader-svg loader-white" cx="50" cy="50" r="20"></circle>
                </svg>
                <span>Processando...</span>
              </>
           ) : (
             getMobileButtonText()
           )}
         </button>
      </div>

      {/* Price Breakdown Modal */}
      <AnimatePresence>
        {showPriceDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div 
               className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
               onClick={() => setShowPriceDetails(false)}
             ></div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl"
             >
                <div className="p-6 border-b border-gray-100 flex items-center relative">
                   <button 
                     onClick={() => setShowPriceDetails(false)} 
                     className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors absolute left-6"
                   >
                      <i className="fas fa-times text-gray-900 text-sm"></i>
                   </button>
                   <h3 className="text-xl font-display font-bold text-[#1C2230] w-full text-center">Detalhamento do preço</h3>
                </div>
                <div className="p-6 space-y-6">
                   <div>
                       <div className="flex justify-between items-start mb-1">
                          <p className="font-normal text-[#1C2230] text-base">{daysDiff} diárias · {formatDateFull(booking.startDate)} – {formatDate(booking.endDate)}</p>
                          <p className="font-normal text-[#1C2230] text-base">R${rentalCost.toFixed(2)}</p>
                       </div>
                   </div>
                   
                   <div>
                       <div className="flex justify-between items-start mb-1">
                          <p className="font-normal text-[#1C2230] text-base">Taxa de serviço do Cube Car</p>
                          <p className="font-normal text-[#1C2230] text-base">R${serviceFee.toFixed(2)}</p>
                       </div>
                   </div>
                   
                   <div className="border-t border-gray-200 pt-6 mt-2 flex justify-between items-center">
                      <p className="font-bold text-lg text-[#1C2230] underline decoration-gray-900 decoration-1 underline-offset-2">Total</p>
                      <p className="font-bold text-lg text-[#1C2230]">R${total.toFixed(2)}</p>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Dates Modal */}
      <AnimatePresence>
        {isEditDateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div 
               className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
               onClick={() => setIsEditDateModalOpen(false)}
             ></div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl flex flex-col min-h-[600px]"
             >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                   <button 
                     onClick={() => setIsEditDateModalOpen(false)} 
                     className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                   >
                      <i className="fas fa-times text-gray-900 text-lg"></i>
                   </button>
                   <h3 className="text-2xl font-display font-bold text-[#1C2230] w-full text-center">Editar reserva</h3>
                   <div className="w-8"></div>
                </div>
                
                {/* Body */}
                <div className="p-10 space-y-10 flex-1 relative">
                    {/* Start Booking - Styled like CarDetails */}
                    <div>
                        <h4 className="font-bold text-sm text-[#3A4150] mb-3 uppercase tracking-wide">Retirada</h4>
                        <div className="flex gap-6">
                           {/* Date Dropdown */}
                           <div className="flex-1 relative">
                                <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Data</label>
                                <div 
                                    onClick={(e) => handleDateClick(e, 'start')}
                                    className={`w-full border rounded-2xl px-5 py-3.5 text-base font-medium cursor-pointer flex items-center justify-between transition-all relative z-[50] ${activeDropdown === 'start-date' ? 'border-[#3667AA] ring-2 ring-[#3667AA]/10 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className={tempBooking.startDate ? 'text-[#1C2230]' : 'text-gray-400'}>
                                        {formatDate(tempBooking.startDate) || 'DD/MM/AAAA'}
                                    </span>
                                    <i className="far fa-calendar text-gray-400 text-lg"></i>
                                </div>
                                {activeDropdown === 'start-date' && renderCalendar('start')}
                           </div>
                           
                           {/* Time Dropdown */}
                           <div className="w-1/3 relative">
                              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Hora</label>
                              <div 
                                    onClick={(e) => handleTimeClick(e, 'start')}
                                    className={`w-full border rounded-2xl px-5 py-3.5 text-base font-medium cursor-pointer flex items-center justify-between transition-all relative z-[50] ${activeDropdown === 'start-time' ? 'border-[#3667AA] ring-2 ring-[#3667AA]/10 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className={tempBooking.startTime ? 'text-[#1C2230]' : 'text-gray-400'}>
                                        {tempBooking.startTime || '10:00'}
                                    </span>
                                    <i className="far fa-clock text-gray-400 text-lg"></i>
                                </div>
                                {activeDropdown === 'start-time' && (
                                   <div 
                                    className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-56 overflow-y-auto w-full z-[90] custom-scrollbar`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="py-2">
                                      {TIME_SLOTS.map((time) => (
                                        <button
                                          key={time}
                                          onClick={() => selectTime(time)}
                                          className={`w-full text-center py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors text-[#484848]`}
                                        >
                                          {time}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                           </div>
                        </div>
                    </div>

                    {/* End Booking - Styled like CarDetails */}
                    <div>
                        <h4 className="font-bold text-sm text-[#3A4150] mb-3 uppercase tracking-wide">Devolução</h4>
                        <div className="flex gap-6">
                           {/* Date Dropdown */}
                           <div className="flex-1 relative">
                                <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Data</label>
                                <div 
                                    onClick={(e) => handleDateClick(e, 'end')}
                                    className={`w-full border rounded-2xl px-5 py-3.5 text-base font-medium cursor-pointer flex items-center justify-between transition-all relative z-[50] ${activeDropdown === 'end-date' ? 'border-[#3667AA] ring-2 ring-[#3667AA]/10 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className={tempBooking.endDate ? 'text-[#1C2230]' : 'text-gray-400'}>
                                        {formatDate(tempBooking.endDate) || 'DD/MM/AAAA'}
                                    </span>
                                    <i className="far fa-calendar text-gray-400 text-lg"></i>
                                </div>
                                {activeDropdown === 'end-date' && renderCalendar('end')}
                           </div>
                           
                           {/* Time Dropdown */}
                           <div className="w-1/3 relative">
                              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">Hora</label>
                              <div 
                                    onClick={(e) => handleTimeClick(e, 'end')}
                                    className={`w-full border rounded-2xl px-5 py-3.5 text-base font-medium cursor-pointer flex items-center justify-between transition-all relative z-[50] ${activeDropdown === 'end-time' ? 'border-[#3667AA] ring-2 ring-[#3667AA]/10 bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <span className={tempBooking.endTime ? 'text-[#1C2230]' : 'text-gray-400'}>
                                        {tempBooking.endTime || '10:00'}
                                    </span>
                                    <i className="far fa-clock text-gray-400 text-lg"></i>
                                </div>
                                {activeDropdown === 'end-time' && renderTimeDropdown()}
                           </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-3xl shrink-0">
                    <button 
                        onClick={handleClearDates}
                        className="text-sm font-bold underline text-[#1C2230] hover:text-[#3667AA] transition-colors"
                    >
                        Limpar datas
                    </button>
                    <button 
                        onClick={handleSaveDates}
                        className="bg-[#3667AA] text-white font-bold px-10 py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-blue-100 text-base"
                    >
                        Salvar
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Checkout;