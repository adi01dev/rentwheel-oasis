
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { getCarById, createBooking } from '@/services/carService';
import { Car as CarType } from '@/services/carService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Calendar as CalendarIcon, Car, CheckCircle, Clock, MapPin, Shield } from 'lucide-react';

const BookCar = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [car, setCar] = useState<CarType | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) return;
      
      try {
        setLoading(true);
        const carData = await getCarById(carId);
        if (carData) {
          setCar(carData);
        } else {
          toast({
            title: 'Car not found',
            description: 'The car you are looking for could not be found.',
            variant: 'destructive',
          });
          navigate('/cars');
        }
      } catch (error) {
        console.error('Failed to fetch car:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCar();
  }, [carId, navigate, toast]);
  
  useEffect(() => {
    if (car && startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      setTotalPrice(car.price * days);
    } else {
      setTotalPrice(0);
    }
  }, [car, startDate, endDate]);
  
  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to book a car.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    if (!car || !startDate || !endDate || !user) {
      toast({
        title: 'Incomplete information',
        description: 'Please select a pickup and return date.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setBookingLoading(true);
      await createBooking({
        userId: user.id,
        carId: car.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
      });
      
      toast({
        title: 'Booking confirmed!',
        description: 'Your car has been booked successfully.',
      });
      
      navigate('/user-dashboard');
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBookingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading car details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
              <p className="mb-6">The car you are looking for could not be found.</p>
              <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              &larr; Back
            </Button>
            <h1 className="text-3xl font-bold">Book {car.make} {car.model}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Car Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.make} ${car.model}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
                      <p className="text-gray-600">{car.year}</p>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-primary">${car.price}</span>
                      <span className="text-gray-500">/day</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{car.location}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{car.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-muted rounded-full text-gray-700 text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Booking Protection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Insurance Included</h4>
                          <p className="text-sm text-gray-600">Your booking includes insurance coverage for peace of mind.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">24/7 Support</h4>
                          <p className="text-sm text-gray-600">Our team is available round the clock to assist you.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Form */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Book this car</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Select dates</h4>
                      <Calendar
                        mode="range"
                        selected={{
                          from: startDate,
                          to: endDate,
                        }}
                        onSelect={(range) => {
                          setStartDate(range?.from);
                          setEndDate(range?.to);
                        }}
                        disabled={(date) => date < new Date()}
                        className={cn("rounded border pointer-events-auto")}
                      />
                    </div>
                    
                    {startDate && endDate && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Trip details</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Pickup date</span>
                            </div>
                            <span className="font-medium">{format(startDate, 'MMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Return date</span>
                            </div>
                            <span className="font-medium">{format(endDate, 'MMM d, yyyy')}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Duration</span>
                            </div>
                            <span className="font-medium">{differenceInDays(endDate, startDate) + 1} days</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {startDate && endDate && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Price details</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>
                              ${car.price} × {differenceInDays(endDate, startDate) + 1} days
                            </span>
                            <span>${totalPrice}</span>
                          </div>
                          
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full"
                      disabled={!startDate || !endDate || bookingLoading}
                      onClick={handleBooking}
                    >
                      {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                    
                    {!isAuthenticated && (
                      <p className="text-sm text-gray-600 text-center">
                        You'll need to sign in before booking
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper function for className merging (imported from @/lib/utils)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default BookCar;
