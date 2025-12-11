import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchWidgetProps {
  onSearch: (searchParams: any) => void;
}

// Generate time slots (00:00 - 23:30)
const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const totalMinutes = i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  // --- STATE ---
  const [location, setLocation] = useState('');
  
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState('');

  // Visibility States
  const [isLocationActive, setIsLocationActive] = useState(false);
  
  // Controls which dropdown is open: 'pickup-calendar', 'pickup-time', 'return-calendar', 'return-time'
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Calendar View State (current month being looked at)
  const [viewDate, setViewDate] = useState(new Date());

  // Ref for click outside detection
  const widgetRef = useRef<HTMLDivElement>(null);

  // --- TYPEWRITER PLACEHOLDER STATE ---
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const baseText = "Busque por ";
  const words = ["bairro", "cidade", "região"];

  // --- LOGIC ---

  // Typewriter Effect
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = baseText + words[i];
      
      setPlaceholderText((prev) => {
        if (isDeleting) {
          return fullText.substring(0, prev.length - 1);
        } else {
          return fullText.substring(0, prev.length + 1);
        }
      });

      // Typing Speed Logic
      let speed = 100;
      if (isDeleting) speed = 50;

      // Logic to switch between typing and deleting
      if (!isDeleting && placeholderText === fullText) {
        speed = 2000; // Pause at end of word
        setIsDeleting(true);
      } else if (isDeleting && placeholderText === baseText) {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        speed = 500; // Pause before typing next word
      }
      
      setTypingSpeed(speed);
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, loopNum, typingSpeed]);

  // Handle click outside to collapse widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        // Only close active dropdowns (calendars), keep main widget expanded if it was open
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    if (e.target.value.length > 0) {
      setIsLocationActive(true);
    }
  };

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
      // Reset view date to selected date or today when opening calendar
      if (name.includes('calendar')) {
        const isPickup = name.includes('pickup');
        const targetDate = isPickup ? pickupDate : returnDate;
        setViewDate(targetDate || new Date());
      }
    }
  };

  const handleDateSelect = (type: 'pickup' | 'return', date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Simple basic check to prevent selecting past dates in search
    if (date < today) return;

    if (type === 'pickup') {
      setPickupDate(date);
      // Logic: Close calendar, open pickup time if empty, else active returns
      setActiveDropdown('pickup-time');
    } else {
      setReturnDate(date);
      setActiveDropdown('return-time');
    }
  };

  const handleTimeSelect = (type: 'pickup' | 'return', time: string) => {
    if (type === 'pickup') {
      setPickupTime(time);
      // If return date is empty, open return calendar
      if (!returnDate) {
        setActiveDropdown('return-calendar');
      } else {
        setActiveDropdown(null);
      }
    } else {
      setReturnTime(time);
      setActiveDropdown(null);
    }
  };

  // --- CALENDAR HELPER FUNCTIONS ---
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return 'Escolher data';
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const renderCalendar = (type: 'pickup' | 'return') => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];
    
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const isSelected = type === 'pickup' 
        ? pickupDate?.toDateString() === currentDate.toDateString()
        : returnDate?.toDateString() === currentDate.toDateString();
      
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const isPast = currentDate < today;

      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={(e) => {
            e.stopPropagation();
            handleDateSelect(type, currentDate);
          }}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
            ${isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-blue-50 text-slate-700'}
            ${isSelected && !isPast ? 'bg-primary text-white shadow-glow transform scale-105' : ''}
            ${isToday && !isSelected && !isPast ? 'border border-primary text-primary' : ''}
          `}
        >
          {d}
        </button>
      );
    }

    return (
      <div 
        className="absolute top-full left-0 mt-3 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white/60 p-6 z-[60] w-[340px] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/50 rounded-full text-slate-600 transition-colors">
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="font-display font-medium text-slate-900 text-lg">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/50 rounded-full text-slate-600 transition-colors">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-3">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-2 justify-items-center">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={widgetRef}
      className="w-full max-w-2xl mx-auto flex flex-col gap-4 relative z-40 px-4 sm:px-0"
    >
      
      {/* 1. Location Input - Glass Card Standard */}
      <div className={`bg-white/60 backdrop-blur-xl rounded-[2rem] border transition-all duration-300 relative z-30 ${isLocationActive ? 'border-[#2B5288] shadow-glow ring-2 ring-[#2B5288]/10' : 'border-white/60 shadow-glass hover:shadow-xl'}`}>
        <div className="flex items-center px-5 sm:px-8 py-4 sm:py-5">
          <div className="bg-blue-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-6 text-primary shrink-0">
             <i className="fas fa-map-marker-alt text-lg sm:text-xl"></i>
          </div>
          <div className="flex flex-col w-full overflow-hidden">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-0.5 sm:mb-1 tracking-wide sm:tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
              Onde você quer retirar o carro?
            </label>
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder={placeholderText || "Busque por..."} 
                className="flex-grow bg-transparent outline-none text-slate-900 placeholder-slate-400 text-base sm:text-lg font-medium leading-relaxed font-display"
                value={location}
                onChange={handleLocationChange}
                onFocus={() => setIsLocationActive(true)}
              />
              {location && (
                <button 
                  onClick={() => {
                    setLocation('');
                  }}
                  className="text-slate-400 hover:text-slate-600 ml-2 transition-colors"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Expanding Section (Dates & Times & Search Button) */}
      <AnimatePresence>
        {isLocationActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-visible"
          >
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              
              {/* Pickup Field - Glass Card */}
              <div className="flex-1 relative group">
                <div 
                  className={`bg-white/60 backdrop-blur-xl border rounded-[1.5rem] px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${activeDropdown?.startsWith('pickup') ? 'border-[#2B5288] shadow-glow ring-1 ring-[#2B5288]/20' : 'border-white/60 shadow-glass hover:bg-white/80'}`}
                >
                  {/* Left Side: Date */}
                  <div 
                    className="flex items-center gap-4 flex-1"
                    onClick={() => toggleDropdown('pickup-calendar')}
                  >
                     <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-slate-600 shadow-sm border border-white/40">
                        <i className="far fa-calendar text-lg"></i>
                     </div>
                    <div className="flex flex-col select-none">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Retirada</span>
                      <span className={`text-sm font-medium ${pickupDate ? 'text-slate-900' : 'text-slate-400'}`}>
                        {formatDateDisplay(pickupDate)}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Time (Slide in animation) */}
                  <AnimatePresence>
                    {pickupDate && (
                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex items-center overflow-hidden whitespace-nowrap"
                      >
                         <div className="w-px h-8 bg-slate-200 mx-3 shrink-0"></div>
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown('pickup-time');
                          }}
                          className="text-sm font-medium text-primary hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors min-w-[60px]"
                        >
                          {pickupTime || "10:00"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Pickup Calendar Dropdown */}
                {activeDropdown === 'pickup-calendar' && renderCalendar('pickup')}

                {/* Pickup Time Dropdown */}
                {activeDropdown === 'pickup-time' && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white/60 max-h-60 overflow-y-auto z-[60] py-2 custom-scrollbar">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect('pickup', time)}
                        className={`w-full text-left px-6 py-2.5 hover:bg-blue-50 text-sm font-medium ${time === pickupTime ? 'text-primary bg-blue-50' : 'text-slate-600'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Return Field - Glass Card */}
              <div className="flex-1 relative group">
                <div 
                  className={`bg-white/60 backdrop-blur-xl border rounded-[1.5rem] px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${activeDropdown?.startsWith('return') ? 'border-[#2B5288] shadow-glow ring-1 ring-[#2B5288]/20' : 'border-white/60 shadow-glass hover:bg-white/80'}`}
                >
                  {/* Left Side: Date */}
                  <div 
                    className="flex items-center gap-4 flex-1"
                    onClick={() => toggleDropdown('return-calendar')}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-slate-600 shadow-sm border border-white/40">
                        <i className="far fa-calendar text-lg"></i>
                     </div>
                    <div className="flex flex-col select-none">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Devolução</span>
                      <span className={`text-sm font-medium ${returnDate ? 'text-slate-900' : 'text-slate-400'}`}>
                        {formatDateDisplay(returnDate)}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Time (Slide in animation) */}
                  <AnimatePresence>
                    {returnDate && (
                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex items-center overflow-hidden whitespace-nowrap"
                      >
                         <div className="w-px h-8 bg-slate-200 mx-3 shrink-0"></div>
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown('return-time');
                          }}
                          className="text-sm font-medium text-primary hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors min-w-[60px]"
                        >
                          {returnTime || "10:00"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Return Calendar Dropdown */}
                {activeDropdown === 'return-calendar' && renderCalendar('return')}

                {/* Return Time Dropdown */}
                {activeDropdown === 'return-time' && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white/60 max-h-60 overflow-y-auto z-[60] py-2 custom-scrollbar">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect('return', time)}
                        className={`w-full text-left px-6 py-2.5 hover:bg-blue-50 text-sm font-medium ${time === returnTime ? 'text-primary bg-blue-50' : 'text-slate-600'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Search Button (Gradient) */}
            <div className="pt-6">
              <button 
                onClick={() => onSearch({ 
                  location, 
                  pickup: { date: pickupDate?.toISOString(), time: pickupTime }, 
                  return: { date: returnDate?.toISOString(), time: returnTime } 
                })}
                className="w-full font-medium font-display text-lg py-4 rounded-2xl shadow-glow transition-all duration-300 bg-brand-gradient text-white hover:opacity-95 hover:shadow-glow-hover active:scale-[0.99] transform border-t border-white/20"
              >
                Buscar
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SearchWidget;