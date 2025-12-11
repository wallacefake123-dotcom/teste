import React, { useState } from 'react';
import { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  user: User;
  onNavigateHome: () => void;
}

type ViewMode = 'traveler' | 'host';

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigateHome }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('traveler');

  // --- MOCK DATA ---
  const myTrips = [
    {
      id: 't1',
      carName: 'Tesla Model 3',
      imageUrl: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80',
      dates: '15 Out - 18 Out',
      status: 'upcoming', // upcoming, completed, cancelled
      owner: 'Cláudia Dias',
      price: 255
    },
    {
      id: 't2',
      carName: 'Jeep Wrangler',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      dates: '02 Set - 05 Set',
      status: 'completed',
      owner: 'Carlos Edu',
      price: 330
    }
  ];

  const myListings = [
    {
      id: 'l1',
      carName: 'Chevrolet Tracker',
      imageUrl: 'https://images.unsplash.com/photo-1627454819213-177271b25864?auto=format&fit=crop&w=800&q=80',
      pricePerDay: 120,
      tripsThisMonth: 4,
      earnings: 480,
      rating: 4.8
    }
  ];

  const hostRequests = [
    {
      id: 'r1',
      userName: 'Fernanda L.',
      dates: '20 Nov - 22 Nov',
      listing: 'Chevrolet Tracker',
      earnings: 240,
      avatar: 'https://i.pravatar.cc/150?u=fernanda'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           {/* CHANGED: font-bold to font-medium */}
           <h1 className="text-3xl font-display font-medium text-[#181824]">
             {viewMode === 'traveler' ? 'Minhas Viagens' : 'Painel do Anfitrião'}
           </h1>
           <p className="text-[#484848] mt-1">
             {viewMode === 'traveler' 
               ? `Olá, ${user.name.split(' ')[0]}! Aqui estão suas reservas.` 
               : 'Gerencie seus veículos e acompanhe seus ganhos.'}
           </p>
        </div>

        {/* Toggle Switch */}
        {user.isHost && (
          <div className="bg-gray-100 p-1 rounded-xl flex items-center relative">
             <button 
               onClick={() => setViewMode('traveler')}
               className={`relative z-10 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewMode === 'traveler' ? 'text-[#181824]' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Viajante
             </button>
             <button 
               onClick={() => setViewMode('host')}
               className={`relative z-10 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewMode === 'host' ? 'text-[#181824]' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Anfitrião
             </button>
             
             {/* Sliding Background */}
             <motion.div 
               className="absolute bg-white shadow-sm rounded-lg h-[calc(100%-8px)] top-1 bottom-1"
               initial={false}
               animate={{ 
                 left: viewMode === 'traveler' ? '4px' : '50%',
                 width: viewMode === 'traveler' ? 'calc(50% - 6px)' : 'calc(50% - 6px)'
               }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
             />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'traveler' ? (
          /* --- TRAVELER VIEW --- */
          <motion.div 
            key="traveler"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
             {/* Upcoming Trips */}
             <section>
                {/* CHANGED: font-bold to font-medium */}
                <h2 className="text-xl font-medium text-[#181824] mb-4">Próximas Viagens</h2>
                {myTrips.filter(t => t.status === 'upcoming').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTrips.filter(t => t.status === 'upcoming').map(trip => (
                      <div key={trip.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                         <div className="h-48 relative">
                            <img src={trip.imageUrl} className="w-full h-full object-cover" alt={trip.carName} />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#181824]">
                              Confirmado
                            </div>
                         </div>
                         <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                               <h3 className="font-bold text-lg text-[#181824]">{trip.carName}</h3>
                               <span className="bg-blue-50 text-[#3667AA] px-2 py-1 rounded-md text-xs font-bold">R$ {trip.price}</span>
                            </div>
                            <p className="text-sm text-[#484848] mb-4"><i className="far fa-calendar mr-2"></i> {trip.dates}</p>
                            <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                 {trip.owner.charAt(0)}
                               </div>
                               <div className="text-xs">
                                  <p className="text-gray-400">Anfitrião</p>
                                  <p className="font-bold text-[#181824]">{trip.owner}</p>
                               </div>
                               <button className="ml-auto text-[#3667AA] text-sm font-bold hover:underline">Ver detalhes</button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
                     <p className="text-gray-500 mb-4">Você não tem viagens agendadas.</p>
                     <button onClick={onNavigateHome} className="bg-[#3667AA] text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-95">Buscar carros</button>
                  </div>
                )}
             </section>

             {/* Past Trips */}
             <section>
                {/* CHANGED: font-bold to font-medium */}
                <h2 className="text-xl font-medium text-[#181824] mb-4">Histórico</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                   {myTrips.filter(t => t.status === 'completed').map((trip, idx) => (
                      <div key={trip.id} className={`flex flex-col md:flex-row items-center p-4 gap-4 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                         <img src={trip.imageUrl} className="w-full md:w-24 h-32 md:h-16 object-cover rounded-xl" alt={trip.carName} />
                         <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-[#181824]">{trip.carName}</h3>
                            <p className="text-sm text-gray-500">{trip.dates}</p>
                         </div>
                         <div className="text-center md:text-right">
                             <p className="font-bold text-[#181824] mb-1">R$ {trip.price}</p>
                             <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Concluído</span>
                         </div>
                         <button className="w-full md:w-auto border border-gray-200 text-[#181824] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">
                            Avaliar
                         </button>
                      </div>
                   ))}
                </div>
             </section>
          </motion.div>
        ) : (
          /* --- HOST VIEW --- */
          <motion.div 
            key="host"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
             {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#181824] text-white rounded-2xl p-6 shadow-lg">
                   <p className="text-gray-400 text-sm font-medium mb-1">Ganhos em Outubro</p>
                   <h3 className="text-3xl font-bold">R$ 480,00</h3>
                   <div className="mt-4 flex items-center text-xs text-green-400">
                      <i className="fas fa-arrow-up mr-1"></i> 12% vs mês anterior
                   </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                   <p className="text-gray-500 text-sm font-medium mb-1">Viagens Totais</p>
                   <h3 className="text-3xl font-bold text-[#181824]">12</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                   <p className="text-gray-500 text-sm font-medium mb-1">Avaliação Média</p>
                   <h3 className="text-3xl font-bold text-[#181824]">4.9 <span className="text-sm text-gray-400 font-normal">/ 5.0</span></h3>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Active Listings */}
                <div className="lg:col-span-2 space-y-6">
                   {/* CHANGED: font-bold to font-medium */}
                   <h2 className="text-xl font-medium text-[#181824]">Meus Carros</h2>
                   {myListings.map(car => (
                      <div key={car.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-6 shadow-sm">
                         <img src={car.imageUrl} className="w-full sm:w-48 h-32 object-cover rounded-xl" alt={car.carName} />
                         <div className="flex-1 py-1">
                            <div className="flex justify-between items-start mb-2">
                               <h3 className="font-bold text-lg text-[#181824]">{car.carName}</h3>
                               <button className="text-gray-400 hover:text-[#3667AA]"><i className="fas fa-ellipsis-h"></i></button>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[#484848] mb-4">
                               <span className="bg-gray-50 px-2 py-1 rounded">R$ {car.pricePerDay}/dia</span>
                               <span className="flex items-center gap-1"><i className="fas fa-star text-[#3667AA] text-xs"></i> {car.rating}</span>
                               <span>{car.tripsThisMonth} viagens este mês</span>
                            </div>
                            <div className="flex gap-3">
                               <button className="flex-1 bg-[#181824] text-white py-2 rounded-lg text-sm font-bold hover:opacity-90">Editar anúncio</button>
                               <button className="flex-1 border border-gray-200 text-[#181824] py-2 rounded-lg text-sm font-bold hover:bg-gray-50">Calendário</button>
                            </div>
                         </div>
                      </div>
                   ))}
                   
                   <button 
                     onClick={() => window.location.href = '/become-host'} 
                     className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 text-gray-500 font-bold hover:border-[#3667AA] hover:text-[#3667AA] transition-colors flex items-center justify-center gap-2"
                   >
                     <i className="fas fa-plus"></i> Adicionar novo carro
                   </button>
                </div>

                {/* Pending Requests */}
                <div>
                   {/* CHANGED: font-bold to font-medium */}
                   <h2 className="text-xl font-medium text-[#181824] mb-6">Solicitações</h2>
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      {hostRequests.length > 0 ? hostRequests.map(req => (
                        <div key={req.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                           <div className="flex items-center gap-3 mb-3">
                              <img src={req.avatar} className="w-10 h-10 rounded-full" alt={req.userName} />
                              <div>
                                 <p className="font-bold text-sm text-[#181824]">{req.userName}</p>
                                 <p className="text-xs text-gray-500">Solicitou {req.listing}</p>
                              </div>
                           </div>
                           <div className="bg-gray-50 rounded-lg p-3 text-xs text-[#484848] mb-3 flex justify-between">
                              <span>{req.dates}</span>
                              <span className="font-bold text-green-600">+ R$ {req.earnings}</span>
                           </div>
                           <div className="flex gap-2">
                              <button className="flex-1 bg-[#3667AA] text-white py-2 rounded-lg text-xs font-bold hover:opacity-90">Aceitar</button>
                              <button className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50">Recusar</button>
                           </div>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500 text-center py-4">Nenhuma solicitação pendente.</p>
                      )}
                   </div>
                </div>

             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;