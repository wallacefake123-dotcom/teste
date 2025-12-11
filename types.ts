
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  location: string;
  type: 'SUV' | 'Sedan' | 'Truck' | 'Luxury' | 'Convertible';
  ownerId: string;
  rating: number;
  trips: number;
  available: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  // New fields for details view
  images?: string[];
  features?: string[];
  description?: string;
  availabilityHours?: {
    start: string;
    end: string;
  };
  reviews?: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    userAvatar: string;
  }[];
  ownerDetails?: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    yearsHosting: number;
    school?: string;
    job?: string;
    quote?: string;
    about?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isHost: boolean;
}

export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeId?: string;
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface AIResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'image' | 'audio';
  metadata?: any;
}

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  carRelated?: {
    make: string;
    model: string;
    imageUrl: string;
  };
}