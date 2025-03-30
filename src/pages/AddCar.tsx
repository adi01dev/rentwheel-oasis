
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Car as CarType, addCar } from '@/services/carService';
import { Check, Upload, X } from 'lucide-react';

// Common car makes for the dropdown
const carMakes = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi',
  'Tesla', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Subaru', 'Lexus'
];

// Common car features
const carFeatures = [
  'Air Conditioning',
  'Bluetooth',
  'Backup Camera',
  'Navigation System',
  'Leather Seats',
  'Sunroof',
  'All-Wheel Drive',
  'Cruise Control',
  'Heated Seats',
  'Premium Sound System',
  'Keyless Entry',
  'Apple CarPlay',
  'Android Auto',
  'Parking Sensors'
];

// Cities
const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Francisco', 'Austin', 'Seattle'
];

const AddCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    location: '',
    description: '',
    imageUrl: '',
    features: [] as string[],
  });
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  // Redirect if not authenticated or not a host
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'host') {
      toast({
        title: 'Access denied',
        description: 'You must be logged in as a host to add a car.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    // Simulate image upload (in a real app, this would call an API)
    setTimeout(() => {
      // Using a placeholder image URL for demo purposes
      // In a real app, this would be the URL returned from the upload service
      const randomImageId = Math.floor(Math.random() * 1000);
      const mockImageUrl = `https://images.unsplash.com/photo-${randomImageId}?q=80&w=2070&auto=format&fit=crop`;
      
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: mockImageUrl 
      }));
      setPreviewImage(URL.createObjectURL(file));
      setUploading(false);
      
      toast({
        title: 'Image uploaded',
        description: 'Your car image has been uploaded successfully.',
      });
    }, 1500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validation
    if (!formData.make || !formData.model || !formData.location || !formData.description) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all the required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.price <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price.',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.features.length === 0) {
      toast({
        title: 'No features selected',
        description: 'Please select at least one feature for your car.',
        variant: 'destructive',
      });
      return;
    }
    
    // If no image was uploaded, use a default one
    if (!formData.imageUrl) {
      setFormData(prev => ({
        ...prev,
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'
      }));
    }
    
    try {
      setSubmitting(true);
      
      await addCar({
        ...formData,
        hostId: user.id,
        availability: true,
      });
      
      toast({
        title: 'Car added successfully',
        description: 'Your car has been listed on RentWheel.',
      });
      
      navigate('/host-dashboard');
    } catch (error) {
      toast({
        title: 'Failed to add car',
        description: 'There was an error adding your car. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!isAuthenticated || !user || user.role !== 'host') {
    return null;
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
            <h1 className="text-3xl font-bold">List Your Car</h1>
            <p className="text-gray-600">Provide details about your car to list it for rental</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Car Details</CardTitle>
                <CardDescription>
                  Fill in the information about your car
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Select
                        value={formData.make}
                        onValueChange={(value) => handleSelectChange('make', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          {carMakes.map(make => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        placeholder="e.g. Camry"
                        value={formData.model}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        min={1990}
                        max={new Date().getFullYear() + 1}
                        value={formData.year}
                        onChange={handleNumberChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Daily Rate ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min={1}
                        placeholder="e.g. 75"
                        value={formData.price || ''}
                        onChange={handleNumberChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => handleSelectChange('location', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your car, its condition, and any special features"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Car Features</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {carFeatures.map(feature => (
                        <div 
                          key={feature} 
                          className="flex items-center space-x-2"
                        >
                          <Checkbox 
                            id={`feature-${feature}`}
                            checked={formData.features.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <label
                            htmlFor={`feature-${feature}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carImage">Car Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {previewImage ? (
                        <div className="relative">
                          <img 
                            src={previewImage} 
                            alt="Car preview" 
                            className="mx-auto h-40 object-contain"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            className="absolute top-0 right-0 bg-white rounded-full"
                            onClick={() => {
                              setPreviewImage('');
                              setFormData(prev => ({ ...prev, imageUrl: '' }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label
                              htmlFor="carImage"
                              className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90"
                            >
                              {uploading ? 'Uploading...' : 'Upload Image'}
                            </Label>
                            <Input
                              id="carImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={uploading}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG or JPEG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Your car will be reviewed before listing</span>
                    </div>
                    <Button 
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'List Your Car'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddCar;
