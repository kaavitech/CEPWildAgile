import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Mountain } from 'lucide-react';
import { EcoCentre } from '@/lib/mockData';
import bandipurImg from '@/assets/bandipur.jpg';
import nagarholeImg from '@/assets/nagarhole.jpg';
import dandeliImg from '@/assets/dandeli.jpg';
import seminaryHillsImg from '@/assets/seminary-hills-1.jpg';
import welcomeAboutImg from '@/assets/welcome-about.jpg';
import gorewada1Img from '@/assets/gorewada1.jpg';

const imageMap: Record<string, string> = {
  'bandipur': bandipurImg,
  'nagarhole': nagarholeImg,
  'dandeli': dandeliImg,
  'seminary-hills-1.jpg': seminaryHillsImg,
  'welcome-about.jpg': welcomeAboutImg,
  'gorewada1.jpg': gorewada1Img,
};

interface EcoCentreCardProps {
  centre: EcoCentre;
}

const EcoCentreCard = ({ centre }: EcoCentreCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'Moderate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Difficult': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-muted';
    }
  };

  const imageSrc = centre.images[0] ? imageMap[centre.images[0]] : undefined;

  return (
    <Card className="shadow-soft hover:shadow-medium transition-all overflow-hidden group flex flex-col h-full">
      <div 
        className="h-48 bg-cover bg-center relative overflow-hidden"
        style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
      >
        {!imageSrc && <div className="absolute inset-0 bg-gradient-forest" />}
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className={getDifficultyColor(centre.trailDifficulty)}>
            <Mountain className="h-3 w-3 mr-1" />
            {centre.trailDifficulty}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold">{centre.name}</h3>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{centre.location.address}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          {centre.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-medium">Capacity:</span>
          <span className="text-muted-foreground">{centre.capacity} students</span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Link to={`/eco-centres/${centre.id}`} className="w-full">
          <Button variant="forest" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EcoCentreCard;
