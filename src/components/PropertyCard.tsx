import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Euro } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  id: string;
  title: string;
  city: string;
  country: string;
  price_per_month: number;
  bedrooms: number;
  bathrooms: number;
  surface_area?: number;
  images?: string[];
  is_available: boolean;
  is_featured?: boolean;
}

export function PropertyCard({
  id,
  title,
  city,
  country,
  price_per_month,
  bedrooms,
  bathrooms,
  surface_area,
  images,
  is_available,
  is_featured
}: PropertyCardProps) {
  const countryLabel = country === 'france' ? 'France' : 'Espagne';
  const imageUrl = images?.[0] || '/placeholder.svg';

  return (
    <Link 
      to={`/properties/${id}`}
      className="group block glass-card rounded-xl overflow-hidden hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {is_featured && (
            <Badge className="bg-primary text-primary-foreground">
              En vedette
            </Badge>
          )}
          {!is_available && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Loué
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1 text-primary-foreground/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{city}, {countryLabel}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms}</span>
          </div>
          {surface_area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{surface_area}m²</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">{price_per_month.toLocaleString('fr-FR')}</span>
            <Euro className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground text-sm">/mois</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
