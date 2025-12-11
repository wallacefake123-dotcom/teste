import React, { useState } from 'react';
import { Car } from '../types';
import { addCar } from '../services/carService';

interface AddCarModalProps {
  onClose: () => void;
  onCarAdded: () => void;
}

const AddCarModal: React.FC<AddCarModalProps> = ({ onClose, onCarAdded }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: 50,
    location: '',
    type: 'Sedan' as Car['type'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCar({
        ...formData,
        imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
        coordinates: { lat: 0, lng: 0 } // Mock coords
      });
      onCarAdded();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#222222]">List Your Car</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.make}
                onChange={e => setFormData({...formData, make: e.target.value})}
                placeholder="e.g. Toyota"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
                placeholder="e.g. Camry"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.year}
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as Car['type']})}
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Luxury">Luxury</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Downtown, Airport"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={formData.pricePerDay}
                onChange={e => setFormData({...formData, pricePerDay: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3667AA] text-white font-semibold py-3 rounded-lg hover:opacity-95 transition-opacity mt-6 disabled:bg-gray-300 disabled:text-gray-500 flex justify-center items-center"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                 <svg className="loader-container h-5 w-5" viewBox="25 25 50 50" style={{ width: '1.25em', height: '1.25em' }}>
                    <circle className="loader-svg loader-white" cx="50" cy="50" r="20"></circle>
                 </svg>
                 <span>Listing Car...</span>
              </div>
            ) : 'List Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;