
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, Booking, getCarById } from '@/services/carService';
import { Car as CarType } from '@/services/carService';
import { Calendar, CarFront, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<(Booking & { car?: CarType })[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userBookings = await getUserBookings(user.id);
        
        // Fetch car details for each booking
        const bookingsWithCars = await Promise.all(
          userBookings.map(async (booking) => {
            const car = await getCarById(booking.carId);
            return { ...booking, car };
          })
        );
        
        setBookings(bookingsWithCars);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-gray-600">Manage your bookings and account details</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="bookings">
                <TabsList className="mb-6">
                  <TabsTrigger value="bookings">Your Bookings</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Bookings</CardTitle>
                      <CardDescription>
                        Manage and view your current and past bookings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p>Loading your bookings...</p>
                        </div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                          <CarFront className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                          <p className="text-gray-600 mb-6">You haven't made any car bookings yet.</p>
                          <Button onClick={() => navigate('/cars')}>
                            Browse Cars
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {bookings.map(booking => (
                            <div 
                              key={booking.id} 
                              className="border rounded-lg overflow-hidden flex flex-col md:flex-row"
                            >
                              {booking.car && (
                                <div className="md:w-1/3">
                                  <img 
                                    src={booking.car.imageUrl} 
                                    alt={`${booking.car.make} ${booking.car.model}`}
                                    className="h-48 w-full object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="p-4 md:p-6 flex-1">
                                {booking.car && (
                                  <div className="mb-3">
                                    <h3 className="text-lg font-semibold">
                                      {booking.car.make} {booking.car.model}
                                    </h3>
                                    <p className="text-gray-600">{booking.car.year}</p>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                    <div>
                                      <div className="text-sm text-gray-600">Pickup Date</div>
                                      <div>{format(new Date(booking.startDate), 'MMM d, yyyy')}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                    <div>
                                      <div className="text-sm text-gray-600">Return Date</div>
                                      <div>{format(new Date(booking.endDate), 'MMM d, yyyy')}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {booking.status}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-lg font-semibold">${booking.totalPrice}</span>
                                    <span className="text-gray-600"> total</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="favorites">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Favorite Cars</CardTitle>
                      <CardDescription>
                        Cars you've saved for later
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CarFront className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                        <p className="text-gray-600 mb-6">You haven't added any cars to your favorites.</p>
                        <Button onClick={() => navigate('/cars')}>
                          Browse Cars
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences and settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                value={user.name}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                className="w-full px-3 py-2 border rounded-md"
                                value={user.email}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline">
                              Edit Information
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-semibold mb-4">Password & Security</h3>
                          <Button variant="outline">Change Password</Button>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Email Notifications</span>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input 
                                  type="checkbox" 
                                  checked 
                                  className="sr-only"
                                />
                                <div className="w-10 h-6 bg-primary rounded-full"></div>
                                <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full bg-white transform translate-x-4"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
