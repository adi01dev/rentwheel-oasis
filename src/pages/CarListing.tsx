
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Car, getCars, getCarsByLocation } from '@/services/carService';
import { FilterX, SlidersHorizontal } from 'lucide-react';

const CarListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
  );
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('price-low');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        let fetchedCars;
        if (location) {
          fetchedCars = await getCarsByLocation(location);
        } else {
          fetchedCars = await getCars();
        }
        
        setCars(fetchedCars);
        setFilteredCars(fetchedCars);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [location]);
  
  const handleSearch = (searchLocation: string, searchStartDate: Date | undefined, searchEndDate: Date | undefined) => {
    setLocation(searchLocation);
    setStartDate(searchStartDate);
    setEndDate(searchEndDate);
    
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchStartDate) params.set('startDate', searchStartDate.toISOString());
    if (searchEndDate) params.set('endDate', searchEndDate.toISOString());
    
    setSearchParams(params);
  };
  
  const applyFilters = () => {
    let filtered = [...cars];
    
    // Apply price filter
    filtered = filtered.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );
    
    // Apply sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-new') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'year-old') {
      filtered.sort((a, b) => a.year - b.year);
    }
    
    setFilteredCars(filtered);
  };
  
  useEffect(() => {
    applyFilters();
  }, [priceRange, sortBy]);
  
  const resetFilters = () => {
    setPriceRange([0, 200]);
    setSortBy('price-low');
    setFilteredCars(cars);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">Find your perfect car</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            
            {/* Filters Sidebar */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetFilters}
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="mb-4">
                      <Slider
                        defaultValue={[0, 200]}
                        max={200}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Min: </span>
                        <span className="font-medium">${priceRange[0]}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Max: </span>
                        <span className="font-medium">${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Sort By</h4>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="year-new">Year: Newest First</SelectItem>
                        <SelectItem value="year-old">Year: Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Mobile Apply Button */}
                  <div className="lg:hidden">
                    <Button className="w-full" onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Car Listing */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading cars...</p>
                </div>
              ) : filteredCars.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search filters or explore other locations.</p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-gray-600">{filteredCars.length} cars found</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCars.map(car => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarListing;
