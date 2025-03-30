
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

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// API base URL - replace with your actual backend URL when deployed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Service functions
export const getCars = async (): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_URL}/cars`);
    if (!response.ok) {
      throw new Error(`Error fetching cars: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    // Fallback to mock data during development
    return mockCars;
  }
};

export const getCarById = async (id: string): Promise<Car | undefined> => {
  try {
    const response = await fetch(`${API_URL}/cars/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching car: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching car with id ${id}:`, error);
    // Fallback to mock data during development
    return mockCars.find(car => car.id === id);
  }
};

export const getCarsByLocation = async (location: string): Promise<Car[]> => {
  try {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    
    const response = await fetch(`${API_URL}/cars/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Error searching cars: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching cars by location:', error);
    // Fallback to mock data during development
    if (!location) return mockCars;
    return mockCars.filter(car => 
      car.location.toLowerCase().includes(location.toLowerCase())
    );
  }
};

export const addCar = async (car: Omit<Car, 'id'>): Promise<Car> => {
  try {
    const response = await fetch(`${API_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    
    if (!response.ok) {
      throw new Error(`Error adding car: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding car:', error);
    // Fallback during development
    const newCar: Car = {
      ...car,
      id: `car${Math.random().toString(36).substr(2, 9)}`,
    };
    mockCars.push(newCar);
    return newCar;
  }
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating booking: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    // Fallback during development
    const newBooking: Booking = {
      ...booking,
      id: `booking${Math.random().toString(36).substr(2, 9)}`,
      status: 'confirmed',
    };
    mockBookings.push(newBooking);
    return newBooking;
  }
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Error fetching user bookings: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    // Fallback during development
    return mockBookings.filter(booking => booking.userId === userId);
  }
};

export const getHostCars = async (hostId: string): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_URL}/cars/host/${hostId}`);
    if (!response.ok) {
      throw new Error(`Error fetching host cars: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching cars for host ${hostId}:`, error);
    // Fallback during development
    return mockCars.filter(car => car.hostId === hostId);
  }
};

// Mock data for development and fallback
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

const mockBookings: Booking[] = [];
