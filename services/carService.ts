import { Car } from "../types";

// Helper to generate mock images (Generic car details for gallery)
const getCarImages = (id: string) => [
  `https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80`, // Interior/Steering Wheel
  `https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80`, // Dashboard/Road view
  `https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80`, // Generic Exterior Detail
];

// Helper to generate mock reviews
const getReviews = () => [
  {
    id: 'r1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'The car was in perfect condition and the host was super helpful! Highly recommended.',
    date: 'Oct 2023',
    userAvatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 'r2',
    userName: 'Mike Chen',
    rating: 4,
    comment: 'Great drive, very clean. Pick up was a bit tricky but otherwise great experience.',
    date: 'Sep 2023',
    userAvatar: 'https://i.pravatar.cc/150?u=mike'
  }
];

// Mock Data - In a real app, this would be fetched from Supabase
const MOCK_CARS: Car[] = [
  {
    id: "1",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    pricePerDay: 85,
    imageUrl: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80",
    location: "Downtown Seattle, WA",
    type: "Sedan",
    ownerId: "user_1",
    rating: 4.9,
    trips: 42,
    available: true,
    coordinates: { lat: 47.6062, lng: -122.3321 },
    features: ["Autopilot", "Bluetooth", "Heated Seats", "GPS", "Backup Camera"],
    description: "Experience the future of driving with this pristine Tesla Model 3. Perfect for city driving or weekend getaways. Comes fully charged.",
    availabilityHours: { start: "08:00", end: "18:00" },
    images: getCarImages("tesla"),
    reviews: getReviews(),
    ownerDetails: {
      name: "Cláudia Dias",
      avatar: "https://i.pravatar.cc/150?u=claudia",
      isSuperhost: true,
      yearsHosting: 4,
      school: "Anhanguera Uniderp",
      job: "Corretora de Imóveis",
      quote: "Quando não souber para onde ir, siga o perfume dos seus sonhos."
    }
  },
  {
    id: "2",
    make: "Ford",
    model: "Bronco",
    year: 2022,
    pricePerDay: 120,
    imageUrl: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=format&fit=crop&w=800&q=80",
    location: "Bellevue, WA",
    type: "SUV",
    ownerId: "user_2",
    rating: 4.8,
    trips: 15,
    available: true,
    coordinates: { lat: 47.6101, lng: -122.2015 },
    features: ["4WD", "Convertible Top", "Apple CarPlay", "All-Terrain Tires"],
    description: "Rugged and ready for adventure. This Ford Bronco is perfect for exploring the Pacific Northwest mountains.",
    availabilityHours: { start: "08:00", end: "18:00" },
    images: getCarImages("bronco"),
    reviews: getReviews(),
    ownerDetails: {
      name: "Ricardo Silva",
      avatar: "https://i.pravatar.cc/150?u=ricardo",
      isSuperhost: false,
      yearsHosting: 1,
      school: "USP - Engenharia",
      job: "Engenheiro Civil",
      quote: "A vida é uma estrada, aproveite a viagem."
    }
  },
  {
    id: "3",
    make: "Porsche",
    model: "911 Carrera",
    year: 2021,
    pricePerDay: 250,
    imageUrl: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80",
    location: "Capitol Hill, Seattle, WA",
    type: "Convertible",
    ownerId: "user_3",
    rating: 5.0,
    trips: 8,
    available: true,
    coordinates: { lat: 47.6186, lng: -122.3155 },
    features: ["Sport Mode", "Leather Interior", "Premium Sound", "Convertible"],
    description: "Turn heads with this stunning Porsche 911. A true driver's car with exceptional handling and performance.",
    availabilityHours: { start: "09:00", end: "20:00" },
    images: getCarImages("porsche"),
    reviews: getReviews(),
    ownerDetails: {
      name: "Fernanda Costa",
      avatar: "https://i.pravatar.cc/150?u=fernanda",
      isSuperhost: true,
      yearsHosting: 5,
      school: "FGV - Marketing",
      job: "Diretora de Arte",
      quote: "Design é a alma de tudo."
    }
  },
  {
    id: "4",
    make: "Rivian",
    model: "R1T",
    year: 2023,
    pricePerDay: 140,
    imageUrl: "https://images.unsplash.com/photo-1551834317-9ddfd4ec7069?auto=format&fit=crop&w=800&q=80",
    location: "Ballard, Seattle, WA",
    type: "Truck",
    ownerId: "user_4",
    rating: 4.9,
    trips: 22,
    available: true,
    coordinates: { lat: 47.6687, lng: -122.3848 },
    features: ["Electric", "Gear Tunnel", "Off-road capable", "Premium Audio"],
    description: "The ultimate electric adventure vehicle. This Rivian R1T combines truck utility with sports car performance.",
    availabilityHours: { start: "07:00", end: "19:00" },
    images: getCarImages("rivian"),
    reviews: getReviews(),
    ownerDetails: {
      name: "Roberto Mendes",
      avatar: "https://i.pravatar.cc/150?u=roberto",
      isSuperhost: true,
      yearsHosting: 3,
      job: "Fotógrafo de Natureza",
      quote: "Explore o inexplorado."
    }
  },
  {
    id: "5",
    make: "Toyota",
    model: "Prius",
    year: 2020,
    pricePerDay: 55,
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    location: "University District, Seattle, WA",
    type: "Sedan",
    ownerId: "user_5",
    rating: 4.6,
    trips: 156,
    available: true,
    coordinates: { lat: 47.6553, lng: -122.3035 },
    features: ["Hybrid", "Bluetooth", "Keyless Entry", "Fuel Efficient"],
    description: "Reliable and incredibly fuel efficient. Great for long trips or running errands around the city.",
    availabilityHours: { start: "06:00", end: "22:00" },
    images: getCarImages("prius"),
    reviews: getReviews(),
    ownerDetails: {
      name: "Julia Pereira",
      avatar: "https://i.pravatar.cc/150?u=julia",
      isSuperhost: false,
      yearsHosting: 2,
      school: "UFMG - Biologia",
      job: "Pesquisadora",
      quote: "Sustentabilidade em primeiro lugar."
    }
  },
   {
    id: "6",
    make: "Jeep",
    model: "Wrangler",
    year: 2021,
    pricePerDay: 110,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    location: "Fremont, Seattle, WA",
    type: "SUV",
    ownerId: "user_6",
    rating: 4.7,
    trips: 34,
    available: true,
    coordinates: { lat: 47.6501, lng: -122.3498 },
    features: ["4x4", "Removable Roof", "Bluetooth", "Tow Hitch"],
    description: "Classic Jeep Wrangler ready for any weather. Includes removable top for sunny days.",
    availabilityHours: { start: "09:00", end: "17:00" },
    images: getCarImages("jeep"),
    reviews: getReviews(),
    ownerDetails: {
      name: "Carlos Edu",
      avatar: "https://i.pravatar.cc/150?u=carlos",
      isSuperhost: true,
      yearsHosting: 6,
      job: "Aventureiro Profissional",
      quote: "Onde o asfalto termina, a diversão começa."
    }
  }
];

export const getCars = async (): Promise<Car[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_CARS]);
    }, 500);
  });
};

export const addCar = async (car: Omit<Car, "id" | "ownerId" | "rating" | "trips" | "available">): Promise<Car> => {
  return new Promise((resolve) => {
    const newCar: Car = {
      ...car,
      id: Math.random().toString(36).substr(2, 9),
      ownerId: "current_user",
      rating: 0,
      trips: 0,
      available: true,
      features: ["Bluetooth", "Backup Camera"], // Default features for new mock cars
      availabilityHours: { start: "08:00", end: "18:00" },
      images: getCarImages("new"),
      reviews: [],
      ownerDetails: {
        name: "Você",
        avatar: "https://i.pravatar.cc/150?u=me",
        isSuperhost: false,
        yearsHosting: 0,
        job: "Novo Host",
        quote: "Pronto para começar!"
      }
    };
    MOCK_CARS.push(newCar);
    setTimeout(() => resolve(newCar), 800);
  });
};