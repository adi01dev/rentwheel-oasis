
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { addCar } from '@/services/carService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';

// Mock car features for selection
const availableFeatures = [
  'Air Conditioning',
  'Bluetooth',
  'Backup Camera',
  'GPS Navigation',
  'Leather Seats',
  'Sunroof',
  'AWD',
  'Apple CarPlay',
  'Android Auto',
  'Heated Seats',
  'Premium Sound',
  'Keyless Entry',
];

// Mock car makes for selection
const carMakes = [
  'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Chevrolet', 'Nissan', 'Mazda', 'Volkswagen', 'Jeep'
];

// City options
const cities = [
  'New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Seattle', 'Boston', 'Austin', 'Denver', 'Atlanta'
];

const AddCar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in as a host to add a car.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);
  
  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to storage and get URL
      // For demo, we'll use a mock URL
      const mockImageUrl = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2024&auto=format&fit=crop';
      setImageUrl(mockImageUrl);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make || !model || !year || !price || !location || !description || !imageUrl) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, we would validate the form data more thoroughly
      
      await addCar({
        hostId: user?.id || 'unknown',
        make,
        model,
        year: parseInt(year),
        price: parseInt(price),
        location,
        description,
        imageUrl,
        features,
        availability: true,
      });
      
      toast({
        title: 'Car added successfully',
        description: 'Your car has been listed for rent.',
      });
      
      navigate('/host-dashboard');
    } catch (error) {
      toast({
        title: 'Failed to add car',
        description: 'There was an error adding your car. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">List Your Car</h1>
            <p className="text-gray-600 mt-2">Fill in the details to add your car to RentWheel</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Car Details Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Car Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Select 
                        value={make} 
                        onValueChange={setMake}
                      >
                        <SelectTrigger id="make">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          {carMakes.map(make => (
                            <SelectItem key={make} value={make}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Camry, Model 3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 2022"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Daily Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 75"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={location} 
                        onValueChange={setLocation}
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your car to potential renters..."
                      className="min-h-32"
                    />
                  </div>
                </div>
                
                {/* Features Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Features</h2>
                  <p className="text-sm text-gray-600">Select the features your car offers</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="font-normal">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Car Image Upload */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Car Image</h2>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img 
                          src={previewImage} 
                          alt="Car preview" 
                          className="max-h-64 mx-auto rounded-lg object-cover"
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPreviewImage('');
                            setImageUrl('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Upload a car image</p>
                        <p className="text-sm text-gray-500 mb-4">Upload a clear photo of your car</p>
                        <input
                          type="file"
                          id="car-image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => document.getElementById('car-image')?.click()}
                        >
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-4 border-t flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding Car...' : 'Add Car'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddCar;
