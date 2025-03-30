
// Types
export interface Car {
  id: string;
  hostId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  description: string;
  imageUrl: string;
  features: string[];
  availability: boolean;
}

// Mock data
const mockCars: Car[] = [
  {
    id: "car1",
    hostId: "host1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 75,
    location: "New York",
    description: "Comfortable sedan with excellent fuel efficiency. Perfect for city driving with its smooth handling and spacious interior.",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070&auto=format&fit=crop",
    features: ["Air Conditioning", "Bluetooth", "Backup Camera", "GPS Navigation"],
    availability: true
  },
  {
    id: "car2",
    hostId: "host2",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    price: 85,
    location: "Los Angeles",
    description: "Versatile SUV with plenty of cargo space and comfort features. Ideal for family trips and outdoor adventures.",
    imageUrl: "https://images.unsplash.com/photo-1574819795060-f12ea81088f1?q=80&w=2071&auto=format&fit=crop",
    features: ["Leather Seats", "Sunroof", "AWD", "Apple CarPlay"],
    availability: true
  },
  {
    id: "car3",
    hostId: "host3",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 120,
    location: "San Francisco",
    description: "Cutting-edge electric vehicle with autopilot features and zero emissions. Experience the future of driving.",
    imageUrl: "https://images.unsplash.com/photo-1619826761293-93111a9dc600?q=80&w=2070&auto=format&fit=crop",
    features: ["Autopilot", "Electric", "Premium Sound", "Glass Roof"],
    availability: true
  },
  {
    id: "car4",
    hostId: "host1",
    make: "BMW",
    model: "3 Series",
    year: 2022,
    price: 110,
    location: "Chicago",
    description: "Luxury sports sedan with powerful performance and premium features. The ultimate driving machine.",
    imageUrl: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=2070&auto=format&fit=crop",
    features: ["Sport Mode", "Premium Audio", "Heated Seats", "Keyless Entry"],
    availability: true
  },
  {
    id: "car5",
    hostId: "host2",
    make: "Ford",
    model: "Mustang",
    year: 2021,
    price: 95,
    location: "Miami",
    description: "Iconic American muscle car with exhilarating performance. Feel the thrill of the open road.",
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?q=80&w=2070&auto=format&fit=crop",
    features: ["V8 Engine", "Convertible", "Leather Interior", "Performance Package"],
    availability: true
  },
];

// Service functions
export const getCars = async (): Promise<Car[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCars;
};

export const getCarById = async (id: string): Promise<Car | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCars.find(car => car.id === id);
};

export const getCarsByLocation = async (location: string): Promise<Car[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!location) return mockCars;
  return mockCars.filter(car => 
    car.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const addCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const newCar: Car = {
    ...car,
    id: `car${Math.random().toString(36).substr(2, 9)}`,
  };
  mockCars.push(newCar);
  return newCar;
};

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const mockBookings: Booking[] = [];

export const createBooking = async (booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newBooking: Booking = {
    ...booking,
    id: `booking${Math.random().toString(36).substr(2, 9)}`,
    status: 'confirmed',
  };
  mockBookings.push(newBooking);
  return newBooking;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getHostCars = async (hostId: string): Promise<Car[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCars.filter(car => car.hostId === hostId);
};
