import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from '../types';
import Footer from './Footer';

interface BookingDetails {
  car: Car;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
  onContinue: (data: BookingDetails) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const ALL_TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const totalMinutes = i * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

const CarDetails: React.FC<CarDetailsProps> = ({ car, onClose, onContinue }) => {
  // Reverted to simple initialization
  const [activeImage, setActiveImage] = useState(car.imageUrl || (car.images && car.images[0]) || '');
  
  const defaultStart = car.availabilityHours?.start || '08:00';
  const defaultEnd = car.availabilityHours?.end || '18:00';
  const availability = car.availabilityHours || { start: "08:00", end: "18:00" };

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState(defaultStart);
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState(defaultEnd);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  
  // UX FIX: Specific refs for date picker containers to handle "click outside" correctly
  const datePickerContainerRef = useRef<HTMLDivElement>(null);
  const mobileDatePickerContainerRef = useRef<HTMLDivElement>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // --- SCROLL LOCK FIX ---
  // Blocks the main body scroll when this component is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  // -----------------------

  const today = new Date();
  const bookedDate1 = new Date(today); bookedDate1.setDate(today.getDate() + 3);
  const bookedDate2 = new Date(today); bookedDate2.setDate(today.getDate() + 4);
  
  const mockBookedDates = [
    `${bookedDate1.getFullYear()}-${String(bookedDate1.getMonth() + 1).padStart(2, '0')}-${String(bookedDate1.getDate()).padStart(2, '0')}`,
    `${bookedDate2.getFullYear()}-${String(bookedDate2.getMonth() + 1).padStart(2, '0')}-${String(bookedDate2.getDate()).padStart(2, '0')}`
  ];

  const images = car.features && car.images && car.images.length > 0 
    ? [car.imageUrl, ...car.images.filter(img => img !== car.imageUrl)] 
    : [car.imageUrl, car.imageUrl, car.imageUrl]; 

  // UX FIX: Improved Click Outside Logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isLightboxOpen) return;

      const target = event.target as Node;
      // Check if click is inside the specific date picker containers (desktop or mobile)
      const isInsideDesktop = datePickerContainerRef.current?.contains(target);
      const isInsideMobile = mobileDatePickerContainerRef.current?.contains(target);
      
      // Also check if we are clicking inside a fixed modal (which might be appended to body or outside refs)
      // We'll rely on the modal backdrop click handler for closing in mobile mode
      const isModal = (target as HTMLElement).closest('.fixed.z-\\[100\\]');

      // If click is outside both and not in a modal, close the dropdown
      if (!isInsideDesktop && !isInsideMobile && !isModal) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLightboxOpen]);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const features = car.features || ['Bluetooth', 'GPS', 'USB Input', 'Audio System'];
  
  const handleContinue = () => {
    onContinue({
      car,
      startDate,
      endDate,
      startTime,
      endTime
    });
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
    setStartTime(defaultStart);
    setEndTime(defaultEnd);
    setActiveDropdown(null);
  };

  const owner = car.ownerDetails || {
    name: "Anfitrião",
    avatar: `https://i.pravatar.cc/150?u=${car.ownerId}`,
    isSuperhost: false,
    yearsHosting: 1,
    job: "Membro da Comunidade",
    quote: "Apaixonado por carros e viagens.",
    school: ""
  };

  const locationQuery = car.coordinates 
    ? `${car.coordinates.lat},${car.coordinates.lng}`
    : car.location;

  const getCalculatedCosts = () => {
    const defaultDays = 3;
    const insurance = 30;
    const serviceFee = 45;

    if (!startDate || !endDate) {
      const rentalCost = car.pricePerDay * defaultDays;
      return {
        days: defaultDays,
        rentalCost,
        insurance,
        serviceFee,
        total: rentalCost + insurance + serviceFee
      };
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    const diffMs = end.getTime() - start.getTime();
    let daysDiff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (daysDiff < 1) daysDiff = 1;

    const rentalCost = car.pricePerDay * daysDiff;

    return {
      days: daysDiff,
      rentalCost,
      insurance,
      serviceFee,
      total: rentalCost + insurance + serviceFee
    };
  };

  const costs = getCalculatedCosts();

  const isDateDisabled = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (date < todayMidnight) return true;
    if (mockBookedDates.includes(dateStr)) return true;
    if (date.getTime() === todayMidnight.getTime()) {
       const currentHour = now.getHours();
       const currentMinute = now.getMinutes();
       const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
       if (currentTimeStr > availability.end) return true;
    }
    return false;
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const handleDateClick = (type: 'start' | 'end') => {
    const key = type === 'start' ? 'start-date' : 'end-date';
    if (activeDropdown !== key) {
        const currentVal = type === 'start' ? startDate : endDate;
        let initialDate = new Date();
        if (currentVal) {
            const [y, m, d] = currentVal.split('-').map(Number);
            initialDate = new Date(y, m - 1, d);
        }
        setViewDate(initialDate);
        setActiveDropdown(key);
    } else {
        setActiveDropdown(null);
    }
  };

  const handleTimeClick = (type: 'start' | 'end') => {
    const key = type === 'start' ? 'start-time' : 'end-time';
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const selectDate = (date: Date) => {
      if (isDateDisabled(date)) return;

      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (activeDropdown === 'start-date') {
        setStartDate(formatted);
        if (endDate && formatted > endDate) {
            setEndDate('');
        }
        setActiveDropdown('start-time');
      } else {
        if (startDate && formatted < startDate) {
            alert("A data de devolução não pode ser anterior à data de retirada.");
            return;
        }
        setEndDate(formatted);
        setActiveDropdown('end-time');
      }
  };

  const selectTime = (time: string) => {
      if (activeDropdown === 'start-time') setStartTime(time);
      else setEndTime(time);
      setActiveDropdown(null);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Escolher data';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderCalendar = (alignment: 'left' | 'right' = 'left', isMobile = false) => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-full sm:h-10 sm:w-10"></div>); // Match height of day cells
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const currentStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      const isStartDate = startDate === currentStr;
      const isEndDate = endDate === currentStr;
      const isInRange = startDate && endDate && currentStr > startDate && currentStr < endDate;
      
      // Determine if we should show range background on this cell
      const showRangeBg = isInRange || (isStartDate && endDate) || (isEndDate && startDate);
      
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const isDisabled = isDateDisabled(currentDate);

      // Wrapper div handles the "Range" background strip
      days.push(
        <div 
          key={d}
          className={`relative w-full h-8 sm:h-10 flex items-center justify-center
            ${showRangeBg && !isStartDate && !isEndDate ? 'bg-[#3667AA]/10' : ''} 
            ${showRangeBg && isStartDate ? 'bg-gradient-to-r from-transparent to-[#3667AA]/10' : ''}
            ${showRangeBg && isEndDate ? 'bg-gradient-to-l from-transparent to-[#3667AA]/10' : ''}
            ${isStartDate && endDate ? 'rounded-l-full' : ''}
            ${isEndDate && startDate ? 'rounded-r-full' : ''}
          `}
        >
            {/* Range connector specifically for Start/End nodes to ensure clean rounding */}
            {isStartDate && endDate && (
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#3667AA]/10 z-0"></div>
            )}
            {isEndDate && startDate && (
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#3667AA]/10 z-0"></div>
            )}

            <button
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation();
                selectDate(currentDate);
              }}
              className={`relative z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:border-2 hover:border-[#3667AA] hover:text-[#3667AA] text-[#484848]'}
                ${(isStartDate || isEndDate) && !isDisabled ? 'bg-[#3667AA] text-white shadow-md hover:bg-[#3667AA] hover:text-white hover:border-none' : ''}
                ${isToday && !isStartDate && !isEndDate ? 'border border-[#3667AA] text-[#3667AA]' : ''}
              `}
            >
              {d}
            </button>
        </div>
      );
    }

    // HEIGHT STABILITY FIX: Ensure exactly 42 slots (6 rows) are rendered for grid consistency
    const totalGridSlots = 42; 
    const currentFilledSlots = days.length;
    for (let i = currentFilledSlots; i < totalGridSlots; i++) {
        days.push(<div key={`empty-end-${i}`} className="h-8 w-full sm:h-10 sm:w-10"></div>);
    }

    const calendarContent = (
      <>
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
            <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase">
              {day}
            </div>
          ))}
        </div>
        {/* Adjusted Grid: No gap-x to allow range bars to touch */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0 justify-items-center">
          {days}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4 text-[10px] sm:text-xs text-[#484848] justify-center">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <span>Indisponível</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-[#3667AA]"></div>
                <span>Hoje</span>
            </div>
        </div>
      </>
    );

    if (isMobile) {
      const title = activeDropdown === 'start-date' ? 'Retirada' : 'Devolução';
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveDropdown(null)}></div>
           <div 
             className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-[320px] relative z-10 animate-fade-in-up overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Header Title for Mobile - INCREASED HEIGHT (py-6) */}
              <div className="py-6 px-4 border-b border-gray-100 flex justify-center items-center bg-gray-50 relative shrink-0">
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <button 
                    onClick={() => setActiveDropdown(null)} 
                    className="absolute right-4 text-gray-400 p-2 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
              </div>
              <div className="p-6">
                {calendarContent}
              </div>
           </div>
        </div>
      );
    }

    return (
      <div 
        className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[80] w-[280px] sm:w-[320px] ${alignment === 'right' ? 'right-0' : 'left-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {calendarContent}
      </div>
    );
  };

  const renderTimeDropdown = (alignment: 'left' | 'right' = 'left', isMobile = false) => {
    const isStart = activeDropdown === 'start-time';
    const currentTimeSelection = isStart ? startTime : endTime;
    
    let filteredTimeSlots = ALL_TIME_SLOTS.filter(time => 
        time >= availability.start && time <= availability.end
    );

    const activeDateStr = isStart ? startDate : endDate;
    if (activeDateStr) {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        if (activeDateStr === todayStr) {
             const currentHour = now.getHours();
             const currentMinute = now.getMinutes();
             const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
             
             filteredTimeSlots = filteredTimeSlots.filter(t => t > currentTimeStr);
        }
    }

    if (isMobile) {
       // Define title based on type
       const title = activeDropdown === 'start-time' ? 'Horário de retirada' : 'Horário de devolução';
       
       return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveDropdown(null)}></div>
           <div 
             className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-[320px] max-h-[60vh] overflow-hidden flex flex-col relative z-10 animate-fade-in-up"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Updated Header: INCREASED HEIGHT (py-6) */}
              <div className="py-6 px-4 border-b border-gray-100 flex justify-center items-center bg-gray-50 relative shrink-0">
                  <span className="font-bold text-slate-900 text-center text-lg">{title}</span>
                  <button onClick={() => setActiveDropdown(null)} className="absolute right-4 text-gray-400 p-2 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><i className="fas fa-times"></i></button>
              </div>
              <div className="overflow-y-auto custom-scrollbar p-2">
                {filteredTimeSlots.length === 0 ? (
                   <div className="px-4 py-4 text-xs text-gray-500 text-center">Nenhum horário disponível para esta data.</div>
                ) : (
                  filteredTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => selectTime(time)}
                      className={`w-full text-center py-3 text-sm font-medium hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0
                        ${time === currentTimeSelection ? 'bg-[#3667AA] text-white hover:bg-[#3667AA]' : 'text-[#484848]'}
                      `}
                    >
                      {time}
                    </button>
                  ))
                )}
              </div>
           </div>
        </div>
       );
    }

    return (
      <div 
        className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-56 overflow-y-auto w-32 z-[90] custom-scrollbar ${alignment === 'right' ? 'right-0' : 'left-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2">
          {filteredTimeSlots.length === 0 ? (
             <div className="px-4 py-2 text-xs text-gray-500 text-center">Nenhum horário disponível</div>
          ) : (
            filteredTimeSlots.map((time) => (
              <button
                key={time}
                onClick={() => selectTime(time)}
                className={`w-full text-center py-2 text-sm font-medium hover:bg-blue-50 transition-colors
                  ${time === currentTimeSelection ? 'bg-[#3667AA] text-white hover:bg-[#3667AA]' : 'text-[#484848]'}
                `}
              >
                {time}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-fade-in flex flex-col pb-24 lg:pb-0 font-sans selection:bg-blue-100 selection:text-blue-900">
        
        {/* Ambient Background - Clean White Theme with subtle blue tints (Identical to App.tsx) */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle Blue Glow top right */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
          {/* Subtle Blue Glow bottom left */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Glass Header - Updated Layout to Match Grid */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-20 shadow-sm shrink-0 supports-[backdrop-filter]:bg-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="p-2 -ml-2 hover:bg-white/50 rounded-full transition-colors flex items-center gap-2 text-gray-600"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex gap-4 text-gray-500 text-sm">
              <button className="hover:text-slate-900 flex items-center gap-1 font-medium"><i className="far fa-heart"></i> Salvar</button>
              <button className="hover:text-slate-900 flex items-center gap-1 font-medium"><i className="fas fa-share-alt"></i> Compartilhar</button>
            </div>
          </div>
        </div>

        <div className="flex-grow w-full relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-[300px] sm:h-[400px] md:h-[500px]">
              <div className="h-full relative bg-gray-100 overflow-hidden group">
                <AnimatePresence mode='wait'>
                    <motion.img 
                      key={activeImage}
                      src={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover absolute inset-0 cursor-pointer"
                      onClick={() => openLightbox(images.indexOf(activeImage))} 
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-none md:group-hover:bg-black/5 transition-all pointer-events-none"></div>
                <button 
                  onClick={() => openLightbox(0)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm 
                            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-2 text-slate-900"
                >
                  <i className="fas fa-th"></i>
                  <span className="md:hidden">Fotos</span>
                  <span className="hidden md:inline">Mostrar todas as fotos</span>
                </button>
              </div>

              <div className="hidden md:grid grid-cols-2 gap-2 h-full">
                  {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative h-full overflow-hidden group">
                      <img 
                        src={img} 
                        className={`w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110 ${activeImage === img ? 'opacity-50' : 'opacity-100'}`}
                        onClick={() => setActiveImage(img)}
                      />
                      <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none ${activeImage === img ? 'bg-black/20' : ''}`}></div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                <div className="pb-6 mb-2 border-b border-gray-200/60">
                    <h1 className="text-3xl font-medium text-slate-900 mb-2">{car.make} {car.model} {car.year}</h1>
                    <div className="flex items-center gap-4 text-sm text-[#484848] mb-6">
                      <span className="flex items-center gap-1 font-medium"><i className="fas fa-star text-[#3667AA]"></i> {car.rating} ({car.trips} viagens)</span>
                      <span>•</span>
                      <span>{car.location}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-4">
                          <img src={owner.avatar} alt={owner.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-white" />
                          <div>
                             <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Hospedado por</p>
                             <h3 className="font-medium text-slate-900">{owner.name}</h3>
                             <div className="flex items-center gap-2 text-xs text-[#484848] mt-0.5">
                               <span>Membro desde {new Date().getFullYear() - owner.yearsHosting}</span>
                               {owner.isSuperhost && (
                                 <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-[#E11D48] font-medium">
                                    <i className="fas fa-medal"></i> Superhost
                                  </span>
                                 </>
                               )}
                             </div>
                          </div>
                        </div>
                        <button className="border border-gray-300/80 bg-white/50 backdrop-blur-sm text-slate-900 font-medium px-6 py-2.5 rounded-lg hover:bg-white transition-colors w-full sm:w-auto shadow-sm">
                           Enviar mensagem
                        </button>
                    </div>
                </div>

                {/* Mobile Date Selection */}
                <div className="lg:hidden mb-8 mt-6 relative" ref={mobileDatePickerContainerRef}>
                  <h3 className="font-medium text-lg mb-4 text-slate-900">Selecione as datas</h3>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                        <div 
                          className={`bg-white/80 backdrop-blur-md border rounded-full px-5 py-3 flex items-center shadow-sm transition-all ${activeDropdown === 'start-date' || activeDropdown === 'start-time' ? 'border-[#3667AA] ring-1 ring-[#3667AA]' : 'border-gray-200'}`}
                        >
                            <i className="far fa-calendar text-gray-800 text-lg mr-3" onClick={() => handleDateClick('start')}></i>
                            <div className="flex-1 flex items-center justify-between">
                              <div className="cursor-pointer flex-1" onClick={() => handleDateClick('start')}>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide cursor-pointer">Início</label>
                                  <span className={`text-sm font-medium ${startDate ? 'text-slate-900' : 'text-gray-400'}`}>
                                    {formatDateDisplay(startDate)}
                                  </span>
                              </div>
                              <div className="w-px h-8 bg-gray-200 mx-4 shrink-0"></div>
                              <div className="cursor-pointer min-w-[80px] text-left" onClick={() => handleTimeClick('start')}>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide cursor-pointer">Hora</label>
                                  <span className="text-sm font-medium text-[#3667AA]">{startTime}</span>
                              </div>
                            </div>
                        </div>
                        {activeDropdown === 'start-date' && renderCalendar('left', true)}
                        {activeDropdown === 'start-time' && renderTimeDropdown('left', true)}
                    </div>
                    <div className="relative">
                        <div 
                          className={`bg-white/80 backdrop-blur-md border rounded-full px-5 py-3 flex items-center shadow-sm transition-all ${activeDropdown === 'end-date' || activeDropdown === 'end-time' ? 'border-[#3667AA] ring-1 ring-[#3667AA]' : 'border-gray-200'}`}
                        >
                            <i className="far fa-calendar text-gray-800 text-lg mr-3" onClick={() => handleDateClick('end')}></i>
                            <div className="flex-1 flex items-center justify-between">
                              <div className="cursor-pointer flex-1" onClick={() => handleDateClick('end')}>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide cursor-pointer">Fim</label>
                                  <span className={`text-sm font-medium ${endDate ? 'text-slate-900' : 'text-gray-400'}`}>
                                    {formatDateDisplay(endDate)}
                                  </span>
                              </div>
                              <div className="w-px h-8 bg-gray-200 mx-4 shrink-0"></div>
                              <div className="cursor-pointer min-w-[80px] text-left" onClick={() => handleTimeClick('end')}>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide cursor-pointer">Hora</label>
                                  <span className="text-sm font-medium text-[#3667AA]">{endTime}</span>
                              </div>
                            </div>
                        </div>
                        {activeDropdown === 'end-date' && renderCalendar('left', true)}
                        {activeDropdown === 'end-time' && renderTimeDropdown('left', true)}
                    </div>
                  </div>
                  {(startDate || endDate) && (
                    <div className="mb-6">
                        <button 
                            onClick={handleClearDates}
                            className="text-sm font-bold underline text-[#1C2230] hover:text-[#3667AA] transition-colors"
                        >
                            Limpar datas
                        </button>
                    </div>
                  )}
                </div>

                <div className="py-8 border-b border-gray-200/60">
                  <h3 className="font-medium text-lg mb-4 text-slate-900">Recursos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#484848] text-sm">
                        <i className="fas fa-check text-green-500"></i> {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-8 border-b border-gray-200/60">
                  <h3 className="font-medium text-lg mb-4 text-slate-900">Descrição</h3>
                  {/* INLINE STYLE FIX */}
                  <p className="text-[#484848] leading-relaxed text-sm sm:text-base font-normal" style={{ color: '#3A4150' }}>
                    {car.description || "Este veículo é perfeito para suas necessidades. Muito econômico, confortável e ideal para viagens curtas ou longas. Possui ar condicionado, direção hidráulica e sistema de som de alta qualidade."}
                  </p>
                </div>
                
                <div className="py-8 border-b border-gray-200/60">
                  <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-glass p-6">
                    <h3 className="font-medium text-lg mb-4 text-slate-900">Local de retirada e devolução</h3>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="mt-1 text-gray-400"><i className="fas fa-map-marker-alt text-xl"></i></div>
                      <div>
                          <p className="font-medium text-slate-900">{car.location}</p>
                          <p className="text-sm text-[#484848]">O endereço exato é enviado após a reserva.</p>
                      </div>
                    </div>
                    <div className="w-full h-64 bg-gray-200 rounded-xl mb-6 relative overflow-hidden border border-gray-200 shadow-sm">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          loading="lazy" 
                          allowFullScreen 
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${locationQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          title="Car Location"
                        ></iframe>
                    </div>
                    <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-4">
                      <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Retirada</p>
                          <p className="font-medium text-slate-900 text-lg">a partir de {availability.start}</p>
                      </div>
                      <div className="border-l border-gray-200 pl-8">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Devolução</p>
                          <p className="font-medium text-slate-900 text-lg">até {availability.end}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-8 border-b border-gray-200/60">
                  <h3 className="font-medium text-lg mb-4 text-slate-900">Comentários</h3>
                  <div className="space-y-6">
                    {(car.reviews || []).length > 0 ? car.reviews?.map(review => (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{review.userName}</p>
                              <p className="text-xs text-[#484848]">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white border border-gray-100 px-2 py-1 rounded-lg shadow-sm">
                              <span className="font-medium text-sm text-slate-900">{review.rating}</span>
                              <i className="fas fa-star text-xs text-[#3667AA]"></i>
                          </div>
                        </div>
                        <p className="text-[#484848] text-sm font-normal">{review.comment}</p>
                      </div>
                    )) : (
                      <p className="text-[#484848] text-sm">Este carro ainda não tem avaliações.</p>
                    )}
                  </div>
                </div>

                <div className="pt-8 pb-12">
                  <h2 className="text-2xl font-medium text-slate-900 mb-6">Conheça seu anfitrião</h2>
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-glass border border-white/60 p-8 max-w-sm mb-8">
                    <div className="flex items-center gap-8">
                       <div className="flex flex-col items-center">
                          <div className="relative">
                             <img src={owner.avatar} alt={owner.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                             <div className="absolute bottom-0 right-0 bg-[#E11D48] text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                <i className="fas fa-check text-xs"></i>
                             </div>
                          </div>
                          <h3 className="text-2xl font-medium text-slate-900 mt-3 text-center leading-tight">
                            {owner.name.split(' ')[0]} <br/> {owner.name.split(' ').slice(1).join(' ')}
                          </h3>
                          <p className="text-sm text-[#484848] font-medium mt-1">Anfitrião</p>
                       </div>
                       <div className="flex flex-col gap-4 min-w-[100px]">
                          <div>
                             <span className="text-2xl font-medium text-slate-900 block">{(car.reviews || []).length}</span>
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2 block w-full">avaliações</span>
                          </div>
                          <div>
                             <span className="text-2xl font-medium text-slate-900 block flex items-center gap-1">
                               {car.rating} <i className="fas fa-star text-xs text-slate-900"></i>
                             </span>
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">estrelas</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                     {/* INLINE STYLE FIX: Removed conflict class, applied inline */}
                     <div className="flex items-center gap-4">
                        <div className="w-6 flex justify-center" style={{ color: '#3A4150' }}><i className="far fa-user text-xl"></i></div>
                        <span className="text-base" style={{ color: '#3A4150' }}>Nasci na década de 90</span>
                     </div>
                     {owner.school && (
                        /* INLINE STYLE FIX */
                        <div className="flex items-center gap-4">
                            <div className="w-6 flex justify-center" style={{ color: '#3A4150' }}><i className="fas fa-graduation-cap text-xl"></i></div>
                            <span className="text-base" style={{ color: '#3A4150' }}>Onde estudei: {owner.school}</span>
                        </div>
                     )}
                     {owner.job && (
                        /* INLINE STYLE FIX */
                        <div className="flex items-center gap-4">
                            <div className="w-6 flex justify-center" style={{ color: '#3A4150' }}><i className="fas fa-briefcase text-xl"></i></div>
                            <span className="text-base" style={{ color: '#3A4150' }}>Meu trabalho: {owner.job}</span>
                        </div>
                     )}
                  </div>
                  {/* INLINE STYLE FIX */}
                  <div className="text-[#484848] leading-relaxed max-w-2xl text-base mb-8 font-normal" style={{ color: '#3A4150' }}>
                     {owner.quote || "Olá! Sou apaixonado por carros e adoro conhecer novas pessoas. Conte comigo para uma experiência incrível e segura!"}
                  </div>
                </div>
              </div>

              <div className="hidden lg:block lg:w-1/3">
                {/* UPDATED: Glassmorphism effect similar to SearchWidget. 
                    STANDARDIZED: rounded-2xl (vs 2rem) and p-6 (vs p-8) to match 'Location' card */}
                <div className="sticky top-24 bg-white/60 backdrop-blur-xl rounded-2xl shadow-glass border border-white/60 p-6">
                  <div className="flex justify-between items-baseline mb-6">
                    <div>
                      <span className="text-2xl font-medium text-slate-900">R$ {car.pricePerDay}</span>
                      <span className="text-slate-700 text-sm"> / dia</span>
                    </div>
                  </div>
                  {/* UPDATED: Date picker container style - REMOVED overflow-hidden, ADDED relative z-30, Rounded-xl to match outer 2xl */}
                  <div ref={datePickerContainerRef} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl mb-3 shadow-glass relative z-30">
                    <div className="flex border-b border-gray-200/60">
                        <div 
                          className="flex-1 p-4 border-r border-gray-200/60 cursor-pointer hover:bg-white/80 transition-colors relative rounded-tl-xl"
                          onClick={() => handleDateClick('start')}
                        >
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Retirada</p>
                          <p className={`text-sm font-medium truncate ${startDate ? 'text-slate-900' : 'text-gray-400'}`}>{formatDateDisplay(startDate)}</p>
                          {activeDropdown === 'start-date' && renderCalendar()}
                        </div>
                        <div 
                          className="flex-1 p-4 cursor-pointer hover:bg-white/80 transition-colors relative rounded-tr-xl"
                          onClick={() => handleDateClick('end')}
                        >
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Devolução</p>
                          <p className={`text-sm font-medium truncate ${endDate ? 'text-slate-900' : 'text-gray-400'}`}>{formatDateDisplay(endDate)}</p>
                          {activeDropdown === 'end-date' && renderCalendar('right')}
                        </div>
                    </div>
                    <div className="flex">
                        <div 
                          className="flex-1 p-4 border-r border-gray-200/60 cursor-pointer hover:bg-white/80 transition-colors relative rounded-bl-xl"
                          onClick={() => handleTimeClick('start')}
                        >
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Horário</p>
                          <p className="text-sm font-medium text-slate-900">{startTime}</p>
                          {activeDropdown === 'start-time' && renderTimeDropdown()}
                        </div>
                        <div 
                          className="flex-1 p-4 cursor-pointer hover:bg-white/80 transition-colors relative rounded-br-xl"
                          onClick={() => handleTimeClick('end')}
                        >
                          <p className="text-[10px] font-bold text-gray-500 uppercase">Horário</p>
                          <p className="text-sm font-medium text-slate-900">{endTime}</p>
                          {activeDropdown === 'end-time' && renderTimeDropdown('right')}
                        </div>
                    </div>
                  </div>
                  
                  {(startDate || endDate) && (
                    <div className="mb-6">
                        <button 
                            onClick={handleClearDates}
                            className="text-sm font-bold underline text-[#1C2230] hover:text-[#3667AA] transition-colors"
                        >
                            Limpar datas
                        </button>
                    </div>
                  )}

                  {startDate && endDate && (
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200/50 text-sm text-[#484848]">
                        <div className="flex justify-between">
                          <span className="underline decoration-gray-300 decoration-dotted underline-offset-2">R$ {car.pricePerDay} x {costs.days} dias</span>
                          <span>R$ {costs.rentalCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="underline decoration-gray-300 decoration-dotted underline-offset-2">Taxa de serviço</span>
                          <span>R$ {costs.serviceFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="underline decoration-gray-300 decoration-dotted underline-offset-2">Seguro e proteção</span>
                          <span>R$ {costs.insurance}</span>
                        </div>
                    </div>
                  )}
                  {startDate && endDate && (
                    <div className="flex justify-between items-center mb-6 font-medium text-lg text-slate-900">
                      <span>Total</span>
                      <span>R$ {costs.total}</span>
                    </div>
                  )}
                  <button 
                    onClick={handleContinue}
                    disabled={!startDate || !endDate}
                    className="w-full bg-[#3667AA] text-white font-medium py-3 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none"
                  >
                    Continuar
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">Você não será cobrado ainda.</p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div>
            {startDate && endDate ? (
               <div className="flex flex-col">
                  <span className="font-medium text-slate-900">R$ {costs.total}</span>
                  <span className="text-xs text-[#484848] underline">Total por {costs.days} dias</span>
               </div>
            ) : (
               <div className="flex flex-col">
                  <span className="font-medium text-lg text-slate-900">R$ {car.pricePerDay}</span>
                  <span className="text-xs text-[#484848]">por dia</span>
               </div>
            )}
          </div>
          <button 
            onClick={handleContinue}
            disabled={!startDate || !endDate}
            className="bg-[#3667AA] text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-blue-100 hover:opacity-95 active:scale-95 transition-all disabled:bg-gray-300 disabled:shadow-none disabled:transform-none"
          >
            Continuar
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          >
             <button 
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 left-4 text-white/80 hover:text-white p-2 z-50"
             >
                <i className="fas fa-times text-2xl"></i>
             </button>
             <div className="relative w-full h-full flex items-center justify-center">
                <motion.img 
                  key={lightboxIndex}
                  src={images[lightboxIndex]} 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="max-w-full max-h-full object-contain p-4"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -10000) {
                      nextImage();
                    } else if (swipe > 10000) {
                      prevImage();
                    }
                  }}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors hidden sm:block"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors hidden sm:block"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {images.length}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CarDetails;