
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=2070&auto=format&fit=crop)',
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Discover the Perfect Car for Your Journey
        </h1>
        <p className="text-lg md:text-xl text-white mb-8">
          Find, book, and rent cars from local hosts. An easier way to get the car you want.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg"
            onClick={() => navigate('/cars')}
            className="bg-accent hover:bg-accent/90"
          >
            Browse Cars <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate('/register')}
            className="bg-white/10 hover:bg-white/20 text-white border-white"
          >
            Become a Host
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
