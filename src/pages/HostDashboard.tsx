
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getHostCars } from '@/services/carService';
import { Car as CarType } from '@/services/carService';
import { Car, Edit, PlusCircle, User, Trash } from 'lucide-react';

const HostDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'host') {
      navigate('/login');
      return;
    }
    
    const fetchCars = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const hostCars = await getHostCars(user.id);
        setCars(hostCars);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [user, isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user || user.role !== 'host') {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Host Dashboard</h1>
            <p className="text-gray-600">Manage your listings and bookings</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Host Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Host
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/add-car')}
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Car
                  </Button>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="cars">
                <TabsList className="mb-6">
                  <TabsTrigger value="cars">Your Cars</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cars">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Listed Cars</CardTitle>
                        <CardDescription>
                          Manage all your car listings
                        </CardDescription>
                      </div>
                      <Button onClick={() => navigate('/add-car')}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Car
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p>Loading your cars...</p>
                        </div>
                      ) : cars.length === 0 ? (
                        <div className="text-center py-12">
                          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No cars listed yet</h3>
                          <p className="text-gray-600 mb-6">Start earning by adding your first car listing.</p>
                          <Button onClick={() => navigate('/add-car')}>
                            Add Your First Car
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cars.map(car => (
                            <div 
                              key={car.id} 
                              className="border rounded-lg overflow-hidden flex flex-col md:flex-row"
                            >
                              <div className="md:w-1/3">
                                <img 
                                  src={car.imageUrl} 
                                  alt={`${car.make} ${car.model}`}
                                  className="h-48 w-full object-cover"
                                />
                              </div>
                              
                              <div className="p-4 md:p-6 flex-1">
                                <div className="flex justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {car.make} {car.model}
                                    </h3>
                                    <p className="text-gray-600">{car.year}</p>
                                  </div>
                                  <div>
                                    <span className="text-lg font-semibold">${car.price}</span>
                                    <span className="text-gray-600">/day</span>
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 line-clamp-2 mb-4">
                                  {car.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {car.features.slice(0, 3).map((feature, index) => (
                                    <span 
                                      key={index} 
                                      className="text-xs px-2 py-1 bg-muted rounded-full text-gray-600"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                  {car.features.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-muted rounded-full text-gray-600">
                                      +{car.features.length - 3} more
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bookings for Your Cars</CardTitle>
                      <CardDescription>
                        Manage all your booking requests and confirmed bookings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-6">When customers book your cars, they'll appear here.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="earnings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Earnings</CardTitle>
                      <CardDescription>
                        Track your income from car rentals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="48" 
                          height="48" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="text-gray-400 mx-auto mb-4"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <h3 className="text-lg font-semibold mb-2">No earnings yet</h3>
                        <p className="text-gray-600 mb-6">Start earning by getting your first booking.</p>
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

export default HostDashboard;
