import React, { useState, useEffect } from 'react';
import SearchWidget from './components/SearchWidget';
import CarCard from './components/CarCard';
import CarDetails from './components/CarDetails';
import AddCarModal from './components/AddCarModal';
import LoginModal from './components/LoginModal';
import Checkout from './components/Checkout';
import Header from './components/Header';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import BecomeHost from './components/BecomeHost';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import HelpCenter from './components/HelpCenter'; // Import
import { Car, User } from './types';
import { getCars } from './services/carService';

interface BookingDetails {
  car: Car;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

type Page = 'home' | 'how-it-works' | 'become-host' | 'checkout' | 'chat' | 'dashboard' | 'help-center';

const App: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Auth State with Persistence
  const [user, setUser] = useState<User | null>(() => {
    // Try to load from local storage first to persist login across refreshes
    try {
      const savedUser = localStorage.getItem('cube_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  
  const [showBookingSuccess, setShowBookingSuccess] = useState<string | null>(null);
  
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [checkoutData, setCheckoutData] = useState<BookingDetails | null>(null);

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const path = window.location.pathname.replace(/^\//, ''); 
        if (path === 'become-host') return 'become-host';
        if (path === 'how-it-works') return 'how-it-works';
        if (path === 'checkout') return 'checkout';
        if (path === 'chat') return 'chat';
        if (path === 'dashboard') return 'dashboard';
        if (path === 'help-center') return 'help-center';
      }
    } catch (e) {
      console.warn("Location access blocked or unavailable");
    }
    return 'home';
  });

  // Persist user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('cube_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cube_user');
    }
  }, [user]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const statePage = event.state?.page;
      if (statePage) {
        setCurrentPage(statePage);
      } else {
        try {
          const path = window.location.pathname.replace(/^\//, '');
          if (path === 'become-host') setCurrentPage('become-host');
          else if (path === 'how-it-works') setCurrentPage('how-it-works');
          else if (path === 'checkout') setCurrentPage('checkout');
          else if (path === 'chat') setCurrentPage('chat');
          else if (path === 'dashboard') setCurrentPage('dashboard');
          else if (path === 'help-center') setCurrentPage('help-center');
          else setCurrentPage('home');
        } catch (e) {
          setCurrentPage('home');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    try {
      const initialPath = currentPage === 'home' ? '/' : `/${currentPage}`;
      window.history.replaceState({ page: currentPage }, '', initialPath);
    } catch (e) {
      console.warn("History API restricted in this environment (replaceState blocked)");
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: Page) => {
    if (currentPage === page) {
      window.scrollTo(0, 0);
      return;
    }
    
    if (page !== 'checkout') {
      setCheckoutData(null);
      setSelectedCar(null);
    }
    
    setIsListModalOpen(false);
    setCurrentPage(page);
    
    try {
      const path = page === 'home' ? '/' : `/${page}`;
      window.history.pushState({ page }, '', path);
    } catch (e) {
       console.warn("History API restricted in this environment (pushState blocked)");
    }
    
    window.scrollTo(0, 0);
  };

  const fetchCars = async () => {
    setLoading(true);
    const data = await getCars();
    setCars(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleBookingContinue = (data: BookingDetails) => {
    setCheckoutData(data);
    navigateTo('checkout');
  };

  const handleBookingSuccess = () => {
    navigateTo('home');
    setShowBookingSuccess(`Reserva confirmada com sucesso!`);
    setTimeout(() => setShowBookingSuccess(null), 3000);
  };

  const handleCheckoutBack = () => {
    setCurrentPage('home');
    try {
      window.history.replaceState({ page: 'home' }, '', '/');
    } catch (e) {
      // Ignore
    }
    window.scrollTo(0, 0);
  };

  const openAuthModal = (view: 'login' | 'signup') => {
    if (user) return; // Already logged in
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    navigateTo('home');
  };

  // 1. Checkout Page
  if (currentPage === 'checkout') {
    if (!checkoutData) {
      setTimeout(() => navigateTo('home'), 0);
      return null;
    }
    return (
      <>
        <Checkout 
          user={user}
          car={checkoutData.car}
          startDate={checkoutData.startDate}
          endDate={checkoutData.endDate}
          startTime={checkoutData.startTime}
          endTime={checkoutData.endTime}
          onBack={handleCheckoutBack}
          onSuccess={handleBookingSuccess}
          onLoginClick={() => openAuthModal('login')}
        />
        {isAuthModalOpen && (
          <LoginModal 
            initialView={authModalView} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLogin={handleLogin}
          />
        )}
      </>
    );
  }

  // 2. Chat Page
  if (currentPage === 'chat') {
    if (!user) {
      setTimeout(() => {
         navigateTo('home');
         openAuthModal('login');
      }, 0);
      return null;
    }
    return (
      <div className="min-h-screen flex flex-col relative bg-[#F9FAFB] h-screen overflow-hidden">
        <Header 
          user={user}
          onBecomeHostClick={() => navigateTo('become-host')}
          onLogoClick={() => navigateTo('home')}
          onHowItWorksClick={() => navigateTo('how-it-works')}
          onHelpCenterClick={() => navigateTo('help-center')}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onLogout={handleLogout}
          onChatClick={() => navigateTo('chat')}
          onDashboardClick={() => navigateTo('dashboard')}
        />
        <ChatInterface 
          currentUser={user}
          onBack={() => navigateTo('home')}
        />
      </div>
    );
  }

  // 3. Dashboard Page
  if (currentPage === 'dashboard') {
    if (!user) {
      setTimeout(() => {
         navigateTo('home');
         openAuthModal('login');
      }, 0);
      return null;
    }
    return (
      <div className="min-h-screen flex flex-col relative bg-[#F9FAFB]">
        <Header 
          user={user}
          onBecomeHostClick={() => navigateTo('become-host')}
          onLogoClick={() => navigateTo('home')}
          onHowItWorksClick={() => navigateTo('how-it-works')}
          onHelpCenterClick={() => navigateTo('help-center')}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onLogout={handleLogout}
          onChatClick={() => navigateTo('chat')}
          onDashboardClick={() => navigateTo('dashboard')}
        />
        <Dashboard 
          user={user} 
          onNavigateHome={() => navigateTo('home')}
        />
      </div>
    );
  }

  // 4. How It Works
  if (currentPage === 'how-it-works') {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#F9FAFB]">
        <Header 
          user={user}
          onBecomeHostClick={() => navigateTo('become-host')}
          onLogoClick={() => navigateTo('home')}
          onHowItWorksClick={() => navigateTo('how-it-works')}
          onHelpCenterClick={() => navigateTo('help-center')}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onLogout={handleLogout}
          onChatClick={() => navigateTo('chat')}
          onDashboardClick={() => navigateTo('dashboard')}
        />
        <HowItWorks 
          onBackToHome={() => navigateTo('home')}
          onBecomeHost={() => navigateTo('become-host')}
        />
        {isAuthModalOpen && (
          <LoginModal 
            initialView={authModalView} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  // 5. Help Center (New)
  if (currentPage === 'help-center') {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#F9FAFB]">
        {/* Header Restored */}
        <Header 
          user={user}
          onBecomeHostClick={() => navigateTo('become-host')}
          onLogoClick={() => navigateTo('home')}
          onHowItWorksClick={() => navigateTo('how-it-works')}
          onHelpCenterClick={() => navigateTo('help-center')}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onLogout={handleLogout}
          onChatClick={() => navigateTo('chat')}
          onDashboardClick={() => navigateTo('dashboard')}
        />
        <HelpCenter 
          onBackToHome={() => navigateTo('home')}
          onContactSupport={() => console.log('Contact support clicked')}
        />
        {isAuthModalOpen && (
          <LoginModal 
            initialView={authModalView} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  // 6. Become Host
  if (currentPage === 'become-host') {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#F9FAFB]">
        <Header 
          user={user}
          onBecomeHostClick={() => window.scrollTo(0,0)}
          onLogoClick={() => navigateTo('home')}
          onHowItWorksClick={() => navigateTo('how-it-works')}
          onHelpCenterClick={() => navigateTo('help-center')}
          onLoginClick={() => openAuthModal('login')}
          onSignupClick={() => openAuthModal('signup')}
          onLogout={handleLogout}
          onChatClick={() => navigateTo('chat')}
          onDashboardClick={() => navigateTo('dashboard')}
        />
        <BecomeHost 
          onBackToHome={() => navigateTo('home')}
          onListCar={() => setIsListModalOpen(true)}
        />
        {isListModalOpen && (
          <AddCarModal 
            onClose={() => setIsListModalOpen(false)} 
            onCarAdded={() => { fetchCars(); navigateTo('home'); }}
          />
        )}
        {isAuthModalOpen && (
          <LoginModal 
            initialView={authModalView} 
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    );
  }

  // 7. Home (Default) - UPDATED BACKGROUND TO WHITE
  return (
    <div className="min-h-screen flex flex-col relative bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* Updated Ambient Background - Clean White Theme with subtle blue tints */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle Blue Glow top right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
        {/* Subtle Blue Glow bottom left */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px]"></div>
      </div>

      <Header 
        user={user}
        onBecomeHostClick={() => navigateTo('become-host')}
        onLogoClick={() => { setSelectedCar(null); navigateTo('home'); }}
        onHowItWorksClick={() => navigateTo('how-it-works')}
        onHelpCenterClick={() => navigateTo('help-center')}
        onLoginClick={() => openAuthModal('login')}
        onSignupClick={() => openAuthModal('signup')}
        onLogout={handleLogout}
        onChatClick={() => navigateTo('chat')}
        onDashboardClick={() => navigateTo('dashboard')}
      />

      <div className="relative z-40">
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center mb-10 max-w-4xl px-4 animate-fade-in-up">
            {/* CHANGED: font-light to font-medium (500) for H1 Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-slate-600 tracking-tight mb-6 leading-tight">
              Sem balcão, <span className="text-[#3667AA] font-medium">sem burocracia.</span>
            </h1>
            {/* Body text uses default 400 (Regular) */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Alugue com pessoas de verdade: reservou, dirigiu e devolveu.
            </p>
          </div>
          <SearchWidget onSearch={fetchCars} />
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-0">
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-8 px-2 sm:px-0">
            {/* CHANGED: font-light to font-medium (500) for Section Title */}
            <h2 className="text-xl sm:text-2xl font-display font-medium text-slate-900">Disponíveis perto de você</h2>
            {/* Badge uses font-medium (500) */}
            <span className="text-sm text-slate-600 font-medium bg-white/60 backdrop-blur px-3 py-1 rounded-full border border-gray-200 shadow-sm">{cars.length} veículos</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <svg className="loader-container" viewBox="25 25 50 50">
                  <circle className="loader-svg" cx="50" cy="50" r="20"></circle>
               </svg>
               <p className="mt-4 text-slate-400 font-medium animate-pulse">Buscando veículos...</p>
            </div>
          ) : (
            // GRID CHANGED: grid-cols-2 for mobile (2 columns), gap-4 (tighter)
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
              {cars.map(car => (
                <CarCard key={car.id} car={car} onClick={(car) => setSelectedCar(car)} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer 
        onHowItWorksClick={() => navigateTo('how-it-works')} 
        onHelpCenterClick={() => navigateTo('help-center')}
      />

      {selectedCar && (
        <CarDetails 
          car={selectedCar} 
          onClose={() => setSelectedCar(null)}
          onContinue={handleBookingContinue}
        />
      )}
      {isAuthModalOpen && (
        <LoginModal 
          initialView={authModalView} 
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
      {showBookingSuccess && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-in z-[70] border border-slate-700">
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-green-400"></i>
          </div>
          <span className="font-medium font-display">{showBookingSuccess}</span>
        </div>
      )}
    </div>
  );
};

export default App;