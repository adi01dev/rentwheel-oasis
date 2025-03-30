
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Car } from '@/services/carService';
import { MapPin, Calendar, Cpu } from 'lucide-react';
import { Button } from './ui/button';
 
interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={car.imageUrl} 
          alt={`${car.make} ${car.model}`}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
          <p className="text-sm text-muted-foreground">{car.year}</p>
        </div>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{car.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 my-3">
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
        
        <p className="text-sm line-clamp-2 mt-2 text-gray-600">
          {car.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-primary">${car.price}</span>
          <span className="text-gray-500 text-sm">/day</span>
        </div>
        <Link to={`/book/${car.id}`}>
          <Button>Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
