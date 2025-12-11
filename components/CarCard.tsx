import React from 'react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
  onClick: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  return (
    <div 
      onClick={() => onClick(car)}
      className="group flex flex-col gap-2 cursor-pointer w-full"
    >
      {/* Image Container - Square Aspect Ratio for 2-column grid */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-200">
        <img 
          src={car.imageUrl} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Heart Icon (Wishlist) */}
        <button className="absolute top-2 right-2 text-white/70 hover:text-white hover:scale-110 transition-all z-10">
           <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}>
              <path d="M16 28c-7-4.73-14-10-14-17a6.98 6.98 0 0 1 7-7c1.8 0 3.58.68 4.95 2.05L16 8.1l2.05-2.05a6.98 6.98 0 0 1 9.9 0 6.98 6.98 0 0 1 0 9.9c-2.3 2.3-6.6 6.6-12.55 12.05L16 28z"></path>
           </svg>
        </button>
      </div>
      
      {/* Info Content - Compact for 2-col */}
      <div className="flex flex-col text-[#1C2230]">
        {/* Line 1: Name (13px) . Year (13px) | Rating */}
        <div className="flex justify-between items-start">
           <h3 className="font-semibold text-[13px] truncate text-slate-900 leading-tight">
             {car.make} {car.model} <span className="font-normal text-gray-500 text-[13px]">. {car.year}</span>
           </h3>
           <div className="flex items-center gap-1 shrink-0 ml-1">
             <i className="fas fa-star text-[10px]"></i>
             <span className="text-sm font-light">{car.rating}</span>
           </div>
        </div>

        {/* Line 2: Location */}
        <p className="text-sm text-gray-500 truncate leading-snug">
          {car.location}
        </p>

        {/* Line 3: Price */}
        <div className="mt-0.5 flex items-baseline gap-1">
           <span className="font-semibold text-slate-900 text-[15px]">R$ {car.pricePerDay}</span>
           <span className="text-slate-900 text-sm"> /dia</span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;